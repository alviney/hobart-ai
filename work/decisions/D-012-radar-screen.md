# D-012: The radar screen is a scan, then a "You're here" card and a nearby list

- **Date:** 2026-11-16
- **Status:** accepted
- **Projects:** [ui-mockups](../projects/ui-mockups.md), [notify-core](../projects/notify-core.md)

## Context

The radar (D-009) is for two things: discovering Troves while walking around
the city, and quickly subscribing to the Trove where you're standing. The
owner compared several layouts and didn't want the radar graphic taking up
space on the screen.

## Decision

- Opening the radar shows a short, minimal **scan**: faint rings and a slow
  sweep in the same colour as the page, with "Scanning nearby…", for under
  two seconds. People with reduced motion skip it.
- Then the results appear:
  - **"You're here"**: a Trove within about 50 m that you don't subscribe to
    is the top recommendation, with Subscribe and "What's here".
  - The other nearby public Troves, grouped by walking distance (under
    500 m, under 1.5 km, further out), each with its latest ping, distance
    and ping strength.
- On the radar screen the bottom bar becomes **Search nearby**: it searches
  the names, info pages and recent pings of every public Trove nearby,
  including ones you don't subscribe to (see Q-006).

## Options considered

- **Scan first**: you get the radar feeling every time without losing space.
- **Radar as background**: atmospheric, but competes with the text.
- **Radar as a header accent**: strong identity, but uses 150px every time.
- **A big radar on screen**: the first version; took too much space.

## Consequences

Search over nearby Troves needs their pings to be readable by people who
don't subscribe, which is an owner decision (Q-006).
