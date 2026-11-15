# Digest

Tell the owner what the project needs from them today. This loop reads; it
builds nothing.

## Read

- `work/questions.md`: open questions and unticked "Only you can do" items
- the board in `work/README.md`, and the project files behind any row whose
  next step is the owner's
- open pull requests on this repository, and the state of CI on `main`

## Work out

Rank everything waiting on the owner by how much work it blocks: a question
that holds up a `ready` or `building` project beats one that holds up
scoping, and an account that takes a week to approve beats one that takes a
minute. Pull requests waiting more than two days count.

## Change

Only bookkeeping, and only if it is wrong: a board row that no longer
matches its project file, a question whose answer is already recorded as a
decision. If you change anything, open a pull request.

## Notify

Always, in this shape, short enough for a phone:

> **<Project>: 2 things need you**
> 1. Q-004: <question>? I'd pick <option>. Blocks <project>.
> 2. Pull request #12 (<title>) has been waiting 3 days.
>
> Also: <one line on what moved since yesterday>.

At most three items. If nothing needs the owner, say that in one line along
with what is in progress. If CI on `main` is red, lead with that.
