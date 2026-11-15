# Work

How ideas get scoped, built and shipped here. All tracking is plain markdown
in this folder, so it is versioned with the code, reviewable in pull
requests, and readable by Claude at the start of any session.

```
work/
  README.md      this file: the process and the board
  questions.md   what is waiting on the owner
  ideas.md       inbox: one line per raw idea
  signals.md     where the data is, and what it last said
  projects/      one file per project being scoped or built
  decisions/     one file per settled decision (append-only)
  spikes/        write-ups of timeboxed experiments
  loops/         the prompts the scheduled tasks run
```

## The board

Update this table whenever a project changes status. Every file in
`projects/` has a row; `npm run check` fails if one is missing.

| Project | Status | Next step |
| --- | --- | --- |

## Lifecycle

```
idea ──▶ scoping ──▶ spiking ──▶ ready ──▶ building ──▶ shipped
               └──────────────┴─────────┴────────────▶ dropped
```

| Status | Means | Leaves when |
| --- | --- | --- |
| **idea** | A line in `ideas.md`. | Someone wants to think about it → copy the template into `projects/`. |
| **scoping** | The project file exists; the problem, outcome and open questions are being written down. | Every open question is answered or turned into a spike. |
| **spiking** | Timeboxed experiments are answering the questions that talking can't. | Each spike has a write-up in `spikes/` and its conclusion is a decision. |
| **ready** | Scope is fixed, "done when" is concrete, and nothing it needs is waiting on the owner. | The build loop picks it up. |
| **building** | On a branch or in a pull request. | Merged and live. |
| **shipped** | Live. Fill in the outcome: did it do what we said? | — |
| **dropped** | Not doing it. Say why in the file. | — |

`ready` is the gate between thinking and building. The build loop works only
on `ready` and `building` projects, so moving a project to `ready` is how
the owner says "go".

## Rules of thumb

**Questions have one home.** Anything waiting on the owner is in
`questions.md`, with a recommendation. A question buried in a project file
or a pull request description is a question nobody will answer.

**Decisions are append-only.** Before reopening a topic, read `decisions/`.
If a decision needs to change, write a new one that says `Supersedes D-00x`
and mark the old one superseded. That is what stops the same conversation
happening twice.

**Spikes are for learning, not shipping.** A spike has a question, a timebox
and a throwaway branch (`spike/<project>-<topic>`). Its deliverable is the
write-up in `spikes/` and a decision, not merged code.

**Running in parallel.** Each project file lists what it touches. Two
projects can run at once if their lists don't overlap. One branch per
project, one pull request per deliverable.

**Small files.** A project file should fit on a screen or two. If scoping is
getting long, the project is probably two projects.

## Useful prompts

- "Scope the <x> project" → fills in a project file and lists open questions.
- "Run the <y> spike" → works on a `spike/…` branch, writes it up, proposes a decision.
- "We've decided <z>" → writes the decision and links it from the affected projects.
- "<x> is ready" → moves the project to `ready` for the build loop.
