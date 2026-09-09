import { AppShell } from "@/components/app/shell/AppShell";

/**
 * The app shell.
 *
 * Deliberately NOT the root layout: `app/layout.tsx` belongs to the landing
 * workstream, and putting the client-side gate here means the expansion never
 * touches it.
 *
 * The hydration gate and the demo deep-links live here once rather than being
 * copied into every screen — which also means `?reset=1` and `?persona=nurul`
 * now work on every app route, not just /today.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
