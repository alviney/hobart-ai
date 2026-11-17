# D-018: The app is TypeScript: React on Vite, Hono on Node, SQLite

- **Date:** 2026-11-17
- **Status:** accepted (hosting updated by D-019: Cloudflare Workers + D1)
- **Projects:** [app-v1](../projects/app-v1.md), [notify-core](../projects/notify-core.md)

## Context

The owner wants to start building so the app can be iterated on, not just
the prototype. Nothing should cost money yet (D-001) or need accounts the
owner hasn't set up.

## Decision

- **One TypeScript repository** with three folders: `app/` (the web app),
  `server/` (the API) and `shared/` (product rules both use, such as ping
  strength and who gets notified).
- **Web app:** React 18 built with Vite. A web app people can add to their
  phone's home screen first; native apps later if needed. Styles start from
  the prototype's CSS so it matches the agreed design.
- **API:** Hono on Node 22.
- **Database:** SQLite through Node's built-in `node:sqlite`: a single file
  (`data/sub1.db`), no database server, nothing to install or pay for.
- **Tests:** Vitest, for the shared rules and the API (`npm test`).
- **Sign-in:** not yet. There is one built-in person ("You") so the screens
  can be built and tried; real accounts come with notify-core.

## Options considered

- **This stack**: small, fast to change, runs anywhere Node runs, and moves
  to a hosted database later without rewriting the app.
- **Next.js**: one framework for both, but heavier and slower to iterate on.
- **A hosted backend (Firebase, Supabase)**: quicker sign-in and sync, but
  needs accounts now and ties the data model to a vendor.

## Consequences

Hosting needs a place that runs Node and keeps a file (or a move to a
hosted Postgres/SQLite when real users arrive). `node:sqlite` is still
marked experimental in Node 22 and prints a warning; it's stable enough for
this stage. Revisit at the first real deploy.
