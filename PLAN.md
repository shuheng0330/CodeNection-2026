> Historical plan: superseded by [PHASE_PLAN.md](PHASE_PLAN.md) on 8 September 2026. Retained for decision history; do not use its ownership, scope, freeze date, or submission-format claims as current instructions.

# Pikul - Preliminary Round Delivery Plan

**Deadline:** 13 September 2026, 23:59 MYT

**Submission:** Google Form, submitted by the team leader

**Required:** public GitHub repository, complete README, ideation assets, viewable prototype, slides, and a 3-5 minute unlisted YouTube video named with the team name

## 1. Product decision

Pikul will remain a focused **two-page prototype**:

1. `/` explains the problem, personal-baseline insight, one-thing-to-put-down principle, and No Button.
2. `/today` demonstrates the complete interactive product loop.

More pages do not earn marks by themselves. The preliminary-round goal is to prove one clear flow end-to-end:

> See what is making this week heavy -> test a new commitment -> put one negotiable thing down -> reclaim time for recovery.

`/week` is optional polish. `/settings`, onboarding, dark mode, accounts, cloud sync, and real calendar integrations are outside the preliminary-round core.

## 2. Product thesis

**Pikul** means "to shoulder a load" in Malay and also refers to a historic Southeast Asian unit of weight.

Pikul is a workload manager for Malaysian university students balancing coursework, part-time work, commuting, family, social commitments, and errands. Its core insight is that overload is not one universal number: it is a spike relative to what that student normally carries.

The prototype uses deterministic arithmetic, not an LLM or prediction model. It compares the most recent seven days with the student's rolling 28-day baseline. Duration and how draining a commitment feels are combined into one comparable measure.

The second defining feature is the **No Button**. It prices a proposed commitment before the student agrees and drafts a respectful decline or renegotiation message.

## 3. What judges must be able to see

The product is only preliminary-round complete when a judge can observe all five moments below:

1. **Understand:** the landing page explains why "everything at once" is the problem.
2. **See:** `/today` states how this week compares with the student's own normal.
3. **Explain:** the screen shows which life areas are making the week heavy.
4. **Act:** adding or pricing a commitment visibly changes the result.
5. **Recover:** putting something down shows what time was reclaimed and offers a gentle recovery choice.

This is the minimum complete experience. A static dashboard, even if polished, is not enough.

## 4. Rubric coverage

| Rubric area | Weight | Evidence we will submit |
|---|---:|---|
| Visual diagrams and mindmaps | 8% | Mindmap + problem tree + user flow |
| Iteration and idea evolution | 7% | Dated decision timeline with dropped directions and product pivots |
| Mentor feedback | 7% | Specific feedback -> action/rejection -> reason |
| Breadth of exploration | 3% | Alternatives compared using consistent criteria |
| Originality | 7% | Personal-baseline model adapted to total student load |
| Novel features | 5% | One put-down recommendation + No Button + reclaimed-time recovery loop |
| Differentiation | 3% | Evidence-backed comparison with current alternatives |
| Technical viability | 6% | Deterministic engine, local persistence, tested calculations, deployable web app |
| Scope realism | 5% | Two-page core, explicit priorities, optional stretch work, cut order |
| Resource awareness | 4% | Owners, estimates, zero required API cost, daily milestones |
| Presentation | 15% | Rehearsed four-minute problem-to-outcome story recorded from deployment |
| Visual consistency | 4% | Shared type, colour, spacing, card, and motion tokens |
| Usability and UX | 4% | One obvious next action, mobile controls, keyboard and screen-reader checks |
| Mockup completeness | 2% | Full core flow from understanding to action and recovery |
| Problem understanding | 5% | Causes, stakeholders, consequences, and constraints in README/video |
| Target alignment | 5% | Specific Malaysian undergraduate personas and realistic commitments |
| Solution effectiveness | 7% | Clear before/after demo plus brief student usability feedback |
| Reach and scalability | 3% | Realistic roadmap for timetable/calendar integrations and campus distribution |

Working code is not a separate rubric line, but it is evidence for feasibility, usability, completeness, and effectiveness.

## 5. Product and copy rules

1. User-facing copy must not expose technical or diagnostic vocabulary. The method can be explained to judges in the README and video.
2. Never recommend dropping classes, coursework, health needs, or family responsibilities. Recommendations are limited to negotiable shifts, favours, optional events, and similar commitments.
3. Recovery suggestions must be optional and non-medical. Pikul creates breathing room; it does not diagnose or prescribe.
4. The prototype uses no product-side LLM. Decline messages remain deterministic, private, instant, and reliable during the demo.
5. Every user-facing string belongs in `lib/copy.ts` in the block owned by the relevant workstream.
6. Claims in the README require credible sources. Do not publish unsupported market statistics, retention figures, acquisition claims, or scientific claims.
7. Describe the workload method as a design heuristic adapted from sports workload modelling, not a medically validated predictor of student wellbeing.

## 6. Team ownership

| Area | Owner | Paths |
|---|---|---|
| Product engine and app experience | A | `lib/engine/**`, `lib/seed/**`, `lib/store.ts`, `app/today/**`, optional `app/week/**`, `components/app/**` |
| Landing and visual system | B | `app/page.tsx`, `app/globals.css`, `app/layout.tsx`, `components/landing/**`, `public/**` |
| Evidence and submission | C | `README.md`, `docs/**`, slides, video, mentor record, submission checklist |
| Shared foundations | Announce before editing | `components/shared/**`, `lib/motion.ts`, `lib/utils.ts`, `lib/decline.ts`, project configuration |
| Shared copy | Partitioned | Edit only the block marked with your owner letter in `lib/copy.ts` |

The current repository has the shared foundation merged on `main`. Unless the team explicitly chooses another integration branch in chat, branch from and open pull requests into `main`.

Use short-lived branches:

- `Xiang-a-*` for A
- `Xiang-b-*` for B
- `Xiang-c-*` for C

Each pull request should contain one deliverable and pass `npm run verify` before merge.

## 7. Workstream A - Complete the product proof

### A1. Add commitment - P0, about 3 hours

Create `components/app/AddCommitmentSheet.tsx` and mount it from `/today`.

Fields: category, title, date, hours, and a 1-5 "how much does this take out of you?" control.

Submitting must call the existing store action and visibly update the result without a reload.

**Acceptance:** add a heavy shift and the CarryBar, contributing-area summary, and future price update immediately.

### A2. Contributing-area summary - P0, about 2 hours

Add a compact "What's making this week heavy" section to `/today`. Aggregate the current week into understandable areas such as coursework, work, travel, family/social, and errands/coordination.

Use a small number of labelled bars or rows. Do not build a dense analytics dashboard or display a universal score.

**Acceptance:** a judge can identify the largest contributor in under five seconds, and colour is not the only way to distinguish categories.

### A3. Complete the recovery loop - P0, about 2 hours

When Pikul recommends putting down a negotiable commitment, show the result in human terms, for example:

> Handing this back gives you Saturday evening back.

Offer a small, optional recovery choice such as keeping the time empty, resting, taking a walk, or seeing someone. Allow the user to choose their own action.

**Acceptance:** the demo ends with reclaimed time and an explicit recovery outcome rather than only a lower calculation.

### A4. Demo reliability - P0, about 1.5 hours

- `?reset=1` restores the opening state.
- `?persona=nurul` loads Nurul directly.
- Add a visible "Reset demo" action.
- Keep seeded data deterministic across hard refreshes.
- Prevent duplicate user-event IDs after reset or repeated additions.

**Acceptance:** the rehearsed click path can be repeated five times without manual localStorage cleanup.

### A5. Accessibility pass - P0, about 2 hours

Check keyboard-only operation, visible focus, bottom-sheet focus trapping and return, meaningful labels, status announcements, colour-independent meaning, 200% zoom, reduced motion, and 44px touch targets.

### A6. Four-week horizon - P2 stretch, about 3 hours

Create `/week` and `LoadRidge` only after A1-A5 pass. Use the existing forecast engine and `d3-shape`. The existing No Button forecast already communicates the future, so this page must not delay the core flow.

### A7. Settings explainer - cut for preliminary round

Do not build unless every P0/P1 deliverable, documentation item, deployment check, and video rehearsal is complete.

## 8. Workstream B - Make the two pages feel complete

### B1. Put-down principle section - P0, about 1.5 hours

Add a section between the existing scroll story and "How it works." Explain that Pikul names one thing worth putting down, not another ranked backlog.

### B2. No Button landing scene - P1, about 2 hours

Add a compact phone scene showing a request to cover a shift, the future cost of accepting it, a drafted decline, and the time protected for recovery.

If the full scroll-driven scene is unstable on mobile, use a simpler staged animation. Clarity and performance matter more than animation complexity.

### B3. Mobile and accessibility polish - P0, about 2 hours

- no horizontal scroll at 390px;
- no clipped text at 200% zoom;
- visible focus states and sufficient colour contrast;
- reduced motion settles with no looping animation;
- acceptable scrolling on a real mid-range Android phone;
- no inaccessible text embedded only inside decorative graphics.

### B4. Submission identity - P1, about 45 minutes

Replace the favicon, add an Open Graph image, remove unused scaffold assets, confirm metadata, and capture final screenshots only from the deployed build.

## 9. Workstream C - Build the scoring evidence

### C1. Mentor session - P0, book immediately

Book a session early enough to act on the feedback. Record the question, specific feedback, what changed, what was rejected and why, and permitted proof of the session.

### C2. Ideation package - P0, about 3 hours

Create:

- `docs/ideation/mindmap.md`
- `docs/ideation/problem-tree.md`
- `docs/ideation/user-flow.md`
- `docs/ideation/decisions.md`

The decision log must show a dated evolution, not only a retrospective list. For every stage use:

> Direction -> assumption -> evidence or concern -> decision -> what changed next

### C3. Breadth comparison - P0, about 45 minutes

Compare genuinely considered concepts using the same criteria: problem fit, originality, student impact, prototype feasibility, and reason selected or rejected. Do not claim a number of explored ideas unless those ideas are documented.

### C4. Lightweight student validation - P0, about 2 hours

Ask 3-5 Malaysian undergraduates to try the core flow:

1. What does the opening sentence mean?
2. What is making this student's week heavy?
3. What would you do next?
4. Does the decline message sound usable?
5. Does the recovery suggestion feel helpful or intrusive?

Record patterns, not personal data. Document at least one product change resulting from the feedback.

### C5. README - P0, about 3 hours

The README must contain:

1. overview, deployed link, video link, and screenshots;
2. problem causes, stakeholders, and consequences;
3. specific target users and personas;
4. the personal-baseline insight;
5. end-to-end solution and before/after outcome;
6. method, limitations, and sources;
7. evidence-backed differentiation;
8. technical architecture, privacy, and viability;
9. built scope, deliberate cuts, time, team, and cost;
10. reach and scalability roadmap;
11. ideation diagrams, decision timeline, mentor feedback, and student validation;
12. local setup and team details.

The README is a scoring surface. Keep placeholders for the URL, screenshots, mentor result, and video only until those assets exist.

### C6. Slides and video - P0, whole team

Target approximately four minutes:

| Time | Content |
|---|---|
| 0:00-0:25 | Human problem and "everything at once" hook |
| 0:25-0:45 | Specific Malaysian undergraduate target user |
| 0:45-1:10 | Personal-baseline insight |
| 1:10-2:40 | Live flow: see -> explain -> add/price -> put down -> recover |
| 2:40-3:10 | Differentiation from trackers and schedulers |
| 3:10-3:35 | Feasibility, privacy, and technical approach |
| 3:35-4:00 | Impact, reach, and closing line |

Record from the deployed URL. Include a persona switch to show that equal hours can mean something different for two students. Rehearse the click path five times and watch a complete test recording before the final take.

## 10. Schedule

| Date | A - Product | B - Design | C - Evidence |
|---|---|---|---|
| 7 Sep | A1 add commitment | B1 put-down principle | Book mentor; begin decision timeline |
| 8 Sep | A2 contributing areas | B2 No Button scene | Ideation diagrams and breadth table |
| 9 Sep | A3 recovery loop | B3 mobile pass | README problem, audience, insight, differentiation |
| 10 Sep | A4 demo reliability | B4 identity assets | Student validation; README feasibility and impact |
| 11 Sep | A5 accessibility and bug fixes | Cross-page polish | Mentor integration; README reach/scalability |
| 12 Sep | Optional A6 only if core is green; feature freeze 23:00 | Final mobile QA | Slides, screenshots, test recording, rehearsal x5 |
| 13 Sep | No new features; deployed smoke test | No new animation | Final video, links, public-repo check, submit six hours early |

Deploy to Vercel as early as possible. Require no environment variables and verify the deployment on a phone using mobile data.

## 11. Verification gates

Before every merge:

```bash
npm run gate
npm run test
npm run build
# or: npm run verify
```

Before feature freeze:

- hard-refresh `/today` three times: identical opening state;
- add a commitment: the overall result and area breakdown change;
- price an ask: the future consequence is understandable;
- put it down: reclaimed time and a recovery option appear;
- switch to Nurul: the personal-baseline thesis is visible;
- reset and repeat the flow five times;
- complete the flow using only a keyboard;
- test at 390px and 200% zoom;
- enable reduced motion: animations settle and nothing loops;
- open the public URL on mobile data;
- verify every link in a signed-out browser.

## 12. Cut order

Cut first:

1. settings;
2. onboarding;
3. dark mode;
4. standalone `/week`;
5. complex landing-phone scroll choreography;
6. decorative motion and extra illustrations.

Do not cut:

- deployed mobile experience;
- landing explanation;
- `/today` personal comparison;
- contributing-area summary;
- add/price commitment proof;
- one put-down recommendation;
- reclaimed-time recovery outcome;
- resettable demo path;
- accessibility baseline;
- README and ideation evidence;
- mentor feedback and student validation;
- final video.

## 13. Definition of preliminary-round done

Pikul is ready when a first-time judge can understand the problem and complete the core flow without narration, the same flow works repeatedly on a deployed phone-sized build, and every rubric claim has visible evidence in the product, README, ideation package, or video.

The objective is not to look large. It is to feel complete, credible, and memorable.
