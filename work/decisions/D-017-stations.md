# D-017: "Trove" is renamed "Station"

- **Date:** 2026-11-16
- **Status:** accepted
- **Projects:** [ui-mockups](../projects/ui-mockups.md), [notify-core](../projects/notify-core.md), [pilot-publishers](../projects/pilot-publishers.md)
- **Supersedes:** the word "Trove" in [D-008](D-008-sub1-troves-pings.md)

## Context

D-008 named the entities (a club, school, shop, group) "Troves". The owner
considered "Start a Sub" instead, then alternatives (Beacon, Station,
Buoy, Channel, Board and others).

## Decision

An entity is a **Station**. People subscribe to Stations; a Station sends
**Pings**; your subscriptions are **Your subs**. In the app: "Start a
Station", "Create Station", "You run this Station" and so on.

Earlier decisions and project files say "Trove"; read it as "Station".
They aren't rewritten, so the history stays intact.

## Options considered

- **Station**: radio and sonar feel, clearly something that broadcasts,
  a real word with nothing to learn.
- **Beacon**: the closest fit to pings and fading signal; owner preferred
  Station.
- **Sub** for the entity: would clash with "Your subs" meaning your
  subscriptions.
- **Trove**: distinctive, but an invented meaning for people to learn.

## Consequences

Code still uses `trove` in identifiers; user-facing text says Station.
Marketing drafts need updating when they're next touched.
