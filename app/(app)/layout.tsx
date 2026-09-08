"use client";

import { useEffect } from "react";
import { PERSONAS } from "@/lib/seed/personas";
import { usePikul } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

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
  const hydrated = useHydrated();
  const reset = usePikul((s) => s.reset);
  const setPersona = usePikul((s) => s.setPersona);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("reset") === "1") reset();
    const p = q.get("persona");
    if (p && PERSONAS.some((x) => x.id === p)) setPersona(p);
  }, [reset, setPersona]);

  // The seed is derived from the real date and the store rehydrates from
  // localStorage, so hold the first paint rather than risk a mismatch.
  if (!hydrated) return <div className="min-h-screen bg-linen" />;

  return <>{children}</>;
}
