# Pikul — phase plan to 13 September

Three lanes, six days. Every Phase 1 task starts without waiting for anyone.

**Assumption:** Thong is team leader and holds the Vercel account; Lim takes the
landing and visual system. Swap the labels if that is wrong — the dependency
structure holds either way.

---

## Verified against the 2026 documents

Checked against the [2026 T&C](https://itsocietymmu.com/wp-content/uploads/2026/06/terms-conditions-codenection-2026.pdf),
the [2026 Handbook](https://drive.google.com/file/d/1QfYvryftsj6xutkkRqge2yYxcMvCvCTa/view)
and the event page — not carried over from last year.

| | |
|---|---|
| Prototype submission | **13 Sep**. Handbook wants the **GitHub repo link *and* a video of at most 5 minutes**. Late submissions are not entertained. |
| Who submits | Team leader only, one submission per phase |
| Advancing | **Top 30 — 10 per track, 3 tracks.** The website still says 40; that is stale 2025 copy from when there were 4 tracks |
| Judging | 14–20 Sep · finalists announced **21 Sep** |
| Building Phase | **21 Sep – 11 Oct** · repo + deployed link (deployed marked optional) |
| Deployment Phase | **12–31 Oct** · live for public use, **user guide due 31 Oct**. Only bug fixes — shipping new features is a documented disqualification ground |
| Grand Final | **15 Nov 2026**, physical, venue TBA. 10 min pitch + 5 min Q&A. **All members must attend in person; no substitutions** |
| Originality | Work must be created after the 30 Aug problem release. Our first commit is 6 Sep — clean. Declare external code and libraries |

**Three things worth correcting out loud, because we had them wrong:**

1. **A deployed link is *optional* at this stage**, not a hard requirement — the
   T&C says "(if it exists)". We should still deploy on day one, because Design
   (10%) is judged from a viewable page and because screenshots, the video and
   student validation all need a URL. But it is leverage, not a rule.
2. **No unlisted-YouTube rule and no filename convention exist** in any official
   document. Check the Google Form itself before assuming a format.
3. **"Best Presentation" and "Most Impactful Project" no longer exist** — those
   were 2025. 2026 has 1st/2nd/3rd per track plus Best Female Team, and **a team
   may claim only one prize.**

Two contradictions in the official documents worth raising with the organisers:
the top 30 vs 40 discrepancy, and **IP ownership** — the website FAQ says the
team keeps it, T&C §8.5(b) says the organiser owns everything submitted, and the
T&C is the binding document.

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

- **Thong — deploy to Vercel from `main` (1h).** No env vars needed.
  **Blocks README, screenshots, video, student validation.**
- **Thong — book the mentor slot (15m).** Mentorship runs 7–13 Sep alongside the
  prototype phase. Worth 7%, and the only item that can become *impossible*
  rather than merely late.
- **Ku — merge `Xiang-a-core-flow` into `main` (15m).** Announce two frozen-file
  changes: `chrono-node` added, and `verify` now runs lint.

## Phase 1 — Parallel build · 8–10 Sep

Every task here needs nothing from anyone else.

**Ku** — accessibility across 7 routes (6h): focus trap, focus return and Escape
in both sheets, `useReducedMotion` in NoButton and AddCommitmentSheet, and a
text alternative on CarryBar (the product's main output is currently invisible
to a screen reader). Shared app nav (3h). Eighth route — the post-commitment
check-in (3h), which is the brief's literally-named *stress tracker*.

**Lim** — identity assets (2h): favicon, `opengraph-image`, delete the five
scaffold SVGs, add `metadataBase`. Put-down section and No Button scene (4h) —
show the drafted reply **instantly**, because typewriter text reads as "an LLM
wrote this". Mesh tuning from 3 blobs to 2, and a 390px pass on a real
Android (3h).

**Thong** — decision log (2h), README sections 2–8 (5h) with `TODO:URL` and
`TODO:SHOT` markers, breadth comparison table (1h).

## Phase 2 — Evidence · 10–11 Sep

First real cross-dependencies, and they run one way only.

**Ku** — draft the technical prose into `docs/` for Thong (3h). Demo reliability
across 8 routes (2h). **Lim** — mindmap, problem tree and user flow as Mermaid
in `docs/ideation/` (4h). **Thong** — student validation on the deployed URL,
3–5 undergrads on their own phones (2h); mentor writeup (1h); assemble the
README (3h).

## Phase 3 — Freeze and film · 12 Sep, freeze 23:00

Whole team. The deliverable is a video, so this day outranks any screen.

Slides and script (Thong, 3h) — open on the comparison, not the problem
statement. Ku drives the demo and rehearses five times, because Ku can answer a
question mid-run. Lim takes screenshots from the deployed URL **at 640px or
wider**, or the grain overlay is hidden and the page loses its texture. Then
record a full take, watch it back, and re-record.

## Phase 4 — Submit · 13 Sep, six hours early

Build nothing.

| Check | Owner |
|---|---|
| Repo link and video both in the form | Thong |
| Video under 5:00 and plays for a signed-out viewer | Thong |
| Deployed URL opens on mobile data | Lim |
| Every link works signed out | Thong |
| `npm run verify` green on `main` | Ku |
| Click path survives five repeats | Ku |
| Dependencies declared in the README | Ku |
| Form submitted | Thong |

## Phase 5 — After the prototype round

This round is not the end, and the schedule after it is longer than the build.

- **21 Sep – 11 Oct · Building Phase.** The real product window. Everything cut
  from this week — `/history`, onboarding, the landing scene — belongs here.
- **12–31 Oct · Deployment Phase.** Live for public use. **Bug fixes only;
  shipping new features here is a listed disqualification ground.** User guide
  due 31 Oct. Gather feedback through GitHub issues or an in-app form — it has
  to be verifiable.
- **1 Nov judging · 15 Nov Grand Final**, physical, all three of us present.
  10 min pitch, 5 min Q&A. Ku must be able to defend the engine cold: why a
  seven-day weighted average over a twenty-eight-day one, why the put-down ranks
  by weight rather than by how far it moves the number, and why there is no
  model. The problem statement permits AI tooling but requires the team to
  understand what it submitted.

---

## Why this cannot deadlock

1. **One bottleneck, and it is first.** Only the deploy is shared, it takes an
   hour, and everything else in Phase 1 needs nothing.
2. **Placeholders, never pauses.** The README carries `TODO:` markers from day one.
3. **No shared files.** Disjoint paths; `copy.ts` partitioned; nav owned by Ku.
4. **Dependencies point one way.** Code and diagrams feed the README, never back.
5. **The heaviest lane got lighter.** Thong carries roughly 60% of the score, so
   Ku writes the technical prose and Lim draws the diagrams — both in their own
   lanes, both removing a handover Thong would otherwise have to chase.
6. **Small PRs, merged the day they are done.** `ku-*`, `lim-*`, `thong-*` into
   `main`, one deliverable each, `npm run verify` green before opening. There is
   no integration day because there is nothing to integrate.

## Cut order, agreed now

Cut: eighth route → nav polish → landing No Button scene → third ideation
diagram → student validation. Anything cut here moves to the Building Phase,
which is three weeks long — so cutting now costs less than it looks.

**Never cut:** the README · the video · the mobile layout · the accessibility
pass · a viewable deployed page. Four of those five are not code, which is the
point — there is no rubric line for working software.
