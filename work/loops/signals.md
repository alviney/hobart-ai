# Signals

Read what real users did, find the biggest problem, and propose one thing to
do about it.

## Before anything

Read `work/signals.md`. If no source other than CI is `connected`, stop and
say which one would be most useful to connect and what the owner has to do.
Don't estimate, and don't describe data you could not read.

## Read

For each connected source, the period since the last entry under "Readings"
(or the last seven days):

- **The funnel**: how many reached each step in `work/signals.md`, and the
  conversion between steps.
- **Who dropped**: at the worst step, split by whatever the source has, such
  as acquisition channel, device, new or returning, region. Look for the
  group that behaves differently from the rest.
- **Errors**: anything new, or anything hitting many users.
- **What people said**: reviews, support messages, replies.

## Be honest about the numbers

State the count behind every rate. With small numbers, say that it is too
few to tell and report the counts anyway. Don't call a change a trend
until it has held for two readings. Don't propose an A/B test the traffic
cannot settle within a month; propose making the change and watching the
number instead.

## Change

- Prepend a dated entry to "Readings" in `work/signals.md`: the period, the
  count at each step, and one line on what stood out.
- If there is a finding worth acting on, add one question to
  `work/questions.md` with the evidence, two or three options (change the
  message, change the step, test both, leave it) and a recommendation.
- If a shipped project named a signal in its outcome, record in that
  project's file whether the number moved.

Open one pull request. Build nothing.

## Notify

Only if something moved or a question was asked:

> **<Project>: people are dropping at <step>**
> 41 of 130 who started sign-up finished it (32%), down from 48% last week.
> Most of the drop is <group>. I'd <recommendation>. Q-009 has the options.
