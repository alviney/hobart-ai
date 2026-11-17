import { Hono } from 'hono';
import { ME } from './seed';
import { resetStore, type Arg, type Db } from './store';
import {
  CATEGORIES, type Category, type Level, type Via, daysSince, distanceM, matchCount, notifies, searchWords, strength,
} from '../shared/domain';

// One person for now ("You"). Real sign-in comes later; every route reads the user from here.
const currentUser = () => ME;
const RADAR_M = 2500;
const NEARBY_DAYS = 30;
const HERE_M = 50;
const DAY = 86_400_000;

type StationRow = { id: string; name: string; short: string; category: Category; access: 'invite' | 'public'; owner_id: string; lat: number | null; lng: number | null; verified_at: string; created_at: string };
/** A ping joined with the few Station fields it's shown with. */
type PingRow = { id: number; station_id: string; urgent: number; title: string | null; body: string; created_at: string; s_name: string; s_short: string; s_category: Category; s_owner: string };
type SubRow = { user_id: string; station_id: string; level: Level; via: Via; paused: number };

const PING_SELECT = `SELECT p.*, s.name AS s_name, s.short AS s_short, s.category AS s_category, s.owner_id AS s_owner
  FROM pings p JOIN stations s ON s.id = p.station_id`;
const placeholders = (n: number) => Array.from({ length: n }, () => '?').join(',');

/** What the API needs to know about the person asking, loaded in three queries. */
async function viewer(db: Db, user: string) {
  const [subs, reads, counts] = await Promise.all([
    db.all<SubRow>('SELECT * FROM subscriptions WHERE user_id = ?', user),
    db.all<{ ping_id: number }>('SELECT ping_id FROM reads WHERE user_id = ?', user),
    db.all<{ station_id: string; n: number }>('SELECT station_id, COUNT(*) AS n FROM subscriptions GROUP BY station_id'),
  ]);
  const subMap = new Map(subs.map((s) => [s.station_id, s]));
  const readSet = new Set(reads.map((r) => r.ping_id));
  const countMap = new Map(counts.map((c) => [c.station_id, c.n]));

  const station = (s: StationRow, here?: { lat: number; lng: number }) => {
    const sub = subMap.get(s.id);
    return {
      id: s.id, name: s.name, short: s.short, category: s.category, access: s.access,
      owner: s.owner_id === user,
      verifiedDays: daysSince(s.verified_at), strength: strength(daysSince(s.verified_at)),
      subscribers: countMap.get(s.id) ?? 0,
      sub: sub ? { level: sub.level, via: sub.via, paused: !!sub.paused } : null,
      dist: here && s.lat != null && s.lng != null ? Math.round(distanceM(here, { lat: s.lat, lng: s.lng })) : null,
    };
  };
  const ping = (p: PingRow) => {
    const sub = subMap.get(p.station_id), own = p.s_owner === user;
    return {
      id: p.id, stationId: p.station_id, stationName: p.s_name, stationShort: p.s_short, category: p.s_category,
      urgent: !!p.urgent, title: p.title, body: p.body, createdAt: p.created_at,
      read: own || readSet.has(p.id), own,
      notified: notifies(sub ? { level: sub.level, via: sub.via, paused: !!sub.paused } : null, !!p.urgent, own),
    };
  };
  return { subMap, station, ping };
}

export function api(db: Db) {
  const app = new Hono();
  const getStation = (id: string) => db.get<StationRow>('SELECT * FROM stations WHERE id = ?', id);
  const owned = async (id: string) => {
    const s = await getStation(id);
    return s && s.owner_id === currentUser() ? s : null;
  };

  // ---- Reading ----
  app.get('/me', async (c) => c.json(await db.get('SELECT id, name FROM users WHERE id = ?', currentUser())));

  app.get('/timeline', async (c) => {
    const user = currentUser();
    const [v, rows] = await Promise.all([
      viewer(db, user),
      db.all<PingRow>(`${PING_SELECT} WHERE s.owner_id = ? OR s.id IN (SELECT station_id FROM subscriptions WHERE user_id = ?)
        ORDER BY p.created_at DESC LIMIT 200`, user, user),
    ]);
    return c.json(rows.map(v.ping));
  });

  app.get('/summary', async (c) => {
    const since = new Date(Date.now() - 2 * DAY).toISOString();
    const p = await db.get<PingRow>(`${PING_SELECT} JOIN subscriptions su ON su.station_id = p.station_id AND su.user_id = ?
      WHERE p.created_at >= ? AND su.paused = 0 ORDER BY p.urgent DESC, p.created_at DESC LIMIT 1`, currentUser(), since);
    if (!p) return c.json({ text: null });
    const first = p.title ? p.title + '.' : p.body.split(/(?<=\.)\s/)[0];
    return c.json({ text: `${p.s_short}: ${first}`, urgent: !!p.urgent, pingId: p.id });
  });

  app.get('/pings/:id', async (c) => {
    const user = currentUser();
    const p = await db.get<PingRow>(`${PING_SELECT} WHERE p.id = ?`, Number(c.req.param('id')));
    if (!p) return c.json({ error: 'That ping no longer exists.' }, 404);
    await db.run('INSERT OR IGNORE INTO reads (user_id, ping_id) VALUES (?, ?)', user, p.id);
    const [v, s] = await Promise.all([viewer(db, user), getStation(p.station_id)]);
    return c.json({ ping: v.ping(p), station: v.station(s!) });
  });

  app.get('/subs', async (c) => {
    const user = currentUser();
    const [v, own, following] = await Promise.all([
      viewer(db, user),
      db.all<StationRow>('SELECT * FROM stations WHERE owner_id = ? ORDER BY name', user),
      db.all<StationRow>(`SELECT s.* FROM stations s JOIN subscriptions su ON su.station_id = s.id
        WHERE su.user_id = ? AND s.owner_id != ? ORDER BY s.name`, user, user),
    ]);
    return c.json({ own: own.map((s) => v.station(s)), following: following.map((s) => v.station(s)) });
  });

  app.get('/stations/:id', async (c) => {
    const s = await getStation(c.req.param('id'));
    if (!s) return c.json({ error: 'That Station no longer exists.' }, 404);
    const [v, docs, pings, audience] = await Promise.all([
      viewer(db, currentUser()),
      db.all<{ id: number; title: string; body: string }>('SELECT id, title, body FROM docs WHERE station_id = ? ORDER BY id', s.id),
      db.all<PingRow>(`${PING_SELECT} WHERE p.station_id = ? ORDER BY p.created_at DESC LIMIT 20`, s.id),
      db.all<{ level: Level; via: Via; n: number }>('SELECT level, via, COUNT(*) AS n FROM subscriptions WHERE station_id = ? GROUP BY level, via', s.id),
    ]);
    return c.json({ station: v.station(s), docs, pings: pings.map(v.ping), audience });
  });

  /** Public Stations nearby, the one you're standing at, and their recent pings (D-012, D-013). */
  app.get('/nearby', async (c) => {
    const user = currentUser();
    const here = { lat: Number(c.req.query('lat')), lng: Number(c.req.query('lng')) };
    if (!Number.isFinite(here.lat) || !Number.isFinite(here.lng)) return c.json({ error: 'Location is missing.' }, 400);
    const words = searchWords(c.req.query('q') || '');
    const since = new Date(Date.now() - NEARBY_DAYS * DAY).toISOString();
    const [v, all] = await Promise.all([
      viewer(db, user),
      db.all<StationRow>("SELECT * FROM stations WHERE access = 'public' AND owner_id != ? AND lat IS NOT NULL", user),
    ]);
    const stations = all
      .map((s) => ({ s, dist: distanceM(here, { lat: s.lat!, lng: s.lng! }) }))
      .filter(({ s, dist }) => dist <= RADAR_M && strength(daysSince(s.verified_at)) > 0)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 90); // stay under D1's 100 bound values per query
    const ids = stations.map(({ s }) => s.id);
    const byId = new Map(stations.map((x) => [x.s.id, x]));
    const [pings, docs] = ids.length ? await Promise.all([
      db.all<PingRow>(`${PING_SELECT} WHERE p.station_id IN (${placeholders(ids.length)}) AND p.created_at >= ? ORDER BY p.created_at DESC`, ...ids, since),
      words.length ? db.all<{ station_id: string; title: string; body: string }>(`SELECT station_id, title, body FROM docs WHERE station_id IN (${placeholders(ids.length)})`, ...ids) : Promise.resolve([]),
    ]) : [[], []];

    const hereStation = stations.find(({ dist }) => dist <= HERE_M);
    const herePing = hereStation ? pings.find((p) => p.station_id === hereStation.s.id) : undefined;
    const withDist = (s: StationRow, dist: number) => ({ ...v.station(s), dist: Math.round(dist) });

    type Text = { from: 'ping' | 'info' | 'name'; t: string };
    const results: { station: ReturnType<typeof withDist>; match: string; from: Text['from']; score: number }[] = [];
    if (words.length) {
      for (const { s, dist } of stations) {
        const texts: Text[] = [
          { from: 'name', t: s.name },
          ...pings.filter((p) => p.station_id === s.id).map((p): Text => ({ from: 'ping', t: (p.title ? p.title + '. ' : '') + p.body })),
          ...docs.filter((d) => d.station_id === s.id).map((d): Text => ({ from: 'info', t: `${d.title}: ${d.body}` })),
        ];
        const best = texts.map((x) => ({ ...x, n: matchCount(words, x.t) })).sort((a, b) => b.n - a.n)[0];
        if (best && best.n > 0) {
          // Best match first; a name match counts most, then pings, then info pages; nearer wins ties.
          const weight = best.from === 'name' ? 0.3 : best.from === 'ping' ? 0.2 : 0;
          results.push({ station: withDist(s, dist), match: best.t, from: best.from, score: best.n + weight - dist / 100_000 });
        }
      }
      results.sort((a, b) => b.score - a.score);
    }
    return c.json({
      here: hereStation ? { station: withDist(hereStation.s, hereStation.dist), latest: herePing ? v.ping(herePing) : null } : null,
      pings: words.length ? [] : pings.map((p) => ({ ...v.ping(p), dist: Math.round(byId.get(p.station_id)!.dist) })),
      results,
    });
  });

  /** Simple question answering over the Stations you follow. Keyword matching for now, not AI. */
  app.post('/ask', async (c) => {
    const user = currentUser();
    const { question } = await c.req.json<{ question: string }>();
    const words = searchWords((question || '').replace(/\bneed\b/gi, 'bring'));
    const mine = `SELECT id FROM stations WHERE owner_id = ? OR id IN (SELECT station_id FROM subscriptions WHERE user_id = ?)`;
    const [docs, pings] = await Promise.all([
      db.all<{ title: string; body: string; s_short: string }>(`SELECT d.title, d.body, s.short AS s_short FROM docs d JOIN stations s ON s.id = d.station_id WHERE d.station_id IN (${mine})`, user, user),
      db.all<PingRow>(`${PING_SELECT} WHERE p.station_id IN (${mine}) ORDER BY p.created_at DESC LIMIT 300`, user, user),
    ]);
    const hits = [
      ...docs.map((d) => ({ score: matchCount(words, `${d.title} ${d.body}`), station: d.s_short, text: d.body, source: d.title })),
      ...pings.map((p) => { const n = matchCount(words, `${p.title ?? ''} ${p.body}`); return { score: n ? n + 0.5 : 0, station: p.s_short, text: p.title ? `${p.title}. ${p.body.split('\n')[0]}` : p.body, source: 'ping' }; }),
    ];
    const top = hits.filter((h) => h.score > 0).sort((a, b) => b.score - a.score).slice(0, 2);
    return c.json({ answers: top.map(({ station, text, source }) => ({ station, text, source })) });
  });

  // ---- Changing things ----
  app.post('/pings/:id/read', async (c) => {
    await db.run('INSERT OR IGNORE INTO reads (user_id, ping_id) VALUES (?, ?)', currentUser(), Number(c.req.param('id')));
    return c.json({ ok: true });
  });

  app.put('/stations/:id/subscription', async (c) => {
    const s = await getStation(c.req.param('id'));
    if (!s) return c.json({ error: 'That Station no longer exists.' }, 404);
    const user = currentUser();
    const body = await c.req.json<{ level?: Level; via?: Via; paused?: boolean }>();
    const cur = await db.get<SubRow>('SELECT * FROM subscriptions WHERE user_id = ? AND station_id = ?', user, s.id);
    const level = body.level ?? cur?.level ?? 'all';
    const via = body.via ?? cur?.via ?? 'email';
    const paused = body.paused ?? !!cur?.paused;
    if (!['all', 'urgent'].includes(level) || !['email', 'ai', 'webhook'].includes(via)) return c.json({ error: 'That setting isn’t available yet.' }, 400);
    await db.run(`INSERT INTO subscriptions (user_id, station_id, level, via, paused, created_at) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT (user_id, station_id) DO UPDATE SET level = excluded.level, via = excluded.via, paused = excluded.paused`,
      user, s.id, level, via, paused ? 1 : 0, new Date().toISOString());
    return c.json((await viewer(db, user)).station(s));
  });

  app.delete('/stations/:id/subscription', async (c) => {
    await db.run('DELETE FROM subscriptions WHERE user_id = ? AND station_id = ?', currentUser(), c.req.param('id'));
    return c.json({ ok: true });
  });

  app.post('/stations', async (c) => {
    const user = currentUser();
    const { name, category, access, lat, lng } = await c.req.json<{ name: string; category: Category; access: 'invite' | 'public'; lat?: number; lng?: number }>();
    const clean = (name || '').trim();
    if (!clean) return c.json({ error: 'Give your Station a name.' }, 400);
    if (!CATEGORIES.includes(category)) return c.json({ error: 'Pick what kind of Station it is.' }, 400);
    const base = clean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'station';
    let id = base, n = 1;
    while (await getStation(id)) id = `${base}-${++n}`;
    const now = new Date().toISOString();
    const args: Arg[] = [id, clean, clean.length > 24 ? clean.slice(0, 23) + '…' : clean, category, access === 'public' ? 'public' : 'invite', user, lat ?? null, lng ?? null, now, now];
    await db.run('INSERT INTO stations (id, name, short, category, access, owner_id, lat, lng, verified_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ...args);
    return c.json((await viewer(db, user)).station((await getStation(id))!), 201);
  });

  app.post('/stations/:id/pings', async (c) => {
    const s = await owned(c.req.param('id'));
    if (!s) return c.json({ error: 'Only the person who runs this Station can send pings.' }, 403);
    const { body, title, urgent } = await c.req.json<{ body: string; title?: string; urgent?: boolean }>();
    if (!(body || '').trim()) return c.json({ error: 'Write something first.' }, 400);
    const now = new Date().toISOString();
    const r = await db.run('INSERT INTO pings (station_id, urgent, title, body, created_at) VALUES (?, ?, ?, ?, ?)', s.id, urgent ? 1 : 0, (title || '').trim() || null, body.trim(), now);
    await db.run('UPDATE stations SET verified_at = ? WHERE id = ?', now, s.id);
    const subs = await db.all<SubRow>('SELECT * FROM subscriptions WHERE station_id = ?', s.id);
    const notified = subs.filter((x) => notifies({ level: x.level, via: x.via, paused: !!x.paused }, !!urgent, x.user_id === s.owner_id)).length;
    return c.json({ id: r.lastId, notified, waiting: subs.length - notified }, 201);
  });

  app.post('/stations/:id/verify', async (c) => {
    const s = await owned(c.req.param('id'));
    if (!s) return c.json({ error: 'Only the person who runs this Station can confirm its details.' }, 403);
    await db.run('UPDATE stations SET verified_at = ? WHERE id = ?', new Date().toISOString(), s.id);
    return c.json((await viewer(db, currentUser())).station((await getStation(s.id))!));
  });

  app.post('/stations/:id/docs', async (c) => {
    const s = await owned(c.req.param('id'));
    if (!s) return c.json({ error: 'Only the person who runs this Station can add pages.' }, 403);
    const { title, body } = await c.req.json<{ title: string; body: string }>();
    if (!(title || '').trim() || !(body || '').trim()) return c.json({ error: 'Add a title and some text.' }, 400);
    await db.run('INSERT INTO docs (station_id, title, body) VALUES (?, ?, ?)', s.id, title.trim(), body.trim());
    await db.run('UPDATE stations SET verified_at = ? WHERE id = ?', new Date().toISOString(), s.id);
    return c.json({ ok: true }, 201);
  });

  // ---- Development helpers ----
  app.post('/dev/reset', async (c) => { await resetStore(db); return c.json({ ok: true }); });
  app.post('/dev/age/:id', async (c) => {
    const s = await owned(c.req.param('id'));
    if (!s) return c.json({ error: 'Only for Stations you run.' }, 403);
    await db.run('UPDATE stations SET verified_at = ? WHERE id = ?', new Date(Date.parse(s.verified_at) - 60 * DAY).toISOString(), s.id);
    return c.json((await viewer(db, currentUser())).station((await getStation(s.id))!));
  });

  return app;
}
