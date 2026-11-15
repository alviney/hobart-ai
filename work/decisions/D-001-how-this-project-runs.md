# D-001: Sessions propose, the owner merges

- **Date:** YYYY-MM-DD
- **Status:** accepted
- **Projects:** all

## Context

This project is worked on mostly by scheduled Claude sessions that nobody is
watching. Each starts with no memory of the last and can be wrong. The owner
wants to spend their time answering questions, not supervising.

## Decision

Sessions may do anything that ends in a pull request. Only the owner makes a
change real.

A session may, without asking:

- read anything in the repository and any source listed as connected in
  `work/signals.md`
- scope projects, run spikes, and add ideas and questions
- build a project whose status is `ready` or `building`, on a branch, and
  open a pull request for it
- fix a failing check on its own pull request

A session never:

- merges a pull request, deploys, publishes, or sends anything to customers
- spends money, changes a paid plan, or starts an ad
- puts a secret in the repository
- skips, weakens or retries a test to get a green run
- acts against a decision; it asks in `work/questions.md` instead

To keep the owner's queue short, a session opens no new pull request while
three of its own are still open, and asks no more than three new questions
in one run.

## Options considered

- **Pull requests as the only way in**: every change is reviewable and
  reversible, and the owner's attention goes to the result instead of the
  process.
- **Auto-merge on green CI**: faster, but only as safe as the tests, and a
  new project has few. Worth revisiting per area once tests there are
  trusted.
- **Approve each step**: safe, but it is supervision, which is what this is
  meant to remove.

## Consequences

Nothing ships unless the owner merges, so an unread queue stops the project.
The digest exists to keep that queue visible. Revisit when the tests are
good enough that merging has become a formality; the usual first step is
auto-merge for pull requests that touch only `work/`.
