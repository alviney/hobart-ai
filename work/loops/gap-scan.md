# Gap scan

Find what the project is missing that nobody has asked for yet, and ask
whether the owner wants it.

## Look for

Compare what the code does with what `work/` says the project is for.

- **Promised but not built.** A decision, project outcome or piece of copy
  describes something the code doesn't do. A screen exists but nothing
  behind it works.
- **Expected but never mentioned.** What a product like this normally has
  and this one lacks: notifications, error tracking, an empty state, a way
  to delete an account, a privacy page, backups.
- **Blind spots.** Sources in `work/signals.md` still `not connected`; code
  with no tests; a step in the funnel with no event.
- **Stalled work.** A `building` project with no log entry in two weeks, a
  question open for more than a week, an "Only you can do" item that now
  blocks something `ready`.
- **Rot.** Dependencies with known vulnerabilities, a check that is skipped,
  a TODO that names something already shipped.

Before raising anything, search `work/ideas.md`, `work/questions.md`,
`work/projects/` and `work/decisions/` for it. A gap that is already an
idea, already asked, or already decided against is not a finding.

## Change

At most three findings a run, the ones that matter most to what "working"
means in `work/signals.md`. For each, either:

- add a line to `work/ideas.md` marked `(gap scan, YYYY-MM-DD)`, if it is
  simply something to consider, or
- add a question to `work/questions.md`, if it needs a yes or no: "We have
  not built <x>. Do you want it?" with a recommendation and a size guess.

Open one pull request with the additions. Build nothing.

## Notify

Only if there is a finding:

> **<Project>: 2 gaps found**
> 1. Nothing tells a user when <x> happens. Want notifications for it? (S)
> 2. Error tracking is not connected, so we can't see failures in production.
