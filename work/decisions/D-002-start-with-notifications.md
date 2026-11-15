# D-002: Start as an intelligent notification system, not a data hub

- **Date:** 2026-11-15
- **Status:** accepted
- **Projects:** [notify-core](../projects/notify-core.md), [agent-access](../projects/agent-access.md), [pilot-publishers](../projects/pilot-publishers.md)

## Context

The owner's original idea is a centralised hub of clean, live Hobart data
for AI agents ([vision](../vision.md)). A hub has a cold start problem:
nobody contributes until it's useful, and it isn't useful until people
contribute. A notification system is useful as soon as one publisher has a
few subscribers.

## Decision

The first product is an invite-based publish/subscribe notification system.
It has per-notification priority ratings, per-subscriber thresholds, email,
webhook and (paid) SMS delivery, a pull-only mode for personal agents,
documents attached to each channel, and chat over a subscriber's
connections. The data hub stays the long-term vision. Design choices should
keep the path to it open (stable IDs, open schemas, exportable data), but
nothing hub-specific gets built until the notification system has real
publishers.

## Options considered

- **Notification system first**: delivers value from the first publisher,
  and every channel becomes a future hub entity.
- **Curated data hub first**: needs critical mass before anyone gets value,
  and early on the moderator is the owner.

## Consequences

Early work is a messaging product, so the owner's first job is finding
publishers, not curating data. Revisit once there are enough active
publishers that public channels and discovery would add value.
