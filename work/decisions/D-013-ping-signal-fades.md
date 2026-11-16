# D-013: A ping's signal fades with age, and the radar listens back in time

- **Date:** 2026-11-16
- **Status:** accepted
- **Projects:** [ui-mockups](../projects/ui-mockups.md), [notify-core](../projects/notify-core.md)
- **Builds on:** [D-009](D-009-ping-strength-and-radar.md), [D-012](D-012-radar-screen.md)

## Context

D-009 gave each Trove a strength based on when its owner last confirmed its
details. The owner wants individual pings to lose signal as they age, and a
way to look further back on the radar.

## Decision

- Each **ping** has a signal that fades with age. In the prototype: today is
  strong, up to 3 days is good, up to a week is fading, up to a month is
  faint, and older pings drop off the radar. Tune these later.
- The radar has a **"Listening back" slider**: Today (default), Last 3 days,
  This week, Last 2 weeks, Last month. Only Troves that pinged inside that
  window are listed, each with its newest ping in the window and that
  ping's signal. A line says how many nearby Troves were quiet.
- **Search nearby** only searches pings inside the window; names and info
  pages are always searchable.
- The "You're here" card always shows, whatever the window.
- A Trove's own freshness (last confirmed, D-009) still applies to the
  Trove itself, for example on its details sheet.

## Update 2026-11-16

The slider is gone. The radar now lists nearby pings from the last month as
a timeline, like home (D-014): grouped under Today, Yesterday, Earlier this
week and Older, each row showing the Trove, its distance and the time.
Older pings fade. Search still covers names, info pages and these pings.

## Options considered

- **Fading pings with a time slider**: the radar feels live, defaults to
  what's happening today, and still lets you dig back.
- **Show everything, sorted by date**: simpler, but stale pings crowd out
  today's.

## Consequences

Pings need a timestamp-based signal in the data model and API. The radar
can look empty on a quiet day; the slider and the "quiet Troves" line cover
that.
