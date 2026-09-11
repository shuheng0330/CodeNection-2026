# Truth and implementation review — Thong's README draft

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

## 1. The contribution table is wrong, and it under-credits everyone

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

## 2. The validation table is missing its best row

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
anything is visible. Source: `docs/evidence/2026-09-09-decision-contract.md`.

## 3. Verified correct — no change needed

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

## 4. Small things

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

## 5. What I could not review

`docs/readme-draft-lim.md` does not exist, so the third leg of the cross-review
matrix is not reviewable yet. Lim's sections carry the Impact problem-context
row (5 marks) and all 10 Design marks. That is the largest unwritten block in
the submission.
