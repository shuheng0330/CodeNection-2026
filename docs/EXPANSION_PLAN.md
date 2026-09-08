# Pikul — Expansion Plan: 2 screens to 9 routes

**Author:** workstream A · **Date:** 8 Sep 2026 · **Deadline:** 13 Sep 2026, 23:59 MYT
**Status:** DRAFT — for review before implementation

---

## 0. What changed, and why this plan exists

Three pieces of research landed on 8 Sep. Four findings reset the assumptions in `PLAN.md`:

1. **The prototype deliverable is a ≤5-minute video, not a live demo** (CodeNection 2025 T&C; 2026 format assumed identical). Top 40 qualify, 10 per track. Grand Finals is 10 min pitch + 5 min Q&A. *Consequence: the signature moment must be legible in a compressed video, possibly muted. Subtle motion craft is invisible; shape change is not.*
2. **Our engine is already a published method.** `hours × intensity` is session-RPE (Foster). The 2016 IOC consensus on load explicitly includes psychological load and travel. *Consequence: stop describing the model as a borrowed analogy; it is an application of an established definition.*
3. **The brief's central verb is preventive** — "before burnout hits", "until it's too late" — and the product is currently entirely retrospective. *Consequence: the forward horizon is the single biggest gap, not a nice-to-have.*
4. **Small multiples beat animation on mobile** for trend comparison (n=96, controlled, own phones). *Consequence: do not animate the forecast. Show panels.*

`PLAN.md` argued for staying at two screens. That was a defensible call against padding, but it under-serves the brief on three named demands (forward horizon, recovery, the "load balancer"). This plan expands to **9 routes but only 4 tabs**, which is how every mature product in this space is actually structured — Oura went 5 tabs to 3, Structured ships 4.

---

## 1. Route map

| # | Route | Nav | Purpose | Judge-visible moment |
|---|---|---|---|---|
| 1 | `/` | — | Landing. **Unchanged except mesh-blob tuning.** | Understand |
| 2 | `/today` | **Tab 1** | Now. Sentence, band, area breakdown, one put-down. | See + Explain |
| 3 | `/week` | **Tab 2** | Four weeks ahead. Collision detection. Rebalance flow. | **Prevent** |
| 4 | `/asks` | **Tab 3** | Every ask priced, and what you did. | Practice |
| 5 | `/recover` | **Tab 4** | Reclaimed hours become a specific plan. | Recover |
| 6 | `/compare` | from `/today` | **The signature moment.** Two students, identical week, opposite verdicts. | Prove the thesis |
| 7 | `/history` | from `/today` | 12 weeks behind, warm-up period marked honestly. | "It built up quietly" |
| 8 | `/method` | from every number | The maths, the sources, and the limitations. | Credibility |
| 9 | `/start` | first run | Onboarding. Declared baseline solves cold start. | Feasibility |

**Four tabs, labelled, always visible text.** NN/g: hidden nav cuts task completion 21%; icon-only forces guessing. The No Button stays a persistent action reachable from anywhere — it is interruption-driven (a WhatsApp message arrives) and must not cost a tab slot.

---

## 2. Engine work (do this first — everything depends on it)

### 2.1 `carrySeries()` — incremental EWMA
Naive per-day `computeCarry` measured at **78ms for 84 points**. Single-pass incremental EWMA is O(n).
```ts
carrySeries(events, asOf, days): { date, ratio, acute, chronic, warm: boolean }[]
```
`warm` is false while fewer than `CHRONIC_DAYS` of history precede the point. **This is not cosmetic** — see §2.2.

### 2.2 Warm-up honesty
Measured on our own seed: weeks 1–3 read 1.57 / 1.90 / 1.45 for the three personas. That is the EWMA initial-load artefact, not a real crisis. Documented in the ACWR critique literature.

**Rule: never render a ratio for an un-warm point as though it were real.** `/history` draws it as a dashed, greyed segment labelled "still learning your normal". WHOOP and Oura both do exactly this — Oura's Resilience is *absent*, not empty, until 5 days of data exist.

### 2.3 Declared baseline (cold start)
The insight worth stating in the pitch: *a footballer's baseline must be observed over 28 days; a student's baseline is a published document.*
```ts
declaredBaseline(recurring: Recurring[]): number     // steady-state weekly load
blendedChronic(declared, observed, n, k = 14): number // (k·declared + n·observed)/(k+n)
```

### 2.4 Sleep debt as a capacity modifier — fills the "physical" gap
The brief names five areas: mental, time, physical, social, errands. We model none of "physical".

One input a day (hours slept), a personal sleep need set once, a **rolling 14-night debt** (Rise Science's method; Van Dongen 2003 for the dose-dependent science).

**Critically: debt reduces the denominator, not the numerator.**
```ts
sleepDebt(nights, need, window = 14): number
effectiveChronic(chronic, debt): number   // capacity shrinks as debt grows
```
Produces the sharpest line in the product: **"Your week isn't heavier than usual. You are."**

Guardrails: self-reported sleep is a *stated* input, not a measurement. Say so on `/method`. Do not draw a hypnogram. Do not add steps, workouts or any body metric — that turns us into a fitness tracker and loses the brief.

### 2.5 Collision detection
```ts
collisions(events, asOf, windowHours = 96): Collision[]
```
Pure date arithmetic, no model risk. A ratio of 1.4 is abstract; **"four things land in four days"** is not.

### 2.6 Free-slot finder (for `/recover`)
```ts
freeBlocks(events, asOf, minHours = 2): Block[]
```

---

## 3. Screens

### 3.1 `/compare` — the signature moment
**Two ropes stacked vertically** (not side by side — mobile). Each carries a faint dotted ghost line at its own resting sag: that student's normal.

1. Screen asks: **"Which one is closer to breaking?"** Viewer commits by tapping a rope.
2. One tap adds an **identical** set of commitments to both ropes.
3. Both sag by exactly the same distance. **One crosses its ghost line. The other doesn't.**

Why this is first: it is prediction-then-reveal, the highest-retention pattern in data journalism; it survives a muted video because the *shape* changes; it makes the viewer publicly wrong; and it answers "what if you removed the AI?" — there was never any.

**Risk to manage:** if the ghost lines look arbitrary, it reads as rigged. Show where the baseline came from — 28 days of that student's own data — immediately after the reveal, or a sharp judge kills it in Q&A.

Reuses `CarryLine`. One shared spring value with a per-rope offset — never two independent spring instances.

### 3.2 `/week` — four weeks ahead
- **Four small-multiple panels, shown at once. Not animated.** (n=96 study.)
- Collision callout: *"Week 11 is a wall. Four things land between the 3rd and the 6th."*
- **No Button drops four copies at once** — press it and the card splits into four identical copies falling onto the next four weeks simultaneously. Teaches that a yes is never one yes. One shared spring, per-rope offset.
- `/week/rebalance` — the brief's named "load balancer". Two literal operations: **group** (batch errands into one trip) and **push back** (defer to a later week). Sunsama's proven pattern, but against a *learned* threshold rather than a self-set one.

### 3.3 `/asks` — the decision log
Every ask, what it would have cost, what you chose. Plus the running total of hours handed back and where they went.

**Bounds (a real shipping product) is built almost entirely on this loop and has no capacity model at all.** That is our wedge: they can script the no, we can price it.

**Rule: a genuine yes is celebrated exactly as much as a no.** Same button weight, same log treatment. A screen that scores you on declines is actively harmful for a people-pleasing population.

### 3.4 `/recover` — reclaimed hours become a plan
Not a content library. Not a breathing circle. A **specific, concrete offer in the user's own units, with the cost already paid**:

> "Thursday 6–9pm is the only unclaimed block in your next ten days. Nothing is due Friday."

If-then format (implementation intentions, d≈0.65 across 642 tests), grounded in behavioural activation (activity scheduling, d=0.87), which balances pleasure and mastery — exactly the brief's "sleep, downtime, or a hangout".

**The absence of tracking is the design feature.** The moment we log whether they rested, we have rebuilt the streak.

### 3.5 `/history` — 12 weeks behind
- **Delta-from-baseline, two-tone area.** Plot the *gap*, not the value, so the zero line *is* the baseline and it moves with you. Rust above, dusk below.
- Highlight only **sustained** excursions, not daily wobble. A four-week rust wash is a paragraph of narrative with no words in it.
- **Annotated milestones** — midterms, the week extra shifts appeared, mid-sem break. A curve without event markers is a squiggle.
- Warm-up weeks dashed and labelled (§2.2).

### 3.6 `/method` — credibility
The EWMA, λ=2/(N+1), the session-RPE lineage, the IOC load definition — **and the limitations, named by us first**: mathematical coupling, contested predictive validity, thresholds never validated for academic load, and no published work applying ACWR outside physical training. Volunteering the strongest objection is what makes the rest credible.

Linked from every number. Not a tab — no mature product has a methodology tab.

### 3.7 `/start` — onboarding
Timetable + standing shifts + commute + sleep need. Under 90 seconds. Produces a declared baseline so the product works on day one.

Name the phase and put a date on it: *"Pikul is learning your weeks. Your own normal will be ready around [date]."* Reframes the wait as evidence of personalisation rather than a defect.

---

## 4. Landing page — minimal change

Keep the hero. Two adjustments only:
- **Mesh blobs: three → two, cut contrast** until no individual blob is identifiable as a shape. Saturated multi-hue mesh is on the 2026 "over it" lists; a warm wash reading as *paper stock* is not. If a screenshot reads "gradient" it's too much; if it reads "paper" it's right.
- Keep the grain — lo-fi print texture is a current 2026 trend, and it is what rescues the blobs.

---

## 5. Do-not-build list

| | Why |
|---|---|
| Fake "analysing…" delay or spinner | Manufactures the appearance of a model while paying the AI-wrapper cost. Correct Q&A answer: *"there is no inference."* |
| Typewriter / streaming text | Universally reads as LLM output. **This removes PLAN.md's B2 spec of an 18ms character stagger on the decline message.** Show it instantly as a visibly filled-in template — that *proves* there's no model. |
| GitHub-style contribution grid | Rewards work on consecutive days — the exact behaviour we exist to stop. Makes load look like an achievement. |
| Spotify-Wrapped semester recap | Monzo shipped one; called shaming, escalated to the Financial Ombudsman. Our data is shifts and caregiving, not leisure. |
| Bento grid for data screens | Cliché in 2026 and functionally wrong — asymmetric tiles fight uniform scanning. |
| Balance scale / beam | A scale is an instrument of *judgement*. Makes the app the arbiter and the student the thing weighed. Also the most obvious visual in a wellbeing track. |
| Water level / gauge / ring / dial | A gauge in a costume. Bounded, implies an invented maximum, invites "is 73% bad?". The rope is superior because it is unbounded and relative. |
| Streamgraph, radial/spiral, horizon chart | Shifting baseline unreadable; spiral is a known dataviz liability; horizon needs training and dozens of series. |
| Toppling stack, tear-off paper receipt | Needs a physics engine; reads as a game; skeuomorphism is 2011. |
| Confetti, streaks, celebration bursts, sound | The user just declined something out of exhaustion. |
| Count-up number tickers | Duration without information; makes small numbers look dramatic. |
| Hover-dependent flourish (3D tilt, custom cursors) | Dead on the target device. |
| Scroll-jacking | NN/g: majority disoriented; avoid on mobile entirely. Scroll drives *position*; tap drives *state*. |
| Dark mode toggle | Off-brief, doubles palette QA the week before finals. |

---

## 6. Build order

**Engine before screens.** Every screen below depends on §2.

| Order | Item | Est. | Rationale |
|---|---|---|---|
| 1 | `carrySeries` + warm-up flag | 2h | Blocks `/history`, `/week`, `/compare` |
| 2 | Nav shell + 4-tab bar + route stubs | 3h | Unblocks parallel screen work |
| 3 | Rope lands **on** the line when you hand back | 3h | Cheapest, de-risks the spring, purely positive |
| 4 | `/compare` Twin Rope + prediction prompt | 10h | **The signature moment** |
| 5 | `/week` small multiples + collisions | 8h | Closes the biggest gap vs the brief |
| 6 | Sleep debt engine + input | 5h | Fills "physical" |
| 7 | `/recover` | 5h | Brief's final clause |
| 8 | `/asks` | 4h | Differentiation |
| 9 | `/history` delta-area + annotations | 6h | The thesis, made concrete |
| 10 | `/method` | 3h | Credibility, mostly prose |
| 11 | `/start` | 5h | Feasibility + cold start |
| 12 | Annotation & direct-labelling pass | 4h | Same data, better communication |
| 13 | a11y pass + reduced-motion + Android profiling | 5h | Currently failing |

**Cut order if short:** `/start` → `/method` (fold into README) → `/asks` → `/history` → sleep debt.
**Never cut:** `/compare`, `/week`, the deployed URL, the mobile layout.

---

## 7. Open questions for review

1. Is 9 routes still padding? The IA research says 4 tabs max; we have 9 routes behind 4 tabs. Does that hold up, or does a judge count routes?
2. Sleep debt reduces the *denominator*. Is that mathematically defensible given ACWR's existing coupling problem, or does it make the ratio worse?
3. `/compare` uses two seeded personas. Does a judge read that as rigged regardless of how we show the baseline?
4. Is `/asks` real without persistence beyond localStorage?
5. Build order assumes ~58h. Deadline is 5 days away with one developer. What actually gets cut?
