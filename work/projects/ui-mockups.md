# UI mockups: options for the key screens and the landing page

- **Status:** shipped
- **Size guess:** M
- **Touches:** design files or clickable HTML prototypes only, no product code
- **Related decisions:** [D-017](../decisions/D-017-stations.md), [D-016](../decisions/D-016-thematic-tactile.md), [D-015](../decisions/D-015-friendly-look.md), [D-014](../decisions/D-014-home-timeline.md), [D-013](../decisions/D-013-ping-signal-fades.md), [D-012](../decisions/D-012-radar-screen.md), [D-011](../decisions/D-011-urgent-or-not.md), [D-010](../decisions/D-010-deep-sonar.md), [D-008](../decisions/D-008-sub1-troves-pings.md), [D-009](../decisions/D-009-ping-strength-and-radar.md), [D-004](../decisions/D-004-mockups-first-and-ads.md), [D-003](../decisions/D-003-marketing-sells-the-dream.md), [D-005](../decisions/D-005-visual-direction.md), [D-007](../decisions/D-007-feed-first-menu-sheet.md)

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
- 2026-11-16: home feed is compact equal-height rows (rating, Trove, time, one-line title); tapping opens the full ping
- 2026-11-16: three looks to compare (Harbour, Yellow Submarine, Deep Sonar), each with its own feed rows and a compact filter
- 2026-11-16: Deep Sonar look; one feed row per Trove with unread counts; rating filter menu (D-010)
- 2026-11-16: two levels only, urgent or not; only urgent is marked (D-011)
- 2026-11-16: home is now a briefing generated from an editable prompt (default: what's on today); the per-Trove list moves to a Pings page (exploration, not yet a decision)
- 2026-11-16: briefing cut to a few lines of plain text with a small 'Edit prompt' link
- 2026-11-16: briefing rewritten as neutral summaries of what's on; it doesn't tell people what to do. Paused Troves are left out
- 2026-11-16: All pings moves to a round header button (inbox icon, unread badge, orange if urgent), next to the radar
- 2026-11-16: wordmark and logo removed from the home header
- 2026-11-16: three radar layouts to compare (Sonar, Here first, Distance rings); all have a 'You're here' recommendation for an unsubscribed Trove at your location and a bottom bar that searches nearby public Troves and their recent pings
- 2026-11-16: radar visual no longer takes up space; three treatments to compare (scan-first loading screen, background, header accent) over the same 'You're here' card and walking-distance list
- 2026-11-16: radar screen settled: minimal scan, then You're here and a nearby list with search (D-012); visibility of public pings asked as Q-006
- 2026-11-16: ping signal fades with age; radar 'Listening back' slider from today to a month (D-013)
- 2026-11-16: three minimal radar designs to compare (Quiet list, Signal dots, Big names); signal shown by fading rather than meters
- 2026-11-16: Quiet list chosen for the radar; other designs removed (D-012 updated)
- 2026-11-16: radar is a toggle on home that swaps the briefing for the radar; no separate screen (D-012 updated)
- 2026-11-16: header and bottom bar stay in place while the radar scans
- 2026-11-16: bottom bar always says 'Ask anything'; with the radar on it searches nearby Troves
- 2026-11-16: radar scan made small and inline so the toggle swaps content in place
- 2026-11-16: back to the drawing board: three home concepts centred on recent pings (Timeline, Trove shelf, Now / Nearby / Yours); fixed the Ask bar rendering behind content
- 2026-11-16: home is a timeline of recent pings (D-014)
- 2026-11-16: radar drops the slider; nearby pings show as a timeline like home (D-012, D-013 updated)
- 2026-11-16: three new looks to compare against Deep Sonar: Techy, Friendly, Yellow Submarine (theme switcher over the real screens)
- 2026-11-16: Friendly look with submarine-yellow accents (D-015)
- 2026-11-16: yellow kept to highlights; neutral background and white summary card (D-015 updated)
- 2026-11-16: thematic layer: depth is time, portholes, pressable controls, the ripple (D-016)
- 2026-11-16: portholes dropped; back to pastel letter avatars with unread dots (D-016 updated)
- 2026-11-16: avatar circles removed; timeline rows fade after the first two (D-016 updated)
- 2026-11-16: category icons on timeline rows (school, sport, food and so on) (D-016 updated)
- 2026-11-16: radar range control: Within 250 m / 500 m / 1 km / 2.5 km (D-012 updated)
- 2026-11-16: radar range is a minus/plus stepper, 250 m up to All of Hobart (D-012 updated)
- 2026-11-16: five radar range controls to compare (stretch the ring, walking time, dial, pull further, places); not yet chosen
- 2026-11-16: 'pull further' chosen for radar range; other controls removed (D-012 updated)
- 2026-11-16: range control removed; radar shows Troves within about 2.5 km (D-012 updated)
- 2026-11-16: four cafes (Pressed Coffee, Larder & Co, Tidal Bakery, Beanstalk Espresso) with 35 stock pings added to see the noise; same-day pings now sort by clock time
- 2026-11-16: per-row fade replaced by a fade at the bottom edge of the screen (D-016 updated)
- 2026-11-16: category filter chips on the timeline and radar (D-014 updated)
- 2026-11-16: category filter becomes a small row of on/off icons (D-014 updated)
- 2026-11-16: filters removed; noise is handled by subscribing or not. Cafe dummy data cut to two pings (Tidal Bakery, Pressed Coffee) (D-014 updated)
- 2026-11-16: 3D buttons removed; controls are flat with a slight press-in (D-016 updated)
- 2026-11-16: radar toggle is a single round button again, not a switch (D-016 updated)
- 2026-11-16: radar button shows an X while the radar is on (D-016 updated)
- 2026-11-16: home header stays fixed; content scrolls under it with a fade (D-016 updated)
- 2026-11-16: three 'You're here' styles to compare (Spotlight, Sonar contact, Peek inside)
- 2026-11-16: 'You're here' is a navy contact card with the category icon ping (D-012 updated)
- 2026-11-16: Your Troves button next to the radar; swaps the timeline in place and becomes an X (D-014 updated)
- 2026-11-16: 'Your Troves' renamed 'Your subs'; 'Subscribed' heading dropped (D-014 updated)
- 2026-11-16: Scan a code and Start a Trove buttons removed from Your subs (still in the menu)
- 2026-11-16: home design language carried through every screen (D-015 updated)
- 2026-11-16: three ping-strength designs to compare instead of wifi bars (sonar rings, ring on the icon, glow)
- 2026-11-16: sonar rings chosen for ping strength, small and top right on cards (D-009 updated)
- 2026-11-16: ping strength now on the icon circle: strong = rich yellow rim, good = normal, weak = faded (D-009 updated)
- 2026-11-16: strong-ping border now sits over the edge of the icon circle
- 2026-11-16: back to sonar rings for ping strength (D-009 updated)
- 2026-11-16: ping strength as a horizontal bar along the bottom of Trove cards (D-009 updated)
- 2026-11-16: horizontal bar too busy; back to sonar rings (D-009 updated)
- 2026-11-16: sonar rings larger and moved to the bottom right of Trove cards (D-009 updated)
- 2026-11-16: ping strength as a loading ring around the icon circle (D-009 updated)
- 2026-11-16: more space between the ringed icon and the text on Trove cards and headers
- 2026-11-16: All pings page removed from the menu; links now go home (D-014 updated)
- 2026-11-16: Troves renamed Stations (D-017)
