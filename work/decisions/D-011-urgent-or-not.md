# D-011: Pings are urgent or not; only urgent is marked

- **Date:** 2026-11-16
- **Status:** accepted
- **Projects:** [notify-core](../projects/notify-core.md), [ui-mockups](../projects/ui-mockups.md), [agent-access](../projects/agent-access.md)
- **Supersedes:** the four-level priority scale in [D-005](D-005-visual-direction.md) and [D-010](D-010-deep-sonar.md)

## Context

Pings had four ratings (Urgent, Important, Good to know, FYI) and each
subscriber picked a threshold among them. The owner wants it simpler.

## Decision

- A ping is either **urgent** or **not urgent**. Not urgent is the default.
- Only urgent pings are marked. In the feed, a Trove's unread count turns
  orange when one of its unread pings is urgent; inside a Trove, urgent
  pings say "Urgent" in orange. Not-urgent pings show no indicator, and
  rows run full width with no marker column.
- Each subscription is either **Everything** (every ping notifies you) or
  **Urgent only** (only urgent pings notify you; the rest wait in your
  feed). Pausing and "My AI only" still work as before.
- When writing a ping, the app suggests urgent or not; the sender can
  change it. Urgent notifies every subscriber.
- The feed filter is **All** or **Urgent only**.

## Options considered

- **Two levels**: one decision for the sender and one for the subscriber;
  far less to explain.
- **Four levels**: finer control, but more for everyone to learn, and
  publishers inflate ratings.

## Consequences

The "priority inflation" risk in the vision becomes "urgent inflation":
watch for senders who mark everything urgent, and consider limits or
nudges if it happens. The API and MCP tools take a simple `urgent: true`.
