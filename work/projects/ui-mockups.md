# UI mockups: options for the key screens and the landing page

- **Status:** shipped
- **Size guess:** M
- **Touches:** design files or clickable HTML prototypes only, no product code
- **Related decisions:** [D-008](../decisions/D-008-sub1-troves-pings.md), [D-009](../decisions/D-009-ping-strength-and-radar.md), [D-004](../decisions/D-004-mockups-first-and-ads.md), [D-003](../decisions/D-003-marketing-sells-the-dream.md), [D-005](../decisions/D-005-visual-direction.md), [D-007](../decisions/D-007-feed-first-menu-sheet.md)

## Why

The owner wants to see what this could look like before committing to a
stack or a build ([D-004](../decisions/D-004-mockups-first-and-ads.md)).
The same visuals become the landing page and ad creative.

## Outcome

Two or three distinct visual directions, each covering the same key
screens, from which the owner picks one (recorded as a decision).

## Not doing

- Working backend, real accounts, real delivery
- Every screen: only the ones that sell the idea or test the hard parts

## Open questions

- [x] Format: a Claude design canvas (private artifact, shareable from its Share menu): https://claude.ai/artifact/Pqur9C8nAW3zan5uhUUQmq

## Screens

1. **QR scan → subscribe** (phone): the "magic first scan", with pick a
   threshold, email or connect your AI.
2. **Connections** (phone): list with on/off toggles, threshold per
   connection, delivery choice (email, webhook, SMS, none or pull only).
3. **Feed** (phone): notifications with ratings, plus "banked" ones below
   the threshold.
4. **Publisher compose** (desktop): write an update, AI-suggested rating,
   preview who it will reach.
5. **Channel page**: feed plus documents (overview, wiki, FAQs), and the
   QR poster download.
6. **Connect your AI**: the plain-language MCP setup.
7. **Landing page with waitlist**: sells the dream within the D-003
   guardrails, for publishers and subscribers.

## Done when

- [x] 2–3 directions, each covering screens 1–7 (three: A Harbour, B Signal, C Market day; the channel page is folded into the publisher screen)
- [x] Shared with the owner as links they can open on a phone
- [x] The owner's pick written up as a decision ([D-005](../decisions/D-005-visual-direction.md))

## Log

- 2026-11-15: created, marked ready (needs nothing from the owner)
- 2026-11-15: three directions published to the design canvas; waiting on the owner's pick
- 2026-11-15: the owner picked A's colours with C's shapes and tone (D-005); applied across all of A; B and C removed from the canvas
- 2026-11-15: clickable prototype in `prototype/index.html`, published at https://claude.ai/artifact/V3Esqanzj3rnjsBLhbLiq1 (simulated data, no backend)
- 2026-11-15: prototype reworked for D-006: Share tab, Start a channel, Yours in Connections
- 2026-11-15: tab bar removed; feed is home with a floating Ask bar; three navigation options to compare (header icons, channel chips, menu sheet)
- 2026-11-15: menu sheet chosen (D-007); other navigation options and the switcher removed
- 2026-11-15: prototype rebuilt as Sub1 (D-008): Troves and Pings, home shows only the latest ping, radar of nearby Troves with ping strength (D-009)
- 2026-11-15: rating filter chips under the header (All, Urgent, Important, Good to know, FYI); feed is newest first
