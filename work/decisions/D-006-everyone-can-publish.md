# D-006: One account, and anyone can publish

- **Date:** 2026-11-15
- **Status:** accepted
- **Projects:** [notify-core](../projects/notify-core.md), [ui-mockups](../projects/ui-mockups.md)

## Context

The first prototype had a Subscriber/Publisher switch. The owner wants any
user to be able to be a publisher.

## Decision

There are no modes. Every account follows channels, and any account can also
run channels. A **Share** tab is in the main navigation for everyone: with
no channel it opens "Start a channel"; with one it opens the compose
screen; with several it adds a "Posting to" picker. Channels you run sit in
Connections under **Yours**, and open a management screen (share news,
invite link and QR poster, subscribers, documents, past news). Your own
posts appear in your feed tagged "You".

## Options considered

- **No modes, Share for everyone**: every subscriber is one tap from
  publishing, which is how the network grows towards the hub.
- **Account or mode switcher**: suits full-time business accounts, but
  confusing for parents and volunteers who mostly receive.

## Consequences

Creating a channel has to be quick and safe for anyone. Whether channels
are instant and free is open as [Q-004](../questions.md). A desktop
dashboard for heavy publishers can come later as an extra view.
