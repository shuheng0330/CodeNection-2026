# Architecture and coding design

Updated 9 September 2026. Implementation ownership and release criteria: PHASE_PLAN.md.

## Current architecture

Next.js 16.3.4 App Router, React 19, TypeScript, Tailwind CSS 4, Motion, and Zustand. lib/engine contains pure workload, forecast, contribution, collision, put-down and recovery functions. lib/parse uses chrono-node and local rules. lib/seed generates deterministic personas. lib/store.ts persists local changes with Zustand.

The seven page routes live directly under app. app/(app)/layout.tsx currently has no child page routes and does not wrap them. User copy is primarily in lib/copy.ts; reply templates live in lib/decline.ts. The current visual system is Linen & Clay, Fraunces, and DM Sans.

## Planned design

- Thong supplies a client AppShell explicitly mounted by page owners, without relocating routes. Integrate Today first; verify direct loads, internal navigation, persona/reset queries and hydration before expanding.
- Ku supplies a shared deterministic fixture at lib/seed/decisionDemo.ts containing persona, reference date, candidate and forecast. Landing and explicit fresh sample entry share it. Reuse stable demo dates; isolate landing preview and preserve state on ordinary navigation.
- Ku adds atomic request acceptance with duplicate protection: event plus decision once. Decline records only a decision. Preview/cancel does not persist changes.
- Use existing engine output for daily Week views and forecasts. Do not manufacture clock-time gaps or guarantee a lower current measure after removing future events.
- Shared tokens stay in app/globals.css; page owners apply the visual reference. Copy sections are owner-partitioned. No new backend or external messaging service is planned.
- The four signature enhancements have explicit fallbacks. No optional new feature admission late in the sprint.

## Verification and delivery

npm run verify runs voice gate, lint, Vitest and production build. Changed calculations/state require targeted regressions including repeated confirmation, cancellation, navigation and reset. Browser QA covers 360/390/768/1024/1440px, 200% zoom, keyboard/focus, reduced motion and a real Android phone. Inspect heavy, calm, empty and error states.

Thursday evening is a readiness checkpoint. Agreed feature development continues Friday until the 15:00 merge target, followed by final integration/QA/fixes until the 18:00 MYT code freeze on 11 September. Record release commit/deployment before screenshots and filming. Planned architecture above has not been implemented in this documentation task.

Read relevant bundled Next.js guides in node_modules/next/dist/docs before writing application code, as required by AGENTS.md.

## Implemented landing composition — 9 September 2026

The homepage now composes server-rendered CommitmentScene, BuildsQuietly and PutDownPrinciple components. Styles are isolated in components/landing/landing.module.css, preserving global tokens and app screens. Copy changes remain in landing-owned blocks of lib/copy.ts. The 280vh sticky animation was replaced by a normal-flow illustrative chart with a text equivalent; the hero is immediately readable. Existing CarryLine and other animation helpers are retained for later work but are no longer mounted by this landing composition.

Navigation uses existing reset links and the #how anchor, with no state/API changes. Reduced-motion support for this static composition follows from removal of timed reveals and an explicit CSS rule disabling its hover transition. Browser-level preference emulation remains unverified. npm run verify passed on the implemented commit (74 tests, lint, voice gate, TypeScript and production build).

## Landing motion implementation — 9 September 2026

CommitmentScene is now a client island with an approximately two-second timer sequence, a spring MotionValue, four decorative markers and local intro/ready/released state. ropeMotion contains illustration-only curve geometry and frame timing; tests live in lib/landing-motion.test.ts to follow the existing test-discovery convention. Timers are cleaned up; leaving during introduction settles the ready state. Release/replay never touches the store.

AnimatedMonth uses a once-only one-third visibility trigger and a short scaleY stagger. AnimatedSteps observes the group on desktop and each item on mobile, remembering completed entrances across breakpoint changes. Both render visible initial HTML and settle styles during cleanup. Reduced-motion handling uses a landing-local useSyncExternalStore subscription to matchMedia so preference changes also settle active animations; background fields use a finite CSS entrance with a reduced-motion override. Local CSS reserves the scene/control/result area. PutDownPrinciple and the surrounding page remain server components.

## Wide rope implementation revision — 9 September 2026

CommitmentScene now runs an eight-stage, nine-second local timeline. Remaining stage time is retained when paused; document visibility and viewport visibility gate playback. Rope and card lift MotionValues use the existing spring tokens and explicitly stop/resume together. Readable HTML cards follow the SVG curve through responsive CSS custom properties, using four desktop anchors or two mobile columns with staggered hanger lengths. Illustration and caption/control dimensions are reserved. The server renders settled cards; a reactive reduced-motion subscription disables playback.

RevealGroup is a small client wrapper accepting server-rendered children, optional className and div/figure semantics. Each wrapper observes its own 35% entry and animates child transforms with spring.settle and opacity over 650ms, with a 150ms stagger. AnimatedSteps applies a 180ms desktop step stagger and 120ms internal sequence, observing individual steps on mobile. Cleanup restores complete content. This supersedes the earlier static PutDownPrinciple description. No public app API or dependency changes were introduced.

## Brand metadata and static identity assets — 9 September 2026

`lib/brand-metadata.ts` owns the shared title, description, image alternative text and a typed metadata factory. `app/layout.tsx` remains the root metadata export and supplies `VERCEL_PROJECT_PRODUCTION_URL`, falling back to `VERCEL_URL` and then local development. No canonical URL is defined. This keeps route-specific canonical decisions available to their route segments and avoids identifying every app route as the homepage.

Next.js file conventions serve `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png` and `app/opengraph-image.png`. The vector SVG and ICO use a 100% transparent background so the Balanced Pikul Carrying Yoke glyph floats seamlessly in browser tabs without an opaque square box. The ICO contains 16px, 32px and 48px RGBA PNG frames; the Apple icon is 180×180; and the sharing image is 1200×630. `app/opengraph-image.alt.txt` supplies the file-convention Open Graph alternative text, while the metadata object supplies the same text for Twitter. The single Open Graph and Twitter image references are verified in rendered HTML.

`scripts/generate-brand-assets.py` reproducibly generates the assets from the existing Linen & Clay values and the Latin Fraunces/DM Sans font files emitted by `next/font` into `.next`. It emits the transparent `app/favicon.ico`, `app/icon.svg`, `app/apple-icon.png`, and sharing image. It requires a completed Next.js build before regeneration and uses the existing local Pillow tooling; it adds no application dependency or runtime work.

## Hero entrance and shift exit refinement — 9 September 2026

The hero text reuses RevealGroup without wrapping the actions. The shift card opacity derives from its existing lift MotionValue, reaching zero before the -60px release endpoint. This keeps fading and movement paused/resumed together without another timer. The released card is excluded from the accessibility tree; its space remains reserved. Reduced motion jumps the lift to zero and restores visibility.

## Landing QA cleanup — 9 September 2026

The production landing was rechecked against the current CSS Module at all five release widths. Selectors for the superseded static card stack and earlier marker-based motion scene had no remaining TypeScript or TSX references and were removed from `components/landing/landing.module.css`. Current wide-rope, card, entrance, responsive and reduced-motion rules remain unchanged. No shared token, engine, store, route or dependency changed.

## Landing decision preview implementation — 9 September 2026

DecisionPreview is a landing client island with local choice and announcement state. It resolves decisionDemo after mounting to avoid build-time sample-date drift. Server markup retains the explanation and demo CTA with a reserved preview area. previewOutcome is a pure formatter selecting price.landing before/after ratios, rounding to percentages and formatting added/kept-free hours; null landing omits forecast values. Dates use parseISO and local date-fns formatting. The component never imports the store or decision actions. Reply space is reserved across choices; only user selections trigger a polite status announcement and brief CSS opacity transition, disabled with reduced motion.

## Simplified landing composition — 10 September 2026

The request/forecast columns share one bordered surface, with a vertical desktop divider and horizontal mobile divider. Reply space stays reserved across preview selections. PutDownPrinciple retains its existing reveal wrapper but removes the secondary example figure. Local CSS provides a compact heading/body composition and tighter closing-section spacing; app state and forecast logic are unchanged.
