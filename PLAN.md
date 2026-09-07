# Pikul — Parallel Build Plan to 13 September

**Deadline: 13 Sep 2026, 23:59 MYT** · Google Form, team leader submits · repo must be **public** before submitting

> **How to use this document.** Everyone reads §0 and §1. Then each person reads **only their own section** (§2, §3 or §4) — those sections are deliberately self-contained and repeat whatever they need, so you can paste your entire section into your coding agent as a single brief without it needing any other part of this file.

---

## §0 — Shared context (everyone reads once)

### What we're building

**Pikul** (Malay: *to shoulder a load*; also a historic South-East Asian unit of weight) — a load manager for university students. Lifestyle track, **Stress & Workload Manager** problem statement.

**The core idea.** Burnout isn't an absolute amount of work — it's a spike *relative to your own normal*. Pikul adapts **ACWR** (acute:chronic workload ratio) from sports science: an exponentially-weighted average of your last 7 days measured against your rolling 28-day baseline. Every commitment — an assignment, an 8-hour shift, a 90-minute commute, a family weekend — converts into one comparable measure, so they can finally be traded against each other.

It is deterministic arithmetic. **No LLM, no API calls, no prediction model.** That is deliberate: 2026 judges are documented as fatigued by AI wrappers, and our differentiation must survive the question *"what if you removed the AI?"*

**Second feature — The No Button.** Every competing app is retrospective: it shows the damage after you already said yes. Pikul owns the decision point instead — it prices a proposed commitment against the weeks ahead (*"saying yes puts you at 118% of a usual week in week 11"*) and drafts the decline for you.

**Target user:** Malaysian undergraduates juggling classes, part-time shifts, long commutes and family obligations. Never "everyone" — the rubric explicitly penalises a broad audience.

### The scoring reality

The prototype rubric has **no category for working code.**

| Category | % | Judged from |
|---|---|---|
| Ideation | **25%** | README + ideation assets |
| Impact | **20%** | README + video |
| Creativity & Novelty | **15%** | README + video |
| Feasibility | **15%** | README |
| Presentation | **15%** | Video |
| Design | **10%** | Deployed page |

**60% of the total is README + video.** Person C's job is the highest-scoring role on this team, not the leftover one.

### Four rules nobody may break

**Rule 1 — clinical vocabulary never reaches a user.** No "ACWR", "acute", "chronic", "burnout", "streak", no percentages, no 0–100 score. Users read plain language built on the word *carrying*. Every user-facing string lives in `lib/copy.ts`. Enforced by `npm run gate`, which fails if a banned term reaches a readable string. Our pitch line: **show the maths to judges, never to the user.**

**Rule 2 — never suggest dropping class, coursework or family.** `lib/engine/putdown.ts` only ever recommends handing back shifts, favours and optional commitments. Telling a Malaysian student to skip their cousin's wedding is a bug, not advice.

**Rule 3 — no LLM in the product.** Decline templates are deterministic: offline, instant, no API key to leak, no latency on stage, no chance of generating something unhinged in front of a judge.

**Rule 4 — no AI attribution in commits.** Plain messages describing the change. No co-author trailers.

### Setup (identical for all three)

```bash
git clone https://github.com/shuheng0330/CodeNection-2026.git
cd CodeNection-2026
git checkout Xiang
npm install
npm run dev            # http://localhost:3000
```

**All dependencies are already installed. Nobody edits `package.json`.** If you genuinely need a new package, say so in the group chat first — two people adding dependencies simultaneously is the most common merge conflict on a team this size.

---

## §1 — Why nobody waits for anybody

The repo has been prepared so that **all three people can start at minute zero and never block each other.** Concretely:

**1. Every shared foundation is already built, tested and pushed.** The engine, the forecast, the store, the seeded demo data, the design tokens, the motion tokens and the shared components all exist on branch `Xiang` right now. Nobody is waiting on anybody's implementation — you are all building *on top of* finished work, not *next to* unfinished work.

**2. Shared components were moved out of contested folders.** `Reveal` and `SplitText` now live in `components/shared/`. Previously `/today` imported `Reveal` from `components/landing/`, which would have meant Person A breaking every time Person B refactored. That coupling is gone.

**3. `lib/copy.ts` is partitioned by owner.** Each block carries an `OWNER:` comment. Add strings to your own block only.

**4. Person C never waits for running code.** Every artefact C needs — decision log, ideation diagrams, README prose, breadth writeup — can be written today. The three things C *cannot* produce alone (deployed URL, screenshots, mentor feedback) are handled with explicit placeholders and slotted in last. See §4.

**5. No big-bang merge day.** Everyone opens small PRs into `Xiang` continuously. There is no scheduled "integration day" where three branches meet for the first time.

### Ownership map

| Path | Owner | Everyone else |
|---|---|---|
| `lib/engine/`, `lib/seed/`, `lib/store.ts` | **A** | read-only |
| `app/today/`, `app/week/`, `app/settings/`, `components/app/` | **A** | do not open |
| `app/page.tsx`, `app/globals.css`, `components/landing/`, `public/` | **B** | do not open |
| `README.md`, `docs/`, `PLAN.md` | **C** | do not open |
| `lib/copy.ts` | **partitioned** — edit only the block tagged with your letter | |
| `components/shared/`, `lib/motion.ts`, `lib/utils.ts`, `lib/decline.ts` | **frozen** | announce in chat before touching |
| `package.json`, `tsconfig.json`, `next.config.ts` | **frozen** | announce in chat before touching |

If you find yourself needing to edit a file you don't own, **stop and post in the group chat.** That is the only rule that prevents this plan from degenerating.

### Integration protocol

```bash
git checkout Xiang && git pull          # start of every session
git checkout -b Xiang-a-week            # your own short-lived branch
# ... work ...
npm run verify                          # MUST pass before you push
git push -u origin Xiang-a-week         # then open a PR into Xiang
```

Branch naming: `Xiang-a-*` for A, `Xiang-b-*` for B, `Xiang-c-*` for C. Merge into `Xiang` as soon as a task is done — do not batch several tasks into one giant PR.

---

## §2 — PERSON A · Engine & App Screens

> Self-contained brief. Everything you need is below.

**Mission:** make the demo *provably real*. A judge who taps "add a commitment" and watches the curve genuinely move learns more than any explanation could deliver.

### Files you own — create and edit freely

```
lib/engine/**          lib/seed/**          lib/store.ts
app/today/**           app/week/**          app/settings/**
components/app/**
lib/copy.ts            ← ONLY the blocks tagged "OWNER: A"
```

### Files you must never open

`app/page.tsx` · `app/globals.css` · `components/landing/**` · `public/**` · `README.md` · `docs/**` · `package.json`

### What already exists — import it, do not rebuild it

```ts
// lib/engine/types.ts
type LoadCategory = "class"|"assignment"|"shift"|"commute"|"family"|"social"|"club"|"admin";
type Intensity = 1|2|3|4|5;
type BandKey = "light"|"usual"|"busy"|"heavy"|"toomuch";
interface LoadEvent  { id: string; date: string /* yyyy-MM-dd */; category: LoadCategory;
                       title: string; hours: number; intensity: Intensity; source: "seed"|"user" }
interface DailyLoad  { date: string; load: number }
interface CarryState { acute: number; chronic: number; ratio: number; band: BandKey; dailies: DailyLoad[] }

// lib/engine/acwr.ts
computeCarry(events: LoadEvent[], asOf: Date, days?: number): CarryState
bandFor(ratio: number): BandKey
eventLoad(e: LoadEvent): number          // hours × INTENSITY_WEIGHT[intensity]
dailySeries(events: LoadEvent[], asOf: Date, days?: number): DailyLoad[]
pctOfUsual(ratio: number): number        // 1.18 → 118
const BAND_EDGES = { light: 0.8, usual: 1.1, busy: 1.3, heavy: 1.5 }
const ACUTE_DAYS = 7, CHRONIC_DAYS = 28, HISTORY_DAYS = 84
const INTENSITY_WEIGHT = [0, 0.6, 0.85, 1.0, 1.3, 1.7]   // index = intensity

// lib/engine/forecast.ts
interface WeekPrice      { weekStart: string; label: string /* "week 11" */;
                           ratioBefore: number; ratioAfter: number; pctOfUsual: number }
interface CommitmentPrice{ weeks: WeekPrice[]; worst: WeekPrice; verdict: "fits"|"tight"|"costly" }
priceCommitment(events: LoadEvent[], candidate: LoadEvent, asOf: Date, currentWeek: number): CommitmentPrice
const FORECAST_WEEKS = 4
const ASK_WEIGHTS = { light:{hours:2,intensity:3}, medium:{hours:5,intensity:4}, heavy:{hours:9,intensity:4} }

// lib/engine/putdown.ts
suggestPutDown(events: LoadEvent[], asOf: Date): LoadEvent | null

// lib/store.ts   (zustand + localStorage persist)
usePikul  → { personaId, userEvents, setPersona(id), addEvent(e), reset() }
useCarry() → { persona, asOf, events, carry }     // carry is a CarryState

// lib/seed/generateSemester.ts
demoAsOf(now?: Date): Date                // most recent Wednesday, deterministic per day
generateEvents(persona: Persona, asOf: Date): LoadEvent[]
const CURRENT_WEEK = 10, SEMESTER_WEEKS = 14

// lib/seed/personas.ts
PERSONAS: Persona[]   DEFAULT_PERSONA   personaById(id: string): Persona
// Aisyah (default) · Wei Jian · Nurul

// lib/motion.ts     spring.ui | spring.settle | spring.rope ; stagger.words | stagger.cards
// lib/decline.ts    ASK_KINDS ; draftDecline(kind: AskKind, tone: Tone): string
// components/shared/Reveal.tsx      <Reveal delay={0.1} className="...">…</Reveal>
```

Colour tokens (Tailwind classes, e.g. `bg-clay-600`, `text-ink-muted`):
`linen surface raised hairline · ink ink-muted ink-faint · clay-700 clay-600 clay-500 clay-100 · sage ember amber rust · dusk dusk-100`

**Already built and working, do not rewrite:** `components/app/CarryBar.tsx`, `WeightChip.tsx`, `PutDownCard.tsx`, `NoButton.tsx`, and `app/today/page.tsx`.

### A1 — `/week`, the horizon *(~3 hr, P1)*

Create `app/week/page.tsx` and `components/app/LoadRidge.tsx`.

Four weeks ahead as an area/ridge chart, with the comfortable band drawn as a shaded ribbon behind the curve. Tapping a week reveals what's in it. **This is where "week 11" stops being a number and becomes something about to happen to you.**

- Use `d3-shape` (already installed): `area()` / `line()` with `curveCatmullRom`, rendered into your own `<svg>`. **Do not add Recharts** — its default styling is exactly the clinical register we're avoiding.
- Get the data from `priceCommitment()` — it already returns 4 weeks of before/after ratios and labels. Pass a zero-hours candidate if you only want the "before" curve.
- Band ribbon spans ratio 0.8 → 1.1, using `bg-clay-100`.
- Animate with `motion` (`pathLength` 0 → 1). Import springs from `lib/motion.ts`; do not invent new ones.

**Acceptance:** `/week` renders 4 labelled weeks; tapping one lists its commitments; `npm run verify` passes.

### A2 — Add-commitment sheet *(~3 hr, P1)*

Create `components/app/AddCommitmentSheet.tsx`, mounted from `/today`.

Fields: category (the 8 `LoadCategory` values), title, hours, date, and a 1–5 *"how much does this take out of you?"* dial. Submit calls `usePikul().addEvent({...})` — already implemented, do not modify the store shape.

**Why this matters more than it looks:** it is the proof the engine is real rather than a picture. Seed data is stored as *events*, never as daily totals, precisely so a user-added commitment recomputes the curve for real.

Copy the bottom-sheet pattern from the existing `components/app/NoButton.tsx` so the interaction language stays identical.

**Acceptance:** adding a commitment visibly moves the CarryBar on `/today` and the `/week` curve, with no page reload.

### A3 — Demo hygiene *(~1 hr)*

- `?reset=1` in the URL clears persisted state on mount; plus a "Reset demo" button.
- `?persona=nurul` deep-links a persona (`setPersona`).
- **You will need reset mid-demo.** Do not skip this.

**Acceptance:** `/today?reset=1` restores the opening state; `/today?persona=nurul` loads Nurul.

### A4 — `/settings` explainer *(~1 hr, P2 — cut first if short)*

Create `app/settings/page.tsx`: persona switcher, reset, and **"how we work this out"** — the single screen where showing the method is permitted, still in plain language with a small chart. This is our answer to a judge who asks whether the maths is real.

### Your copy block

All strings go in the `OWNER: A` blocks of `lib/copy.ts` (`BAND`, `TODAY`, `NO_BUTTON`, `priceLine`). Never hardcode a user-facing string in a component. Never write a percentage except `pctOfUsual` in the No Button forecast, which is relative-to-self by construction.

### Done when

```bash
npm run verify        # gate + 13 tests + build, all green
```
Plus by hand: hard-refresh `/today` three times → identical curve; add a commitment → curve moves; `/today?reset=1` → opening state restored.

---

## §3 — PERSON B · Landing & Design

> Self-contained brief. Everything you need is below.

**Mission:** the landing page is the showpiece and roughly 40% of the visual budget. It is the first thing a judge sees and the thing that gets screenshotted.

### Files you own — create and edit freely

```
app/page.tsx           app/globals.css        app/layout.tsx
components/landing/**  public/**
lib/copy.ts            ← ONLY the blocks tagged "OWNER: B"
```

### Files you must never open

`lib/engine/**` · `lib/seed/**` · `lib/store.ts` · `app/today/**` · `app/week/**` · `components/app/**` · `README.md` · `docs/**` · `package.json`

### What already exists — build on it, do not rewrite it

Already working in `components/landing/`: `CarryLine.tsx` (the hero rope), `BuildsQuietly.tsx` (scroll act), `MeshBackdrop.tsx`, `GrainOverlay.tsx`.
In `components/shared/`: `Reveal.tsx`, `SplitText.tsx`.

```ts
// lib/motion.ts — use these, do not invent new springs
spring.ui     = { stiffness: 260, damping: 26 }   // buttons, sheets
spring.settle = { stiffness: 170, damping: 22 }   // cards, reveals
spring.rope   = { stiffness: 90,  damping: 12, mass: 1.2 }  // the hero rope
stagger.words = 0.06     stagger.cards = 0.08

// components/shared
<Reveal delay={0.08} className="…">…</Reveal>
<SplitText text="…" accent="carrying" delay={0.35} />

// lib/copy.ts — your blocks
HERO { eyebrow, headline, headline2, headlineAccent, sub, cta, ctaSecondary,
       restingCaption, heavyCaption, reliefCaption, usualLabel }
QUIETLY { a, b, c, note }
HOW { title, body, points[] }
```

Colour tokens (all defined in `app/globals.css` under `@theme`):
`linen surface raised hairline · ink ink-muted ink-faint · clay-700 clay-600 clay-500 clay-100 · sage ember amber rust · dusk dusk-100`

Type: `font-display` = Fraunces, `font-sans` = DM Sans. Sizes `text-display text-h1 text-h2 text-lead text-micro`. Cards are `rounded-3xl`. Spacing is restricted to `2 3 4 6 8 12 16 20 24 32` — the enforced subset *is* what Visual Consistency grades.

### B1 — The put-down section *(~1.5 hr)*

New section in `app/page.tsx`, between `<BuildsQuietly />` and the how-it-works block.

One idea, stated plainly: Pikul names **one** thing worth putting down — never a ranked list. *The restraint is the product.* A list of five things to drop is just another backlog.

Suggested shape: a single card, `bg-dusk-100/60` with a `border-dusk/25` hairline (dusk is our "relief" colour), one line of Fraunces, and one supporting sentence. Wrap in `<Reveal>`.

### B2 — The No Button phone scene *(~2 hr)*

Create `components/landing/ActNoButton.tsx`, added to `app/page.tsx`.

Sticky-centred phone frame (`rounded-[2.5rem] border-8 border-ink shadow-lift`). Driven by `useScroll({ target, offset: ["start start","end end"] })` over a ~250vh container:

1. A WhatsApp-style bubble slides in from the left — *"eh can you cover Friday 3–11? 🙏"*
2. The Pikul card rises from the bottom with a 4-bar forecast strip, the last bar crossing a dashed "your usual" line
3. The drafted reply types out via a character stagger at ~18ms

**This teaches the second feature to someone who never opens the app.** Hardcode the visual content — do not import from `lib/engine`, that is Person A's territory and you do not need it for a scripted scene.

### B3 — Favicon and OG image *(~30 min)*

Both are still Next.js defaults. Replace `app/favicon.ico`, add `app/opengraph-image.tsx`. The OG image is what judges see when the link is shared.

### B4 — Mobile pass at 390px *(~2 hr)*

Tap targets ≥44px, no horizontal scroll anywhere, verify `prefers-reduced-motion` genuinely settles (it is already wired through every component — confirm, don't assume), visible focus rings. Delete the leftover `public/*.svg` files from the Next.js scaffold.

**Test on a real mid-range Android, not devtools.** The scroll acts are the performance risk.

### Motion discipline — this is a scored design item

- Animate **only `transform` and `opacity`.** Never animate `width`, `height`, `top`, `box-shadow` or `backdrop-filter` on anything that scrolls.
- Wrap every section in the existing `<Reveal>`. Consistency of entrance *is* the polish.
- Maximum 3 mesh blobs. Grain stays hidden below 640px (`hidden sm:block`).
- **Nothing pulses, flashes, shakes or turns red.** An alarm animation contradicts the entire product thesis. The "too much" colour is rust `#B4462F` — never traffic-light red.

### Done when

```bash
npm run verify
```
Plus by hand: at 390px there is no horizontal scroll; scrolling doesn't jank on a real phone; with `prefers-reduced-motion: reduce` every animation settles and nothing loops.

---

## §4 — PERSON C · Documentation & Submission

> Self-contained brief. **You carry roughly 60% of the total score.** Nothing you need is blocked by anyone's code.

### Files you own

```
README.md      docs/**      PLAN.md      slides      the video      the Google Form
```

### Files you must never open

Everything else. You never need to run the app to do items C1–C5.

### How you avoid ever waiting

Three things genuinely depend on other people. Handle all three with placeholders and fill them in last — **never block on them:**

| You need | Write it as | Fill in |
|---|---|---|
| Deployed URL | `<!-- TODO:URL -->` | when Vercel is live |
| Screenshots | `<!-- TODO:SHOT hero -->` | 12 Sep |
| Mentor feedback | a pre-written section with the quote left blank | right after the session |

Everything else — C1 through C5 — you can complete today without opening a single source file.

### C1 — Book the mentor slot — **do this first, today** *(5 min)* — **7%**

First-come-first-serve, 25 minutes maximum, window closes 13 Sep alongside the submission. Book early enough that we can actually act on the feedback: the top band requires it **documented and meaningfully incorporated**, not merely attended.

Immediately after the session, write: what they said (verbatim where possible) → what we changed because of it → why. Feedback we consciously *rejected*, with reasoning, also scores.

### C2 — Decision log *(~1 hr)* — **7%**

Create `docs/ideation/decisions.md`. The kick-off slides say it outright: **"Dead ends are worth points. Document them."** The material already exists — write it up:

- **Travel Planner problem statement — rejected.** AI itinerary generation is fully commoditised (shipped free in Google AI Mode, Gemini, ChatGPT, Booking, Expedia). Layla, the strongest independent player, was acquired by Expedia on 31 July 2026. Expense splitting is owned by Splitwise plus roughly fifteen active clones. There was no defensible differentiation available.
- **Mood journal with streaks — rejected.** Roughly 3% day-30 retention; about 70% of users abandon within 100 days. It is the archetypal app that dies of manual-logging fatigue — precisely the failure this problem statement warns about.
- **0–100 burnout score dashboard — rejected.** Already ships as BurnoutGuard, *and* the problem statement explicitly says "it shouldn't just track and report."
- **Our own first direction, showing the user a percentage — pivoted away from.** We built toward a capacity percentage, then judged it too clinical for students and rebuilt around plain "carrying" language, hiding the maths entirely. **This is a genuine documented pivot with reasoning — the top band for Iteration.**

Frame each as: what we considered → why we dropped it → what it taught us.

### C3 — Ideation assets *(~2 hr)* — **8%**

Top band requires *multi-layered*: a mindmap **plus** a problem tree **plus** a user flow. Mermaid diagrams committed as `docs/ideation/*.md` render natively on GitHub and cost nothing; a FigJam board works equally well. Pick one medium and stay consistent.

- **Problem tree:** root cause "students can't see their total load" → branches into invisibility, no common unit, no baseline, no way to say no → leaves as symptoms.
- **Mindmap:** Pikul at centre → the five load areas the brief names, plus the sixth we added (coordination load) → features.
- **User flow:** open app → read the sentence → see the one thing to put down → someone asks for something → No Button prices it → copy the decline.

### C4 — README *(~2–3 hr)* — carries Impact 20% + Creativity 15% + Feasibility 15%

`README.md` is currently **0 bytes**. The organiser confirmed there is no separate docs file — **everything is judged from this one file.** Structure it to hit rubric lines by name:

1. What it is, one paragraph, plus the deployed link and video link
2. The problem — causes, stakeholders, real-world consequences *(Understanding the problem context, 5%)*
3. Who it's for — specific Malaysian undergrads, never "everyone" *(Target group alignment, 5%)*
4. The insight — burnout is a spike against your own baseline, not an absolute amount
5. How it works — ACWR in plain language, plus *"no prediction model; just your calendar and your own baseline"*
6. **Differentiation table** vs Finch, Motion/Reclaim, BurnoutGuard, Notion *(Differentiation, 3%)*
7. Tech stack and why *(Technical viability, 6%)*
8. Scope: what we built, what we deliberately cut, and why *(Scope realism 5%, Resource awareness 4%)*
9. Ideation — embed the diagrams, the decision log, the mentor writeup
10. The alternatives we generated and compared *(Breadth, 3%)*
11. Team, and how to run it locally

Write sections 2–8 today; they depend on nothing.

### C5 — Breadth of exploration *(~20 min)* — **3%**

We generated 15 distinct concepts before choosing. Full marks needs them **compared with rationale**, not merely listed. A table of name / one-line idea / why we didn't pick it is enough.

### C6 — Slides and video *(~4 hr, with the whole team, 12 Sep)* — Presentation 15%

3–5 minutes, unlisted YouTube, **titled with the team name**. Record from the **deployed URL**, never localhost.

**Demo spine — four beats, rehearse until it's boring:**
1. Hero animation loads
2. `/today` reads *"This week's heavier than usual for you"*
3. The No Button prices a yes and writes the no
4. Switch to **Nurul** — her comfortable band sits at nearly double Aisyah's absolute hours. *Same measure, different normal.* This proves the entire thesis in five seconds.

Record a full take on 12 Sep, watch it back, then fix what looks bad on camera. Things always read differently in a recording.

---

## §5 — Schedule

Everyone starts immediately. No task below waits on another person's output.

| Date | A — Engine & App | B — Landing & Design | C — Docs & Submission |
|---|---|---|---|
| **7 Sep** | A1 `/week` | B1 put-down section | **Book mentor.** C2 decision log |
| **8 Sep** | A2 add-commitment | B2 phone scene | C3 ideation diagrams |
| **9 Sep** | A3 demo hygiene | B3 favicon + OG | C4 README §2–8 |
| **10 Sep** | A4 `/settings` (P2) | B4 mobile pass | C4 finish + mentor writeup |
| **11 Sep** | buffer / bug-fix | buffer / bug-fix | C5 breadth table |
| **12 Sep** | **Feature freeze 23:00.** Whole team: record a full video take, watch it back, fix what films badly, rehearse the click path ×5 | | |
| **13 Sep** | **Build nothing.** Final recording from the deployed URL → screenshots → README links → **submit 6 hours early** | | |

**Deploy to Vercel today** (whoever has the account): import the repo, branch `Xiang`, framework auto-detects Next.js, **no environment variables needed**. Every push then auto-deploys. A live URL removes the entire "it broke on submission night" risk class, and the hackathon requires the app not run only locally.

---

## §6 — Verification

```bash
npm run gate      # fails if clinical vocabulary reaches a user-facing string
npm run test      # 13 engine tests
npm run build     # production build
npm run verify    # all three — run before every push
```

Manual checks before the final submission:

- Hard-refresh `/today` three times → the curve is identical every time
- Add a commitment → the curve visibly moves
- Switch to Nurul → her "usual" sits at far higher absolute hours than Aisyah's
- `prefers-reduced-motion: reduce` → animations settle, nothing loops
- 390px → no horizontal scroll on any page
- The deployed URL loads on a phone on mobile data, not just office wifi

---

## §7 — If we fall behind

Cut in this order: dark mode → onboarding → `/settings` → `/week` → add-commitment → CarryLine drag → phone scene → persona switcher.

**Never cut, at any cost:** the hero animation · `/today` · the No Button · **the deployed URL** · the mobile layout · the copy voice · **the README and ideation assets**.

The minimum viable submission is: hero animation loads → `/today` reads "heavier than usual for you" → the No Button prices a yes and writes the no — working on a phone, at a public URL, with a complete README. Everything beyond that is upside.
