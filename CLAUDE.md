# Sub1 (working name, D-008; entities are Stations, D-017)

An intelligent notification system for Hobart: anyone can start a Station (a
club, school, café, community group) and send Pings to subscribers,
and subscribers decide what is important enough to reach them by email,
webhook or SMS, or pull everything through their own AI via an MCP server.
It's the first step towards a live, AI-ready hub of Hobart data
(`work/vision.md`). It's working when real publishers keep posting weekly
and their subscribers stay connected (`work/signals.md`).

## How to build and test

Stack: [D-018](work/decisions/D-018-app-stack.md). Node 22.

- `npm install` once.
- `npm run dev`: API on :8787 and the web app on :5173 (open :5173). The
  database is `data/sub1.db`, created with sample data on first run.
- `npm test`: shared rules and API tests (Vitest).
- `npm run typecheck`: TypeScript across `app/`, `server/` and `shared/`.
- `npm run build` then `npm start`: production build served by the API.
- `npm run check`: validates `work/`.
- `npx wrangler dev --local`: the Cloudflare version (Worker + local D1), after `npm run build`.
- Hosting is Cloudflare Workers + D1 ([D-019](work/decisions/D-019-cloudflare.md)). Cloudflare deploys from `main`; sessions never deploy.

The API talks to the database through `server/store.ts` (Node SQLite locally,
D1 on Cloudflare); keep each request to a few queries (D1 allows 50).
Sample data lives in `server/seed.ts`; the menu's "Reset sample data" (or
`POST /api/dev/reset`) reloads it. There's one built-in person ("You") until
sign-in exists.

## This project runs through `work/`

Most sessions here are scheduled and start with no memory of the last one.
Everything a session needs to carry on is in `work/`, so read it before
acting and leave it accurate when you finish. See `work/README.md` for the
process.

- **Before proposing an approach, read `work/decisions/`.** Don't reopen a
  settled decision. If something genuinely conflicts with one, ask in
  `work/questions.md` and propose a superseding decision.
- **When a choice is the owner's, ask; don't guess and don't stop.** Add it
  to `work/questions.md` with your recommendation, then carry on with
  whatever does not depend on the answer. A choice is the owner's when it
  changes what the product is, what it says to customers, what it costs, or
  what data it collects. How to implement something is yours.
- **When the owner settles something**, write it up as the next
  `work/decisions/D-00n-<slug>.md`, mark the question answered, and link the
  decision from the projects it affects.
- **When working on a project**, keep its file current: tick open questions,
  append to the log, and update the board in `work/README.md` when the
  status changes.
- **Things only the owner can do** (accounts, keys, domains, payments) go in
  the "Only you can do" list in `work/questions.md` the moment you see them
  coming, not when they block you.

## Limits

Set by [D-001](work/decisions/D-001-how-this-project-runs.md):

- Work reaches `main` only through a pull request the owner merges. Never
  merge, deploy or publish.
- Never spend money, and never put a secret in the repository.
- Build only projects whose status is `ready` or `building`.
- Tests fail loudly. Don't skip, weaken or retry one to get a green run; a
  failing test is either a bug or a question.

## Things not to undo

- Marketing copy follows `marketing/positioning.md` (D-003): sell the dream,
  but never claim a feature that isn't live.
