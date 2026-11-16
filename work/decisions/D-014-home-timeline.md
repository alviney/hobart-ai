# D-014: Home is a timeline of recent pings

- **Date:** 2026-11-16
- **Status:** accepted
- **Projects:** [ui-mockups](../projects/ui-mockups.md), [notify-core](../projects/notify-core.md)
- **Supersedes:** the home layout in [D-010](D-010-deep-sonar.md) (one row per Trove) and the briefing-only home tried after it

## Context

The owner went back to the drawing board on the home screen with one goal:
easily see recent pings. Three concepts were prototyped: Timeline, Trove
shelf (story-style circles) and Now / Nearby / Yours tabs.

## Decision

- **Home is a timeline**: every recent ping from Troves you subscribe to,
  newest first, grouped under Today, Yesterday, Earlier this week and Older.
- Each row: the Trove's name (bold), the time on the right, and two lines
  of the ping (its title in bold if it has one). Unread pings have a dot,
  orange if urgent; urgent pings also say "Urgent". Read pings go grey.
- Above the timeline, one **"Today:" summary line** from the briefing
  prompt; tapping it edits the prompt.
- The header has the menu and the **radar toggle** (D-012), which swaps the
  timeline for the radar in place. The "Ask anything" bar stays at the
  bottom.
- The per-Trove list (D-010) stays as the "All pings" page in the menu.

## Update 2026-11-16: category toggles

A small row of category icons sits above the timeline, one per category in
your pings (School, Sport, Food, Coffee, Nature, Home and so on). All are on
by default; tap one to switch that type of Trove off (it greys out with a
slash), tap again to switch it back on. Several can be off at once. The
radar list has the same row.

## Options considered

- **Timeline**: the most direct way to see what's new.
- **Trove shelf**: quick per-Trove filtering, but adds a row of chrome.
- **Tabs**: everything one tap away, but splits attention three ways.

## Consequences

The briefing shrinks to one line; a fuller briefing can come back later as
the daily digest idea. Revisit if people with many Troves find the timeline
too noisy (the shelf is the fallback).
