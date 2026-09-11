# README inputs — Ku

Three handoffs that were separate files until 11 September: the §4 captions Lim
needs, the §3 ideation material Thong needs, and my assigned cross-review of his
draft. My copy-ready prose for §2, §5, §6, §7 and §9 stays where the plan puts
it, in `docs/readme-sections-ku.md`.


---

## §4 screenshot captions — Ku's supply to Lim

Six captures, in the order README_PLAN names them. Each has alt text (for the
image) and a caption (printed under it). A note on the figures: the percentages are stable, but the **dates** follow
the Wednesday of whatever week the demo is opened in, not the commit. Re-check
the dates against whatever the capture actually shows.

Rubric note: Design is scored on Visual Consistency (4), Usability and UX (4)
and Mockup Completeness (2 — "covers the core flow end-to-end"). So the six
must form one continuous journey, not six nice pictures. The captions below are
written to make that continuity explicit — each one names what the previous
screen handed it.

---

#### 1 · Landing — the idea before the product

**Alt:** Pikul's landing page. A headline reading "Your week is more than your
timetable" above four cards hanging from a curved line, labelled Coursework,
Commuting, Family and Work.

**Caption:** The premise, before any interface. Four commitments hang from one
line, because that is the actual experience — not four separate apps, one
person carrying all of it. The line sags as they load. Nothing here is your
data yet; it is labelled as an illustration.

---

#### 2 · Today — where you stand, against yourself

**Alt:** The Today screen. A sentence reads "This week's heavier than usual for
you", with a marker sitting past a shaded band labelled "your usual". Below,
five areas — Coursework, Work, Getting there, Family and friends, Everything
else — each with a bar and an hours figure.

**Caption:** No score and no percentage. A marker against a shaded band that
means *your usual*, because you can read a position in half a second and a
number invites you to argue with it. The bars are weight and the figures beside
them are plain hours, and the two deliberately disagree — an eight-hour shift
and eight hours of lectures are not the same week.

---

#### 3 · The request, already read

**Alt:** The request sheet, open over the Today screen. A sample message reads
"can you cover next friday 3pm-11pm? kelly called in sick". A line above the
fields reads "read from cover". Below it are five editable rows — what it is,
when, how long, what kind of thing, and how much it takes out of you — with a
"we guessed" badge on the effort dial.

**Caption:** The moment the product exists for. Pikul opens on the message
that actually arrived and shows what it made of it — naming the word it read
the request from, and badging what it had to guess. Every row is editable and
the price follows the boxes, not our guess. Nothing has to be typed before you see a cost — which is
what a thirty-second decision actually requires.

---

#### 4 · The price, with its own before figure

**Alt:** The request sheet after pricing. Text reads "Week 11 is at 128% of a usual week already. Saying yes makes it 132%." A four-week bar chart shows the
weeks ahead, with week 11 highlighted. Below are two buttons: "I said yes" and
"I said no".

**Caption:** The cost, against the specific week the shift would land in — not
against the average of the next month, and not against another student. The
*before* figure is shown deliberately: 132% sounds severe until you know the
week was at 128% before anyone asked, at which point the honest reading is that
this request is not what made the week hard. Saying no produces a drafted reply
in three tones to copy.

---

#### 5 · Making room, previewed before it happens

**Alt:** The put-down card on Today, expanded. A heading reads "One thing worth
putting down" above "Cafe shift", with a link "Choose a different commitment"
revealing a radio list of eligible commitments, the recommendation marked
first. A preview panel names the hours freed and the day that opens up.

**Caption:** Pikul suggests one thing, never a list — a ranked set of five
things to drop is just another backlog. It will never offer your classes,
coursework, commute or family, and if the best candidate frees under three
hours it says nothing at all rather than dressing up busywork as advice. The
recommendation is a starting point, not a verdict: every eligible commitment is
one tap away, and the preview names what you would get back before anything is
saved.

---

#### 6 · The four weeks you can still change

**Alt:** The Week screen showing four weeks ahead as twenty-eight selectable
days on one shared scale, with the heaviest upcoming day opened and its
commitments listed.

**Caption:** The same arithmetic, run forward over commitments already on your
calendar. Nothing here is predicted — it is what you have already agreed to,
added up, so the heavy week is visible before you are inside it. Every day is
selectable from a keyboard as well as a finger.

---

### What Thong needs to capture

- **Desktop:** 2, 4 (these two carry the argument and need the room).
- **Mobile at 390px:** 1, 3, 5, 6 (this is a phone product; showing it only on
  a monitor undercuts the claim).
- Consistent crop and the same warm background on every one.
- Capture from the frozen build only, and record the commit — README_PLAN's
  guardrail list has "an outdated deployment commit" on it for a reason.

---

## Ideation inputs — Ku's supplement to Thong's §3

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

### 1. The one genuinely unclaimed item: `Problem.txt`

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

### 2. Dates and references for the evolution table

**Internal apparatus — do not paste this section into the README.** Commit
hashes and `git show` commands are for you to check my claims against, not for
a judge to read. Use them to confirm the rows, then publish the rows.

Thong's "How Pikul evolved" table is accurate. These are the citations that let
a judge check it, in his existing row order.

| His row | Dated evidence |
|---|---|
| Awareness → prevention | The retired `PLAN.md` (`git show 14b6d97:PLAN.md`, line 13) states the original position in writing — *"Pikul will remain a focused two-page prototype"* — and line 1 marks it superseded on 8 Sep. The retired `EXPANSION_PLAN.md` records why: the brief's verb is preventive, and the product was entirely retrospective. Recover it with `git show c11ea4a^:docs/EXPANSION_PLAN.md` |
| Broad concept → focused prototype | The expansion plan proposed **nine routes**; `PHASE_PLAN.md` settled on **seven** the same day (`c11ea4a`, 8 Sep). `/history` and `/start` were the two cut |
| Manual classification → message first | `docs/evidence.md` (*The decision contract*) — *"It used to ask you to classify the ask yourself… it is a question about our data model rather than about anyone's life"* |
| Result → before and after | `beforeAfterLine` in `lib/copy.ts`; the reasoning is in `docs/readme-sections-ku.md` §5 |
| Recommendation → supported choice | `eligiblePutDowns` in `lib/engine/putdown.ts`, added 10 Sep (`670e99f`, PR #16) |
| System language → student language | The `PROJECT_STATUS.md` merge table records which of two competing implementations survived, and why |

### 3. Two dropped directions worth naming in full

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

### 4. What I cannot supply, and will not invent

**Mentor consultation.** No record exists in `docs/evidence.md`. `PHASE_PLAN.md`
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

---

## Truth and implementation review — Thong's README draft

Ku, 11 September 2026. `README_PLAN.md` §3 assigns me the truth/implementation
review of Thong's draft; this is it. Checked against `main` as merged this
morning, not against memory.

**Overall: it holds up.** I went looking for claims the code would not support
and found one factual problem, one omission worth filling, and a handful of
small things. The honesty discipline in it is better than mine was — the
commented-out mentor template with an instruction not to publish it unless a
real session happened is the right call, and the line *"The evidence below
comes from our own implementation and release checks. It is **not** external
student validation, and we do not present it as such"* is exactly the sentence
that keeps us out of trouble.

---

### 1. The contribution table is wrong, and it under-credits everyone

This is the one thing I would not let through. `README_PLAN.md` §9 says all
three of us approve our own row, so here is mine corrected — and Thong's,
because his is understated too.

**What the table says now:**

> **Thong Shuheng** — App navigation; Week, Recover and Asks flows; deployment
> and route review; selectable hand-back choice; ideation, impact and final
> README integration
>
> **Ku Kian Xiang** — Today and Compare flows; workload calculation and request
> interpretation; decision reliability; method, limitations and technical
> README sections

**What git says.** `/week`, `/recover` and `/asks` were first committed by me
on 8 September (`011251d`, `580e55c`, `871844d`), as were `/`, `/today`,
`/compare` and `/method` — all seven routes. Thong then rebuilt Week into the
living 28-day view, built the shell and navigation that all of them now sit
inside, reframed the supporting routes, and added the selectable hand-back.
Both halves of that are real work and the current wording erases one of them.

Suggested rows, which I think are fair to all three:

| Member | Main responsibilities |
|---|---|
| **Thong Shuheng** | The app shell, navigation and demo deep-links; rebuilt Week into the living four-week view; supporting-route framing for Recover, Asks and Method; the selectable hand-back; deployment and route QA; ideation, impact, and final README integration |
| **Lim Wey Cheng** | Landing-page story and visual system; the decision preview; brand assets, motion and mobile presentation; final screenshots |
| **Ku Kian Xiang** | The initial prototype and all seven routes; the load engine, message parser and seeded weeks; the decision contract — pricing, accept/decline, hand-back; the voice gate and the automated release check; Today and Compare compositions; method, limitations and technical README sections |

If that reads as too much for one row, cut mine rather than leave the routes
mis-attributed — but the sentence "Week, Recover and Asks flows" under Thong
alone is the part that is actually inaccurate.

### 2. The validation table is missing its best row

The "Validation and what changed" table lists five checks. It omits the three
defects that were only found by **rendering the pages**, which is the most
interesting thing in our QA story because none of them were visible in source
and all three had shipped:

| What we checked | What we found | What improved |
|---|---|---|
| Looking at the built pages, not just the tests | The four-week forecast chart had never drawn a bar — a CSS height resolving against nothing. An open sheet was being painted over by the page behind it. The carry bar's track was invisible against the card it sat on | All three fixed, and the whole sweep became `npm run check:release` so it cannot regress silently |

That row is worth adding because it answers the obvious question *"you have 170
tests, why did you still have bugs?"* before a judge asks it. `npm run verify`
proves the code compiles and the tests pass and says nothing about whether
anything is visible. Source: `docs/evidence.md`, *The decision contract*.

### 3. Verified correct — no change needed

- **No stress or wellbeing claim anywhere in the draft.** I grepped for
  stress, capacity, wellbeing and diagnosis. "Capacity" appears twice — in the
  dropped-ideas table, and in the body at line 119 saying Pikul works *"rather
  than claiming to know a student's maximum capacity"* — which is the refusal,
  not the claim. This is the trap `BRIEF_COVERAGE.md` warns about and the draft
  walks past it cleanly.
- *"Kept free and handed back had been mixed up"* — true, and documented in the
  `PROJECT_STATUS.md` merge table.
- *"protection wording did not fully match the rules"* — true. The landing page
  claimed we protect "health needs", a category that has never existed in the
  model, while omitting commuting, which we really do protect. Fixed 10 Sep,
  and `putdown.test.ts` now asserts every landing string that makes the claim
  against `suggestPutDown` itself.
- *"Accepting, declining and handing back now produce one consistent result"* —
  true. The store dedupes on `intentId`, and `check:release` presses "I said
  yes" three times and asserts the shift is booked once.
- *"Essential actions now work by keyboard, and cancelling does not change
  saved data"* — true, and asserted from `localStorage` rather than from the
  screen.
- The roadmap's **Next** row — a campus test plus a weekly *"did this feel
  heavier than usual?"* check — matches the check-in we scoped and deferred,
  and matches what I wrote as the experiment that would settle the method.
- *"works in one browser without an account, database or paid runtime
  service"* — true. No `fetch`, no SDK. One `process.env` reference exists, in
  `app/layout.tsx`, used at build time for link-preview metadata.

### 4. Small things

- **The pitch line.** *"See what a new 'yes' will cost before you give it."* is
  the best single sentence anyone has written for this project. I would put it
  in the video script verbatim.
- **The roadmap's Now row could name `/method`.** It currently lists
  capabilities — personal baseline, request preview, decision choices,
  hand-back, four-week view — which is a reasonable way to write it. I would
  still add the route by name somewhere, because it is the one that makes the
  honesty claims checkable, and a judge who finds it is more likely to read it.
- **"Thong Shuheng"** — the repo's git author name is "Shu Heng". Worth
  settling which spelling goes in a public README.
- The draft carries three internal comment blocks. They are correctly marked,
  but `README_PLAN.md`'s own guardrail list has "no placeholder" on it, so
  they need stripping at integration rather than at the end.

### 5. What I could not review

`docs/readme-draft-lim.md` does not exist, so the third leg of the cross-review
matrix is not reviewable yet. Lim's sections carry the Impact problem-context
row (5 marks) and all 10 Design marks. That is the largest unwritten block in
the submission.
