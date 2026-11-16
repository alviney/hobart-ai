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

- The radar is not its own screen. The radar button on home is a **toggle**:
  on, it swaps the home content (the briefing) for the radar; off, the
  briefing comes back. The button stays lit while the radar is on.
- Turning the radar on shows a short, minimal **scan**: faint rings and a slow
  sweep in the same colour as the page, with "Scanning nearby…", for under
  two seconds. People with reduced motion skip it.
- Then the results appear as a **quiet list** (chosen 2026-11-16 over
  "Signal dots" and "Big names"):
  - **"You're here"**: one line, "You're at <Trove>", with a Subscribe pill,
    when you're within about 50 m of a Trove you don't subscribe to.
  - Then nearby pings from the last month as a timeline (see D-013's
    update), with the Trove's distance next to the time. Older pings fade.
- The bottom bar always says **Ask anything**. While the radar is on, what
  you type also searches nearby: it searches
  the names, info pages and recent pings of every public Trove nearby,
  including ones you don't subscribe to (see Q-006).

## Update 2026-11-16: range

No range control for now. The radar shows public Troves within about
2.5 km. Several range controls were tried (stepper, stretchable ring,
walking time, dial, pull further, named places) and none felt right yet;
revisit later.

## Update 2026-11-16: "You're here" card

The "You're here" recommendation is a navy **contact card** at the top of
the radar: "CONTACT · 20 M" in yellow, the Trove's name in large white
type, its latest ping, a yellow Subscribe pill and "What's here". On the
right, the Trove's category icon sits in a yellow circle with rings
rippling out from it. Chosen over a centred spotlight card and a "peek
inside" card with quick facts.

## Options considered

- **Scan first**: you get the radar feeling every time without losing space.
- **Radar as background**: atmospheric, but competes with the text.
- **Radar as a header accent**: strong identity, but uses 150px every time.
- **A big radar on screen**: the first version; took too much space.

## Consequences

Search over nearby Troves needs their pings to be readable by people who
don't subscribe, which is an owner decision (Q-006).
