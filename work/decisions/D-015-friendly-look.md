# D-015: Friendly look, with submarine yellow as the accent

- **Date:** 2026-11-16
- **Status:** accepted
- **Projects:** [ui-mockups](../projects/ui-mockups.md), [notify-core](../projects/notify-core.md)
- **Supersedes:** the Deep Sonar colours in [D-010](D-010-deep-sonar.md)

## Context

The owner compared four looks on the timeline home (D-014): Deep Sonar,
Techy, Friendly and Yellow Submarine. They chose Friendly, with some
submarine yellow brought in.

## Decision

- **Base:** light and soft. Background `#FFFCF2`, cards `#FFFFFF`, text
  `#2A2340`, secondary text `#4A4363` / `#6E6888`, lines `#E3DEF5`.
- **Type:** Fredoka for headings, Nunito for text.
- **Yellow (`#FFD23F`) is the signature accent:** the radar button (dark
  icon on yellow; dark with a yellow icon when on), the Ask send button,
  the Subscribe pill, the "Today:" summary card (`#FFE476`) and a short
  yellow stroke after each day heading.
- **Purple (`#6C4CE0`)** is the working colour: buttons, links and unread
  dots. Urgent stays orange (`#E8590C` dot, `#C2410C` text).
- **Pings are soft white cards** with a pastel letter avatar per Trove,
  in a colour that stays the same for that Trove.

## Options considered

- **Friendly with yellow**: approachable for everyday people, and the yellow
  keeps the submarine identity.
- **Yellow Submarine**: the most memorable, but loud as a daily app.
- **Techy** and **Deep Sonar**: suit the frontier pitch but feel less
  welcoming to the average user (D-003).

## Consequences

The radar's sonar visuals now sit on a light background, so its rings and
sweep use dark ink at low opacity. Marketing visuals should switch to this
palette.
