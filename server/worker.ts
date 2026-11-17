// Runs Sub1 on Cloudflare Workers (D-019). The built web app in dist/ is served as static
// assets by Cloudflare; only /api/* reaches this code (see wrangler.toml).
import { Hono } from 'hono';
import { api } from './api';
import { ensureReady, type Db } from './store';
import { d1Db, type D1Database } from './store-d1';

type Env = { DB: D1Database };

let ready: Promise<Db> | null = null;
const dbFor = (env: Env) => {
  // Create tables and sample data once per Worker instance (cheap no-ops after the first time).
  ready ??= (async () => { const db = d1Db(env.DB); await ensureReady(db); return db; })().catch((e) => { ready = null; throw e; });
  return ready;
};

const app = new Hono<{ Bindings: Env }>();
app.all('/api/*', async (c) => {
  const db = await dbFor(c.env);
  const inner = api(db);
  const url = new URL(c.req.url);
  url.pathname = url.pathname.replace(/^\/api/, '') || '/';
  return inner.fetch(new Request(url, c.req.raw));
});
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Something went wrong on our side. Try again.' }, 500);
});

export default app;
