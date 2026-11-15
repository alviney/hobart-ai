# Autonomous project template

A starting point for a project that mostly runs itself: scheduled Claude
sessions find the next thing, ask you when a choice is yours, and build the
answer as a pull request. You answer questions and merge.

There is no framework here. It is a folder of markdown (`work/`), a set of
instructions (`CLAUDE.md`), four prompts that run on a schedule
(`work/loops/`) and a check that keeps the markdown honest (`npm run check`).

## How it runs

```
            ┌────────────── work/ ──────────────┐
 loops ───▶ │ board · projects · questions ·    │ ───▶ pull requests ───▶ you merge
 (scheduled)│ decisions · signals · ideas       │
            └──────────────▲────────────────────┘
                           │
              you answer a question; the answer
              is written down as a decision
```

| Loop | Runs | Does |
| --- | --- | --- |
| [digest](work/loops/digest.md) | weekdays | Sends you the few questions that are blocking the most work |
| [build](work/loops/build.md) | daily | Builds the top `ready` project as a pull request |
| [gap scan](work/loops/gap-scan.md) | weekly | Looks for what is missing and asks whether you want it |
| [signals](work/loops/signals.md) | weekly | Reads your analytics and errors, reports the biggest problem and proposes one change |

## First hour

1. **Create your repository from this template** and open it in Claude Code
   (claude.ai/code).
2. **Tell Claude what the project is.** Say: *"Run `work/loops/bootstrap.md`.
   The project is: …"* with a paragraph on what you are building, for whom,
   and how you will know it is working. Claude fills in `CLAUDE.md`, the
   board, the first projects and `work/signals.md`, and asks you its first
   questions.
3. **Do the things only you can do, first.** Bootstrap lists them under
   "Only you can do" in `work/questions.md`: accounts, domains, API keys,
   store listings. These block more work than any decision does, and no
   session can do them for you. Keys go in the cloud environment's settings,
   never in the repository.
4. **Turn the loops on.** Say: *"Set up the loops in `work/loops/` as
   scheduled tasks."* Tell Claude your time zone. Start with the digest and
   the build loop; add the gap scan after a week, and the signals loop once
   something is live and collecting data.
5. **Add your real test command to CI.** `.github/workflows/ci.yml` runs
   `npm run check` today, which only checks `work/`. The build loop is only
   as trustworthy as the tests that tell it it is wrong.

## Day to day

- A notification arrives with a question and a recommendation. Reply in that
  session. The answer is written down as a decision, and the next build run
  picks it up.
- A pull request arrives. Read it, comment or merge.
- To add work yourself, put a line in `work/ideas.md`, or say *"Scope the
  <x> project"*.

## What the sessions will not do

These are set in [D-001](work/decisions/D-001-how-this-project-runs.md), and
changing them takes a new decision:

- merge a pull request, deploy, or publish anything
- spend money or change a paid plan
- reopen a settled decision without asking
- weaken or skip a test to get a green run

## Layout

```
CLAUDE.md                  instructions every session reads first
work/
  README.md                the process and the board
  questions.md             what is waiting on you
  ideas.md                 inbox, one line per idea
  signals.md               where the data is, and what it last said
  projects/                one file per project
  decisions/               one file per settled decision (append-only)
  spikes/                  write-ups of timeboxed experiments
  loops/                   the prompts the scheduled tasks run
tools/check-work.mjs       fails CI when work/ is inconsistent
.github/                   CI and the pull request template
```
