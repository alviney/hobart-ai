# Agent access: API, MCP server and webhooks

- **Status:** scoping
- **Size guess:** M
- **Touches:** public API, MCP server, webhook delivery, API tokens
- **Related decisions:** [D-011](../decisions/D-011-urgent-or-not.md), [D-002](../decisions/D-002-start-with-notifications.md)

## Why

The agent-first part is what sets us apart ([vision](../vision.md)).
Subscribers who choose "no notifications" pull their feed through their own
AI; publishers automate posting; and asking questions of your subscriptions
works in any MCP client before we build in-app chat.

## Outcome

- A subscriber connects an MCP client and can read their feed (filtered by
  threshold or not) and search their channels' documents.
- A publisher can post through the API or MCP server with a token.
- Webhook (HTTP POST) is a delivery option alongside email.

## Not doing

- In-app chat UI (a later project, once MCP usage shows what people ask)
- Agent-to-agent features beyond reading and posting

## Open questions

- [ ] Auth for MCP: OAuth or personal tokens first (implementation; record as a decision)
- [ ] Webhook signing and retry policy (implementation)
- [ ] Depends on the [notify-core](notify-core.md) data model

## Spikes

| Spike | Question it answers | Timebox | Result |
| --- | --- | --- | --- |

## Done when

- [ ] MCP tools: `get_feed`, `list_connections`, `search_documents`, `publish` (publishers only)
- [ ] REST API with the same operations and per-user tokens
- [ ] Signed webhook delivery with retries, respecting thresholds
- [ ] Docs page: "connect your AI" in plain language, plus technical reference

## Log

- 2026-11-15: created from the brainstorm that produced D-002
- 2026-11-16: priority is now urgent or not (D-011); the API takes `urgent: true`
