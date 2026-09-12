# Pikul submission readiness

**Audited:** 13 September 2026 (MYT)
**Source:** main at b2271bf; application files match the README's 6cb8b22 reference.
**Status:** Ready for the reviewed documentation to be published and the team to submit. No scoring-content blocker found. This audit does not claim the submission form has been sent.

This supersedes the 11 September checklist that described an empty README and missing assets. Historical drafts, phase plans, and dated evidence remain records of their time; the root README is the judge-facing source and this file is the current readiness checklist.

## Verified evidence

- Root README includes project/team, problem and users, alternatives and evolution, two ideation diagrams, mentor feedback and before/after evidence, eight distinct prototype captures, differentiation, architecture, scope, method limits, impact, contributions, and setup.
- All README local file/image targets exist. Header navigation targets match section headings. No submission placeholder remains.
- Repository is public. All seven deployed routes plus reset and Nurul persona links returned HTTP 200 without authentication.
- Google Slides opens signed out in view-only mode as Pikul-Pitch-Deck.pptx (five slides).
- YouTube opens signed out as an unlisted Pikul presentation; its player reports 268.421 seconds (4:28), below the documented five-minute limit.
- The user confirmed team approval, full-video audio/readability review, and physical-phone testing in this task. These are team-reported checks, not agent-observed device or audiovisual testing.
- npm run verify passed: voice gate, ESLint, 172 tests in 18 files, and production build.
- npm run check:release passed against that local production build: seven routes at 320, 360, 390, 640, 768, 1024, and 1440px; touch targets, keyboard dialog entry/trapping/return, five repeated demo runs, accept/decline/undo, invalid duration, and reversible hand-back.
- npm audit --omit=dev reports zero production vulnerabilities. The full audit reports three high-severity findings in the Puppeteer / browser tooling / extract-zip development dependency chain. A major tooling upgrade remains follow-up work; no dependency manifest or lockfile was changed in this audit.

## Rubric coverage

The official Prototype Judging Rubrics.pdf contains 21 subcriteria. Coverage means evidence is present, not a predicted score.

| Area / criterion | Weight | Evidence or assessment boundary |
|---|---:|---|
| Ideation: diagrams and mindmaps | 8% | Embedded ideation map and problem tree |
| Ideation: iteration and evolution | 7% | Seven-stage evolution with concerns and outcomes |
| Ideation: mentor integration | 7% | Named, dated consultation, specific feedback, before/after captures |
| Ideation: breadth | 3% | Seven alternatives with decisions and rationale |
| Creativity: originality | 7% | Personal-baseline request-time decision support |
| Creativity: novel features | 5% | Request-cost preview, editable parsing, selectable hand-back |
| Creativity: differentiation | 3% | Narrow comparison with Calendar/Todoist and linked official sources |
| Feasibility: stack | 6% | Actual dependencies, architecture diagram, deployed frontend |
| Feasibility: realistic scope | 5% | Built/next/later table and explicit exclusions |
| Feasibility: resources/time | 4% | Team roles, build window, infrastructure choices and pilot needs |
| Presentation: clarity | 5% | Problem-to-decision narrative, screenshots and video |
| Presentation: structure | 4% | README navigation and ordered core flow |
| Presentation: delivery | 4% | Team reports full-video review; subjective quality remains for judges |
| Presentation: engagement | 2% | Concrete request scenario; subjective quality remains for judges |
| Design: consistency | 4% | Live prototype and screenshot set |
| Design: usability | 4% | Release matrix plus team-reported physical-phone check |
| Design: completeness | 2% | Seven routes and end-to-end decision evidence |
| Impact: problem context | 5% | Malaysian student context, cited research and causes |
| Impact: target group | 5% | University students balancing multiple commitments |
| Impact: effectiveness | 7% | Before/after decision scenario; no external effectiveness validation claimed |
| Impact: reach | 3% | Campus pilot, support partners, consented future extensions |

## Remaining boundaries and final handoff

- Formal screen-reader / Android TalkBack validation and external student-effectiveness testing remain unverified and are disclosed. Physical-phone confirmation does not imply either of these.
- Public reachability was rechecked; an authenticated Vercel deployment-to-commit record was not independently rechecked during this audit. The README distinguishes source identity from public HTTP checks.
- Video duration/access were independently checked; full audio quality and delivery are confirmed by the team.
- The exact official submission cutoff and a submission receipt are not recorded here. The team leader should use the organiser's confirmed cutoff and retain the receipt after submitting.
- Publication of the reviewed README is authorised by the team. After pushing, check the rendered GitHub README links and retain submission confirmation. Sending the competition submission remains the team leader's final step.
