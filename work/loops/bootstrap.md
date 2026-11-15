# Bootstrap

Run once, by hand, in a new repository made from the template. The owner
gives a paragraph describing the project.

## Do

1. **Fill in `CLAUDE.md`**: the project's name and paragraph, and the build
   and test commands if a stack is already chosen. Replace the README's
   title and opening with the project's own; keep the "How it runs" section.
2. **Date D-001** with today's date.
3. **Write `work/signals.md`**: what "working" means for this project and
   the steps that lead to it. Leave sources as `not connected` unless you
   can read them now.
4. **Scope the first projects.** Break the paragraph into the smallest set
   of projects that gets something real in front of a real person. One file
   each in `work/projects/`, a row each on the board. Three to six is
   typical; more means the first milestone is too big.
5. **List what only the owner can do** in `work/questions.md`: every
   account, domain, key, payment and listing the first projects will need.
   This is the most valuable part of the run. Order them by how long they
   take to arrive (store approvals, domain verification and business
   accounts first).
6. **Ask the first questions.** Only the ones that change what gets built
   first, each with a recommendation. Stack and tooling are yours to pick
   unless the owner stated a preference; record the pick as a decision.
7. **Mark `ready`** any project that needs nothing from the owner.
8. Run `npm run check`, commit, and open a pull request.

## Finish by telling the owner

- the projects, in the order you would build them
- the "Only you can do" list
- the questions, with your recommendations
- that the next step is to turn the loops on (`work/loops/README.md`)
