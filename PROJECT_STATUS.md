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
| Add-commitment validation | Ku's `lib/engine/validate.ts` | Shared by three call sites and covered by 21 tests, rather than inline in one component. |
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
