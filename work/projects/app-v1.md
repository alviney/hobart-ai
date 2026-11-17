# App v1: the prototype as a real, running app

- **Status:** building
- **Size guess:** L (in slices)
- **Touches:** `app/`, `server/`, `shared/`, `package.json`
- **Related decisions:** [D-018](../decisions/D-018-app-stack.md), [D-014](../decisions/D-014-home-timeline.md), [D-012](../decisions/D-012-radar-screen.md), [D-015](../decisions/D-015-friendly-look.md), [D-016](../decisions/D-016-thematic-tactile.md), [D-017](../decisions/D-017-stations.md)

## Why

The owner wants to iterate on a real app instead of the prototype: changes
that persist, real data rules, and something that can grow into the pilot.

## Outcome

`npm run dev` runs the app with sample data. Everything the prototype does
works against the API and database, with tests on the rules.

## Not doing (yet)

- Sign-in and multiple real people (with notify-core)
- Email, webhook and SMS delivery (stored as settings only)
- The MCP server and API for people's own AI (agent-access)
- A real AI behind Ask (keyword matching for now) and the summary prompt
- Hosting and deploys (owner's accounts; see questions)

## Done when

- [x] Timeline home with the summary line and depth bands
- [x] Radar: scan, "You're here", nearby pings, search; real location opt-in
- [x] Your subs panel; Station pages for followers and owners
- [x] Subscribe (everything or urgent only; app or AI), pause, unsubscribe
- [x] Start a Station; send pings with the urgent suggestion; info pages; confirm details
- [x] Ask over your Stations (keyword matching)
- [x] Tests for the shared rules and the API
- [ ] Editable summary prompt
- [ ] Sign-in (with notify-core)
- [x] Hosting blueprint for a test deployment (`render.yaml`); waiting on the owner's account

## Log

- 2026-11-17: created; first slice built (all screens above against a real API and SQLite); 18 tests passing
- 2026-11-17: production build checked (one server serves app and API); `render.yaml` added for a free test deployment
