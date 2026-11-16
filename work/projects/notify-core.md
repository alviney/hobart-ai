# Notify core: channels, invites, thresholds, email

- **Status:** scoping
- **Size guess:** L (split into milestones before building)
- **Touches:** the web app, database schema, auth, email delivery
- **Related decisions:** [D-016](../decisions/D-016-thematic-tactile.md), [D-015](../decisions/D-015-friendly-look.md), [D-014](../decisions/D-014-home-timeline.md), [D-013](../decisions/D-013-ping-signal-fades.md), [D-012](../decisions/D-012-radar-screen.md), [D-011](../decisions/D-011-urgent-or-not.md), [D-010](../decisions/D-010-deep-sonar.md), [D-008](../decisions/D-008-sub1-troves-pings.md), [D-009](../decisions/D-009-ping-strength-and-radar.md), [D-002](../decisions/D-002-start-with-notifications.md), [D-004](../decisions/D-004-mockups-first-and-ads.md), [D-005](../decisions/D-005-visual-direction.md), [D-006](../decisions/D-006-everyone-can-publish.md)

## Why

This is the first product ([vision](../vision.md)). Publishers need a dead
simple way to keep people informed, and subscribers need one inbox they
control.

## Outcome

A publisher can create a channel, write documents, invite people and post
rated notifications. A subscriber can accept, set a threshold, choose email
or no notifications, and toggle the connection. Measured by pilot publishers
posting weekly (see `work/signals.md`).

## Not doing

- SMS and billing (later, paid tier)
- In-app chat (the MCP server in [agent-access](agent-access.md) gives chat
  through the user's own AI first)
- Public channels, discovery, community contributions, moderation queues
  (hub-era features)
- Native mobile apps

## Open questions

- [x] Product name: Sub1 for now ([D-008](../decisions/D-008-sub1-troves-pings.md))
- [ ] Radar location handling (owner): [Q-005](../questions.md)
- [ ] Instant and free channel creation (owner): [Q-004](../questions.md)
- [x] Rating scale: urgent or not ([D-011](../decisions/D-011-urgent-or-not.md))
- [x] Visual direction picked ([D-005](../decisions/D-005-visual-direction.md))
- [ ] Stack and hosting (implementation; record as a decision before building, keeping costs at $0 until the owner approves spend)
- [ ] Data model uses stable IDs and schema.org-compatible fields so channels can become hub entities later (implementation)
- [ ] Privacy: minimum data, export and delete from v1 (implementation; the privacy policy wording is the owner's)

## Spikes

| Spike | Question it answers | Timebox | Result |
| --- | --- | --- | --- |

## Done when

- [ ] Publisher sign-up, channel creation, channel documents (markdown)
- [ ] Invite by email or link, accept flow, connections list with on/off toggles
- [ ] Post a notification with a priority rating from the web app
- [ ] Per-connection threshold; email delivery only above the threshold; "no notifications" mode
- [ ] Feed view per subscriber across all connections
- [ ] Export and delete my data
- [ ] Tests cover threshold filtering and invite acceptance

## Log

- 2026-11-15: created from the brainstorm that produced D-002
- 2026-11-15: no stack choice until the mockups are picked (D-004)
- 2026-11-15: visual direction chosen (D-005)
- 2026-11-15: one account, anyone can publish (D-006)
- 2026-11-15: name and vocabulary (D-008), ping strength and radar (D-009); location question Q-005
- 2026-11-16: Deep Sonar look; one feed row per Trove with unread counts; rating filter menu (D-010)
- 2026-11-16: two levels only, urgent or not; only urgent is marked (D-011)
- 2026-11-16: radar screen settled: minimal scan, then You're here and a nearby list with search (D-012); visibility of public pings asked as Q-006
- 2026-11-16: ping signal fades with age; radar 'Listening back' slider from today to a month (D-013)
- 2026-11-16: home is a timeline of recent pings (D-014)
- 2026-11-16: Friendly look with submarine-yellow accents (D-015)
- 2026-11-16: thematic layer: depth is time, portholes, pressable controls, the ripple (D-016)
- 2026-11-16: Troves need a category (drives the row icon); chosen when a Trove is created
