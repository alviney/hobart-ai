import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// One origin serves everything (D-020): the marketing site at `/`, the app at
// `/app/`. In dev, Vite owns `/app/*` and this middleware serves site/index.html
// for everything else, so links between the two work on localhost too.
const marketingSite = (): Plugin => ({
  name: 'serve-marketing-site',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const path = (req.url ?? '/').split('?')[0];
      if (path.startsWith('/app') || path.startsWith('/api') || path.includes('.')) return next();
      res.setHeader('content-type', 'text/html; charset=utf-8');
      res.end(readFileSync('site/index.html'));
    });
  },
});

export default defineConfig({
  root: 'app',
  base: '/app/',
  plugins: [react(), marketingSite()],
  build: { outDir: '../dist/app', emptyOutDir: true },
  server: { port: 5173, proxy: { '/api': 'http://localhost:8787' } },
});
