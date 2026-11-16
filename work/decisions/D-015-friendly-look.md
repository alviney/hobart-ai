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

- **Base:** light and soft. Background `#F8F7FB` (neutral; a warm yellow background read as too cute), cards `#FFFFFF`, text
  `#2A2340`, secondary text `#4A4363` / `#6E6888`, lines `#E3DEF5`.
- **Type:** Fredoka for headings, Nunito for text.
- **Yellow (`#FFD23F`) is the signature accent:** the radar button (dark
  icon on yellow; dark with a yellow icon when on), the Ask send button,
  the Subscribe pill, a highlighter stroke behind "Today:" in the white
  summary card (`#FFE476`), and a short yellow stroke after each day
  heading. Yellow is for highlights only, never large backgrounds.
- **Purple (`#6C4CE0`)** is the working colour: buttons, links and unread
  dots. Urgent stays orange (`#E8590C` dot, `#C2410C` text).
- **Pings are soft white cards** with a pastel letter avatar per Trove,
  in a colour that stays the same for that Trove.

## Update 2026-11-16: one design language on every screen

The rest of the app now follows the home screen:

- White cards with a soft shadow on the pale background; no lavender fills.
- Section labels in Fredoka with the short yellow stroke, like day headings.
- Troves are shown by their category icon in a yellow circle (navy circle
  for Troves you run), not letter avatars.
- Yellow is the main action (Subscribe, Send ping, Copy invite link);
  secondary actions are white with an outline; selected options turn
  yellow.
- Back links are white pills, like the menu button.
- Moments (subscribing to a Trove, "You're here") use navy with a yellow
  eyebrow.
- Lists of pings on Trove pages and All pings use the home cards with
  category icons.

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
