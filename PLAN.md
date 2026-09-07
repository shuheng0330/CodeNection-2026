# Pikul — Team Plan to 13 September

**Deadline: 13 Sep 2026, 23:59** · Google Form, team leader submits · repo must be **public**

> Read this first if you're picking up the project. Everything below assumes you know nothing about it yet.

---

## What we're building

**Pikul** (Malay: *to shoulder a load*; also a historic SEA unit of weight) — a load manager for uni students, for the Lifestyle track's **Stress & Workload Manager** problem statement.

**The core idea.** Burnout isn't an absolute amount of work — it's a spike *relative to your own normal*. So Pikul borrows **ACWR** (acute:chronic workload ratio) from sports science: an exponentially-weighted average of your last 7 days, measured against your rolling 28-day baseline. Everything you carry — an assignment, an 8-hour shift, a 90-minute commute, a family weekend — converts to one comparable measure, so things can finally be traded against each other.

It's deterministic maths. **No LLM, no API calls, no prediction model.** That's deliberate: 2026 judges are documented as fatigued by AI wrappers, and our differentiation has to survive the question *"what if you removed the AI?"*

**Second feature — The No Button.** Every competing app is retrospective: it shows you the damage after you already said yes. Pikul owns the decision point instead — it prices a proposed commitment against the weeks ahead (*"saying yes puts you at 118% of a usual week in week 11"*) and drafts the decline for you.

**Target user:** Malaysian undergrads juggling classes, part-time shifts, long commutes and family obligations. Not "everyone" — the rubric explicitly penalises a broad audience.

---

## The scoring reality — read this before you plan your week

**The prototype rubric has no category for working code.**

| Category | % | Judged from |
|---|---|---|
| Ideation | **25%** | README + ideation assets |
| Impact | **20%** | README + video |
| Creativity & Novelty | **15%** | README + video |
| Feasibility | **15%** | README |
| Presentation | **15%** | Video |
| Design | **10%** | Deployed page / mockups |

**60% of the total is README + video.** Both are currently empty. The code we've written earns **zero points directly** — it exists to make the video concrete and the claims credible.

This is why one full person owns documentation. It is not the leftover job; it is the highest-scoring job on the team.

---

## Current status

**Done and pushed** (branch `Xiang`, 44 files):

- ACWR engine with 13 passing unit tests — including one that proves the core thesis: identical hours produce opposite verdicts for two different baselines
- Seeded semester generator: 280 events, fixed PRNG so the demo is byte-identical on every device and after every refresh. Three personas. Current week tuned to read *"heavier than usual for you"* (ratio 1.33)
- Landing page: animated hero (rope sagging under weight cards), scroll-driven "it builds quietly" section, how-it-works
- `/today`: load bar with a "your usual" band, one put-down suggestion, the week's commitments, persona switcher
- The No Button: 3-step sheet, 4-week forecast strip, 12 deterministic decline templates
- Design tokens + a voice gate script that fails if clinical vocabulary reaches a user-facing string

**Not done:** deployed URL · README (0 bytes) · ideation assets · decision log · mentor consultation · slides · video · `/week` · add-commitment sheet · landing put-down + phone-scene sections · mobile pass · favicon/OG image

---

## Who owns what

Assign names, then **stay in your own files.** The ownership split below is designed so three people can work simultaneously without merge conflicts.

| Role | Owns | Name |
|---|---|---|
| **A — Engine & App** | `lib/engine/`, `lib/seed/`, `lib/store.ts`, `app/today/`, `app/week/`, `components/app/` | |
| **B — Landing & Design** | `app/page.tsx`, `app/globals.css`, `components/landing/`, `public/` | |
| **C — Docs & Submission** | `README.md`, `docs/`, slides, video, the Google Form | |

**Shared, edit with care:** `lib/copy.ts` (every user-facing string lives here — tell the others in chat before you touch it).

**Rule: B is one person, not two.** The landing page needs a single visual voice. Splitting it produces something that looks committee-made, and Visual Consistency is 4%.

**If someone drops out:** A takes A+C's code duties, B stays untouched on the landing page, and C's documentation work gets split — never dropped. Cut everything marked P1 immediately.

---

## Person A — Engine & App Screens

**You own the thing that makes the demo believable.** A judge who taps "add a commitment" and watches the curve move learns more than any explanation.

### A1. `/week` — the horizon *(P1, ~3 hr)*
Four weeks ahead as a ridge/area chart (`d3-shape`, we already have it), with the comfortable band as a shaded ribbon behind it. Tap a week to see what's in it. **This is where "week 11" stops being a number and becomes a thing that's about to happen to you.**

Reuse: `priceCommitment()` in `lib/engine/forecast.ts` already computes 4 weeks of before/after ratios. Don't rebuild it.

### A2. Add-commitment sheet *(P1, ~3 hr)*
Type (assignment / shift / travel / family / social / class), hours, date, and a *"how much does this take out of you?"* 1–5 dial. Writes through `usePikul().addEvent()` — already implemented in `lib/store.ts`.

**Why this matters more than it looks:** it's the proof the engine is real and not a picture. Seed events are derived, never hardcoded totals, precisely so this works.

### A3. Demo hygiene *(~1 hr)*
`?reset=1` and a "Reset demo" button. **You will need this mid-demo.** Also `?persona=nurul` for deep-linking.

### A4. `/settings` — "how we work this out" *(P2, ~1 hr)*
The one screen where we're allowed to show the method, still in plain language. This is our answer to a judge who asks whether the maths is real.

**Definition of done:** `npm run verify` passes; adding a commitment visibly moves the curve; reset restores the opening state.

---

## Person B — Landing & Design

**The landing page is the showpiece and roughly 40% of the visual budget.** It's also what a judge sees first, and what gets screenshotted.

### B1. The put-down section *(~1.5 hr)*
Between the scroll act and how-it-works. One idea, stated plainly: Pikul names **one** thing worth putting down, never a ranked list of five. *The restraint is the product* — a list of five things to drop is just another backlog.

### B2. The No Button phone scene *(~2 hr)*
Sticky-centred phone frame. On scroll: a WhatsApp-style bubble slides in (*"eh can you cover Friday 3–11? 🙏"*) → the Pikul card rises with the forecast strip → the drafted reply types out via a character stagger (~18ms). **This teaches the second feature to someone who never opens the app.**

### B3. Favicon + OG image *(~30 min)*
Both are still Next.js defaults. The OG image is what judges see when the link gets shared.

### B4. Mobile pass at 390px *(~2 hr)*
Tap targets ≥44px, no horizontal scroll, verify `prefers-reduced-motion` (already wired throughout — confirm it actually settles). **Test on a real mid-range Android, not devtools.** The scroll acts are the risk.

### Motion rules — these are a design-score item
- Animate **only `transform` and `opacity`.** Never animate `width`, `height`, `top`, or `box-shadow` on anything that scrolls.
- Use the existing `<Reveal>` for every section. Consistency of entrance *is* the polish.
- Max 3 mesh blobs. Grain stays hidden below 640px.
- **Nothing pulses, flashes, shakes, or turns red.** An alarm animation contradicts the entire product thesis. The "too much" colour is rust `#B4462F`, never traffic-light red.

**Definition of done:** looks right on a real phone; nothing janks while scrolling; reduced-motion settles cleanly.

---

## Person C — Documentation & Submission

**You are carrying 60% of the score.** Everything below is worth more than anything left in the codebase.

### C1. Book the mentor slot — **do this today** *(5 min)* — **7%**
First-come-first-serve, 25 min max, closes 13 Sep alongside submission. Book early enough that we can actually act on the feedback — the top band requires it *documented and meaningfully incorporated*, not just attended.

### C2. Decision log *(~1 hr)* — **7%**
The slides say it outright: **"Dead ends are worth points. Document them."** Record what we rejected and *why*:

- **Travel Planner PS** — rejected: AI itinerary generation is fully commoditised (free in Google AI Mode, Gemini, ChatGPT, Booking, Expedia); Layla, the best independent player, was acquired by Expedia on 31 Jul 2026; expense splitting is owned by Splitwise plus ~15 clones
- **Mood journal + streaks** — rejected: ~3% day-30 retention, ~70% abandon within 100 days; it's the archetypal app that dies of manual-logging fatigue, the exact failure this PS warns about
- **0–100 burnout score dashboard** — rejected: already ships as BurnoutGuard, *and* the PS explicitly says "it shouldn't just track and report"
- **Clinical framing of our own product** — pivoted: our first direction showed the user a percentage. We dropped it as too clinical for students and rebuilt around plain "carrying" language. **This is a real documented pivot with reasoning — exactly the top band.**

### C3. Ideation assets *(~2 hr)* — **8%**
Top band requires *multi-layered*: mindmap **plus** problem tree **plus** user flow. Mermaid diagrams committed to the repo render natively on GitHub; a FigJam board also works. Pick one and be consistent.

### C4. README *(~2–3 hr)* — carries Impact 20% + Creativity 15% + Feasibility 15%
Organiser confirmed: **no separate docs file, everything lives in README.md.** Structure it to hit rubric lines by name:

1. What it is, one paragraph
2. The problem, with its causes and stakeholders *(Understanding the problem context, 5%)*
3. Who it's for — specific Malaysian undergrads, never "everyone" *(Target group alignment, 5%)*
4. The insight: burnout is a spike against your own baseline, not an absolute
5. How it works — ACWR explained plainly, plus *"no prediction model, just your calendar and your own baseline"*
6. **Differentiation table** vs Finch, Motion/Reclaim, BurnoutGuard, Notion *(Differentiation, 3%)*
7. Tech stack + why *(Technical viability, 6%)*
8. Scope and what we deliberately cut *(Scope realism 5%, Resource awareness 4%)*
9. Ideation section — mindmap, problem tree, iterations, mentor feedback
10. The 15 alternatives we generated and compared *(Breadth, 3%)*
11. Links: deployed URL, video, slides

### C5. Breadth of exploration *(~20 min)* — **3%**
We generated 15 distinct concepts. Full marks needs them **compared with rationale**, not merely listed.

### C6. Slides + video *(~4 hr, with the team)* — Presentation 15%
3–5 min, unlisted YouTube, **named with the team name**. Record from the **deployed URL**, not localhost.

**Demo spine — four beats, rehearse until it's boring:**
1. Hero animation loads
2. `/today` says *"This week's heavier than usual for you"*
3. The No Button prices a yes and writes the no
4. Switch to **Nurul** — her comfortable band sits at nearly double Aisyah's absolute hours. *Same measure, different normal.* This proves the whole thesis in five seconds.

---

## Non-negotiable shared rules

**1. Never show clinical vocabulary to a user.** No "ACWR", no "acute", no "chronic", no percentages, no 0–100 score, no streaks. Users read plain language built on *carrying*. Every user-facing string lives in `lib/copy.ts`.

Enforced by `npm run gate` — it fails the build if a banned term reaches a string a user could read. Run it before every push.

Our pitch line: **show the maths to judges, never to the user.**

**2. Never suggest dropping class, coursework, or family.** `lib/engine/putdown.ts` only ever recommends handing back shifts, favours and optional commitments. Telling a Malaysian student to skip their cousin's wedding isn't advice, it's a bug.

**3. No LLM in the product.** The decline templates are deterministic on purpose: offline, instant, no API key to leak, no latency on stage, and no chance of generating something unhinged in front of a judge.

**4. No AI attribution in commits.** Plain commit messages describing the change. No co-author trailers.

---

## Day by day

| Date | A — Engine & App | B — Landing & Design | C — Docs & Submission |
|---|---|---|---|
| **7 Sep** | `/week` chart | Put-down section | **Book mentor.** Decision log |
| **8 Sep** | Add-commitment sheet | Phone scene | Ideation assets |
| **9 Sep** | Reset + persona deep-links | Favicon, OG image | README draft |
| **10 Sep** | `/settings` explainer | Mobile pass at 390px | README + mentor feedback written up |
| **11 Sep** | **Merge in the morning.** Full-team integration. Real-device test. **Feature freeze 23:00** | | |
| **12 Sep** | Polish only | Polish only | **Record a full video take, watch it back, fix what looks bad on camera.** Rehearse ×5 |
| **13 Sep** | **Build nothing.** Final recording from the deployed URL → screenshots → README links → **submit 6 hours early** | | |

**Deploy to Vercel today.** Import the repo, branch `Xiang`, framework auto-detects, no env vars needed. A live URL removes the entire "it broke on submission night" risk class, and the hackathon requires it not run only locally.

---

## Verification — run before every push

```bash
npm run gate     # no clinical vocabulary in user-facing strings
npm run test     # 13 engine tests
npm run build    # production build
npm run verify   # all three
```

Also check by hand:
- Hard-refresh `/today` three times — the curve must be identical every time
- Add a commitment — the curve must visibly move
- Switch to Nurul — her "usual" sits at far higher absolute hours than Aisyah's
- `prefers-reduced-motion: reduce` — animations settle, nothing loops
- 390px — no horizontal scroll

---

## If we fall behind — cut in this order

Dark mode → onboarding → auth → `/week` → add-commitment → CarryLine drag → phone scene → persona switcher

**Never cut, at any cost:**
the hero animation · `/today` · the No Button · **the deployed URL** · the mobile layout · the copy voice · **the README and ideation assets**

The minimum viable submission is: hero animation loads → `/today` reads "heavier than usual for you" → the No Button prices a yes and writes the no — working on a phone, at a public URL, with a full README. Everything else is upside.

---

## Getting set up

```bash
git clone https://github.com/shuheng0330/CodeNection-2026.git
cd CodeNection-2026
git checkout Xiang
npm install
npm run dev          # http://localhost:3000
```

Work on your own branch off `Xiang`, and open a PR into it rather than pushing directly, so nobody clobbers anyone.
