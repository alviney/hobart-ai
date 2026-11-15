# D-007: The app is feed-first, with a menu sheet

- **Date:** 2026-11-15
- **Status:** accepted
- **Projects:** [ui-mockups](../projects/ui-mockups.md), [notify-core](../projects/notify-core.md)

## Context

The prototype had a five-tab bar. The owner wanted fewer things on screen at
once: the feed as home, a floating input for asking questions, and
everything else reachable somewhere else. Three options were prototyped:
header icons, channel chips and a menu sheet.

## Decision

No tab bar. Home is the feed ("What's new"), with a floating bar at the
bottom for asking about anything you follow, and nothing else on it. A
menu button (top left) is the only other control: it opens a sheet from
the bottom with Share news (once you run a channel), Connections, your
channels, Start a channel, Scan a code, and Your AI and settings. Every
other screen has a "‹ What's new" back link.

## Options considered

- **Menu sheet**: the cleanest screen; the owner's pick.
- **Channel chips**: fast switching between connections, but crowded with
  many connections.
- **Header icons**: the most obvious, but more on screen.

## Consequences

Connections and sharing are one tap further away. Watch in testing whether
people find them. Revisit if they don't.
