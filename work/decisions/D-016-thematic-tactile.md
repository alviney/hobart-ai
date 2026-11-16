# D-016: The submarine theme explains how the app works

- **Date:** 2026-11-16
- **Status:** accepted
- **Projects:** [ui-mockups](../projects/ui-mockups.md), [notify-core](../projects/notify-core.md)
- **Builds on:** [D-015](D-015-friendly-look.md), [D-014](D-014-home-timeline.md), [D-013](D-013-ping-signal-fades.md)

## Context

The Friendly look (D-015) still felt like a generic app with a theme painted
on. The owner wanted it to feel thematic and tactile for non-technical
people.

## Decision

Four ideas, used with restraint:

- **Depth is time.** The timeline is a dive: today is at the surface on a
  light background, and each older day band (Yesterday, Earlier this week,
  Older) sits on a deeper blue, down to navy. Cards dim with depth. This
  replaces fading rows as the way to show that old pings lose signal.
- **Portholes.** Each Trove's avatar is a porthole with a yellow rim. The
  light is on when the ping is unread (orange light for urgent) and the
  glass is dark once it's read. There is no separate unread dot.
- **Controls you can press.** Buttons have a solid lower edge and sink when
  pressed, with a short vibration where the phone allows. The radar is a
  two-position switch with a yellow knob. "Urgent" is a flip switch.
- **The ripple.** One motion everywhere: sending a ping sends rings out
  across the screen, a new ping's porthole ripples, and the radar scan is
  the same rings. People who ask for reduced motion don't get it.

Not doing: paper message slips, mascots or other decoration (too cute).

## Options considered

- **Theme as behaviour** (this): the metaphor teaches the product.
- **Theme as decoration**: illustration and colour only; tried, felt generic
  or cutesy.

## Consequences

Text and cards need separate colours per depth band to stay readable.
Sound could join the ripple later; it's an owner call.
