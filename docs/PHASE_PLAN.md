# Pikul — phase plan to 13 September

Three lanes, six days. Every Phase 1 task starts without waiting for anyone.

> A formatted version of this plan is at
> https://claude.ai/code/artifact/9479d0b0-6b17-4aff-af79-a09f5f7fd485

**Assumption:** Thong is team leader and holds the Vercel account; Lim takes the
landing and visual system. Swap the labels if that is wrong — the dependency
structure holds either way.

---

## The three lanes

| | Owner | Paths — nobody else opens these |
|---|---|---|
| Engine, app screens, a11y, technical prose | **Ku** | `lib/**`, `app/{today,week,compare,recover,asks,method}/**`, `components/app/**` |
| Landing, visual system, identity, ideation diagrams | **Lim** | `app/page.tsx`, `app/globals.css`, `app/layout.tsx`, `components/landing/**`, `public/**`, `docs/ideation/**` |
| Deploy, README, mentor, validation, slides, video, submission | **Thong** | `README.md`, `docs/**` (except `ideation/`), Vercel, the Google Form |

`lib/copy.ts` stays partitioned by owner block. **App navigation belongs to Ku**,
so Lim never edits an app screen to change styling — ask Ku for a token change.

---

## Phase 0 — Unblock · 8 Sep, first two hours

Nothing else starts until the deploy is live; four deliverables depend on a URL.

- **Thong — deploy to Vercel from `main` (1h).** No env vars needed.
  **Blocks README, screenshots, video, student validation.**
- **Thong — book the mentor slot (15m).** 7%, first-come, and the only item that
  can become *impossible* rather than merely late.
- **Ku — merge `Xiang-a-core-flow` into `main` (15m).** Announce two frozen-file
  changes: `chrono-node` added, and `verify` now runs lint.

## Phase 1 — Parallel build · 8–10 Sep

Every task here needs nothing from anyone else.

**Ku** — accessibility across 7 routes (6h): focus trap + focus return + Escape in
both sheets, `useReducedMotion` in NoButton and AddCommitmentSheet, and a text
alternative on CarryBar (the product's main output is currently invisible to a
screen reader). Shared app nav (3h). Eighth route — the post-commitment check-in
(3h), which is the brief's literally-named *stress tracker*.

**Lim** — identity assets (2h): favicon, `opengraph-image`, delete the five
scaffold SVGs, add `metadataBase`. Put-down section + No Button scene (4h) —
show the drafted reply **instantly**, because typewriter text reads as "an LLM
wrote this". Mesh tuning 3 blobs → 2 and a 390px pass on a real Android (3h).

**Thong** — decision log (2h), README §2–8 (5h) with `TODO:URL` / `TODO:SHOT`
markers, breadth comparison table (1h).

## Phase 2 — Evidence · 10–11 Sep

First real cross-dependencies, and they run one way only.

**Ku** — draft technical prose into `docs/` for Thong (3h). Demo reliability
across 8 routes (2h). **Lim** — mindmap, problem tree, user flow as Mermaid in
`docs/ideation/` (4h). **Thong** — student validation on the deployed URL, 3–5
undergrads on their own phones (2h); mentor writeup (1h); assemble the README (3h).

## Phase 3 — Freeze and film · 12 Sep, freeze 23:00

Whole team. The deliverable is a video, so this day outranks any screen.

Slides and script (Thong, 3h) — open on the comparison, not the problem
statement. Ku drives the demo and rehearses ×5, because Ku can answer a
question mid-run. Lim takes screenshots from the deployed URL **at ≥640px**, or
the grain overlay is hidden and the page loses its texture. Then record a full
take, watch it back, re-record.

## Phase 4 — Submit · 13 Sep, six hours early

Build nothing.

| Check | Owner |
|---|---|
| Repo is public | Thong |
| Deployed URL opens on mobile data | Lim |
| Every link works signed out | Thong |
| Video unlisted, not private | Thong |
| `npm run verify` green on `main` | Ku |
| Click path survives five repeats | Ku |
| Form submitted | Thong |

## Phase 5 — Finals · conditional

Ku must defend the engine cold — the rules permit AI tooling but require you to
understand what you submitted. Thong rebuilds the pitch for ten minutes at
roughly 30% problem / 70% solution. Lim: bug fixes only, no new features.

---

## Why this cannot deadlock

1. **One bottleneck, and it is first.** Only the deploy is shared, it takes an
   hour, and everything else in Phase 1 needs nothing.
2. **Placeholders, never pauses.** The README carries `TODO:` markers from day one.
3. **No shared files.** Disjoint paths; `copy.ts` partitioned; nav owned by Ku.
4. **Dependencies point one way.** Code and diagrams feed the README, never back.
5. **The heaviest lane got lighter.** Thong carries ~60% of the score, so Ku
   writes the technical prose and Lim draws the diagrams — both in their own lanes.
6. **Small PRs, merged the day they are done.** `ku-*`, `lim-*`, `thong-*` into
   `main`, one deliverable each, `npm run verify` green before opening. There is
   no integration day because there is nothing to integrate.

## Cut order, agreed now

Cut: eighth route → nav polish → landing No Button scene → third ideation
diagram → student validation.

**Never cut:** the deployed URL · the README · the video · the mobile layout ·
the accessibility pass. Four of those five are not code, which is the point —
there is no rubric line for working software.
