# Architecture and coding design

Updated 8 September 2026. Implementation ownership and release criteria: PHASE_PLAN.md.

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
