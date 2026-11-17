import { defineConfig } from 'vitest/config';

// Tests run from the repository root (vite.config.ts points at app/ for the web app).
export default defineConfig({ test: { include: ['shared/**/*.test.ts', 'server/**/*.test.ts'] } });
