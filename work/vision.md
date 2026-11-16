# Vision: from notifications to a living Hobart

Where this is going, and why we start small. Projects should move towards
this. Marketing is allowed to sell it (see
[D-003](decisions/D-003-marketing-sells-the-dream.md)), but the product
only promises what it can do today.

## The end dream

A **Hobart hub**: clean, live, trustworthy data about the city's businesses,
food scene, community groups, schools and events. Any AI agent can use it
through an MCP server. People and organisations keep it current because they
already use it every day.

- **Every entity has a home.** A café, a school, a netball club or a council
  service has one record, with a stable ID and open schemas (schema.org
  types), so nothing is duplicated.
- **Two voices per entity.** The owner is authoritative on facts such as
  hours, contacts and menus. The community adds colour and flags when
  something is stale. Owners can lock their content, but never the
  "this is outdated or closed" signal.
- **Provenance on every fact.** Who said it, when, and how it was verified,
  so agents can reason about trust. "Clean data" means exactly this.
- **Permissioned streams.** Some data is public; some is for members,
  parents or customers only. The entity decides.
- **Your city in your AI.** Anyone can connect a personal agent and ask
  "what's on for me this week?" across everything they follow.
- **Open by design.** Centralised now because that is what gets it started,
  but with open schemas, stable IDs and open data exports. If decentralised
  protocols mature, the hub becomes one node in that network rather than a
  silo.

## Why we don't start there

A data hub is worthless until it has critical mass, and people don't
contribute data so that AI agents have something to read. That is the cold
start problem, and it kills most directories.

## Where we start: an intelligent notification system

Set out in [D-002](decisions/D-002-start-with-notifications.md).

**Publishers** (a club, a school, a café, a body corporate, a neighbour)
create a channel and invite the people they want to keep informed.
**Subscribers** accept, and the channel joins their list of
**connections**.

- Every notification has a **priority rating**. Each subscriber sets their
  own **threshold** per connection, and only what clears it reaches them.
- Subscribers choose how updates reach them: **email**, **HTTP POST
  (webhook)**, **SMS** (paid tier), or **nothing at all**. "Nothing" means
  they stay subscribed and their own agent pulls the feed when it suits
  them.
- Each connection can be **toggled** on or off without unsubscribing.
- Publishers post **manually in the web app** or **through the API or MCP
  server**.
- Channels hold more than a feed: **documents** such as an overview, a wiki,
  instructions and FAQs.
- Subscribers can **chat with all their subscriptions** in the app, or in
  their own AI through the MCP server: "When is the next working bee, and
  what do I bring?"

## How the start becomes the dream

| Notification system | Becomes, in the hub |
| --- | --- |
| A publisher's channel | An entity |
| Channel documents | The entity's wiki and owner-verified facts |
| The feed | Live data about that entity |
| Invite-only channels | Permissioned streams |
| A subscriber's connections | A personal, agent-readable view of their city |

Every publisher who joins for the notifications is building the hub without
being asked to. Once enough of Hobart publishes, we open up public channels,
discovery and community contributions. A moderator gates the creation of new
entities to filter out duplicates.

## What's different from what exists

Researched 2026-11-15. Each piece exists somewhere; the combination doesn't.

- **Developer push tools** (ntfy, Pushover, Gotify, and the MCP servers that
  wrap them) have priorities and agent access, but no invites, no documents
  and no friendly interface.
- **Agent notification MCP servers** (Notify-MCP, agent-center) handle
  agent-to-agent publish/subscribe, not organisations talking to people.
- **Notification infrastructure** (Courier, Novu, Knock, SuprSend) is a
  backend for other companies' apps, not a consumer product.
- **Organisation-to-member apps** (Compass, Seesaw, TeamSnap, Heja, PlayHQ,
  Band, WhatsApp channels) each own one silo, give every message equal
  weight, and offer no agent access.
- **Newsletters** (Substack, Buttondown) are email-only broadcasts.

**Our angle:** one inbox, **owned by the subscriber**, across every
organisation they follow, with their own threshold, an agent-first pull
mode, and documents they can ask questions about.

## Known hard parts

- **Priority inflation.** If publishers set the rating alone, everything
  becomes urgent. Plan: AI suggests a rating, the publisher adjusts it, and
  each subscriber recalibrates per connection ("this school's 4s are my 2s").
- **The publisher is the real customer.** Subscribers only arrive by
  invitation. The pitch to publishers: write once and reach everyone however
  they prefer, without pinging anyone about trivia, and let members ask the
  documents instead of messaging you.
- **Incumbents.** Don't fight Compass or PlayHQ head on. Start with groups
  that have no proper tool yet: community and volunteer groups, body
  corporates, small businesses with regulars, neighbourhood groups. Imports
  from RSS, email or a calendar let us sit alongside existing tools.
- **SMS costs real money** (several cents per message in Australia), so it
  is paid-tier only.
- **Privacy.** We hold who-follows-what for real people in a small city, and
  the Australian Privacy Act applies. Collect the minimum, and offer export
  and deletion from day one.
- **Moderation** grows with public content. Invite-only channels keep it
  small until the hub opens up.
