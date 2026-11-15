# <Project name>

<One paragraph: what this is, who it is for, and how we know it is working.
Bootstrap (`work/loops/bootstrap.md`) fills this in.>

## How to build and test

<Commands to install, run, check and test. Until the project has code,
`npm run check` validates `work/` and is all CI runs.>

## This project runs through `work/`

Most sessions here are scheduled and start with no memory of the last one.
Everything a session needs to carry on is in `work/`, so read it before
acting and leave it accurate when you finish. See `work/README.md` for the
process.

- **Before proposing an approach, read `work/decisions/`.** Don't reopen a
  settled decision. If something genuinely conflicts with one, ask in
  `work/questions.md` and propose a superseding decision.
- **When a choice is the owner's, ask; don't guess and don't stop.** Add it
  to `work/questions.md` with your recommendation, then carry on with
  whatever does not depend on the answer. A choice is the owner's when it
  changes what the product is, what it says to customers, what it costs, or
  what data it collects. How to implement something is yours.
- **When the owner settles something**, write it up as the next
  `work/decisions/D-00n-<slug>.md`, mark the question answered, and link the
  decision from the projects it affects.
- **When working on a project**, keep its file current: tick open questions,
  append to the log, and update the board in `work/README.md` when the
  status changes.
- **Things only the owner can do** (accounts, keys, domains, payments) go in
  the "Only you can do" list in `work/questions.md` the moment you see them
  coming, not when they block you.

## Limits

Set by [D-001](work/decisions/D-001-how-this-project-runs.md):

- Work reaches `main` only through a pull request the owner merges. Never
  merge, deploy or publish.
- Never spend money, and never put a secret in the repository.
- Build only projects whose status is `ready` or `building`.
- Tests fail loudly. Don't skip, weaken or retry one to get a green run; a
  failing test is either a bug or a question.

## Things not to undo

<Project-specific rules go here as they are learned: the one place a shared
value lives, the thing that looks redundant but isn't. Add a line whenever a
session breaks something a rule would have saved.>
