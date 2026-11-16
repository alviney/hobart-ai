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

Three ideas, used with restraint (a fourth, portholes, was dropped):

- **Depth is time.** The timeline is a dive: today is at the surface on a
  light background, and each older day band (Yesterday, Earlier this week,
  Older) sits on a deeper blue, down to navy. Cards dim with depth. This
  replaces fading rows as the way to show that old pings lose signal.
- ~~Portholes~~ (tried and dropped the same day). Rows have no avatar.
  Instead each row starts with a **category icon** for its Trove (school,
  sport, food, coffee, nature, home, music, shop, group), then the name
  with an unread dot, orange for urgent.
- **Fade at the bottom edge only.** Rows are full strength wherever they
  are in the list; they fade out only as they slide under the Ask bar at
  the bottom of the screen. (Fading every row after the first two was
  tried and dropped.)
- **Controls you can press.** Buttons have a solid lower edge and sink when
  pressed, with a short vibration where the phone allows. The radar is a
  two-position switch with a yellow knob. "Urgent" is a flip switch.
- **The ripple.** One motion everywhere: sending a ping sends rings out
  across the screen, a new ping's card ripples, and the radar scan is
  the same rings. People who ask for reduced motion don't get it.

Not doing: paper message slips, mascots or other decoration (too cute).

## Options considered

- **Theme as behaviour** (this): the metaphor teaches the product.
- **Theme as decoration**: illustration and colour only; tried, felt generic
  or cutesy.

## Consequences

Text and cards need separate colours per depth band to stay readable.
Sound could join the ripple later; it's an owner call.
