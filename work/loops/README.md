# Loops

Each file here is the prompt for one scheduled task. The prompts live in the
repository so they are versioned and reviewed like everything else; the
scheduled task itself only says *"Read `work/loops/<name>.md` and follow
it."*

| Loop | Suggested schedule | Needs | Notifies you |
| --- | --- | --- | --- |
| [bootstrap](bootstrap.md) | once, by hand | A paragraph from you | In the session |
| [digest](digest.md) | weekdays, morning | Nothing | Always |
| [build](build.md) | daily, overnight | A `ready` project | When a pull request opens or it is blocked |
| [gap scan](gap-scan.md) | weekly | Nothing | When it finds something |
| [signals](signals.md) | weekly | A connected source in `work/signals.md` | When something moved |

## Turning them on

In a Claude Code cloud session on this repository, say:

> Set up the loops in `work/loops/` as scheduled tasks. My time zone is
> <zone>. Each one starts a fresh session and sends me a push notification.

Start with the digest and build. Add the gap scan once the first projects
are moving, and signals once something is live.

## Rules every loop follows

- Read `CLAUDE.md`, `work/README.md`, `work/questions.md` and
  `work/decisions/` first. The limits in D-001 apply.
- Changes go on a branch and into a pull request, including changes that
  only touch `work/`.
- End with a summary short enough to read on a phone lock screen: what you
  did, and the one thing you need from the owner, if anything. If there is
  nothing worth their attention, say so in one line.
- If the owner replies in the session, treat it as an answer: write the
  decision, close the question and update the affected projects.

## Adding a loop

Copy an existing file. A loop needs a trigger, what to read, what it may
change, when to stay quiet and what the notification says. Keep each to one
job; a loop that does two things gets neither right.
