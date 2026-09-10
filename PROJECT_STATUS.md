# Project status

Updated 9 September 2026.

## Confirmed from source inspection

- Current branch/worktree: `Shuheng`.
- Seven page routes and deterministic workload/parser/seed/local-state modules exist.
- Xiang-a-core-flow is merged at 72a0b87; that merge is not pending.
- npm run verify includes voice gate, lint, tests and production build.
- README.md is empty; the submission evidence package is unfinished.
- Sheet accessibility and CarryBar text-alternative work identified during source review remain separate follow-up items.

## Completed planning work

- Studied the app, historical plan and current phase plan.
- Completed three review passes, recorded in docs/PLAN_REVIEW.md.
- Consolidated PHASE_PLAN.md into the final team delivery plan with minimum scope, bounded enhancements/fallbacks, three development lanes, early integration, Friday freeze, release gate and shared weekend production.
- Marked PLAN.md historical and synchronised requirements/architecture/status documentation.

## Completed implementation

- Added a shared responsive app shell across Today, Week, Recover, Asks, Compare and Method.
- Added persistent desktop navigation and mobile Today / Week / Recover / Asks / More navigation with active-page states.
- Added an accessible mobile More sheet with focus entry, focus trapping, Escape dismissal and focus return.
- Centralised `?reset=1` and `?persona=...` demo-query behaviour in the shell.
- Removed repeated route headers while keeping the landing page outside the product shell.
- Verified all six product routes at desktop and mobile widths, including direct loading, active states, More navigation, persona selection, reset and horizontal overflow.
- Turned the four-week horizon into a living view with 28 keyboard-accessible day selectors on one shared load scale.
- Defaulted the week view to the heaviest upcoming day and added a truthful detail panel sourced from existing commitments.
- Kept the heavy-cluster explanation as the single priority signal above the inspectable horizon.
- Verified pointer and Enter-key day selection in the browser at a compact viewport.
- Added one shared supporting-page frame and intro hierarchy for Recover, Asks and Method.
- Gave Recover and Asks responsive desktop compositions while preserving their compact mobile flow and existing state behavior.
- Corrected declined-request totals from “handed back” to “kept free,” matching the decision semantics in the delivery plan.
- Improved supporting-page semantics with labelled sections, a live recovery-choice result and a valid ordered Method list.
- Verified Recover’s no-room and quiet-day states, keyboard choice selection, empty and populated Ask histories, and the Method reading flow in the browser.
- Deployed commit `775d516` to Vercel at `https://pikul-codenection-2026.vercel.app` with no environment variables.
- Verified all seven public routes plus reset and persona deep links return HTTP 200.
- Verified the public landing → Today → Week path in a fresh browser surface and recorded a repeatable demo/deployment runbook.
- Completed the full route matrix at compact, tablet and desktop-equivalent widths with no horizontal overflow.
- Added bounded release fixes for sheet focus behavior, clipboard fallback, atomic one-time decisions, add validation, put-down confirmation, CarryBar text alternatives and mobile touch targets.
- Verified invalid input blocking, decision deduplication, atomic acceptance, put-down cancel/confirm and mobile target sizes in the browser.
- `npm run verify` passes: voice gate, lint, 74 Vitest tests and the Next.js production build.

## Next actions

- Team kickoff: confirm availability, official deadline/form, mentor status, sample contract and visual references.
- Redeploy the bounded QA fixes and run the public smoke path; connect automatic Git deployment after the release branch is agreed and merged.
- Complete final integration/QA/fixes Friday 15:00–18:00 and freeze by 11 September, 18:00 MYT.
- Joint README, diagrams, evidence, slides, recording and early submission.

## Validation limits

## Lim task 1 completion — 9 September 2026

- Active worktree branch is codex/lim-landing, tracking origin/codex/lim-landing. The user committed/pushed the landing implementation as 83b09f4. This continuation preserves that commit and adds documentation only; no additional commit or push was made by the agent.
- Implemented split hero, static HTML commitment illustration, shorter month/week explanation, put-down principle with labelled eight-hour example, and three-step explanation. Shared tokens, engine/store and app routes are unchanged.
- Fresh npm run verify: PASS, 8 test files and 74 tests; voice gate, lint, TypeScript and production build passed.
- Browser layout checks: no horizontal overflow at 360/390/768/1024/1440px. Landing links have target heights of at least 44px. Keyboard skip link and visible focus verified; #how anchor verified. Sample CTA and persona reset were verified during the initial implementation (Nurul -> landing CTA -> Aisyah).
- Additional 720px reflow check passed as a proxy for a 1440px window at 200% zoom. True browser 200% zoom could not be applied by the in-app browser controls and remains a manual check. Reduced-motion behaviour was reviewed in source; browser preference emulation and real-device testing remain manual checks.
- Desktop and mobile viewport screenshots saved outside the repository under C:/Users/User/.codex/visualizations/2026/09/08/01a08121-815e-7c70-87c1-ecbf9bd97538/landing-desktop-final.png and landing-mobile-final.png. Earlier full-page captures had stitching artifacts; use the final viewport captures.
- The independent reviewer could not run because its usage allowance was exhausted; no independent-review pass is claimed. Local source/diff review and browser validation were completed.
- The user's animation feedback is reserved for the next improvement task, per their instruction to finish the original task first.

The earlier planning-only validation paragraph is historical. The checks above describe the completed landing implementation; they do not establish whole-app release or deployed-site readiness.

## Landing motion completion — 9 September 2026

- Restored the two-second spring rope introduction, extra-shift release and replay inside the split hero. Labels remain visible; controls and result have reserved space. Background colour fields settle once. No app data is changed.
- Added once-only month bar growth and responsive step entrances: grouped desktop stagger and individual mobile visibility triggers. The put-down explanation stays static.
- Added a reactive landing-local reduced-motion subscription and corrected released-card text contrast following independent source review. Geometry/timing regression tests cover the rope markers and introduction.
- Final npm run verify passed: voice gate, lint, 9 test files / 77 tests, TypeScript and production build. git diff --check passed. Next.js reports an existing external package-lock warning outside the repository; build completes successfully.
- Browser checks covered introduction, release, keyboard activation, replay, leaving during introduction, chart scrolling and settled steps. No horizontal overflow at 360, 390, 768, 1024 and 1440px in the checked states. Ready/released illustration heights matched. Explanation navigation works; sample/reset flow was verified in the preceding landing task and its routes remain unchanged.
- True 200% browser zoom and OS reduced-motion preference emulation were unavailable in the in-app browser and remain manual checks. Source review confirms visible server markup, transform-based animation, cleanup and preference subscriptions; this is not a claim of a full real-device accessibility audit.
- Review artifacts are outside the repository at C:/Users/User/.codex/visualizations/2026/09/08/01a08121-815e-7c70-87c1-ecbf9bd97538/: motion-desktop.png, motion-mobile.png and landing-motion.gif (short screenshot-frame recording of introduction and release).
- Work remains on codex/lim-landing in the same worktree. Existing changes were preserved. No commit or push was made.

## Wide rope and stronger entrances completion — 9 September 2026

- Replaced the split hero with centred copy/actions and a wide named-card rope. Added an automatic nine-second weight/relief cycle, keyboard-accessible pause/resume, and off-screen/tab-visibility suspension. The previous release/replay buttons are removed.
- Added independent staggered entrances to put-down text/example and How it works heading/step children. Mobile retains individually observed step entrances. No lower-section replay controls were added.
- Final npm run verify passed: voice gate, lint, 9 test files / 78 tests, TypeScript and production build. The added test verifies the nine-second story duration and weight/release/reset states.
- Browser checks: readable card sizing and no horizontal overflow at 360/390/768/1024/1440px; mobile row spacing increased to preserve a gap during release. Keyboard pause/resume and explanation link worked. The stage stayed unchanged while the hero was off-screen. Captured a complete ten-second cycle. Source review identified card springs continuing after pause; explicit MotionValue stop/resume fixed this before final verification.
- Browser-level hidden-tab and reduced-motion emulation, true 200% zoom and exhaustive frame-by-frame checks at every viewport remain manual validation. Sample/reset URLs are unchanged; the earlier functional reset check remains the recorded evidence. No claim of new full app-screen validation is made.
- Artifacts outside the repository: C:/Users/User/.codex/visualizations/2026/09/08/01a08121-815e-7c70-87c1-ecbf9bd97538/wide-rope-desktop.png, wide-rope-mobile.png and wide-rope-motion.gif. The GIF is a short browser screenshot-frame recording.
- Same worktree and codex/lim-landing branch. Existing changes preserved; no commit or push.

## Brand metadata and sharing identity completion — 9 September 2026

- Work remains in the same worktree on `codex/lim-landing`. The tree was clean before this task; changes are left uncommitted and unpushed for review.
- Added a three-frame 16/32/48px RGBA favicon, matching 180px Apple touch icon, and a static 1200×630 Open Graph PNG. The assets use the existing Linen & Clay palette; the sharing image uses the project’s Fraunces and DM Sans font output.
- Updated root document, Open Graph and Twitter metadata to the approved title and description. The rendered page contains one Open Graph image, one Twitter image, a `summary_large_image` card, dimensions and matching descriptive alternative text. No root canonical tag is emitted.
- Local requests returned HTTP 200 for `/`, `/favicon.ico`, `/apple-icon.png` and `/opengraph-image.png`. Full-size and 400×210 sharing-image inspection passed; enlarged nearest-neighbour reviews confirmed the icon silhouette remains recognisable at 16px and 32px.
- Final `npm run verify` passed after the documentation update: voice gate, lint, 10 test files / 80 tests, TypeScript and production build. The production build prerendered the Apple icon and Open Graph image routes.
- No confirmed deployment URL is recorded in `PHASE_PLAN.md` or the required project documents. Metadata therefore uses `VERCEL_PROJECT_PRODUCTION_URL`/`VERCEL_URL` at deployment and localhost during local development. The production origin and external platform link-preview caches remain unverified until the deployment URL is supplied and deployed.

## Hero text and shift exit verification — 9 September 2026

- Added the one-time hero text entrance and shortened supporting copy. The extra-shift card and hanger now lift/fade completely away during release and return on reset.
- npm run verify passed: voice gate, lint, 10 test files / 80 tests, TypeScript and production build.
- Port 3000 was serving an older production process. Started the fresh production build at localhost:3001 for verification. Browser sampling confirmed opacity 0 at the released stage, opacity 1 after reset, and no desktop horizontal overflow over a full cycle. Screenshot: C:/Users/User/.codex/visualizations/2026/09/08/01a08121-815e-7c70-87c1-ecbf9bd97538/hero-shift-removed.png.
- Same codex/lim-landing branch and worktree. Changes left uncommitted and unpushed; prior responsive/reduced-motion validation limits still apply.

## Landing-only QA and cleanup — 9 September 2026

- Preserved the existing uncommitted hero entrance, shorter copy, shift removal and documentation changes on `codex/lim-landing`. Added only removal of confirmed-unreferenced landing CSS and this QA record; no commit or push was made.
- Built the current tree and served the fresh production output on `http://localhost:3217`, without using the older processes on ports 3000 or 3101. The existing Next.js package-lock/output-tracing-root warning remained non-blocking.
- At 360, 390, 768, 1024 and 1440 CSS pixels, automated DOM measurements and visual inspection found no horizontal overflow, overflowing text, card overlap or hidden action. Target heights remained 44px or greater. The 360px actions stack; 390px and wider retain their intended grouping.
- Verified the hero text enters once and remains settled after leaving and returning. Pause held the stage and stopped playback; resume advanced it. The extra-shift wrapper reached opacity 0, translated to -60px, set `aria-hidden`, then returned to opacity 1 without `aria-hidden` on the next cycle. Lower-section headings and steps remained settled when revisited.
- Keyboard traversal reached the skip link, brand, header action, primary action, explanation link and pause control with visible clay focus outlines. The explanation link reached `#how`; the sample link reached `/today?reset=1` and rendered the expected seeded Today heading.
- True browser 200% zoom was not exposed by the in-app browser. A 720×450 CSS-pixel reflow proxy for a 1440×900 window at 200% had no horizontal overflow and kept all actions rendered. Reduced-motion emulation was unavailable; the active environment reported no reduced-motion preference, so only source/CSS handling was reviewed. Opening another in-app tab did not make the source document hidden (`visibilityState` stayed `visible`), so hidden-tab suspension remains unverified in a real browser.
- Captured final 1440×900 desktop and 390×844 mobile viewport screenshots in the QA session. Real-device testing remains outside this pass.
- Final `npm run verify` passed after the CSS cleanup: voice gate, lint, 10 test files / 80 tests, TypeScript and production build.
Shared navigation, the living week view and supporting routes have been validated locally and on the current Vercel deployment. They have not yet been checked on a physical Android device using mobile data. Automatic Git deployment is intentionally deferred until the team agrees and merges the production branch. Other planned enhancements remain pending. External submission rules have not been reverified in this revision.

## Release checks run 9 September 2026 (Ku's lane)

Measured in headless Chrome against a production build, not estimated. The
whole sweep is now `npm run check:release`, so anyone can rerun it before the
freeze rather than take this section on trust. It needs a running server:

    npm run build && npm start        # one terminal
    npm run check:release             # another

It currently passes. What it covers:

- Reflow and overflow, seven routes at 320, 360, 390, 640, 768, 1024 and 1440
  CSS pixels. No route scrolls horizontally at any width. 640 is in the list
  because it is what a 1280px desktop viewport becomes at 200% zoom, which is
  the other half of WCAG 1.4.10.
- Touch targets at every one of those widths, against the 44px the gate asks
  for.
- The request sheet from a keyboard: focus enters, lands on the heading rather
  than a close button, cannot be tabbed or shift-tabbed out of, leaves on
  Escape, returns to the trigger, and moves again on a step change so the new
  step is announced.
- Five straight run-throughs in one browser with nothing cleared between them,
  all five producing identical figures, and three presses of "I said yes"
  booking the shift once.
- Accept, decline and change-your-mind, checked against what is actually in
  storage rather than what the screen says.
- Adding a commitment: a blank, zero or longer-than-a-day duration cannot be
  submitted, says why, and changes nothing if the button is pressed anyway.
- The hand-back preview: opening it and cancelling it both save nothing.

**Cross-owner change, announced here rather than assumed.** The back link
reading "Today" on `/week`, `/recover`, `/asks` and `/method` measured 39x20
CSS pixels, under the gate's 44px, on all seven widths. Ku added
`inline-flex min-h-11 items-center` to that one link in each of those four
files — one line per file, nothing else touched. Thong owns them; revert
freely if AppShell is about to replace those headers anyway.

Not covered by any of the above, and still outstanding for the Friday gate:
NVDA or VoiceOver, real-Android TalkBack, and a physical-device pass. Those
cannot be run headlessly and stay manual.

### Defects found by looking at the rendered pages, and fixed

- The four-week forecast strip in the request sheet had never drawn its bars.
  Each bar's height is a percentage of its column, and `items-end` sized each
  column to its content, so the percentage resolved against nothing. The strip
  had been rendering an empty frame with week labels under it.
- An open sheet was painted over by the page behind it. `position: sticky` on
  Today's decision panel starts a stacking context, so the sheet's `z-50` only
  ranked it against its siblings inside that panel. Both sheets are now
  portalled to the body.
- The carry bar's track disappeared into the highlighted card on `/compare` —
  both are warm neutrals within a few percent of each other. The track now
  carries a hairline.
- Adding a commitment silently invented a duration. The submit handler read a
  blank or zero hours box and wrote a one-hour commitment: the student never
  typed that hour, never saw it, and their week moved because of it. The two
  input paths now hold the same standard — the request sheet and the add sheet
  both refuse and explain rather than coerce. The add sheet has no forecast, so
  it allows a date beyond four weeks where the request sheet cannot.

### Removed

`components/app/WeightChip.tsx` and `ASK_KINDS` in `lib/decline.ts` are gone;
nothing rendered or imported either after Today's upcoming-days list and the
request sheet were rebuilt. Checked against every remote branch first — the
only other references were in two files already rewritten in this lane. The
file map in PHASE_PLAN.md is updated to match.

## Integration, 9 September 2026: two lanes built the same five things

Ku's branch and `main` independently implemented sheet focus management,
clipboard failure handling, atomic accept/decline, add-commitment validation,
a put-down confirmation and a spoken CarryBar label. This records which
version survived the merge and why, so nothing looks like it was dropped by
accident. Everything Thong built that had no counterpart — the shell, the
living Week, the supporting-route frame, the deployment — is kept as-is.

| Feature | Kept | Why |
|---|---|---|
| App shell, navigation, deep links | Thong's | No counterpart. Ku's `RouteHeader` was a stopgap and is deleted, as its own comment said it would be. |
| Sheet focus management | Ku's `lib/useFocusTrap.ts` | `useModalDialog` does not set `inert`, so background controls stay in the tab order; it has no `focusin` recovery, no scrollbar-gutter compensation, focuses the first control rather than the heading, and cannot re-focus on a step change. |
| Atomic accept/decline | Ku's store | `main`'s `decideAsk` has no idempotency: the only guard is component state that resets when the sheet is reopened, so close-and-reopen books the same shift twice. The gate asks for close/reopen to be tested. Ku's dedupes on `intentId` inside the store and has 13 tests. |
| Which week a decision records | Ku's | `main` stored `price.worst` — the heaviest week in the horizon, not the week the request lands in. |
| Add-commitment validation | Ku's `lib/engine/validate.ts` | Shared by three call sites and covered by 18 tests, rather than inline in one component. |
| Put-down confirmation | Ku's preview | Superset: names the hours freed, the day that actually opens up, and that this week's reading will not change. |
| CarryBar label | Both | Ku's per-band sentence plus Thong's explanation of what the shaded area is. |
| Category and intensity grouping | Thong's `ChoiceRow` | A `<fieldset>`/`<legend>` is what a group of choices is; a `<label>` can only name one control. |
| `ASKS.keptFree` over `handedBack` | Thong's | Declining keeps hours free; it does not hand anything back. The distinction is in the plan. |

**Now unused, and Thong's call.** `components/app/shell/useModalDialog.ts` has
no callers after this merge — its only two consumers were the sheets. Delete
it, or point AppShell's More sheet at it: that sheet currently carries a third
inline copy of the same focus logic, and it is the copy without `inert`.

**Also worth a look, not touched here.** `app/(app)/layout.tsx` mounts
AppShell but the `(app)` group contains no pages, so it is dead code. Any page
moved into it while still self-mounting AppShell would render two shells.

## Landing decision preview verification — 9 September 2026

- Implemented local accept/decline preview, original request details, fixed baseline comparison, factual hours, unsent selectable reply and sample CTA. Hero and existing sections are preserved.
- Browser verified 128% reference, 132% acceptance and 128% decline with eight hours kept free for the current shared sample. CTA opens Aisyah's reset demo; app request matches Kelly's shift, 18 September 2026, eight hours.
- Repeated keyboard toggling passed at 360/390/768/1024/1440px without overflow. Reply space is retained across choices. A small button-border size difference was removed by reserving the same border width for both states.
- Focused tests cover affected-week selection, fixture immutability across repeated previews, added/kept-free wording and unavailable forecast handling. Source review found no blockers; no store writes or decision actions are imported. Saved-state isolation is established by code structure and fixture tests, not a browser-storage snapshot.
- A Windows case-insensitive helper/component filename collision was fixed by renaming the pure helper to previewOutcome.ts. npm run verify subsequently passed with 144 tests; a final check follows the border adjustment.
- Browser validation used a fresh production server at localhost:3002. Screenshots outside the repo: C:/Users/User/.codex/visualizations/2026/09/08/01a08121-815e-7c70-87c1-ecbf9bd97538/decision-preview-desktop.png and decision-preview-mobile.png.
- True browser 200% zoom and reduced-motion preference emulation remain manual checks. CSS disables the selection transition for reduced motion. Same branch/worktree, no commit or push.

Final verification after the border adjustment: npm run verify passed (voice gate, lint, 15 test files / 144 tests, TypeScript and production build). git diff --check passed.

## Landing simplification verification — 10 September 2026

- Combined the decision cards into one panel, removed the duplicate eight-hour put-down example, shortened its explanation and removed the How it works introductory paragraph.
- Production browser inspection at localhost:3003 confirmed the revised desktop composition and no horizontal overflow at 360/390/768/1024/1440px. Saved landing-simplified-desktop.png and landing-simplified-mobile.png under C:/Users/User/.codex/visualizations/2026/09/08/01a08121-815e-7c70-87c1-ecbf9bd97538/.
- Verification immediately after the layout changes passed: voice gate, lint, 144 tests, TypeScript and production build. Zoom and reduced-motion browser limitations remain as previously recorded.
- On continuation the active branch is feature/icon-and-title-refresh, with additional icon/metadata changes from other work. These were preserved; no checkout, commit or push was performed.
