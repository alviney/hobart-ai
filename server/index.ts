import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { api } from './api';
import { openDb } from './db';

const port = Number(process.env.PORT || 8787);
const db = openDb(process.env.DB_FILE || 'data/sub1.db');

const app = new Hono();
app.route('/api', api(db));
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Something went wrong on our side. Try again.' }, 500);
});

// In production the built app is served from dist/; in development Vite serves it.
if (process.env.NODE_ENV === 'production') {
  app.use('/*', serveStatic({ root: './dist' }));
  app.get('*', serveStatic({ path: './dist/index.html' }));
}

serve({ fetch: app.fetch, port }, () => console.log(`Sub1 API on http://localhost:${port}`));
