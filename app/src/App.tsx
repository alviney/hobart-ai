import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { CATEGORIES, type Category, type Level, type Via, STRENGTH_LABEL, dayLabel, shortTime, suggestUrgent } from '../../shared/domain';
import { api, type Nearby, type Ping, type Station, type StationPage } from './api';
import { CatIcon, Icon, catLabel } from './icons';

// Where "you" are standing in the sample data (Lansdowne Primary School). Real location is opt-in.
const DEMO_HERE = { lat: -42.8893, lng: 147.319 };
const LEVEL_LABEL: Record<Level, string> = { all: 'Everything', urgent: 'Urgent only' };
const VIA_LABEL: Record<Via, string> = { email: 'Email', ai: 'My AI only', webhook: 'Webhook', sms: 'SMS' };
const DEPTH: Record<string, number> = { Today: 0, Yesterday: 1, 'Earlier this week': 2, Older: 3 };
const km = (m: number) => (m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1)} km`);
const ago = (d: number) => (d === 0 ? 'today' : d === 1 ? 'yesterday' : d < 14 ? `${d} days ago` : d < 60 ? `${Math.round(d / 7)} weeks ago` : `${Math.round(d / 30)} months ago`);

// ---------- Routing: a tiny hash router so the browser back button works ----------
type Route =
  | { name: 'home' } | { name: 'ping'; id: number } | { name: 'station'; id: string } | { name: 'subscribe'; id: string }
  | { name: 'compose'; id: string } | { name: 'start' } | { name: 'ask' } | { name: 'ai' };
function parseHash(h: string): Route {
  const [, a, b] = h.replace(/^#\/?/, '').split('/').length ? ['', ...h.replace(/^#\/?/, '').split('/')] : [];
  if (a === 'ping' && b) return { name: 'ping', id: Number(b) };
  if (a === 'station' && b) return { name: 'station', id: b };
  if (a === 'subscribe' && b) return { name: 'subscribe', id: b };
  if (a === 'compose' && b) return { name: 'compose', id: b };
  if (a === 'start') return { name: 'start' };
  if (a === 'ask') return { name: 'ask' };
  if (a === 'ai') return { name: 'ai' };
  return { name: 'home' };
}
const go = (path: string) => { location.hash = path; };

function useLoad<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [state, set] = useState<{ data?: T; error?: string; loading: boolean }>({ loading: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    let live = true;
    set((s) => ({ ...s, loading: true }));
    fn().then((data) => live && set({ data, loading: false })).catch((e: Error) => live && set({ error: e.message, loading: false }));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, n]);
  return { ...state, reload: () => setN((x) => x + 1) };
}

// ---------- Shared bits ----------
function Avatar({ s, big }: { s: Station; big?: boolean }) {
  return <span className={`avatar ${big ? 'big' : ''} ${s.owner ? 'ink' : ''} sig${s.strength}`} aria-hidden="true"><CatIcon c={s.category} /></span>;
}

function PingRow({ p, near, onOpen }: { p: Ping; near?: boolean; onOpen: (p: Ping) => void }) {
  return (
    <button type="button" className={`rp ${p.read ? 'read' : ''}`} onClick={() => onOpen(p)}>
      <span className="cat" title={catLabel(p.category)}><CatIcon c={p.category} /><span className="sr">{catLabel(p.category)}</span></span>
      <span className="who">
        {!p.read && <span className={`udot ${p.urgent ? 'urgent' : ''}`} aria-label="Unread" />}
        <span className="nm">{p.own ? 'You · ' : ''}{p.stationName}</span>
        {p.urgent && <span className="utag">Urgent</span>}
      </span>
      <span className="tm">{near && p.dist != null ? `${km(p.dist)} · ` : ''}{shortTime(p.createdAt)}</span>
      <span className="tx">{p.title && <b style={{ color: 'var(--ink)', fontWeight: 600 }}>{p.title}. </b>}{p.body.split('\n')[0]}</span>
    </button>
  );
}

/** Pings grouped by day, getting deeper and darker as they get older (D-016). */
function Dive({ pings, near, onOpen }: { pings: Ping[]; near?: boolean; onOpen: (p: Ping) => void }) {
  const bands: { d: string; rows: Ping[] }[] = [];
  for (const p of pings) {
    const d = dayLabel(p.createdAt);
    const last = bands[bands.length - 1];
    if (!last || last.d !== d) bands.push({ d, rows: [p] }); else last.rows.push(p);
  }
  if (!bands.length) return <div className="empty">No pings yet. Turn on the radar to find Stations nearby.</div>;
  return (
    <div className="dive">
      {bands.map((b) => (
        <section key={b.d} className={`band d${DEPTH[b.d]}`}>
          <h2 className="dayh">{b.d}</h2>
          {b.rows.map((p) => <PingRow key={p.id} p={p} near={near} onOpen={onOpen} />)}
        </section>
      ))}
    </div>
  );
}

function Back({ to, label }: { to: string; label: string }) {
  return <button type="button" className="back" onClick={() => go(to)}>‹ {label}</button>;
}

function Switch({ on, label, onChange }: { on: boolean; label: string; onChange: () => void }) {
  return <button type="button" className="switch" role="switch" aria-checked={on} aria-label={label} onClick={onChange}><span /></button>;
}

// ---------- App shell ----------
type Panel = 'timeline' | 'radar' | 'subs';
type Toast = { text: string; n: number } | null;

export function App() {
  const [route, setRoute] = useState<Route>(() => parseHash(location.hash));
  const [panel, setPanel] = useState<Panel>('timeline');
  const [sheet, setSheet] = useState<null | 'menu'>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [ripple, setRipple] = useState(0);
  const [nearQ, setNearQ] = useState('');
  const [chat, setChat] = useState<{ who: 'me' | 'ai'; text: ReactNode }[]>([]);
  const [here, setHere] = useState(DEMO_HERE);
  const [usingDemo, setUsingDemo] = useState(true);

  useEffect(() => {
    const on = () => { setRoute(parseHash(location.hash)); setSheet(null); };
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  useEffect(() => { document.getElementById('screen')?.scrollTo(0, 0); }, [route, panel]);

  const say = useCallback((text: string) => setToast({ text, n: Date.now() }), []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t); }, [toast]);
  const sendRipple = useCallback(() => { if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setRipple(Date.now()); }, []);
  useEffect(() => { if (!ripple) return; const t = setTimeout(() => setRipple(0), 1900); return () => clearTimeout(t); }, [ripple]);

  const ask = async (question: string) => {
    if (!question.trim()) return;
    setChat((c) => [...c, { who: 'me', text: question }]);
    go('/ask');
    try {
      const { answers } = await api.ask(question);
      setChat((c) => [...c, { who: 'ai', text: answers.length
        ? <>{answers.map((a, i) => <span key={i}>{i > 0 && <><br /><br /></>}<b>{a.station}{a.source !== 'ping' ? ` · ${a.source}` : ''}:</b> {a.text}</span>)}</>
        : "I couldn't find that in your Stations' pings or info. Try asking about a club, school or shop you follow." }]);
    } catch (e) { setChat((c) => [...c, { who: 'ai', text: (e as Error).message }]); }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) { say('Your browser can’t share its location.'); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => { setHere({ lat: p.coords.latitude, lng: p.coords.longitude }); setUsingDemo(false); say('Using your location'); },
      () => say('Location is off, so the radar uses the sample spot.'),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const onHome = route.name === 'home';
  const showFab = onHome || route.name === 'ask';
  let body: ReactNode;
  switch (route.name) {
    case 'ping': body = <PingScreen id={route.id} />; break;
    case 'station': body = <StationScreen id={route.id} say={say} />; break;
    case 'subscribe': body = <SubscribeScreen id={route.id} say={say} />; break;
    case 'compose': body = <ComposeScreen id={route.id} say={say} onSent={() => { setPanel('timeline'); sendRipple(); }} />; break;
    case 'start': body = <StartScreen say={say} here={usingDemo ? null : here} />; break;
    case 'ask': body = <AskScreen chat={chat} onAsk={ask} />; break;
    case 'ai': body = <AiScreen />; break;
    default:
      body = panel === 'radar' ? <RadarPanel here={here} usingDemo={usingDemo} q={nearQ} onUseLocation={useMyLocation} />
        : panel === 'subs' ? <SubsPanel />
        : <TimelinePanel onEditPrompt={() => say('Editing the summary prompt comes next.')} />;
  }

  return (
    <div className="phone" id="phone" data-theme="friendly" data-sig="loading">
      <main className={`screen ${showFab ? 'has-fab' : ''} ${onHome ? 'has-top' : ''}`} id="screen" aria-live="polite">{body}</main>
      {onHome && (
        <div id="topbar">
          <div className="topline">
            <button type="button" className="iconbtn" aria-label="Menu" onClick={() => setSheet('menu')}><Icon.menu /></button>
            <span style={{ flex: 1 }} />
            <button type="button" className="radar-btn troves-btn" aria-pressed={panel === 'subs'} aria-label={panel === 'subs' ? 'Close your subs' : 'Your subs'}
              onClick={() => setPanel(panel === 'subs' ? 'timeline' : 'subs')}>{panel === 'subs' ? <Icon.close /> : <Icon.chest />}</button>
            <button type="button" className="radar-btn" style={{ marginLeft: 8 }} aria-pressed={panel === 'radar'} aria-label={panel === 'radar' ? 'Close the radar' : 'Radar: Stations near you'}
              onClick={() => { setNearQ(''); setPanel(panel === 'radar' ? 'timeline' : 'radar'); }}>{panel === 'radar' ? <Icon.close /> : <Icon.radar />}</button>
          </div>
        </div>
      )}
      {showFab && <AskBar radar={onHome && panel === 'radar'} q={nearQ} setQ={setNearQ} onAsk={ask} />}
      {sheet === 'menu' && (
        <>
          <div className="backdrop" onClick={() => setSheet(null)} />
          <div className="sheet" role="dialog" aria-label="Menu">
            <span className="grabber" />
            <MenuItem icon={<Icon.chest />} label="Your subs" onClick={() => { setSheet(null); go('/'); setPanel('subs'); }} />
            <MenuItem icon={<Icon.plus />} label="Start a Station" onClick={() => go('/start')} />
            <MenuItem icon={<Icon.scan />} label="Scan a code" onClick={() => { setSheet(null); say('Scanning comes with the phone app. For now, use the radar.'); }} />
            <MenuItem icon={<Icon.plug />} label="Your AI and settings" onClick={() => go('/ai')} />
            <MenuItem icon={<Icon.reset />} label="Reset sample data" onClick={async () => { setSheet(null); await api.reset(); setChat([]); go('/'); setPanel('timeline'); location.reload(); }} />
          </div>
        </>
      )}
      {ripple > 0 && <div className="ripple-fx" key={ripple} aria-hidden="true"><span /><span /><span /></div>}
      {toast && <div className="toast" role="status">{toast.text}</div>}
    </div>
  );
}

function MenuItem({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return <button type="button" className="sheet-item" onClick={onClick}><span className="iconbtn">{icon}</span><span className="grow">{label}</span></button>;
}

function AskBar({ radar, q, setQ, onAsk }: { radar: boolean; q: string; setQ: (s: string) => void; onAsk: (q: string) => void }) {
  const [text, setText] = useState('');
  const value = radar ? q : text;
  return (
    <div className="fab">
      <form className="fab-ask" onSubmit={(e) => { e.preventDefault(); if (!radar) { onAsk(text); setText(''); } }}>
        <label htmlFor="ask-input" className="sr">{radar ? 'Search Stations near you' : 'Ask about anything you subscribe to'}</label>
        <input className="input" id="ask-input" placeholder="Ask anything" autoComplete="off" value={value} onChange={(e) => (radar ? setQ(e.target.value) : setText(e.target.value))} />
        {radar && q
          ? <button className="fab-send" type="button" aria-label="Clear search" onClick={() => setQ('')}>×</button>
          : <button className="fab-send" type="submit" aria-label="Ask">↑</button>}
      </form>
    </div>
  );
}

// ---------- Home panels ----------
function TimelinePanel({ onEditPrompt }: { onEditPrompt: () => void }) {
  const t = useLoad(() => api.timeline(), []);
  const s = useLoad(() => api.summary(), []);
  if (t.loading && !t.data) return <p className="loading">Loading your pings…</p>;
  if (t.error) return <p className="error-box">{t.error}</p>;
  return (
    <>
      {s.data?.text && <button type="button" className="sumline" onClick={onEditPrompt}><b>Today:</b> {s.data.text}</button>}
      <Dive pings={t.data!} onOpen={(p) => go(`/ping/${p.id}`)} />
    </>
  );
}

function SubsPanel() {
  const s = useLoad(() => api.subs(), []);
  if (s.loading && !s.data) return <p className="loading">Loading your subs…</p>;
  if (s.error) return <p className="error-box">{s.error}</p>;
  const { own, following } = s.data!;
  const card = (st: Station) => (
    <button key={st.id} type="button" className={`conn ${st.owner ? 'mine' : ''} ${st.sub?.paused ? 'off' : ''}`} onClick={() => go(`/station/${st.id}`)}>
      <Avatar s={st} />
      <span className="grow"><span className="name">{st.name}</span>
        <span className="row" style={{ gap: 6 }}>
          {st.owner
            ? <><span className="tag you">You run this</span><span className="tag plain">{st.subscribers} subscriber{st.subscribers === 1 ? '' : 's'}</span></>
            : <><span className={`tag ${st.sub?.level === 'urgent' ? 't4' : 'plain'}`}>{LEVEL_LABEL[st.sub!.level]}</span><span className="tag plain">{st.sub!.paused ? 'Paused' : VIA_LABEL[st.sub!.via]}</span></>}
        </span>
      </span>
    </button>
  );
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 className="dayh" style={{ paddingTop: 0 }}>Your subs</h2>
      {own.length > 0 && <><p className="section-h">You run</p>{own.map(card)}<p className="section-h">You follow</p></>}
      {following.length ? following.map(card) : <div className="empty">No subscriptions yet. Turn on the radar to find Stations nearby.</div>}
    </div>
  );
}

function RadarPanel({ here, usingDemo, q, onUseLocation }: { here: { lat: number; lng: number }; usingDemo: boolean; q: string; onUseLocation: () => void }) {
  const [scanning, setScanning] = useState(() => !matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => { if (!scanning) return; const t = setTimeout(() => setScanning(false), 1700); return () => clearTimeout(t); }, [scanning]);
  const [debounced, setDebounced] = useState(q);
  useEffect(() => { const t = setTimeout(() => setDebounced(q), 180); return () => clearTimeout(t); }, [q]);
  const n = useLoad<Nearby>(() => api.nearby(here.lat, here.lng, debounced), [here.lat, here.lng, debounced]);

  if (scanning) return <div className="scan"><span className="ripple-scan" aria-hidden="true"><i /><i /><i /><b /></span><p>Scanning nearby…</p></div>;
  if (n.error) return <p className="error-box">{n.error}</p>;
  if (!n.data) return <p className="loading">Listening…</p>;
  const { here: h, pings, results } = n.data;
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
      {h && !debounced.trim() && (
        <section className="h-sonar" aria-label="You're here">
          <div className="h-top">
            <div className="grow" style={{ gap: 6 }}><span className="h-eb">Contact · {km(h.station.dist ?? 0)}</span><h2>{h.station.name}</h2></div>
            <span className="h-icon h-icon-s" aria-hidden="true"><i /><i /><CatIcon c={h.station.category} /></span>
          </div>
          {h.latest && <p>{h.latest.title || h.latest.body}</p>}
          <div className="row">
            {h.station.sub
              ? <button type="button" className="pillbtn h-big" onClick={() => go(`/station/${h.station.id}`)}>Open Station</button>
              : <button type="button" className="pillbtn h-big" onClick={() => go(`/subscribe/${h.station.id}`)}>Subscribe</button>}
            <button type="button" className="link-btn" style={{ color: '#FFE476' }} onClick={() => go(`/station/${h.station.id}`)}>What's here</button>
          </div>
        </section>
      )}
      {debounced.trim()
        ? (results.length
          ? <div className="cardlist">{results.map((r) => (
            <button key={r.station.id} type="button" className="conn" onClick={() => go(`/station/${r.station.id}`)}>
              <Avatar s={r.station} />
              <span className="grow"><span className="name">{r.station.name}</span><span className="sub">{km(r.station.dist ?? 0)} · {r.match.slice(0, 120)}</span></span>
            </button>))}</div>
          : <p className="sub">Nothing nearby mentions “{debounced}”.</p>)
        : <Dive pings={pings} near onOpen={(p) => go(`/ping/${p.id}`)} />}
      <p className="demo-note" style={{ textAlign: 'left' }}>
        {usingDemo ? <>Using the sample spot at Lansdowne Primary. <button type="button" className="textlink" onClick={onUseLocation}>Use my location</button></> : 'Using your location. It stays on your phone.'}
      </p>
    </div>
  );
}

// ---------- Screens ----------
function PingScreen({ id }: { id: number }) {
  const r = useLoad(() => api.ping(id), [id]);
  if (r.error) return <><Back to="/" label="Home" /><p className="error-box">{r.error}</p></>;
  if (!r.data) return <p className="loading">Loading…</p>;
  const { ping: p, station: s } = r.data;
  return (
    <>
      <Back to="/" label="Home" />
      <div className="meta">{p.urgent && <span className="tag t4">Urgent</span>}{!p.notified && !p.own && <span className="below">Didn’t notify you</span>}<span>{shortTime(p.createdAt)}</span></div>
      {p.title && <h1>{p.title}</h1>}
      <p className="ping-body" style={{ fontSize: 17, color: 'var(--ink)', whiteSpace: 'pre-line' }}>{p.body}</p>
      <button type="button" className="conn" onClick={() => go(`/station/${s.id}`)} style={{ marginTop: 8 }}>
        <Avatar s={s} />
        <span className="grow"><span className="name">{s.name}</span><span className="sub">{s.owner ? 'You run this' : s.sub ? LEVEL_LABEL[s.sub.level] : 'Not subscribed'}</span></span>
        <span aria-hidden="true" style={{ color: 'var(--muted)' }}>›</span>
      </button>
    </>
  );
}

function StationScreen({ id, say }: { id: string; say: (t: string) => void }) {
  const r = useLoad(() => api.station(id), [id]);
  const [busy, setBusy] = useState(false);
  if (r.error) return <><Back to="/" label="Home" /><p className="error-box">{r.error}</p></>;
  if (!r.data) return <p className="loading">Loading…</p>;
  const page = r.data, s = page.station;
  const act = async (fn: () => Promise<unknown>, done?: string) => {
    setBusy(true);
    try { await fn(); if (done) say(done); r.reload(); } catch (e) { say((e as Error).message); } finally { setBusy(false); }
  };
  const docs = page.docs.length ? page.docs.map((d) => <details key={d.id} className="doc"><summary>{d.title}</summary><p>{d.body}</p></details>) : <p className="sub">No info pages yet.</p>;
  const pings = page.pings.length ? <div className="cardlist">{page.pings.map((p) => <PingRow key={p.id} p={p} onOpen={(x) => go(`/ping/${x.id}`)} />)}</div> : <div className="empty">No pings sent yet.</div>;

  if (s.owner) return <OwnerStation page={page} busy={busy} act={act} say={say} docs={docs} pings={pings} />;
  return (
    <>
      <Back to="/" label="Home" />
      <div className="row" style={{ flexWrap: 'nowrap' }}>
        <Avatar s={s} big />
        <div className="grow"><h2>{s.name}</h2><span className="sub">{STRENGTH_LABEL[s.strength]} · details confirmed {ago(s.verifiedDays)}</span></div>
      </div>
      {s.sub ? (
        <>
          <div className="setting"><span><b>Notifications</b><br /><span className="sub">{s.sub.paused ? 'Paused. Pings still land in your feed.' : 'On'}</span></span>
            <Switch on={!s.sub.paused} label="Notifications" onChange={() => act(() => api.subscribe(s.id, { paused: !s.sub!.paused }), s.sub!.paused ? `Notifications on for ${s.short}` : `${s.short} paused`)} /></div>
          <p className="label">Ping me for</p>
          <div className="pills">{(['all', 'urgent'] as Level[]).map((l) => <button key={l} type="button" className="pill" aria-pressed={s.sub!.level === l} disabled={busy} onClick={() => act(() => api.subscribe(s.id, { level: l }))}>{LEVEL_LABEL[l]}</button>)}</div>
          <p className="label">How it reaches you</p>
          <div className="pills">
            {(['email', 'ai', 'webhook'] as Via[]).map((v) => <button key={v} type="button" className="pill" aria-pressed={s.sub!.via === v} disabled={busy} onClick={() => act(() => api.subscribe(s.id, { via: v }))}>{VIA_LABEL[v]}</button>)}
            <button type="button" className="pill" aria-pressed={false} onClick={() => say('SMS is planned for a paid plan.')}>SMS · Plus</button>
          </div>
          <p className="inline-note">Delivery by email and webhook isn’t switched on yet; pings show in the app for now.</p>
        </>
      ) : (
        <button type="button" className="btn" onClick={() => go(`/subscribe/${s.id}`)}>Subscribe</button>
      )}
      <p className="label">Info</p>{docs}
      <p className="label">Recent pings</p>{pings}
      {s.sub && <button type="button" className="link-btn" style={{ color: 'var(--urgent-fg)', alignSelf: 'flex-start' }} onClick={() => act(async () => { await api.unsubscribe(s.id); }, `Unsubscribed from ${s.short}`)}>Unsubscribe from {s.short}</button>}
    </>
  );
}

function OwnerStation({ page, busy, act, say, docs, pings }: { page: StationPage; busy: boolean; act: (fn: () => Promise<unknown>, done?: string) => void; say: (t: string) => void; docs: ReactNode; pings: ReactNode }) {
  const s = page.station;
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState(''); const [body, setBody] = useState('');
  const link = `${location.origin}/#/subscribe/${s.id}`;
  const copy = async () => { try { await navigator.clipboard.writeText(link); say('Invite link copied'); } catch { say(link); } };
  return (
    <>
      <Back to="/" label="Home" />
      <div className="row" style={{ flexWrap: 'nowrap' }}>
        <Avatar s={s} big />
        <div className="grow"><h2>{s.name}</h2><span className="row" style={{ gap: 6 }}><span className="tag you">You run this</span><span className="tag t1">{s.access === 'public' ? 'On the radar' : 'Invite only'}</span></span></div>
      </div>
      <button type="button" className="btn" onClick={() => go(`/compose/${s.id}`)}>Send a ping</button>
      <div className="panel">
        <span><b>{STRENGTH_LABEL[s.strength]}</b><br /><span className="sub">You confirmed your details {ago(s.verifiedDays)}</span></span>
        <p className="sub">Your ping weakens as your details get older. Sending a ping or adding info counts as confirming.</p>
        <div className="row">
          <button type="button" className="btn small" disabled={busy} onClick={() => act(() => api.verify(s.id), 'Confirmed. Your ping is strong again.')}>Everything's still right</button>
          <button type="button" className="demo-btn" disabled={busy} onClick={() => act(() => api.age(s.id), 'Two months later…')}>Test: 2 months pass</button>
        </div>
      </div>
      <div className="panel">
        <p className="label"><span className="stat">{s.subscribers}</span> subscriber{s.subscribers === 1 ? '' : 's'}</p>
        {page.audience.length > 0 && <p className="sub">{page.audience.map((a) => `${a.n} ${LEVEL_LABEL[a.level].toLowerCase()} by ${VIA_LABEL[a.via].toLowerCase()}`).join(' · ')}</p>}
        <p className="sub" style={{ wordBreak: 'break-all' }}>{link}</p>
        <div className="row"><button type="button" className="btn small" onClick={copy}>Copy invite link</button></div>
      </div>
      <p className="label">Info</p>
      {docs}
      {adding ? (
        <form className="panel" onSubmit={(e) => { e.preventDefault(); act(async () => { await api.addDoc(s.id, { title, body }); setAdding(false); setTitle(''); setBody(''); }, 'Page added. Subscribers can ask about it now.'); }}>
          <label className="label" htmlFor="doc-t">Page title</label>
          <input className="input" id="doc-t" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Wet weather plan" />
          <label className="label" htmlFor="doc-b">What should people know?</label>
          <textarea className="input" id="doc-b" style={{ height: 110, fontSize: 15 }} value={body} onChange={(e) => setBody(e.target.value)} />
          <div className="row"><button className="btn small" type="submit" disabled={busy}>Add page</button><button type="button" className="link-btn" onClick={() => setAdding(false)}>Cancel</button></div>
        </form>
      ) : <button type="button" className="btn dashed small" onClick={() => setAdding(true)}>+ Add a page</button>}
      <p className="label">Past pings</p>{pings}
    </>
  );
}

function SubscribeScreen({ id, say }: { id: string; say: (t: string) => void }) {
  const r = useLoad(() => api.station(id), [id]);
  const [level, setLevel] = useState<Level>('all');
  if (r.error) return <><Back to="/" label="Home" /><p className="error-box">{r.error}</p></>;
  if (!r.data) return <p className="loading">Loading…</p>;
  const s = r.data.station;
  const join = async (via: Via) => {
    try { await api.subscribe(s.id, { level, via, paused: false }); say(`You're subscribed to ${s.short}`); go(`/station/${s.id}`); } catch (e) { say((e as Error).message); }
  };
  return (
    <div style={{ margin: '-22px -20px 0', display: 'flex', flexDirection: 'column' }}>
      <div className="hero"><span className="sub">Subscribe to</span><h1 style={{ fontSize: 34 }}>{s.name}</h1><span>Choose how much you want to hear.</span></div>
      <div className="inner">
        <h2>Ping me for…</h2>
        {([['all', 'Everything', 'Every ping they send'], ['urgent', 'Urgent only', 'Closures, cancellations, things that can’t wait']] as [Level, string, string][]).map(([l, t, d]) => (
          <button key={l} type="button" className="choice" aria-pressed={level === l} onClick={() => setLevel(l)}>
            <span className="radio" /><span className="grow" style={{ gap: 2 }}><b>{t}</b><span className="sub">{d}</span></span>{l === 'urgent' && <span className="tag t4">Urgent</span>}
          </button>
        ))}
        <button type="button" className="btn" onClick={() => join('email')}>Subscribe</button>
        <button type="button" className="link-btn" onClick={() => join('ai')}>Send pings to my AI instead</button>
        <button type="button" className="link-btn" style={{ color: 'var(--muted)' }} onClick={() => history.back()}>Not now</button>
      </div>
    </div>
  );
}

const KINDS: [Category, string][] = [['sport', 'Club or team'], ['school', 'School group'], ['food', 'Food'], ['coffee', 'Coffee'], ['shop', 'Shop'], ['home', 'Neighbours'], ['nature', 'Outdoors'], ['music', 'Music'], ['group', 'Something else']];
function StartScreen({ say, here }: { say: (t: string) => void; here: { lat: number; lng: number } | null }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('sport');
  const [access, setAccess] = useState<'invite' | 'public'>('invite');
  const [busy, setBusy] = useState(false);
  const create = async () => {
    setBusy(true);
    try {
      const s = await api.createStation({ name, category, access, ...(access === 'public' ? (here ?? DEMO_HERE) : {}) });
      say(`${s.name} is ready. Invite some people.`); go(`/station/${s.id}`);
    } catch (e) { say((e as Error).message); setBusy(false); }
  };
  void CATEGORIES;
  return (
    <>
      <Back to="/" label="Home" />
      <h1>Start a Station</h1>
      <p className="sub" style={{ fontSize: 16, color: 'var(--body)' }}>A Station keeps people in the loop about your club, street, shop or group. It takes a minute.</p>
      <label className="label" htmlFor="st-name">What's it called?</label>
      <input className="input" id="st-name" placeholder="Lenna St neighbours" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
      <p className="label">What is it?</p>
      <div className="pills">{KINDS.map(([c, l]) => <button key={c} type="button" className="pill" aria-pressed={category === c} onClick={() => setCategory(c)}>{l}</button>)}</div>
      <p className="label">Who can subscribe?</p>
      <button type="button" className="choice" aria-pressed={access === 'invite'} onClick={() => setAccess('invite')}><span className="radio" /><span className="grow" style={{ gap: 2 }}><b>People I invite</b><span className="sub">By link or QR code. Ready straight away.</span></span></button>
      <button type="button" className="choice" aria-pressed={access === 'public'} onClick={() => setAccess('public')}><span className="radio" /><span className="grow" style={{ gap: 2 }}><b>Anyone nearby</b><span className="sub">Shows on the radar where you are now.</span></span></button>
      <button type="button" className="btn" style={{ marginTop: 'auto' }} disabled={!name.trim() || busy} onClick={create}>Create Station</button>
      <p className="demo-note">Free during the pilot.</p>
    </>
  );
}

function ComposeScreen({ id, say, onSent }: { id: string; say: (t: string) => void; onSent: () => void }) {
  const r = useLoad(() => api.station(id), [id]);
  const [text, setText] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [manual, setManual] = useState(false);
  const [busy, setBusy] = useState(false);
  const hint = suggestUrgent(text);
  const shown = manual ? urgent : (hint?.urgent ?? false);
  if (r.error) return <><Back to="/" label="Home" /><p className="error-box">{r.error}</p></>;
  if (!r.data) return <p className="loading">Loading…</p>;
  const { station: s, audience } = r.data;
  const reach = audience.reduce((n, a) => n + (a.via !== 'ai' && (a.level === 'all' || shown) ? a.n : 0), 0);
  const total = audience.reduce((n, a) => n + a.n, 0);
  const send = async () => {
    setBusy(true);
    try {
      const res = await api.sendPing(s.id, { body: text, urgent: shown });
      onSent(); say(total ? `Ping sent. ${res.notified} notified.` : 'Ping sent. It will be waiting when people subscribe.'); go('/');
    } catch (e) { say((e as Error).message); setBusy(false); }
  };
  return (
    <>
      <Back to={`/station/${s.id}`} label={s.short} />
      <h1>What's the news?</h1>
      <label htmlFor="draft" className="sr">Message</label>
      <textarea className="input" id="draft" placeholder="Saturday games move to 9am at the Domain courts…" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="setting"><span><b>Urgent</b><br /><span className="sub">Reaches everyone, even people who only want urgent pings</span></span>
        <Switch on={shown} label="Urgent" onChange={() => { setManual(true); setUrgent(!shown); }} /></div>
      <p className="sub" style={{ fontSize: 15, color: 'var(--body)' }}>
        {!hint ? 'Write something and we’ll suggest whether it’s urgent.'
          : manual && shown !== hint.urgent ? <>You picked <b>{shown ? 'urgent' : 'not urgent'}</b>. We’d have said {hint.urgent ? 'urgent' : 'not urgent'}, because {hint.why}.</>
          : <>We think it’s <b>{hint.urgent ? 'urgent' : 'not urgent'}</b>: {hint.why}.</>}
      </p>
      <div className="reach">{total ? <><b>{reach} {reach === 1 ? 'person' : 'people'}</b> will get a ping. {total - reach} more will see it next time they look.</> : 'Nobody has subscribed yet, so this will wait in your Station. Share your invite link.'}</div>
      <div className="row" style={{ marginTop: 'auto' }}><button type="button" className="btn" disabled={!text.trim() || busy} onClick={send}>Send ping</button></div>
    </>
  );
}

function AskScreen({ chat, onAsk }: { chat: { who: 'me' | 'ai'; text: ReactNode }[]; onAsk: (q: string) => void }) {
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [chat.length]);
  const sugg = ["What's on this week?", 'What do I need for Saturday?', 'Is school on Friday?', "When's the next working bee?"];
  return (
    <>
      <div className="topline" style={{ justifyContent: 'space-between' }}><h1>Ask</h1><button type="button" className="btn ghost small" onClick={() => go('/')}>Done</button></div>
      <p className="sub">Answers come from your Stations' pings and info. For now this is keyword matching, not AI.</p>
      {chat.length ? chat.map((m, i) => <div key={i} className={`bubble ${m.who}`}>{m.text}</div>)
        : <div className="chips">{sugg.map((q) => <button key={q} type="button" className="chip" onClick={() => onAsk(q)}>{q}</button>)}</div>}
      <div ref={end} />
    </>
  );
}

function AiScreen() {
  return (
    <>
      <Back to="/" label="Home" />
      <h1>Connect your AI</h1>
      <p className="sub" style={{ fontSize: 16, color: 'var(--body)' }}>Soon you'll be able to give your own assistant a link so it can read your pings and Station info. It will only see the Stations you allow.</p>
      <div className="card"><p className="label">Coming next</p><p className="sub">The MCP server and API from the agent-access project. Subscriptions set to “My AI only” are already stored, ready for it.</p></div>
    </>
  );
}
