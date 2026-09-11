# Pikul Submission Readiness Checklist

**Last audited:** 11 September 2026  
**Audit branch:** `Shuheng` at `eed6456`  
**Integration branch:** `main` at `8df7471` when audited  
**Submission status:** **Not ready yet.** The root `README.md` is empty, so drafted material is not currently visible on the submission's main scoring surface.

This is an internal tracking document. It must not be copied into the public
README. Update it whenever a draft, asset, deployment or submission link
changes.

## Status legend

- ✅ **Complete** - final evidence exists in its intended location and has been verified.
- 🟢 **Draft ready** - complete draft evidence exists but has not been integrated into `README.md`.
- 🟡 **In progress** - evidence is partial, branch-only or awaiting final verification.
- 🔴 **Missing** - no evidence was found.
- ⚪ **Optional** - the submission template explicitly describes the item as optional.

Do not mark a requirement complete only because text exists in a draft. A
README requirement becomes complete when it is integrated, accurate and
visible in the root `README.md`.

## 1. Current readiness snapshot

| Area | Status | Current evidence | What this means |
|---|---|---|---|
| Root submission README | 🔴 Missing | [`README.md`](../README.md) is 0 bytes | None of the drafted documentation is currently available to judges |
| Thong's assigned sections | 🟢 Draft ready | [`readme-draft-thong.md`](readme-draft-thong.md) | V2 contains the header, ideation, evolution, QA summary, impact, roadmap and team contributions |
| Ku's core technical sections | 🟢 Draft ready | [`readme-sections-ku.md`](readme-sections-ku.md) | Method, limitations, architecture, setup and dependencies are drafted |
| Ku's expanded README contribution | 🟡 In progress | `origin/Xiang-readme` at `a39f2a8` | Solution, novelty, competitor comparison, architecture diagram, scope and captions remain branch-only and need safe documentation-only integration |
| Lim's README contribution | 🔴 Missing | No `docs/readme-draft-lim.md`; `origin/Lim_Branch:README.md` is empty | Problem context, stakeholders, comparable apps and final design explanation still need a draft |
| Ideation visuals | 🟢 Draft ready | Mindmap and problem reasoning flow in [`readme-draft-thong.md`](readme-draft-thong.md) | Content exists as Mermaid; Lim may still polish the final visual presentation |
| README image assets | 🔴 Missing | `docs/readme-assets/` does not exist | No final hero image or four-to-eight screen set is ready for GitHub |
| Public prototype | 🟡 In progress | <https://pikul-codenection-2026.vercel.app> returned HTTP 200 on all seven routes during this audit | The app is reachable, but the final deployment has not been matched to the eventual frozen `main` commit or added to the root README |
| Mentor consultation | 🔴 Missing | No mentor record in `docs/evidence.md` | Confirm whether a session occurred; document real feedback or disclose that it did not happen |
| External student testing | 🔴 Missing | No tester or participant record in `docs/evidence.md` | Internal QA must not be presented as user validation |
| Video and slides | 🔴 Missing | No confirmed YouTube or public slides/design link in the repository | Record, publish and verify both final links |
| Final build verification | 🟡 In progress | Historical QA is recorded, but no final frozen-build record exists | Re-run checks and record the exact commit, test result and production deployment after freeze |

## 2. Submission template coverage

| Requirement | Owner | Status | Evidence / location | Action needed |
|---|---|---|---|---|
| Project name and team members | Thong | 🟢 Draft ready | [`readme-draft-thong.md`](readme-draft-thong.md), header | Integrate into root README and have all members confirm names |
| Video presentation link | All; Thong integrates | 🔴 Missing | No confirmed link | Upload the final video, verify signed-out playback and add the link to the README header |
| Presentation slides or design link | Lim; Thong integrates | 🔴 Missing | No confirmed link | Publish the slides/design with public access, verify signed out and add the link |
| Problem causes, stakeholders, comparable solution and gap | Lim | 🔴 Missing | No Lim README draft | Write a concise problem section, name at least one checked comparable solution and explain the specific gap |
| Solution overview and feature set | Ku | 🟡 In progress | Core flow in [`readme-sections-ku.md`](readme-sections-ku.md); expanded version on `origin/Xiang-readme` | Integrate the documentation-only branch changes, shorten for judges and place after the problem section |
| Ideas considered | Thong | 🟢 Draft ready | Seven-direction comparison in [`readme-draft-thong.md`](readme-draft-thong.md) | Cross-review with Lim and Ku, then integrate unchanged unless a factual correction is needed |
| Ideation board or mindmap | Thong and Lim | 🟢 Draft ready | Simplified Mermaid mindmap in [`readme-draft-thong.md`](readme-draft-thong.md) | Confirm GitHub rendering; Lim may replace it with a polished embedded image if readability improves |
| Second ideation visual | Thong | 🟢 Draft ready | Root causes to design principles flow in [`readme-draft-thong.md`](readme-draft-thong.md) | Confirm it remains distinct from the mindmap and renders clearly on mobile |
| Mentor consultation record | Thong | 🔴 Missing | No evidence found | Confirm whether a session occurred and add date, mentor, specific feedback, response and result; otherwise disclose the gap honestly |
| Public UI prototype link | Thong | 🟡 In progress | Live Vercel URL and [`2026-09-09-vercel-deployment.md`](evidence/2026-09-09-vercel-deployment.md) | Add it to root README, then verify the frozen deployment signed out and on a phone |
| Four-to-eight key screenshots with captions | Lim; Ku supplies captions | 🔴 Missing | No `docs/readme-assets/`; Ku captions are branch-only | Capture six screens from the frozen deployment, add alt text and captions, and verify they render on GitHub |
| Novel features and original twist | Ku | 🟡 In progress | Expanded novelty section on `origin/Xiang-readme` | Integrate, simplify and confirm every feature is demonstrated in the frozen build |
| Differentiation from existing solutions | Ku and Lim | 🟡 In progress | Competitor comparison on `origin/Xiang-readme` | Re-check each external source and keep only clear, supportable differences |
| Technical stack and constraints | Ku | 🟢 Draft ready | Architecture, setup and dependencies in [`readme-sections-ku.md`](readme-sections-ku.md) | Update final versions and counts after code freeze, then integrate |
| System architecture diagram | Ku | ⚪ Optional | Mermaid architecture diagram on `origin/Xiang-readme` | Integrate if it remains readable and helps a non-technical judge understand the frontend-only scope |
| Build plan, scope and feasibility | Ku; Thong supplies release facts | 🟡 In progress | Branch-only built/next/later section; [`PHASE_PLAN.md`](../PHASE_PLAN.md) is internal evidence | Convert the branch draft into a concise public scope section and add final deployment facts |

## 3. Judging rubric readiness

The official rubric contains **21 scored subcriteria**. Each appears once below;
no subjective score prediction is included.

| Rubric area | Subcriterion | Weight | Owner | Status | Evidence / gap | Action needed |
|---|---|---:|---|---|---|---|
| Ideation | Visual Diagram and Mindmaps | 8% | Thong and Lim | 🟢 Draft ready | Mindmap plus distinct problem reasoning flow in Thong V2 | Verify GitHub/mobile readability and integrate both visuals |
| Ideation | Iteration and Idea Evolution | 7% | Thong | 🟢 Draft ready | Six major product iterations in Thong V2 | Ku checks chronology; Lim checks clarity; then integrate |
| Ideation | Mentor Consultation and Feedback Integration | 7% | Thong | 🔴 Missing | No mentor evidence found | Add only real feedback and its result, or state that no consultation occurred |
| Ideation | Breadth of Exploration | 3% | Thong | 🟢 Draft ready | Seven distinct ideas compared with selected, combined, deferred and dropped decisions | Complete team factual review before integration |
| Creativity and Novelty | Originality | 7% | Ku | 🟡 In progress | Personal-baseline plus request-time decision story is split across Thong V2 and Ku's branch | Combine into one short originality argument without repetition |
| Creativity and Novelty | Novel Features or Twists | 5% | Ku | 🟡 In progress | Detailed feature explanation remains on `origin/Xiang-readme` | Select two or three strongest demonstrated twists and integrate them |
| Creativity and Novelty | Differentiation from Existing Solutions | 3% | Ku and Lim | 🟡 In progress | Branch-only competitor table; sources require final review | Verify sources and state only narrow, demonstrable differences |
| Feasibility | Technical Viability and Tech Stack | 6% | Ku | 🟡 In progress | Technical draft exists; final commit, deployment and counts are not frozen | Integrate the stack and update all release facts after freeze |
| Feasibility | Planning and Scope Realism | 5% | Ku | 🟡 In progress | Internal plan is complete; public built/next/later wording is branch-only | Add concise current, next and later boundaries to README |
| Feasibility | Resource and Time Awareness | 4% | Ku and Thong | 🟡 In progress | Team allocation and one-week constraints are documented internally | Summarize team, time, cost and deliberate cuts in the public feasibility section |
| Presentation | Clarity of Explanation | 5% | All | 🟡 In progress | Individual drafts exist but no complete README or video | Assemble and cross-review one plain-language story |
| Presentation | Structure and Flow | 4% | Thong | 🟡 In progress | [`README_PLAN.md`](README_PLAN.md) defines the order; root README is empty | Assemble problem to solution to evidence to feasibility to impact in root README |
| Presentation | Delivery and Confidence | 4% | All | 🔴 Missing | No final video | Write, rehearse and record a confident presentation under five minutes |
| Presentation | Engagement and Persuasiveness | 2% | All | 🔴 Missing | No final video or complete public narrative | Centre the demonstration on the request-time before/after decision |
| Design | Visual Consistency | 4% | Lim | 🟡 In progress | Cohesive prototype exists, but final screenshot set and signed-out visual review are missing | Capture consistent desktop/mobile evidence from the frozen build |
| Design | Usability and UX | 4% | Lim; Ku and Thong support | 🟡 In progress | Internal responsive and keyboard QA exists; external student testing is absent | Summarize user-visible QA honestly and add real student observations only if available |
| Design | Mockup Completeness | 2% | Lim | 🟡 In progress | Seven-route prototype is live; no README screen sequence exists | Show four-to-eight screens covering the core journey end to end |
| Impact | Understanding the Problem Context | 5% | Lim | 🔴 Missing | No problem/context draft | Explain causes, stakeholders, real-world implications and the gap in current tools |
| Impact | Target Group Alignment | 5% | Thong and Lim | 🟢 Draft ready | Malaysian university audience is defined in Thong V2 | Integrate and support it with Lim's problem context |
| Impact | Effectiveness of the Solution | 7% | Thong and Ku | 🟢 Draft ready | Before/after comparison in Thong V2; detailed flow in Ku's drafts | Join the comparison to the live prototype flow without duplicating prose |
| Impact | Reach and Scalability | 3% | Thong | 🟢 Draft ready | Now/next/then/later/rollout roadmap in Thong V2 | Integrate and preserve the boundary between built scope and future potential |

## 4. Evidence register

Supporting files prove the team's work, but they do not replace evidence that
must appear directly in the root README or video.

| Evidence | What it currently proves | Readiness note |
|---|---|---|
| [`README.md`](../README.md) | Intended final scoring surface | Empty; highest-priority blocker |
| [`readme-draft-thong.md`](readme-draft-thong.md) | Header, ideation breadth, two visuals, product evolution, QA summary, impact, roadmap and team contributions | V2 is ready for cross-review and integration |
| [`readme-sections-ku.md`](readme-sections-ku.md) | Product flow, method, limitations, architecture, setup and dependencies | Core technical draft exists locally |
| `origin/Xiang-readme:docs/readme-sections-ku.md` | Expanded solution, novelty, competitor comparison, architecture diagram and build scope | Branch-only; integrate documentation files without importing stale application code |
| `docs/readme-inputs-ku.md` | Ku's dated ideation and dropped-direction evidence | Branch-only supporting input for Thong's chronology check |
| `docs/readme-inputs-ku.md` | Alt text, captions and a six-screen capture list | Branch-only input for Lim's final screenshots |
| [`README_PLAN.md`](README_PLAN.md) | Rubric-aligned structure, ownership, production schedule and claim guardrails | Internal coordination evidence, not a substitute for public README content |
| [`PHASE_PLAN.md`](../PHASE_PLAN.md) | Product scope, team ownership, time limits, fallbacks and release gate | Source for the public feasibility summary |
| [`2026-09-09-decision-contract.md`](evidence/2026-09-09-decision-contract.md) | Request-flow evolution, correctness decisions and release checks | Translate user-visible outcomes into concise README evidence |
| [`2026-09-09-app-shell.md`](evidence/2026-09-09-app-shell.md) | Shared navigation, direct routes, reset/persona behaviour and accessibility checks | Internal QA evidence |
| [`2026-09-09-living-week.md`](evidence/2026-09-09-living-week.md) | Four-week interaction and day-selection checks | Internal design and completeness evidence |
| [`2026-09-09-supporting-routes.md`](evidence/2026-09-09-supporting-routes.md) | Recover, Asks and Method behaviour | Internal design and completeness evidence |
| [`2026-09-09-route-qa.md`](evidence/2026-09-09-route-qa.md) | Responsive routes, keyboard paths and bounded fixes | Internal QA, not external user validation |
| [`2026-09-09-vercel-deployment.md`](evidence/2026-09-09-vercel-deployment.md) | Vercel project, public URL and earlier route checks | Production commit is historical and must be refreshed after freeze |
| Missing mentor/tester records | No evidence currently exists | Confirm with the team; never manufacture evidence |
| Missing `docs/readme-assets/` | No final README images currently exist | Lim creates the directory and frozen-build image set |

## 5. Priority actions

| Priority | Action | Owner | Complete when |
|---:|---|---|---|
| 1 | Integrate Ku's README documentation | Ku and Thong | The latest Ku prose, ideation inputs and captions are on the integration branch without stale application-code changes |
| 2 | Produce Lim's problem/design contribution and screenshots | Lim | Problem, stakeholders, comparable solution, design rationale and six optimized screen captures are ready for integration |
| 3 | Confirm mentor and student-testing facts | Thong; all provide notes | Real records are documented, or the absence of each activity is explicitly confirmed for honest disclosure |
| 4 | Assemble the root README | Thong | One coherent README contains all scoring evidence with no internal notes, duplicate sections or placeholders |
| 5 | Freeze and verify the build | Thong and Ku | `main` commit, verification result and matching Vercel deployment are recorded; Lim captures only this build |
| 6 | Add public video and slides links | All; Lim leads slides, Thong integrates links | Both artifacts are public, final and linked from the README header |
| 7 | Complete signed-out and mobile checks | All | Repository, deployment, images, video and slides work signed out; the prototype is checked on a physical phone using mobile data |
| 8 | Obtain final team approval | All | Every member approves the complete README, technical claims, visual evidence and contribution descriptions |

## 6. Final sign-off checklist

- [ ] Root README is complete, readable and contains no placeholder or internal instruction.
- [ ] Problem section covers causes, stakeholders, at least one comparable solution and its gap.
- [ ] Solution overview and feature list match the frozen prototype.
- [ ] Two readable, distinct ideation visuals render correctly on GitHub.
- [ ] Ideas and evolution show real alternatives and meaningful product changes.
- [ ] Mentor and student-testing evidence is truthful; missing activity is disclosed rather than implied.
- [ ] Four-to-eight frozen-build screenshots render with useful alt text and interaction captions.
- [ ] Originality, novel features and differentiation claims are concise and source-checked.
- [ ] Stack, architecture, constraints and built/next/later scope match the frozen commit.
- [ ] Public repository, prototype, video and slides/design links work while signed out.
- [ ] Production deployment matches the recorded frozen `main` commit.
- [ ] All seven routes and reset/persona demo links open directly.
- [ ] Final release checks pass and their exact result is recorded without stale counts.
- [ ] Final video has been watched end to end and remains below five minutes.
- [ ] All three members approve their contribution descriptions and the complete submission.
- [ ] Team leader submits with the planned buffer and saves the submission confirmation.
