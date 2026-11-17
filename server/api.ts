import { Hono } from 'hono';
import type { DB } from './db';
import { resetDb } from './db';
import { ME } from './seed';
import {
  CATEGORIES, type Category, type Level, type Via, daysSince, distanceM, matchCount, notifies, searchWords, strength,
} from '../shared/domain';

// One person for now ("You"). Real sign-in comes later; every route reads the user from here.
const currentUser = () => ME;
const RADAR_M = 2500;
const NEARBY_DAYS = 30;
const HERE_M = 50;

type StationRow = { id: string; name: string; short: string; category: Category; access: 'invite' | 'public'; owner_id: string; lat: number | null; lng: number | null; verified_at: string; created_at: string };
type PingRow = { id: number; station_id: string; urgent: number; title: string | null; body: string; created_at: string };
type SubRow = { user_id: string; station_id: string; level: Level; via: Via; paused: number };

export function api(db: DB) {
  const app = new Hono();
  const q = <T>(sql: string, ...args: (string | number | null)[]) => db.prepare(sql).all(...args) as T[];
  const one = <T>(sql: string, ...args: (string | number | null)[]) => db.prepare(sql).get(...args) as T | undefined;

  const subOf = (user: string, stationId: string) => one<SubRow>('SELECT * FROM subscriptions WHERE user_id = ? AND station_id = ?', user, stationId);
  const isRead = (user: string, pingId: number) => !!one('SELECT 1 FROM reads WHERE user_id = ? AND ping_id = ?', user, pingId);
  const subCount = (stationId: string) => (one<{ n: number }>('SELECT COUNT(*) AS n FROM subscriptions WHERE station_id = ?', stationId)?.n ?? 0);

  const stationOut = (s: StationRow, user: string, here?: { lat: number; lng: number }) => {
    const sub = subOf(user, s.id);
    return {
      id: s.id, name: s.name, short: s.short, category: s.category, access: s.access,
      owner: s.owner_id === user,
      verifiedDays: daysSince(s.verified_at), strength: strength(daysSince(s.verified_at)),
      subscribers: subCount(s.id),
      sub: sub ? { level: sub.level, via: sub.via, paused: !!sub.paused } : null,
      dist: here && s.lat != null && s.lng != null ? Math.round(distanceM(here, { lat: s.lat, lng: s.lng })) : null,
    };
  };
  const pingOut = (p: PingRow, user: string, station?: StationRow) => {
    const s = station ?? one<StationRow>('SELECT * FROM stations WHERE id = ?', p.station_id)!;
    const sub = subOf(user, s.id);
    return {
      id: p.id, stationId: s.id, stationName: s.name, stationShort: s.short, category: s.category,
      urgent: !!p.urgent, title: p.title, body: p.body, createdAt: p.created_at,
      read: s.owner_id === user || isRead(user, p.id),
      own: s.owner_id === user,
      notified: notifies(sub ? { level: sub.level, via: sub.via, paused: !!sub.paused } : null, !!p.urgent, s.owner_id === user),
    };
  };
  const stationOr404 = (id: string) => one<StationRow>('SELECT * FROM stations WHERE id = ?', id);

  // ---- Reading ----
  app.get('/me', (c) => c.json(one('SELECT id, name FROM users WHERE id = ?', currentUser())));

  app.get('/timeline', (c) => {
    const user = currentUser();
    const rows = q<PingRow>(`SELECT p.* FROM pings p JOIN stations s ON s.id = p.station_id
      WHERE s.owner_id = ? OR s.id IN (SELECT station_id FROM subscriptions WHERE user_id = ?)
      ORDER BY p.created_at DESC LIMIT 200`, user, user);
    return c.json(rows.map((p) => pingOut(p, user)));
  });

  app.get('/summary', (c) => {
    const user = currentUser();
    const since = new Date(Date.now() - 2 * 86_400_000).toISOString();
    const p = one<PingRow>(`SELECT p.* FROM pings p JOIN subscriptions su ON su.station_id = p.station_id AND su.user_id = ?
      WHERE p.created_at >= ? AND su.paused = 0 ORDER BY p.urgent DESC, p.created_at DESC LIMIT 1`, user, since);
    if (!p) return c.json({ text: null });
    const s = stationOr404(p.station_id)!;
    const first = (p.title ? p.title + '.' : p.body.split(/(?<=\.)\s/)[0]);
    return c.json({ text: `${s.short}: ${first}`, urgent: !!p.urgent, pingId: p.id });
  });

  app.get('/pings/:id', (c) => {
    const p = one<PingRow>('SELECT * FROM pings WHERE id = ?', Number(c.req.param('id')));
    if (!p) return c.json({ error: 'That ping no longer exists.' }, 404);
    const user = currentUser();
    db.prepare('INSERT OR IGNORE INTO reads (user_id, ping_id) VALUES (?, ?)').run(user, p.id);
    return c.json({ ping: pingOut(p, user), station: stationOut(stationOr404(p.station_id)!, user) });
  });

  app.get('/subs', (c) => {
    const user = currentUser();
    const own = q<StationRow>('SELECT * FROM stations WHERE owner_id = ? ORDER BY name', user);
    const following = q<StationRow>(`SELECT s.* FROM stations s JOIN subscriptions su ON su.station_id = s.id
      WHERE su.user_id = ? AND s.owner_id != ? ORDER BY s.name`, user, user);
    return c.json({ own: own.map((s) => stationOut(s, user)), following: following.map((s) => stationOut(s, user)) });
  });

  app.get('/stations/:id', (c) => {
    const s = stationOr404(c.req.param('id'));
    if (!s) return c.json({ error: 'That Station no longer exists.' }, 404);
    const user = currentUser();
    const docs = q<{ id: number; title: string; body: string }>('SELECT id, title, body FROM docs WHERE station_id = ? ORDER BY id', s.id);
    const pings = q<PingRow>('SELECT * FROM pings WHERE station_id = ? ORDER BY created_at DESC LIMIT 20', s.id);
    const levels = q<{ level: Level; via: Via; n: number }>('SELECT level, via, COUNT(*) AS n FROM subscriptions WHERE station_id = ? GROUP BY level, via', s.id);
    return c.json({ station: stationOut(s, user), docs, pings: pings.map((p) => pingOut(p, user, s)), audience: levels });
  });

  /** Public Stations nearby, the one you're standing at, and their recent pings (D-012, D-013). */
  app.get('/nearby', (c) => {
    const user = currentUser();
    const here = { lat: Number(c.req.query('lat')), lng: Number(c.req.query('lng')) };
    if (!Number.isFinite(here.lat) || !Number.isFinite(here.lng)) return c.json({ error: 'Location is missing.' }, 400);
    const words = searchWords(c.req.query('q') || '');
    const since = new Date(Date.now() - NEARBY_DAYS * 86_400_000).toISOString();
    const stations = q<StationRow>("SELECT * FROM stations WHERE access = 'public' AND owner_id != ? AND lat IS NOT NULL", user)
      .map((s) => ({ s, dist: distanceM(here, { lat: s.lat!, lng: s.lng! }) }))
      .filter(({ s, dist }) => dist <= RADAR_M && strength(daysSince(s.verified_at)) > 0)
      .sort((a, b) => a.dist - b.dist);
    const hereStation = stations.find(({ dist }) => dist <= HERE_M);
    const ids = stations.map(({ s }) => s.id);
    const pings = ids.length ? q<PingRow>(`SELECT * FROM pings WHERE station_id IN (${ids.map(() => '?').join(',')}) AND created_at >= ? ORDER BY created_at DESC`, ...ids, since) : [];
    const byId = new Map(stations.map((x) => [x.s.id, x]));
    let list = pings.map((p) => ({ ...pingOut(p, user, byId.get(p.station_id)!.s), dist: Math.round(byId.get(p.station_id)!.dist) }));
    let results: { station: ReturnType<typeof stationOut>; match: string; from: 'ping' | 'info' | 'name'; score: number }[] = [];
    if (words.length) {
      for (const { s, dist } of stations) {
        type Text = { from: 'ping' | 'info' | 'name'; t: string };
        const texts: Text[] = [
          { from: 'name', t: s.name },
          ...pings.filter((p) => p.station_id === s.id).map((p): Text => ({ from: 'ping', t: (p.title ? p.title + '. ' : '') + p.body })),
          ...q<{ title: string; body: string }>('SELECT title, body FROM docs WHERE station_id = ?', s.id).map((d): Text => ({ from: 'info', t: `${d.title}: ${d.body}` })),
        ];
        const best = texts.map((x) => ({ ...x, n: matchCount(words, x.t) })).sort((a, b) => b.n - a.n)[0];
        if (best && best.n > 0) {
          // Best match first; a name match counts most, then pings, then info pages; nearer wins ties.
          const weight = best.from === 'name' ? 0.3 : best.from === 'ping' ? 0.2 : 0;
          results.push({ station: { ...stationOut(s, user), dist: Math.round(dist) }, match: best.t, from: best.from, score: best.n + weight - dist / 100_000 });
        }
      }
      results.sort((a, b) => b.score - a.score);
      list = [];
    }
    return c.json({
      here: hereStation ? { station: { ...stationOut(hereStation.s, user), dist: Math.round(hereStation.dist) }, latest: (() => { const p = pings.find((x) => x.station_id === hereStation.s.id); return p ? pingOut(p, user, hereStation.s) : null; })() } : null,
      pings: list, results,
    });
  });

  /** Simple question answering over the Stations you follow. Keyword matching for now, not AI. */
  app.post('/ask', async (c) => {
    const user = currentUser();
    const { question } = await c.req.json<{ question: string }>();
    const words = searchWords((question || '').replace(/\bneed\b/gi, 'bring'));
    const stations = q<StationRow>(`SELECT s.* FROM stations s WHERE s.owner_id = ? OR s.id IN (SELECT station_id FROM subscriptions WHERE user_id = ?)`, user, user);
    const hits: { score: number; station: string; text: string; source: string }[] = [];
    for (const s of stations) {
      for (const d of q<{ title: string; body: string }>('SELECT title, body FROM docs WHERE station_id = ?', s.id)) {
        hits.push({ score: matchCount(words, `${d.title} ${d.body}`), station: s.short, text: d.body, source: d.title });
      }
      for (const p of q<PingRow>('SELECT * FROM pings WHERE station_id = ? ORDER BY created_at DESC LIMIT 20', s.id)) {
        const n = matchCount(words, `${p.title ?? ''} ${p.body}`);
        hits.push({ score: n ? n + 0.5 : 0, station: s.short, text: p.title ? `${p.title}. ${p.body.split('\n')[0]}` : p.body, source: 'ping' });
      }
    }
    const top = hits.filter((h) => h.score > 0).sort((a, b) => b.score - a.score).slice(0, 2);
    return c.json({ answers: top.map(({ station, text, source }) => ({ station, text, source })) });
  });

  // ---- Changing things ----
  app.post('/pings/:id/read', (c) => {
    db.prepare('INSERT OR IGNORE INTO reads (user_id, ping_id) VALUES (?, ?)').run(currentUser(), Number(c.req.param('id')));
    return c.json({ ok: true });
  });

  app.put('/stations/:id/subscription', async (c) => {
    const s = stationOr404(c.req.param('id'));
    if (!s) return c.json({ error: 'That Station no longer exists.' }, 404);
    const user = currentUser();
    const body = await c.req.json<{ level?: Level; via?: Via; paused?: boolean }>();
    const cur = subOf(user, s.id);
    const level = body.level ?? cur?.level ?? 'all';
    const via = body.via ?? cur?.via ?? 'email';
    const paused = body.paused ?? !!cur?.paused;
    if (!['all', 'urgent'].includes(level) || !['email', 'ai', 'webhook'].includes(via)) return c.json({ error: 'That setting isn’t available yet.' }, 400);
    db.prepare(`INSERT INTO subscriptions (user_id, station_id, level, via, paused, created_at) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT (user_id, station_id) DO UPDATE SET level = excluded.level, via = excluded.via, paused = excluded.paused`)
      .run(user, s.id, level, via, paused ? 1 : 0, new Date().toISOString());
    return c.json(stationOut(s, user));
  });

  app.delete('/stations/:id/subscription', (c) => {
    db.prepare('DELETE FROM subscriptions WHERE user_id = ? AND station_id = ?').run(currentUser(), c.req.param('id'));
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
    while (stationOr404(id)) id = `${base}-${++n}`;
    const now = new Date().toISOString();
    db.prepare('INSERT INTO stations (id, name, short, category, access, owner_id, lat, lng, verified_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, clean, clean.length > 24 ? clean.slice(0, 23) + '…' : clean, category, access === 'public' ? 'public' : 'invite', user, lat ?? null, lng ?? null, now, now);
    return c.json(stationOut(stationOr404(id)!, user), 201);
  });

  const ownedOr403 = (id: string) => {
    const s = stationOr404(id);
    return s && s.owner_id === currentUser() ? s : null;
  };

  app.post('/stations/:id/pings', async (c) => {
    const s = ownedOr403(c.req.param('id'));
    if (!s) return c.json({ error: 'Only the person who runs this Station can send pings.' }, 403);
    const { body, title, urgent } = await c.req.json<{ body: string; title?: string; urgent?: boolean }>();
    if (!(body || '').trim()) return c.json({ error: 'Write something first.' }, 400);
    const now = new Date().toISOString();
    const r = db.prepare('INSERT INTO pings (station_id, urgent, title, body, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(s.id, urgent ? 1 : 0, (title || '').trim() || null, body.trim(), now);
    db.prepare('UPDATE stations SET verified_at = ? WHERE id = ?').run(now, s.id);
    const subs = q<SubRow>('SELECT * FROM subscriptions WHERE station_id = ?', s.id);
    const notified = subs.filter((x) => notifies({ level: x.level, via: x.via, paused: !!x.paused }, !!urgent, x.user_id === s.owner_id)).length;
    return c.json({ id: Number(r.lastInsertRowid), notified, waiting: subs.length - notified }, 201);
  });

  app.post('/stations/:id/verify', (c) => {
    const s = ownedOr403(c.req.param('id'));
    if (!s) return c.json({ error: 'Only the person who runs this Station can confirm its details.' }, 403);
    db.prepare('UPDATE stations SET verified_at = ? WHERE id = ?').run(new Date().toISOString(), s.id);
    return c.json(stationOut(stationOr404(s.id)!, currentUser()));
  });

  app.post('/stations/:id/docs', async (c) => {
    const s = ownedOr403(c.req.param('id'));
    if (!s) return c.json({ error: 'Only the person who runs this Station can add pages.' }, 403);
    const { title, body } = await c.req.json<{ title: string; body: string }>();
    if (!(title || '').trim() || !(body || '').trim()) return c.json({ error: 'Add a title and some text.' }, 400);
    db.prepare('INSERT INTO docs (station_id, title, body) VALUES (?, ?, ?)').run(s.id, title.trim(), body.trim());
    db.prepare('UPDATE stations SET verified_at = ? WHERE id = ?').run(new Date().toISOString(), s.id);
    return c.json({ ok: true }, 201);
  });

  // ---- Development helpers ----
  app.post('/dev/reset', (c) => { resetDb(db); return c.json({ ok: true }); });
  app.post('/dev/age/:id', (c) => {
    const s = ownedOr403(c.req.param('id'));
    if (!s) return c.json({ error: 'Only for Stations you run.' }, 403);
    const older = new Date(Date.parse(s.verified_at) - 60 * 86_400_000).toISOString();
    db.prepare('UPDATE stations SET verified_at = ? WHERE id = ?').run(older, s.id);
    return c.json(stationOut(stationOr404(s.id)!, currentUser()));
  });

  return app;
}
