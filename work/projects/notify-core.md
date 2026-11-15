# Notify core: channels, invites, thresholds, email

- **Status:** scoping
- **Size guess:** L (split into milestones before building)
- **Touches:** the web app, database schema, auth, email delivery
- **Related decisions:** [D-002](../decisions/D-002-start-with-notifications.md), [D-004](../decisions/D-004-mockups-first-and-ads.md), [D-005](../decisions/D-005-visual-direction.md)

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

- [ ] Product name (owner): [Q-001](../questions.md)
- [ ] Rating scale: 1–5 with an AI-suggested default? (implementation; record as a decision)
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
