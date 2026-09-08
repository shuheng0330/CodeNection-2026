# Phase plan — two review passes

8 September 2026. Review of the design-led plan; these are planning findings, not runtime test results.

## Pass 1 — judge, product, and visual quality

1. **“Design first” was a slogan without a decision gate.** A list of colours, breakpoints, and animations does not establish a strong composition. Require a desktop/mobile reference pair and a first-impression review before polishing all routes.
2. **The first-minute story had too many jobs.** It moved from understanding a baseline to parsing, forecasting, accepting, then dropping another commitment. Use a single sample request and decline outcome for the short demo. Keep handing back an existing commitment as a separate, discoverable flow.
3. **Feature names were doing the selling.** A “Living Week” could be a standard calendar. Its distinguishing behaviour must be visible: the same week before/after a request with an understandable explanation. Daily totals must not masquerade as precise free appointment slots.
4. **Two demos could tell different stories.** Fixed landing figures might contradict the app. Use one engine-derived sample fixture and the same persona/request; label it and keep the preview state isolated.
5. **A quiet week was missing from the design ambition.** A persuasive app must also show that nothing needs to be dropped. Require calm and empty states, not only an overloaded hero screenshot.
6. **The product could accidentally glorify declining.** State the actual tradeoff; a yes must remain a valid decision. Declining a proposed request keeps hours free; handing back an existing commitment reclaims hours. Do not mix those claims.

## Pass 2 — execution, dependencies, and freeze credibility

1. **Thursday-evening feature admission contradicted Friday QA.** Optional ideas now stay in the backlog for this release. They remain useful directions, not scheduled obligations.
2. **The hours looked more certain than the evidence.** No availability was confirmed, no browser audit established the starting quality, and integration was understated. Treat estimates as provisional capacity requirements, check availability Tuesday, and cut scope before expanding anyone's hours.
3. **The shell was a real dependency hidden under “parallel lanes.”** Integrate one representative app page Wednesday morning, before applying it to all screens. Test reset/persona handling across navigation as well as direct page loads.
4. **The request decision changed existing behaviour.** The current No Button logs yes/no; adding accepted events requires atomic state handling and duplicate protection. Keep the before/after preview local and test confirmation separately.
5. **Usability testing on Friday leaves too little room to react.** Move the first unfamiliar-user check to Wednesday and the full-flow check to Thursday. Friday verifies fixes.
6. **“Together on Saturday” was not a schedule.** Put times, outputs, and assembly ownership on README, slides, rehearsal, and recording. Capture raw evidence before freeze so Saturday does not invent a history.
7. **Fallbacks were too vague.** Degrade each new feature independently and early. Preserve the existing flow only after verifying it; source inspection is not evidence that it passes.

## Result

PHASE_PLAN.md incorporates both passes. Core ownership and Friday 18:00 MYT freeze remain. The short demo is narrower, optional work is deferred, shared dependencies integrate earlier, and visual quality has explicit review criteria. Actual effort and application quality still require the team's availability check and browser validation.

## Final pass — consolidation and truthfulness

1. **The plan had become a stack of amendments.** Replaced overlapping sections with a single execution order: experience, design, minimum/enhancement scope, ownership, schedule, release gate, production and submission.
2. **Four “signature” promises obscured the minimum release.** Separated required decision behaviour from enhancements and made fallbacks explicit. Optional backlog is not scheduled work.
3. **Friday still risked becoming integration day.** Required all selected features/fallbacks to be merged and deployed Thursday at 18:00. Friday is testing and fixes until the 18:00 freeze.
4. **A satisfying animation could misrepresent the model.** Future-event removal may not alter today's value; a relative measure need not decrease. Final plan requires factual hours and honest forecasts rather than an automatic visual drop.
5. **Landing/app sample parity ignored saved state.** Added one shared reference date/scenario, isolated landing preview, explicit fresh-sample entry and state-preserving ordinary navigation.
6. **Visual ownership could become a bottleneck.** Lim maintains landing/tokens, Ku supplies Today references, and each owner applies agreed design to their screens.
7. **Validation and brief coverage lacked accountable actions.** Each member recruits a potential tester; Ku checks brief coverage and records deferred check-in requirements honestly. Clipboard and invalid request states are included in release behaviour.

Final result: PHASE_PLAN.md is the consolidated team plan. Review history stays in this file. The plan is finalised as a document; implementation and release validation are still pending.

### Final user correction
Friday remains a development day until the 15:00 merge target. Thursday evening is a readiness checkpoint, replacing the final-pass suggestion of a Thursday integration deadline. Reserve Friday 15:00–18:00 for final integration, tests and fixes; the 18:00 code freeze is unchanged. PHASE_PLAN.md and project documentation reflect this correction.
