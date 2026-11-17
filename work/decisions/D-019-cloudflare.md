# D-019: Host on Cloudflare Workers with D1

- **Date:** 2026-11-17
- **Status:** accepted
- **Projects:** [app-v1](../projects/app-v1.md)
- **Updates:** the hosting part of [D-018](D-018-app-stack.md) (the Render blueprint is removed)

## Context

The owner wants to test the app in any browser, and already has a
Cloudflare account. The app was first set up to deploy to Render as a
plain Node server.

## Decision

- **Hosting:** Cloudflare Workers. The built web app (`dist/`) is served as
  static assets; only `/api/*` runs the Worker (`server/worker.ts`).
- **Database:** Cloudflare D1 (SQLite). Locally and in tests the app still
  uses Node's built-in SQLite; both sit behind the same small database
  layer (`server/store.ts`), with the SQL unchanged.
- **Deploys:** Cloudflare builds from GitHub (`npm run build`, then
  `npx wrangler deploy`) whenever `main` changes. Sessions never deploy
  (D-001); merging is the owner's go-ahead.
- **D1 free-plan limits shape the API:** at most 50 queries per request and
  100 bound values per query, so each request loads what it needs in a few
  set-based queries, and the sample data uses multi-row inserts.

## Options considered

- **Cloudflare Workers + D1**: the owner's existing account, free, no sleep,
  data that survives deploys, fast everywhere.
- **Render (free)**: no code changes, but a new account, sleeps when idle and
  wipes its disk on every deploy.

## Consequences

The tables and sample data are created on first request if the database is
empty. There's still no sign-in, so anyone with the link acts as "You";
share the link carefully until notify-core adds accounts. Checked with
`wrangler dev` locally against D1 before handing over.
