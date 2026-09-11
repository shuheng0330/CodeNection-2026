# Ideation inputs — Ku's supplement to Thong's §3

Read `docs/readme-draft-thong.md` first. This does **not** duplicate it.

Thong's mindmap, "Ideas considered" and "How Pikul evolved" already cover the
ground, and his mindmap is better positioned for the rubric than the one I had
drafted — it carries a *Directions explored* branch and a *Why we chose this
direction* branch, which is what Breadth of Exploration actually asks for. I
have dropped mine rather than give the README two competing maps.

What follows is the one thing I can add that he cannot get from memory: the
**dated, checkable record** in git. The Iteration band wants *"multiple
documented iterations showing how and why the idea evolved"*, and a table a
judge can verify against commit history is worth more than the same table
asserted.

---

## 1. The one genuinely unclaimed item: `Problem.txt`

**This is the most valuable thing in the repository that no draft currently
uses, and it sits on a row worth 7 marks.**

`Problem.txt` is at the repository root. It is a list of blunt criticisms of
the prototype — not written as a plan, written as complaints:

> *"Fix UI, big gap (does not occupied the full screen), Too simple"*
> *"Front end only two pages, current implementation feel like just touch and go… flow is too simple and no further extension"*
> *"Lack of WOW factor"*
> *"Students are already overwhelmed. Why would they open an app and manually enter another task every time somebody asks them for something?"*

Thong committed it at **7 September, 23:06** (`bfbfd91`). What happened next is
the part that matters, and every timestamp below is in `git log`:

| Criticism | What changed | When | Commit |
|---|---|---|---|
| *"why would they manually enter another task every time somebody asks?"* | Adding a commitment by **pasting the message that created it** — the seed of the whole request sheet | **33 minutes later**, 7 Sep 23:39 | `2818b87` |
| *"only two pages… no further extension"* | The app shell, and `/week` — the four weeks ahead | next morning, 8 Sep 10:37–10:53 | `7c3bc9e`, `011251d` |
| *"Lack of WOW factor"* | `/compare` — two students, and the viewer commits to an answer before the reveal | 8 Sep 10:56 | `f9a9477` |
| *"Fix UI, big gap, does not occupy the full screen"* | Shared responsive shell, then the Today composition rebuild | 8–9 Sep | `7c3bc9e`, `45f9de7` |

That is a complete **feedback → change → visible result** chain with
timestamps, which is the shape the Mentor Consultation and Feedback Integration
row is scored on.

**The question only the team can answer: who wrote it?** If those words came
from a mentor, a senior, a lecturer — anyone outside the three of us — this is
documented external feedback and should be attributed, dated, and shown as the
table above. If it was one of us critiquing our own work, it is still strong
*iteration* evidence and belongs in the evolution section, but it must **not**
be presented as external feedback.

I cannot answer that from the repository, and guessing would be exactly the
fabrication `README_PLAN.md` forbids. Thong committed the file, so Thong knows.

## 2. Dates and references for the evolution table

**Internal apparatus — do not paste this section into the README.** Commit
hashes and `git show` commands are for you to check my claims against, not for
a judge to read. Use them to confirm the rows, then publish the rows.

Thong's "How Pikul evolved" table is accurate. These are the citations that let
a judge check it, in his existing row order.

| His row | Dated evidence |
|---|---|
| Awareness → prevention | `PLAN.md:13` states the original position in writing — *"Pikul will remain a focused two-page prototype"* — and line 1 marks it superseded on 8 Sep. The retired `EXPANSION_PLAN.md` records why: the brief's verb is preventive, and the product was entirely retrospective. Recover it with `git show c11ea4a^:docs/EXPANSION_PLAN.md` |
| Broad concept → focused prototype | The expansion plan proposed **nine routes**; `PHASE_PLAN.md` settled on **seven** the same day (`c11ea4a`, 8 Sep). `/history` and `/start` were the two cut |
| Manual classification → message first | `docs/evidence/2026-09-09-decision-contract.md` — *"It used to ask you to classify the ask yourself… it is a question about our data model rather than about anyone's life"* |
| Result → before and after | `beforeAfterLine` in `lib/copy.ts`; the reasoning is in `docs/readme-sections-ku.md` §5 |
| Recommendation → supported choice | `eligiblePutDowns` in `lib/engine/putdown.ts`, added 10 Sep (`670e99f`, PR #16) |
| System language → student language | The `PROJECT_STATUS.md` merge table records which of two competing implementations survived, and why |

## 3. Two dropped directions worth naming in full

Thong's table lists "Sleep or wellbeing tracker — Dropped" and "Rebalancing and
scenario optimizer — Deferred". Both were argued in writing before being cut,
and the specifics are stronger than the summary.

**Sleep debt as a capacity modifier.** One input a day, and a rolling 14-night
debt where **the debt shrinks the denominator rather than growing the
numerator** — which produced the sharpest line anyone wrote for this project:
*"Your week isn't heavier than usual. You are."* Dropped because self-reported
sleep is a *stated* input dressed as a measurement, and adding body metrics
turns a load tool into a fitness tracker. `EXPANSION_PLAN.md` §2.4.

**`/week/rebalance`.** Two literal operations — group errands into one trip,
push a commitment to a later week. This is the brief's *named* "load balancer",
and we only ever built handing one thing back. It is the most defensible thing
a judge can say we missed, and `docs/BRIEF_COVERAGE.md` already says so in our
own words. Better that we name it than that they find it.

## 4. What I cannot supply, and will not invent

**Mentor consultation.** No record exists in `docs/evidence/`. `PHASE_PLAN.md`
scheduled the booking for Tuesday 8 September. The handbook allows one session
of up to 25 minutes, booked through the organisers' sheet and held on Discord.
Thong's draft already handles this correctly — a commented-out template and an
instruction not to publish it unless a real session happened. That is the right
call and I would not change it. See §1: `Problem.txt` may already be the answer.

**Student testing.** `PHASE_PLAN.md` scheduled a first-impression check on
Wednesday and a three-student phone test on Thursday. Neither is recorded.

This is the cheapest scoring material still available before the freeze — three
students, fifteen minutes each, written down honestly — and it is the only
thing that moves Design / Usability into its top band, which asks for
*"attention to how people actually use it."* Our release script proves reflow
and keyboard access. It cannot prove usability, and we should not let the
README imply that it does.
