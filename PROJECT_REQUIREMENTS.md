# Project requirements

Updated 9 September 2026. Authoritative delivery scope: PHASE_PLAN.md, final consolidated plan.

## Product and delivery

Pikul is a frontend workload prototype for Malaysian university students, using a personal baseline, local browser state, seeded personas, forecasts, negotiable put-down suggestions, and optional recovery choices.

- Prioritise first impression and intentional desktop/tablet/mobile design across all seven existing routes.
- All three members develop: Ku owns decisions, Lim Wey Cheng landing/identity, Thong app navigation/Week/supporting screens.
- Thursday evening is a readiness checkpoint. Continue agreed feature development on Friday until the 15:00 merge target; reserve 15:00–18:00 for final integration/QA/fixes. Code freezes Friday 11 September, 18:00 MYT.
- All three prepare the README, slides and video after freeze, with Saturday reserved for production.
- Deliver one sample-request flow: understand, preview, accept/decline, see truthful hours and forecast. Acceptance saves event and decision once; decline saves only a decision.
- Landing and explicit fresh sample entry share one scenario; landing preview never alters saved app state.
- Attempt Living Week, pasted request in No Button, Breathing Room preview, and landing toggle within the fixed time budget. Review remaining work Thursday noon and use fallbacks if completion will miss Friday 15:00; minimum release does not depend on all enhancements shipping.
- Preserve existing routes/features, reliable reset and local persistence, accessibility, and deployed demo use without accounts, backend or API keys.
- Do not invent live integrations, medical claims, exact free time slots, or guaranteed falling workload measures. Distinguish kept-free hours from reclaimed hours.
- Defer offer-less scenarios, check-in, sharing cards, onboarding and integrations. Record any unmet brief requirement honestly.

## Acceptance and limits

Use PHASE_PLAN.md's release gate and visual/user checks. Estimates require team availability confirmation. The team leader verifies current official submission rules. This task finalised documentation only; application implementation, browser validation, tests, and deployment verification remain pending.

## Lim task 1 — implemented 9 September 2026

The approved landing composition is implemented in commit 83b09f4 on codex/lim-landing: responsive split hero, readable illustrative commitment cards, a normal-flow month/week explanation, the eight-hour put-down example, and three explanatory steps. Sample actions use the existing /today?reset=1 flow. Landing examples are explicitly illustrative and are not the later shared engine fixture.

No dependency, API, store, engine, app-screen or shared-token changes were required. Interactive decision preview, identity assets and motion improvements remain separate tasks. Current validation is recorded in PROJECT_STATUS.md; the earlier documentation-only statement describes the planning revision, not this implementation.

## Landing motion — implemented 9 September 2026

The approved motion pass restores an illustrative spring-driven rope introduction, user-triggered hand-back and replay. The chart grows once on entry; the three explanation steps reveal as a desktop group or independently on mobile. Labels and navigation remain readable without animation or JavaScript. No workload calculations, app state, routes or dependencies changed. Exact verification and remaining manual checks are recorded in PROJECT_STATUS.md.

## Wide rope and section motion revision — 9 September 2026

This revision supersedes the split-hero and static put-down motion requirements above. The hero uses centred copy/actions and a wide rope with four readable HTML commitment cards. A nine-second illustrative weight/relief loop has Pause/Resume controls and suspends off-screen or in a hidden tab. Mobile uses two rows with longer hangers. Reduced motion renders a settled illustration with no automatic playback. Lower headings, the put-down example and step children receive once-only staggered entrances, without replay controls. Existing routes, sample/reset behaviour and app state remain unchanged.

## Brand metadata and sharing identity — 9 September 2026

- Use “Pikul — Your week is more than your timetable.” and the approved product description consistently for document, Open Graph and Twitter metadata.
- Provide a Linen & Clay favicon with 16px, 32px and 48px frames, a matching 180px Apple touch icon, and one static 1200×630 sharing image using Fraunces and DM Sans.
- The sharing image contains only the Pikul wordmark, approved headline, a short factual supporting line and an abstract carrying-rope illustration. It does not contain screenshots, workload figures or judging claims.
- Open Graph and Twitter metadata use the same image with dimensions and descriptive alternative text. Twitter uses a large-image card. Do not define a root canonical URL inherited by every route.
- The project documents still do not contain a confirmed production URL. Until Thong records one, metadata resolves the deployment origin from Vercel’s production URL environment value and uses localhost only for local builds. External crawler previews remain a deployment check.
