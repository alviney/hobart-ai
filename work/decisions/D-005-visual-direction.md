# D-005: Visual direction: Harbour colours with Market day shapes

- **Date:** 2026-11-15
- **Status:** superseded by D-010 (colours only; type, shapes and tone still apply)
- **Projects:** [ui-mockups](../projects/ui-mockups.md), [notify-core](../projects/notify-core.md), [pilot-publishers](../projects/pilot-publishers.md)

## Context

Three directions were mocked up (D-004): A Harbour (calm, light, navy),
B Signal (dark, techie) and C Market day (warm, rounded, playful). The
owner liked A's calm and colours but preferred C's rounded pills, chunky
headings and friendlier wording.

## Decision

The product uses A's colours with C's shapes and tone. B and C have been
removed from the canvas. The mockups are at
https://claude.ai/artifact/Pqur9C8nAW3zan5uhUUQmq (private to the owner).

- **Colours:** background `#F4F6F7` / `#E9EEF1`, cards `#FFFFFF`, ink
  `#14212B`, primary `#1D5C86` (hover `#123E5C`), light blue `#EEF5FA` /
  `#DCEBF5`, borders `#D3DBE0`, muted text `#56636D` / `#3A4852`.
- **Type:** Bricolage Grotesque 800 for headings, Inter for body.
- **Shapes:** pill buttons, inputs and tags (`border-radius: 99px`), cards
  rounded 22–28px, 2px borders, phone screens 44px.
- **Priority:** shown as word tags, not numbers: Urgent (`#FDE3D3` /
  `#9A3412`), Important (`#DCEBF5` / `#123E5C`), Good to know (`#E3F0EA` /
  `#1F5137`), FYI (`#E9EEF1` / `#3A4852`).
- **Tone:** friendly and plain: "What's the news?", "Share it", "We
  picked Important because… Change it if we're wrong."

## Options considered

- **A colours with C shapes**: calm and trustworthy, but approachable for
  non-technical publishers.
- **B Signal**: matches the "frontier" pitch, but could put off everyday
  users. Its language may still be useful in ads for the AI-curious.
- **Any one direction unchanged**: the owner wanted parts of two.

## Consequences

Priority is a four-level word scale in the interface. The data model can
still store a number behind it (a decision for notify-core). Revisit if
real users find the tags unclear.
