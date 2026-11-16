# D-010: Deep Sonar look, and a feed with one row per Trove

- **Date:** 2026-11-16
- **Status:** superseded by D-015 (colours); the feed layout was replaced by D-014
- **Projects:** [ui-mockups](../projects/ui-mockups.md), [notify-core](../projects/notify-core.md)
- **Supersedes:** the colours in [D-005](D-005-visual-direction.md)

## Context

With the Sub1 branding (D-008) the owner compared three looks in the
prototype: Harbour (light), Yellow Submarine and Deep Sonar (dark). They
also wanted a more compact feed.

## Decision

- **Look:** Deep Sonar. App background `#0B1A24`, surfaces `#13242F` /
  `#172B38`, text `#E6F1F7`, secondary text `#C5D4DD` / `#8FA6B4`, lines
  `#23404F`, primary `#1E78A8`, glow `#9CD6F0`. Rating colours: Urgent
  `#FF8A5B`, Important `#6FC3EC`, Good to know `#7BD88F`, FYI `#9FB4C2`.
  D-005's type (Bricolage Grotesque headings, Inter body), pill shapes and
  friendly wording still apply.
- **Feed:** one row per Trove, sorted by its latest ping. Each row has a
  coloured rating circle on the left (the most important unread ping), the
  **Trove's name** as the main text, the latest ping's title underneath,
  and on the right the latest ping's time and an unread count. Troves that
  don't notify you (paused, AI only) are dimmed.
- **Opening a row** shows that Trove's pings and marks them read; opening a
  ping shows it in full.
- **No heading or filter row** above the feed (removed 2026-11-16; see
  D-011).

## Options considered

- **Deep Sonar**: matches the radar and the "frontier tech made easy"
  pitch.
- **Yellow Submarine**: the most memorable, but loud for a daily app.
- **Harbour**: calm, but generic.

## Consequences

Light-only screens from D-005 need restyling as they're built. Unread state
per person per ping becomes part of the data model.
