// Runs Sub1 on Node: local development and `npm start`. Cloudflare uses worker.ts instead.
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { api } from './api';
import { openNodeDb } from './store-node';

const port = Number(process.env.PORT || 8787);
const db = await openNodeDb(process.env.DB_FILE || 'data/sub1.db');

const app = new Hono();
app.route('/api', api(db));
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Something went wrong on our side. Try again.' }, 500);
});

// In production dist/ holds the marketing site at / and the app at /app/
// (D-020); in development Vite serves both.
if (process.env.NODE_ENV === 'production') {
  app.get('/app', (c) => c.redirect('/app/'));
  app.get('/app/', serveStatic({ path: './dist/app/index.html' }));
  app.use('/*', serveStatic({ root: './dist' }));
  app.get('*', serveStatic({ path: './dist/index.html' }));
}

serve({ fetch: app.fetch, port }, () => console.log(`Sub1 API on http://localhost:${port}`));
