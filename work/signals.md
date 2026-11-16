# Signals

Where this project's data lives and what it last said. The signals loop
reads every connected source below; the gap scan reports the ones that are
not connected yet.

## What "working" means

**Active publishers:** publishers who posted at least once in each of the
last four weeks, and whose subscribers haven't muted them.

| Step | Event or measure | Source |
| --- | --- | --- |
| Publisher creates a channel | `channel_created` | product database |
| Invites go out | `invite_sent` | product database |
| Subscribers accept | `invite_accepted` | product database |
| Publisher posts weekly | `notification_published`, by week | product database |
| Subscribers stay | connections still on after 4 weeks; mutes and unsubscribes | product database |
| Agents use it | MCP and API reads per week | API logs |

## Sources

A source is `connected` when a scheduled session can read it: through a
connector, or an API whose key is saved on the cloud environment.

| Source | Answers | Status | How a session reads it |
| --- | --- | --- | --- |
| Product analytics | Who does what, where they drop off | not connected | |
| Error tracking | What is breaking for real users | not connected | |
| CI | Whether `main` is healthy | connected | GitHub Actions on this repository |
| Customer feedback | What people say (reviews, support, replies) | not connected | |
| Acquisition | What each channel costs and brings in | not connected | |

## Readings

Appended by the signals loop, newest first. Each one says what was measured,
over what period and how many people, so the next run can compare.

