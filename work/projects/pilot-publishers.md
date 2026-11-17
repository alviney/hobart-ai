# Pilot publishers: first Hobart publishers, found through ads

- **Status:** building
- **Size guess:** M
- **Touches:** `marketing/`, landing page, onboarding docs, `work/signals.md`
- **Related decisions:** [D-002](../decisions/D-002-start-with-notifications.md), [D-003](../decisions/D-003-marketing-sells-the-dream.md), [D-004](../decisions/D-004-mockups-first-and-ads.md)

## Why

The publisher is the real customer: subscribers only arrive by invitation.
Whether real publishers keep posting matters more than any feature. They
come from ads pointing at a landing page with a waitlist
([D-004](../decisions/D-004-mockups-first-and-ads.md)), which also measures
demand before anything is built.

## Outcome

3–5 Hobart publishers, each with real subscribers, posting at least weekly
for a month without being nagged.

## Not doing

- Sessions running or paying for ads (D-001); the owner runs the ad account
- Chasing organisations already locked into Compass or PlayHQ

## Open questions

- [x] Who are the first publishers? Found through ads to a waitlist ([D-004](../decisions/D-004-mockups-first-and-ads.md))
- [ ] Free during the pilot? (owner): [Q-003](../questions.md)
- [ ] The owner approves the founding-publisher pitch in [marketing/messages.md](../../marketing/messages.md)

## Spikes

| Spike | Question it answers | Timebox | Result |
| --- | --- | --- | --- |

## Done when

- [x] Landing page with waitlist built (`site/index.html`, draft at https://claude.ai/artifact/G44NJqi3R8CFhpt1E4mRjd). The form isn't connected to anything yet ([Q-007](../questions.md))
- [ ] Ad creative and targeting drafts in `marketing/` (Hobart small businesses and community groups)
- [ ] Waitlist sign-ups measured per ad (see `work/signals.md`)
- [ ] Founding-publisher pitch and onboarding guide approved
- [ ] First 3–5 publishers from the waitlist onboarded with at least 10 subscribers
- [ ] Four weeks of feedback written up as a spike in `work/spikes/`

## Log

- 2026-11-15: created
- 2026-11-15: switched from hand-recruiting to ads plus a waitlist (D-004)
- 2026-11-17: landing page drafted in the Sub1 look (`site/index.html`); waitlist form not yet connected
