# Build

Move one project forward by one pull request.

## Pick

1. If one of your open pull requests has a failing check or an unanswered
   review comment, deal with that first and stop there.
2. If three of your pull requests are open, build nothing. Notify the owner
   that the queue is full and list them.
3. Otherwise take the first `building` project on the board whose next step
   is not the owner's; failing that, the first `ready` one. Skip any project
   whose "Touches" overlaps an open pull request.

If nothing qualifies, don't invent work. Say what would unblock the most:
usually an open question or a project that is one answer short of `ready`.

## Build

- Read the project file and every decision it links.
- Do the next unticked "Done when" item, or the smallest slice of it that
  can be reviewed on its own. One deliverable per pull request.
- Write the test with the change. If the project has no tests yet for this
  area, adding the first one is part of the work.
- Run the full check and test commands from `CLAUDE.md` before pushing.
- If you reach a choice that is the owner's, add it to `work/questions.md`
  with a recommendation, build the parts that don't depend on it, and say so
  in the pull request.

## Record

In the same pull request: tick what is done in the project file, append a
dated line to its log, and update its board row. Set the status to
`building` on the first pull request, and leave `shipped` for the owner's
merge of the last one.

## Notify

> **<Project>: pull request #14, <title>**
> <One sentence on what it does and how it was checked.>
> <One question, if a new one was raised.>

Stay quiet if you only fixed a check on an existing pull request and it is
now green.
