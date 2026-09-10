# Pikul README production plan

**Owners:** Thong (Shuheng), Lim Wey Cheng, and Ku  
**Final integrator:** Thong  
**Target:** A public, self-contained `README.md` that explains and evidences the prototype without requiring judges to open files in `docs/`.

This plan follows the submission template and the prototype judging rubric. The
template is a useful structure, not a mandatory format. The rubric is the
acceptance test.

## 1. Non-negotiable submission rules

- Put every scoring claim and essential visual directly in the root
  `README.md`. Supporting notes may remain in `docs/`, but judges must not need
  them to understand or score the project.
- Treat **Ideation (25%) as README-only evidence**. The video is not a fallback
  for a missing mindmap, idea comparison, iteration history, or mentor record.
- The other criteria can be demonstrated in both the README and the video, so
  the two should reinforce one another without repeating every detail.
- Keep the video below five minutes. Aim for **4:20-4:30** so title cards,
  transitions, or upload timing cannot cause an accidental overrun.
- Use only public links. Test the repository, deployment, slides/design link,
  and unlisted video in a signed-out/incognito window.
- Do not submit the template or rubric PDFs. Their requirements must be
  reflected in the README and video.

## 2. README story and section order

The final README should be easy to skim in one pass and follow this order.

### 0. Project header and instant proof

Include:

- project name, team members, and a one-sentence pitch;
- public prototype link;
- video presentation link;
- public slides/design link, if used;
- one strong hero image or short, lightweight GIF from the actual prototype;
- a compact navigation line linking to the major README sections.

**Owner:** Thong assembles and verifies links. Lim supplies the hero visual.
Ku verifies that the pitch accurately describes the implemented product.

### 1. Problem, target group, and existing gap

Answer these questions with evidence rather than generic statements:

- What burden do Malaysian university students carry?
- What causes the problem and when does it become visible?
- Who is directly affected and who else is a stakeholder?
- What do students use now, and why do those tools fall short at the moment a
  new request arrives?
- Why is comparing a student with their own baseline more useful than comparing
  them with a universal ideal?

Name at least one comparable product or current workaround only after checking
an official source. Keep the comparison narrow and factual.

**Rubric coverage:** Impact — problem context (5), target group (5); supports
Creativity — differentiation (3).

**Lead:** Lim  
**Inputs:** All three provide observed student situations; Ku checks product
claims; Thong checks that the section matches the competition problem framing.  
**Reviewer:** Thong.

### 2. Pikul in one minute: solution and before/after

Explain the solution in three or four sentences, then show the core loop:

1. See whether the coming week is heavier than the student's own usual.
2. Paste or inspect an incoming request.
3. Preview the request's cost in the week where it lands.
4. Accept it, decline with a copyable reply, or create breathing room by
   selecting an eligible existing commitment to hand back.
5. See the resulting decision in the week and decision history.

Add one explicit **before/after scenario**. For example: before Pikul, a student
answers a request without seeing the already-heavy week; after Pikul, the same
student sees the consequence and can make or communicate a deliberate choice.
Use figures from the frozen demo build, not hand-written approximations.

**Rubric coverage:** Impact — solution effectiveness (7); Presentation —
clarity (5) and structure (4).

**Lead:** Ku  
**Inputs:** Lim turns the flow into a compact visual; Thong verifies it against
the deployed demo and decision semantics.  
**Reviewer:** Lim.

### 3. Ideation and process — protect the README-only 25%

This must be the richest evidence section, not a paragraph added at the end.

#### 3.1 Rich ideation map

Embed a readable, high-resolution mindmap connecting at least four layers:

- the core problem;
- causes and affected stakeholders;
- moments in the student's journey;
- possible interventions and resulting feature directions.

Show breadth beyond the final screens. A decorative feature map is not enough;
the visual must show how the team explored the problem.

#### 3.2 A second process diagram

Embed either a problem tree or the complete user/decision flow. A problem tree
is preferable if the mindmap already focuses on solutions. Caption what the
diagram revealed and which product decision followed from it.

#### 3.3 Every distinct idea considered

Use a table with the chosen direction first:

| Idea | Need addressed | What we learned | Kept, combined, or dropped | Why |
|---|---|---|---|---|
| Personal-baseline commitment balancer | ... | ... | Chosen | ... |
| Alternative direction 1 | ... | ... | Dropped/combined | ... |
| Alternative direction 2 | ... | ... | Dropped/combined | ... |
| Alternative direction 3 | ... | ... | Dropped/combined | ... |

Include several genuinely distinct product ideas, not four small variations of
one feature. Record only ideas the team actually discussed.

#### 3.4 Evolution timeline

Document multiple iterations in a concise timeline:

| Stage/date | Earlier direction | Evidence or concern | Decision/change | Result in prototype |
|---|---|---|---|---|

Useful evidence already exists in `docs/evidence/`, including the decision
contract, app shell, Living Week, supporting routes, and route-QA notes. Convert
those implementation decisions into a reader-friendly product evolution story;
do not paste engineering logs into the README.

#### 3.5 Mentor consultation and validation

Use the template's structure:

| Date | Mentor/tester | Specific feedback or observation | What changed | Evidence in prototype |
|---|---|---|---|---|

If the team disagreed with advice, explain the reason. Never invent a mentor,
quote, test result, or date. If no mentor consultation occurred, state that gap
honestly and arrange one before submission if possible.

**Rubric coverage:** Ideation — visual diagrams and mindmaps (8), iteration and
idea evolution (7), mentor consultation/feedback integration (7), breadth (3).

**Lead and editor:** Thong  
**Required contributors:** Lim and Ku each submit their idea candidates, one
dropped direction, key decisions they made, and any mentor/tester notes. Lim
draws/polishes the mindmap; Thong draws the problem tree or user flow; Ku checks
that captions and evolution claims match the product.  
**Reviewers:** Lim checks legibility; Ku checks truthfulness and chronology.

### 4. Design and interactive prototype

Link the public deployment and embed **six key captures** from the frozen build:

1. landing page and personal-baseline idea;
2. Today dashboard;
3. incoming-request interpretation and editable fields;
4. before/after decision forecast plus accept/decline outcome;
5. “Choose a different commitment” and hand-back result;
6. Week horizon plus Recover or Asks evidence.

Use a deliberate mixture of desktop and mobile captures. Every image needs:

- descriptive alt text;
- a one- or two-line caption explaining the interaction and why it matters;
- consistent crop, scale, and background;
- text that remains readable on GitHub without opening the source image.

Briefly explain the visual system, hierarchy, mobile behaviour, accessibility
choices, and reduced-motion support. Claim only checks the team actually ran.

**Rubric coverage:** Design — visual consistency (4), usability/UX (4), mockup
completeness (2).

**Lead:** Lim  
**Inputs:** Thong captures the final production build and records its commit;
Ku supplies the exact interaction captions and confirms state correctness.  
**Reviewer:** Ku.

### 5. What makes Pikul different

State the central twist plainly: Pikul is not another task list; it makes the
cost of a new commitment visible relative to the student's own pattern at the
moment they must answer.

Support this with a short competitor/workaround comparison table. Compare only
dimensions Pikul can demonstrate, such as personal baseline, request-cost
preview, decision communication, selectable hand-back, and privacy/offline
operation. Follow it with two or three novel features and why each changes the
user's decision, not merely what the control does.

**Rubric coverage:** Creativity and Novelty — originality (7), novel features
or twists (5), differentiation (3).

**Lead:** Ku  
**Inputs:** Lim researches and sources comparable solutions; Thong checks that
all differentiation claims appear in the frozen build.  
**Reviewer:** Lim.

### 6. Technical architecture and feasibility

Reuse and edit Ku's existing draft in `docs/readme-sections-ku.md`. Include:

- frontend: Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 4;
- local state: Zustand persisted to browser localStorage;
- deterministic parsing and date handling: `chrono-node` and `date-fns`;
- visual/motion libraries: Motion, D3 Shape, and Lucide React;
- hosting: Vercel, after checking the final production deployment;
- explicit current scope: no backend, database, account, API key, or runtime
  network service;
- a small architecture diagram showing UI routes, shared decision surfaces,
  deterministic parser, pure load engine, and local browser storage;
- why these choices fit a frontend prototype and what must change for a real
  multi-device product;
- tests and release checks using the exact count from the frozen commit.

Add a scope table:

| Now — demonstrated prototype | Next — validated extension | Later — not promised |
|---|---|---|

Also state the main time/resource constraints and why the team deliberately
chose a narrow, testable frontend instead of pretending to complete database,
authentication, calendar integrations, and hosting infrastructure at once.

**Rubric coverage:** Feasibility — technical viability and stack (6), realistic
plan/scope (5), resource/time awareness (4).

**Lead:** Ku  
**Inputs:** Thong supplies production URL, frozen commit, test output, and
deployment evidence; Lim supplies final design-system notes.  
**Reviewer:** Thong.

### 7. Method, safeguards, and limitations

Adapt Ku's method and limitations draft, but verify every paper/source before
linking it. Explain the method in plain language first and place equations or
technical detail second.

Prominently preserve these boundaries:

- Pikul measures weighted commitments, not self-reported stress;
- it is not a diagnosis or medical advice;
- forward views total commitments already recorded; they do not predict how a
  person will feel;
- the weighting and transfer from sports science to student commitments are
  design hypotheses that still require validation;
- browser-only data and generated demo personas limit the current prototype;
- accessibility claims must match actual automated and manual checks.

**Lead:** Ku  
**Reviewer:** Thong checks citations and claims; Lim checks readability.

### 8. Evidence, impact, reach, and next steps

Summarise observed validation, QA, and what changed because of it. Then explain:

- immediate value for Malaysian university students;
- who could realistically benefit next;
- how the idea could scale without implying that unbuilt integrations already
  exist;
- the next validation step, the next product step, and the later roadmap.

Tie reach to a plausible rollout path, such as a small campus pilot before
broader university use. Keep “potential” clearly separate from “built”.

**Rubric coverage:** Impact — solution effectiveness (7) and reach/scalability
(3); also strengthens feasibility and presentation credibility.

**Lead:** Thong  
**Inputs:** All three provide test observations and constraints.  
**Reviewer:** Ku.

### 9. Team contributions and local setup

Include a compact contribution table for Thong, Lim, and Ku. Describe ownership
accurately without implying that each person worked alone. Follow with Ku's
short setup commands and a link to the public prototype so judges do not need to
run the app.

**Lead:** Thong integrates the contribution table; Ku owns setup accuracy.  
**Reviewers:** All three approve their own contribution description.

## 3. Three-person production workflow

To prevent merge conflicts, nobody except Thong edits the root README during
drafting.

| Person | Draft location | Primary deliverables | Required handoff |
|---|---|---|---|
| **Thong (integrator)** | `docs/readme-draft-thong.md` | Header links; ideation/evolution; mentor and validation evidence; impact, roadmap, team table, submission checklist | One integrated root README with no placeholders |
| **Lim** | `docs/readme-draft-lim.md` | Problem, audience, existing gap; visual/design rationale; competitor research; polished diagrams and six-screen visual set | Copy-ready prose, source links, and optimized images under `docs/readme-assets/lim-*` |
| **Ku** | Continue `docs/readme-sections-ku.md` | Product flow; novelty; method and limitations; architecture, feasibility, stack, setup, dependencies | Copy-ready verified prose, architecture visual, confirmed citations and frozen-build technical facts |

Shared assets should live under `docs/readme-assets/` with lowercase,
descriptive filenames. Avoid spaces and owner-neutral names such as
`screenshot-final-final.png`. Thong copies final content into `README.md` only
after each lead marks their handoff ready.

### Cross-review contract

Every lead must receive one content review and one truth/implementation review:

| Draft | Content/clarity review | Truth/implementation review |
|---|---|---|
| Lim | Thong | Ku |
| Ku | Lim | Thong |
| Thong | Lim | Ku |

Review comments should identify the exact sentence, visual, or missing rubric
item. Do not perform broad rewrites in another member's draft without telling
the owner.

## 4. Schedule and handoffs

| Time (MYT) | Required outcome |
|---|---|
| **Thu 10 Sep** | Confirm submission rules and public-link requirements. Inventory evidence. Each member gives Thong all real idea, iteration, mentor, and tester notes. Lim drafts the mindmap; Thong drafts the second ideation diagram. |
| **Fri 11 Sep, before 15:00** | Finish agreed frontend work and merge to `main`. Do not capture final screenshots from a moving build. |
| **Fri 11 Sep, 15:00-18:00** | Run release checks, verify the production deployment, record the frozen commit and exact test count, then freeze the build. |
| **Fri 11 Sep, after 18:00** | Each lead completes a rough draft in their assigned file. Thong creates the final README skeleton and inserts confirmed public links. |
| **Sat 12 Sep, 09:00-12:00** | Finish copy, two ideation visuals, architecture visual, competitor sources, method citations, and six frozen-build captures. |
| **Sat 12 Sep, 13:00-15:00** | Thong assembles `README.md`; all three complete the cross-review matrix and score it against every rubric row. |
| **Sat 12 Sep, 15:00-18:00** | Lock README, slides, and a 4:20-4:30 video script; rehearse the live path; record and watch the entire export. |
| **Sun 13 Sep** | Signed-out verification of every link and image, final spelling/claim check, submit with a six-hour buffer, and save submission confirmation. |

## 5. README versus video

The README carries the complete evidence. The video should persuade and prove
the interaction in under five minutes.

Suggested video allocation:

| Time | Content |
|---|---|
| 0:00-0:35 | Student, problem, and why current tools miss the decision moment |
| 0:35-1:00 | Pikul's personal-baseline idea and distinctive promise |
| 1:00-3:15 | Live request, cost preview, accept/decline, and hand-back path |
| 3:15-3:45 | Week/Recover/Asks proof and clear before/after outcome |
| 3:45-4:10 | Feasibility, privacy, and truthful limitations |
| 4:10-4:30 | Impact, next validation step, and closing case |

Do not spend the limited video time listing every dropped idea. Point viewers to
the README's ideation section and use the video to explain why the chosen idea
matters, how it works, and why it deserves to be built.

## 6. Claim guardrails

Before integration, remove or correct any statement that suggests:

- Pikul tracks or diagnoses stress;
- the frontend is a complete production application;
- a backend, database, user account, calendar integration, notification system,
  or AI model exists;
- future commitments predict wellbeing;
- “kept free” and “handed back” mean the same thing;
- the recommended hand-back is the only eligible choice;
- automated accessibility checks equal full assistive-technology testing;
- an outdated deployment commit or test count is still current.

## 7. Final rubric acceptance checklist

### Ideation — 25

- [ ] A readable, multi-layered mindmap is embedded in README.
- [ ] A second process visual (problem tree or user flow) is embedded and
      interpreted.
- [ ] Several distinct ideas are compared, with honest kept/dropped rationale.
- [ ] Multiple dated iterations show evidence, decision, and resulting change.
- [ ] Specific mentor feedback and its impact are documented, or the gap is
      disclosed without fabrication.

### Creativity and Novelty — 15

- [ ] The personal-baseline/request-decision combination is explained as the
      central original idea.
- [ ] At least two implemented twists are demonstrated, not merely named.
- [ ] A factual competitor/workaround comparison explains why Pikul differs.

### Feasibility — 15

- [ ] The stack, architecture, hosting, state, and deterministic calculations
      are accurate for the frozen commit.
- [ ] Built, next, and later scope are visibly separated.
- [ ] Time, data, validation, accessibility, and production constraints are
      acknowledged with a realistic next step.

### Presentation — 15

- [ ] README opens with a clear problem, audience, solution, and working link.
- [ ] Headings and captions produce a logical story without reading source code.
- [ ] The video is clear, rehearsed, engaging, and no longer than five minutes.

### Design — 10

- [ ] Six consistent, readable captures cover the complete core journey.
- [ ] Both desktop and mobile behaviour are visible.
- [ ] Captions explain hierarchy, usability, and interaction outcomes.
- [ ] Essential controls and states do not rely on colour alone.

### Impact — 20

- [ ] The problem and its causes are specific to the target users.
- [ ] Stakeholders and current alternatives are identified.
- [ ] A convincing before/after story shows how Pikul improves a real decision.
- [ ] Reach and scalability follow a plausible validation and rollout path.

### Publication QA

- [ ] No `TODO`, placeholder, unsupported statistic, invented feedback, or stale
      count remains.
- [ ] All README images render on GitHub and have useful alt text.
- [ ] All external sources are linked at the claim they support.
- [ ] Prototype, video, slides/design, and repository open while signed out.
- [ ] Production matches the recorded `main` commit and all relevant release
      checks pass.
- [ ] All three members approve content and contribution descriptions.

## 8. Definition of done

The README is ready when a judge can understand the problem, chosen solution,
ideation journey, novelty, complete prototype flow, design quality, technical
feasibility, limitations, impact, and team contribution from the README alone;
can open every public artifact without requesting access; and can see each
rubric criterion supported by specific text or visual evidence rather than an
unsupported claim.
