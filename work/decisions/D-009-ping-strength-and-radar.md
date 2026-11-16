# D-009: Ping strength shows freshness, and a radar shows Troves nearby

- **Date:** 2026-11-15
- **Status:** accepted
- **Projects:** [notify-core](../projects/notify-core.md), [ui-mockups](../projects/ui-mockups.md)

## Context

The vision says "clean data" means every fact carries when it was last
confirmed ([vision](../vision.md)). The owner wants that visible: a radar of
Troves nearby, where strong pings mean recently confirmed details and weak
ones mean possibly out of date.

## Decision

- Each Trove has a **last confirmed** date. It resets when the owner sends
  a ping, edits their details or documents, or taps "Everything's still
  right".
- **Ping strength** comes from that date. In the prototype: Strong up to 7
  days, Good up to 30, Weak up to 90, Faint up to 180, then too faint to
  show on the radar. The thresholds are a starting point to tune.
- **Home** is the feed (laid out per D-010). A round **radar button** sits at the top right of
  home; the Ask bar runs full width at the bottom.
- **The radar** shows public Troves within about 2.5 km. Each blip's size
  and brightness show its strength, and Troves you subscribe to are marked.
  Tapping one shows its details and a Subscribe button.

## Update 2026-11-16: how strength is drawn

Ping strength is shown on the Trove's icon circle, with nothing extra on
the row:

- **Strong:** a rich yellow rim around the circle.
- **Good:** the normal circle.
- **Weak or faint:** the circle drops to low opacity.

Tried and replaced the same day: wifi-style bars, sonar rings (a dot with
up to three rings), a thinning ring and a glow.

## Options considered

- **Freshness as ping strength**: makes data quality something people can
  see and owners want to keep up, and it fits the sonar branding.
- **A plain "last updated" date**: accurate, but nobody acts on it.

## Consequences

The radar needs the phone's location. The plan is to work out distances on
the phone and not store where people are; how location is handled is an
owner decision before the build (Q-005). Only public Troves appear on the
radar; invite-only ones never do.
