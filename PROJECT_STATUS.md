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

Measured in headless Chrome against a production build, not estimated.

Reflow and overflow, seven routes at 320, 360, 390, 640, 768, 1024 and 1440
CSS pixels: no route scrolls horizontally at any width. 640 is included
because it is what a 1280px desktop viewport becomes at 200% zoom, which is
the other half of WCAG 1.4.10.

Touch targets, same sweep: `/today` and `/compare` are clean.

**Open, and not Ku's to fix.** The back link that reads "Today" on `/week`,
`/recover`, `/asks` and `/method` measures 39x20 CSS pixels — under the 44px
the phase plan's release gate requires. Thong owns those four files. The fix
is one class change per link (`inline-flex min-h-11 items-center`), or it
disappears entirely once AppShell replaces those per-page headers. Ku has not
edited those files; announced here rather than changed.

Not covered by any of the above, and still outstanding for the Friday gate:
NVDA or VoiceOver, real-Android TalkBack, and a physical-device pass. Those
cannot be run headlessly and remain manual.

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
