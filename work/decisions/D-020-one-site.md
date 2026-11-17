# D-020: One site serves the marketing page and the app

- **Date:** 2026-11-17
- **Status:** accepted
- **Projects:** [app-v1](../projects/app-v1.md), [pilot-publishers](../projects/pilot-publishers.md)

## Context

The owner wants to develop the mobile app, the desktop app and the
marketing site continuously and easily, with the marketing site offering a
login that takes you into an app that works on desktop as well as phones.
Until now the marketing page only existed as a draft file and the app
rendered as a phone-sized column everywhere.

## Decision

- **One origin, one deploy.** The marketing site is the front door at `/`
  (`site/`), the app lives at `/app/` (`app/`, hash-routed). Both build
  into `dist/` and ship together on every merge to `main` (D-019), so all
  three surfaces are developed and deployed continuously.
- **One responsive app is the mobile app and the desktop app.** Full-bleed
  on phones, a desktop card layout from 720px up; one column throughout so
  every screen works unchanged at any width. No separate codebases, and no
  native apps for now — that's a later decision if the pilot earns it.
- **"Log in" on the marketing header opens `/app/`.** There are no real
  accounts yet (that's notify-core), so logging in simply opens the app as
  the built-in person. The button makes the promised shape of the product
  visible without claiming anything that isn't live (D-003): the app it
  opens is real.
- In development one server shows both: `npm run dev`, then `localhost:5173`
  is the marketing site and `localhost:5173/app/` is the app.

## Options considered

- **One origin (chosen):** simplest to build, deploy and link between; the
  login button is an ordinary link.
- **Separate marketing host (e.g. Cloudflare Pages):** cleaner separation
  but two deploys, two URLs to wire together, and nothing needs it yet.

## Consequences

The marketing site is now published wherever the Worker is, including the
`workers.dev` URL, before a real domain exists. The waitlist form still
does nothing until Q-007 is answered. Anyone who clicks "Log in" acts as
"You" until sign-in lands, so the link still needs care when sharing.
