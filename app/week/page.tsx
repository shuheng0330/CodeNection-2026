"use client";

import { useMemo } from "react";
import { CollisionCard } from "@/components/app/CollisionCard";
import { NoButton } from "@/components/app/NoButton";
import { WeekPanels } from "@/components/app/WeekPanels";
import { AppShell } from "@/components/app/shell/AppShell";
import { Reveal } from "@/components/shared/Reveal";
import { WEEK } from "@/lib/copy";
import { collisions } from "@/lib/engine/collisions";
import { weeksAhead } from "@/lib/engine/horizon";
import { CURRENT_WEEK } from "@/lib/seed/generateSemester";
import { useCarry } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

export default function WeekPage() {
  const hydrated = useHydrated();
  const { asOf, events } = useCarry();

  const weeks = useMemo(
    () => weeksAhead(events, asOf, CURRENT_WEEK),
    [events, asOf],
  );

  // One wall, not a list of them. The same restraint as the put-down: a
  // ranked set of five things to dread is just another backlog.
  const wall = useMemo(() => {
    const found = collisions(events, asOf);
    if (found.length === 0) return null;
    const c = found[0];
    const inWeek = weeks.find((w) => c.from >= w.start && c.from <= w.end);
    return { collision: c, label: inWeek?.label ?? "" };
  }, [events, asOf, weeks]);

  if (!hydrated) return <div className="min-h-screen bg-linen" />;

  return (
    <AppShell>
      <main className="mx-auto min-h-screen w-full max-w-lg px-5 pb-28 pt-10 lg:max-w-6xl lg:px-10">
      <Reveal className="mt-10">
        <h1 className="font-display text-h1">{WEEK.title}</h1>
        <p className="mt-4 max-w-xl text-lead text-ink-muted">{WEEK.lead}</p>
      </Reveal>

      <Reveal delay={0.08} className="mt-10">
        {wall ? (
          <CollisionCard collision={wall.collision} weekLabel={wall.label} />
        ) : (
          <div className="rounded-3xl border border-hairline bg-surface p-6">
            <p className="text-ink-muted">{WEEK.quiet}</p>
          </div>
        )}
      </Reveal>

      <Reveal delay={0.14} className="mt-10">
        <WeekPanels weeks={weeks} />
      </Reveal>

      <Reveal delay={0.2} className="mx-auto mt-12 max-w-lg">
        <NoButton events={events} asOf={asOf} />
      </Reveal>
      </main>
    </AppShell>
  );
}
