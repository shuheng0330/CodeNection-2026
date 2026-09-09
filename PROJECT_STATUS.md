# Project status

Updated 8 September 2026.

## Confirmed from source inspection

- Current branch/worktree retained: main.
- Seven page routes and deterministic workload/parser/seed/local-state modules exist.
- Xiang-a-core-flow is merged at 72a0b87; that merge is not pending.
- npm run verify includes voice gate, lint, tests and production build.
- README.md is empty; the submission evidence package is unfinished.
- Shared route navigation, unused route-group layout, sheet accessibility and CarryBar text-alternative work were identified during source review.

## Completed planning work

- Studied the app, historical plan and current phase plan.
- Completed three review passes, recorded in docs/PLAN_REVIEW.md.
- Consolidated PHASE_PLAN.md into the final team delivery plan with minimum scope, bounded enhancements/fallbacks, three development lanes, early integration, Friday freeze, release gate and shared weekend production.
- Marked PLAN.md historical and synchronised requirements/architecture/status documentation.

## Next actions

- Team kickoff: confirm availability, official deadline/form, mentor status, sample contract and visual references.
- Implement selected frontend scope; review progress Thursday evening and continue development until Friday 11 September, 15:00 MYT.
- Complete final integration/QA/fixes Friday 15:00–18:00 and freeze by 11 September, 18:00 MYT.
- Joint README, diagrams, evidence, slides, recording and early submission.

## Validation limits

This task changed documentation only. No application code was changed, no commit was created, and no runtime/browser/build/test or deployment success is claimed. Estimates and planned improvements are not completed work. External submission rules have not been reverified in this revision. Documentation whitespace checks are recorded in the task's tool output.

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
