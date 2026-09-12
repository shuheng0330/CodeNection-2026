# Pikul — final frontend delivery plan

**Plan version:** 8 September 2026, consolidated after three review passes. This is the single current delivery plan; PLAN.md is historical. Feature descriptions below are delivery requirements, not claims that implementation is complete.

**Priority:** A distinctive, self-explanatory frontend that feels complete on desktop and mobile.

**Team:** Ku, Lim Wey Cheng, and Thong all develop during the build phase. All three prepare the README, slides, and video together afterward.

**Development and merge target:** Friday, 11 September, 15:00 MYT. Thursday evening is a readiness checkpoint, not a development cutoff.

**Code freeze:** Friday, 11 September, 18:00 MYT. Friday morning and early afternoon remain available for development of agreed scope. Reserve 15:00–18:00 for integration, testing and fixes. README/slide production starts after freeze; Saturday is reserved for joint preparation and recording. Sunday, 13 September is submission day, targeting six hours before the confirmed official cutoff.

## 1. The experience we are building

Pikul helps Malaysian university students understand the weight of their commitments relative to their own normal, consider a new request, and make room when needed. The frontend must communicate the audience, insight, and useful outcome without requiring the README. Design leads our delivery priorities; this does not change the official judging rubric or remove the need for submission evidence.

### One primary demonstration

**Understand the week → try a sample request → see the consequence → decide → see the hours kept free.**

- **First 10 seconds:** the landing hero identifies the audience and problem, shows a concrete before/after example, and offers **Try a sample week**.
- **By 30 seconds:** Today shows the student's situation. Selecting a sample extra-shift request opens inspectable, prefilled details and a forecast. No typing is required.
- **By 60 seconds:** the visitor can accept or decline. Declining shows the request's hours kept free and a respectful reply available to copy. Accepting adds the commitment and records the decision once.

These timings are usability targets, not measured results. Test them with unfamiliar users.

The same sample persona, request, and engine-derived figures appear on the landing and in the fresh app demo. The landing preview is isolated and never changes saved app data. Entering the sample demo explicitly starts the labelled sample state; ordinary app navigation preserves current state. Keep a separate visible Reset demo action so rehearsals can reproduce the opening.

Pasting a message is deeper exploration. Handing back an existing negotiable commitment is a separate action that **reclaims** hours; declining an unaccepted request **keeps** hours free. Do not conflate them.

Use `/compare` as an optional presentation opening to demonstrate personal baseline. Keep it reachable without making it compulsory onboarding.

## 2. Visual and responsive standard

Keep the existing Linen & Clay identity, Fraunces headings, DM Sans body text, warm workload colours, and dusk blue for recovery. Improve hierarchy, composition, and interaction consistency before adding decoration.

| View | Required composition |
|---|---|
| Desktop, 1024px+ | Persistent app navigation; Today uses a main overview with a supporting decision panel. Week uses the width for daily summaries. Reading pages retain a comfortable text width. No oversized empty phone-shaped canvas |
| Tablet, 768–1023px | Compact navigation; flexible columns that stack before content becomes cramped |
| Mobile, below 768px | One-column hierarchy; Today / Week / Recover / Asks / More navigation. More contains Compare and Method. Decisions use accessible bottom sheets; actions remain visible above safe areas and the keyboard |

All seven existing routes remain: `/`, `/today`, `/week`, `/compare`, `/recover`, `/asks`, `/method`.

### Quality gates

1. **Tuesday reference:** Lim establishes shared tokens and landing-hero composition. Ku supplies Today compositions at 390px and 1440px using those tokens. All three agree the headline, main visual, primary action, and secondary content before polishing further screens. Thong applies the same system to Week and navigation.
2. **Wednesday first impression:** each team member recruits one potential tester; use at least two people unfamiliar with the project for a ten-second landing/Today inspection. Ask who it helps, what the week statement means, and what they would click. Record answers and fix unclear hierarchy before extra motion.
3. **Thursday flow:** aim for three students to complete the sample-request flow unaided on phones within one minute. Record hesitation and mistakes; fix recurring problems. If testers are unavailable, perform team checks and record the external-validation gap honestly.
4. **Every screen:** review heavy, calm, empty, and relevant error states. A calm week should not manufacture a need to decline. Selected/confirmed states must be clear without colour alone.
5. **Release inspection:** check 360, 390, 768, 1024, and 1440 CSS pixels, plus 200% zoom. No accidental horizontal overflow, clipped text, hidden action, or unusable sheet. Use at least 44px touch targets, visible focus, meaningful labels, sufficient contrast, focus trap/return/Escape, and reduced-motion support. Test a real Android phone and a desktop browser.

Motion explains consequences and never blocks input. Information appears immediately with reduced motion. No mandatory scroll sequence, autoplay tour, or typewriter delay. Capture genuine desktop and mobile screenshots; mobile quality must not depend on decorative grain.

## 3. Release scope: foundation first, enhancements second

### Required minimum release

- Responsive landing and shared app navigation; consistent supporting pages.
- A prominent sample-request demonstration with a truthful before/after forecast, reliable accept/decline actions, and a copyable reply. On clipboard failure, leave the reply selectable and explain that it was not copied.
- Existing add/paste/edit, persona switching, put-down, recovery, and ask history remain usable.
- Correct decision state, reset behaviour, accessible primary controls, and repeatable deployment.
- A polished static before/after landing example is the minimum; the toggle below is an enhancement.

### Signature enhancements, attempted within the same time budget

| Enhancement | Visible payoff | Owner | Fallback if completion will miss Friday 15:00 |
|---|---|---|---|
| **Living Week** | Select a day to inspect its commitments; a labelled heavy cluster explains why that part of the week deserves attention | Thong | Existing WeekPanels with stronger hierarchy and collision explanation |
| **Incoming Request** | Paste a message, inspect inferred details, and preview the cost before confirming | Ku | Preset sample request in No Button; retain existing paste/edit in Add Commitment |
| **Breathing Room** | Preview handing back one negotiable commitment, then confirm/cancel and see the hours reclaimed | Ku | Static confirmation naming the commitment, date, and hours; no animated preview |
| **Landing decision toggle** | Switch between accepting and declining the same sample request; see its consequence and reply immediately | Lim Wey Cheng | Static engine-derived comparison and one clear demo CTA |

The release needs one memorable decision payoff. It does not need four elaborate animations. At Thursday noon, estimate remaining work. Continue an enhancement on Friday only if it fits before 15:00 with time to test; otherwise select its fallback. Fallbacks must preserve the minimum release and pass the same correctness/accessibility checks.

### Correctness rules that design must respect

- Use existing engine calculations; do not change thresholds or hardcode an outcome to make a demo dramatic.
- Removing a future commitment may leave today's measure unchanged. Relative-baseline measures may not fall when an event is removed. Show the actual forecast and factual hours; never promise an automatic lower score or animate a false drop.
- Current events provide dates and durations, not exact appointment times. Week is a daily commitment view. Do not invent free clock-time slots or describe declining a request as a confirmed recovery booking.
- Inferred request details stay editable and labelled. Invalid duration/date input cannot be confirmed; unsupported dates must be explained rather than given a misleading forecast. An unparsed message remains editable.
- Accepting a request adds the event and decision together once. Declining records the decision without adding an event. Closing/cancelling a preview changes nothing. Reopening, double-clicking, navigating, and resetting must not duplicate actions.
- Never suggest dropping classes, coursework, health needs, or family responsibilities. Recovery remains optional. The workload method is a design heuristic, not a medical assessment.
- Label sample data. No fake calendar/WhatsApp/LMS connections, automatic external messages, claimed learning, or invented imported data. Replies are copied, not sent.

### Later backlog

Offer-less scenarios, an optional “How did it feel?” check-in, shareable relief cards, onboarding, real integrations, and personalisation belong to the next iteration. No new routes are planned for this sprint. The check-in is explicitly deferred: before submission Ku checks coverage of the brief against the existing Method/product explanation and records any unmet requirement honestly. A workload heuristic must not be presented as an implemented self-report stress tracker.

## 4. Workload and ownership

Estimates are planning allowances, not confirmed availability. They include each lane's local fixes; allow another three hours per person for joint reviews/release checks. Tuesday's kickoff checks capacity. If availability is lower, apply fallbacks early; fit remaining development before Friday 15:00 and protect the final checks and documentation window.

| Owner | Development deliverables | Focused allowance |
|---|---|---|
| **Ku — decision experience** | Today/Compare composition (3h); request fixture, forecast and atomic decisions (5h); put-down confirmation/reveal (2h); sheets/CarryBar accessibility (3h); targeted regressions and fixes (3h) | 16h |
| **Lim Wey Cheng — landing and identity** | Landing composition and put-down explanation (4h); sample preview/toggle (3h); tokens, favicon and sharing metadata (2h); responsive landing pass (4h); fixes (2h) | 15h |
| **Thong — app workspace** | Shared navigation and early integration (4h); Week interaction (3h); Recover/Asks/Method consistency (3h); deployment/demo links (2h); route QA and fixes (4h) | 16h |

All three write frontend code and test their own desktop/mobile work. Each screen owner implements visual-review feedback in their files. Lim maintains shared tokens, not every screen's styling.

### File map

| Owner | Write ownership |
|---|---|
| Ku | `app/today/**`, `app/compare/**`, `lib/engine/**`, `lib/parse/**`, `lib/seed/**`, `lib/store.ts`, `lib/decline.ts`; `components/app/{NoButton,AddCommitmentSheet,CarryBar,AreaBreakdown,PutDownCard}.tsx`; `components/app/decision/**` |
| Lim Wey Cheng | `app/page.tsx`, `app/globals.css`, `app/layout.tsx`, `app/favicon.ico`, new `app/opengraph-image.*`, `components/landing/**`, `public/**` |
| Thong | `app/{week,recover,asks,method}/**`, `app/(app)/layout.tsx`; `components/app/{WeekPanels,CollisionCard}.tsx`; new `components/app/shell/**`, `components/app/week/**` |

Everyone may read/review all files. Announce cross-owner edits before making them.

- `lib/copy.ts`: Ku marks owner sections on Tuesday. Ku owns Today/Compare/decisions, Lim landing/brand, Thong navigation/Week/Recover/Asks/Method. Avoid whole-file reformatting.
- Ku coordinates shared utilities, motion helpers, shared components, and package/config changes. Prefer existing dependencies.
- Thong owns `AppShell({children})`, explicitly mounted by page owners. Do not relocate routes this sprint: `app/(app)/layout.tsx` currently has no child pages and does not wrap existing routes. Landing stays outside the app shell.
- The shell handles navigation and demo-query behaviour without duplicate containers or repeated resets. Owners remove duplicate page handlers only after integration passes. `/method` can remain a server page rendering the client shell.
- Thong supplies the confirmed deployment URL; Lim uses it for canonical metadata. Never invent a live URL.

## 5. Handoffs and daily schedule

All times are MYT. Merge completed work daily and inspect the deployed desktop/phone views together for 15 minutes. This planning task remains in the current branch/worktree; team implementation should use small owner-scoped changes following the repository's agreed integration workflow.

| Date | Ku | Lim Wey Cheng | Thong | Required outcome |
|---|---|---|---|---|
| **Tue 8** | Define candidate/decision contract, shared sample fixture; Today reference | Landing hero, visual tokens, preview composition | Shell skeleton, deploy current main, begin Week | 30-minute kickoff; confirm capacity, deadline/form access and mentor booking; agree references |
| **Wed 9 morning** | Integrate Today with shell; test decision state | Connect sample fixture to landing | Integrate shell with Ku; test navigation/reset | One deployed desktop/mobile vertical slice before spreading shell to other routes |
| **Wed 9 afternoon** | Request flow and sheet accessibility | Landing preview and identity assets | Week and supporting routes | First-impression check with unfamiliar viewers; merge working slices |
| **Thu 10 morning** | Put-down confirmation and decision polish | Responsive landing polish | Finish supporting routes and demo links | **12:00 scope review:** unfinished enhancements get a remaining-work estimate and fallback |
| **Thu 10 afternoon** | Integrate selected scope and fix issues | Apply visual feedback | Deploy integrated app and verify routes | **18:00 readiness checkpoint:** deploy working slices, test the core flow, and assign bounded Friday completion work |
| **Fri 11 before 15:00** | Finish agreed decision features and regressions | Finish agreed landing/visual work | Finish agreed Week/navigation work | Develop and merge selected scope; apply fallbacks where completion threatens the 15:00 target |
| **Fri 11, 15:00–18:00** | Joint release checks | Joint release checks | Joint release checks | Green verification, repeatable demo, frozen commit and deployment recorded |
| **Fri 11 after 18:00** | Shared README/slide outline | Shared README/slide outline | Shared README/slide outline | **Code frozen**; production work begins |

### Tuesday contracts

Ku exports a deterministic sample scenario from `lib/seed/decisionDemo.ts`: persona identifier, reference date, candidate `LoadEvent`, and engine-derived forecast. Landing and the explicit sample entry use the same reference date and request. Lim can develop composition with existing sample content before the export arrives, but must not ship separately invented figures. Reuse the existing stable demo-date convention rather than mixing real-time and fixed dates.

Ku defines preview, accept, decline, and confirmation semantics. Thong consumes existing `useCarry()` and engine helpers for Week rather than modifying the store. By Wednesday morning, Ku and Thong test one integrated Today/shell page for direct loading, internal links, persona switching, reset, and hydration. Only then spread the shell to the other routes.

Record brief dated decisions, screenshots, mentor comments, and tester observations during development. Each member contributes their own notes. Thong collects them in `docs/evidence.md`; this is raw evidence capture, not a separate documentation workstream. Keep a mentor slot before freeze where possible; do not postpone booking to Saturday.

## 6. Friday release gate

The release candidate must pass all of these checks. Record failures and fixes in PROJECT_STATUS.md.

- [ ] All seven routes are reachable; navigation, active state, and browser back behaviour are understandable.
- [ ] Five viewport widths, zoom, keyboard, focus, contrast, touch controls, text alternatives, reduced motion, and a real-phone pass meet section 2.
- [ ] Fresh sample entry matches the landing scenario; ordinary navigation preserves saved state; reset restores the opening reliably.
- [ ] Preset request, editable details, before/after forecast, accept, decline, copy, put-down confirm/cancel, and recovery work. Test paste inside No Button if that enhancement ships; retain checks for existing Add Commitment parsing.
- [ ] Confirming acceptance saves event and decision once; decline saves only a decision. Test repeated confirmation, close/reopen, route changes, and reset. Existing log-only behaviour does not satisfy acceptance.
- [ ] Preview does not save or remove anything. Hours protected/reclaimed and forecast figures agree with calculations; no false promise of a lower current measure.
- [ ] Heavy, calm, empty, and relevant error states are usable; ambiguous and invalid input does not produce an unexplained success.
- [ ] The full demo survives five repeats without manual browser-storage cleanup.
- [ ] `npm run verify` passes on the candidate commit: voice gate, lint, Vitest, and production build. Use targeted regression tests for changed calculations/state; inspect visual changes in the browser.
- [ ] The deployment opens signed out on desktop and a phone using mobile data. Record commit and deployment before screenshots/recording.

After 18:00 Friday, only a release-blocking failure may reopen code: a broken primary flow, failed build/deployment, inaccessible essential control, or corrupted state. Record the reason, apply a minimal fix, rerun affected checks, redeploy, and replace affected captured assets. No cosmetic redesign or new feature after freeze.

## 7. Joint README, slides, and video production

All three draft, assemble, and review together after freeze. Leads coordinate sections rather than becoming sole authors.

| Initial drafting focus | Lead |
|---|---|
| Problem, audience, design rationale, screenshots and slide visual system | Lim Wey Cheng |
| Product flow, method, limitations, architecture, setup and dependencies | Ku |
| Ideation/evolution, mentor and validation evidence, impact, roadmap and submission checklist | Thong |

| Time | Shared deliverable |
|---|---|
| **Fri 18:30–19:30** | README outline, six-slide story, evidence inventory, operator/narrator candidates |
| **Sat 09:00–12:00** | Draft assigned README and slide content; produce mindmap/problem tree/user flow from actual decisions; capture frozen-build desktop/mobile screenshots |
| **Sat 13:00–15:00** | Assemble complete README and slides; all three cross-review. Thong integrates README, Lim assembles slides, Ku checks technical accuracy |
| **Sat 15:00–16:00** | Final script, operator/narrator selection, five timed demo-path rehearsals |
| **Sat 16:00–18:00** | Record, watch the complete take, correct defects and re-record |
| **Sun morning** | Final signed-out link/video checks; team leader submits at least six hours before the confirmed cutoff and saves confirmation |

README coverage: overview and links; problem/audience; personal-baseline insight; demonstrated flow; method/limitations/sources; differentiation; feasibility/privacy/setup/dependencies; built scope and roadmap; ideation and decision history; mentor/student evidence; team details. Show essential diagrams and explanations in the README even when supporting files live in `docs/`.

Six-slide story: **student and problem → personal-baseline insight → request/decision demo → protected time and recovery → evidence and feasibility → impact and next steps**. The optional comparison reveal can replace the opening, not add another long section. Aim for a roughly four-minute video and check the current official limit. Show actual desktop/mobile interactions from the frozen deployment. If production overruns, simplify slide decoration and video editing, not completeness or the submission buffer.

## 8. Submission responsibilities and final constraints

Thong coordinates the checklist; the confirmed team leader submits. On Tuesday, the leader checks current form access, deadline/timezone, video/access rules, required fields, and repository requirements. Before sending, all three verify the public repo, video playback, deployment and README links signed out. Do not inherit the historical plan's YouTube visibility or filename claims as established requirements.

The earlier repository plan recorded a 13 September prototype deadline, repository plus a video of at most five minutes, and team-leader submission. These are carried-forward notes, not newly verified official rules. The repository's organiser notes say the README and video carry the judging evidence; essential documentation must therefore be visible there. Check official documents for later-round rules before scheduling post-submission work.

**Never sacrifice:** intentional desktop/mobile design, a truthful complete decision flow, accessible essential controls, reliable deployment, or the shared post-freeze preparation window. Do not remove existing routes to meet the schedule. If time is short, reduce enhancement depth using section 3 and remove decorative motion first.
