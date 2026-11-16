# Waiting on you

Everything the project needs from its owner, in one place. The digest loop
reads this file and sends the items blocking the most work.

## Only you can do

Accounts, keys, domains, payments, store listings: things no session can do.
Listed as soon as they are foreseen, because they take the longest. Keys go
in the cloud environment's settings, never in the repository.

- [ ] Check the Sub1 name: domain availability and a basic Australian trademark search (IP Australia) before registering anything (D-008)
- [ ] Register a domain once the name check passes — unblocks email sending (DNS verification) and the public site. Tell a session the domain; DNS records come later.
- [ ] Create an email-sending account (e.g. Resend or Postmark free tier) and verify the domain — unblocks invites and email delivery in notify-core. Save the API key in the cloud environment's settings, never in the repository.
- [ ] Create a hosting account once the stack decision is written (free tier) — unblocks a live pilot. A session will say which one.
- [ ] Set up an ad account (e.g. Meta) and decide a test budget — unblocks finding publishers (D-004). Sessions draft the creative; only you can run and pay for ads.
- [ ] Publish the landing page once one is chosen (hosting plus domain) — ads need somewhere to point.
- [ ] Later, for the paid tier: an SMS provider account and payments (ABN, Stripe). Not needed for the pilot.

## Questions

Newest last. Copy the block below for each one. A question is closed by
changing its status to `answered` with the decision that records the answer,
or to `withdrawn` with a reason; it is never deleted.

<!--
## Q-001: <The question, in one line>

- **Status:** open
- **Asked:** YYYY-MM-DD, by <loop or session>
- **Blocks:** <project link, or "nothing yet">
- **Options:** A: … / B: …
- **Recommendation:** <option>, because <one sentence>
-->

## Q-001: What is the product called?

- **Status:** answered → D-008 (working name Sub1, pending domain and trademark checks)
- **Asked:** 2026-11-15, by brainstorm session
- **Blocks:** the domain, email sending, marketing copy ([notify-core](projects/notify-core.md))
- **Options:** A: a Hobart-specific name (local pride, but harder to grow beyond Hobart) / B: a general name with "Hobart" as the first city (room to grow)
- **Recommendation:** B, because the notification product works anywhere and the "first city" story is itself good marketing.

## Q-002: Who are the first 3–5 pilot publishers?

- **Status:** answered → D-004 (find publishers through ads to a waitlist, not personally)
- **Asked:** 2026-11-15, by brainstorm session
- **Blocks:** [pilot-publishers](projects/pilot-publishers.md)
- **Options:** A: community and volunteer groups / B: small businesses with regulars / C: a mix of people you already know personally
- **Recommendation:** C, leaning on community groups, because personal relationships get honest feedback and community groups have no good tool today.

## Q-003: Is the pilot free, and what will eventually cost money?

- **Status:** open
- **Asked:** 2026-11-15, by brainstorm session
- **Blocks:** [pilot-publishers](projects/pilot-publishers.md), the pitch wording
- **Options:** A: free for everyone during the pilot, with SMS and higher volumes paid later / B: publishers pay from day one / C: free forever for community groups, paid for businesses
- **Recommendation:** A now, keeping C as the likely long-term model, because removing friction matters most while proving publishers stick.

## Q-004: Can anyone create a channel instantly, and is it free?

- **Status:** open
- **Asked:** 2026-11-15, by brainstorm session
- **Blocks:** [notify-core](projects/notify-core.md) (channel creation)
- **Options:** A: invite-only channels are instant; public, findable ones get a quick check first / B: every channel is instant / C: every channel is checked
- **Recommendation:** A, and free during the pilot, because private channels carry little risk while public ones are where duplicates and impersonation happen. The prototype already works this way.

## Q-005: How should the radar handle location?

- **Status:** open
- **Asked:** 2026-11-15, by brainstorm session
- **Blocks:** [notify-core](projects/notify-core.md) (radar)
- **Options:** A: distances worked out on the phone; we never store where people are / B: store an approximate suburb to improve results / C: store precise location history
- **Recommendation:** A, because it's the strongest privacy promise and the radar doesn't need anything more. It also fits "your connections are yours" in the marketing.

## Q-006: Are pings from public Troves visible to people who don't subscribe?

- **Status:** open
- **Asked:** 2026-11-16, by brainstorm session
- **Blocks:** nearby search on the radar ([D-012](decisions/D-012-radar-screen.md))
- **Options:** A: public Troves' pings are public and searchable; invite-only Troves never appear anywhere / B: only a public Trove's name and info pages are searchable, pings are for subscribers / C: each Trove owner chooses
- **Recommendation:** A, because it makes nearby search useful from day one, and owners who want privacy already have invite-only Troves.
