# Signals

Where this project's data lives and what it last said. The signals loop
reads every connected source below; the gap scan reports the ones that are
not connected yet.

## What "working" means

<The one number that says the project is doing its job, and the steps that
lead to it. For a product with a funnel, list the steps in order with the
event that marks each one.>

| Step | Event or measure | Source |
| --- | --- | --- |

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

