"use client";

import { useEffect, useMemo } from "react";
import { addDays, format } from "date-fns";
import { AddCommitmentSheet } from "@/components/app/AddCommitmentSheet";
import { AreaBreakdown } from "@/components/app/AreaBreakdown";
import { CarryBar } from "@/components/app/CarryBar";
import { NoButton } from "@/components/app/NoButton";
import { PutDownCard } from "@/components/app/PutDownCard";
import { WeightChip } from "@/components/app/WeightChip";
import { RouteHeader } from "@/components/app/decision/RouteHeader";
import { Reveal } from "@/components/shared/Reveal";
import { AHEAD, AREAS, BAND, TODAY } from "@/lib/copy";
import { toISODate } from "@/lib/engine/dates";
import { putDownReason, suggestPutDown, whenLabel } from "@/lib/engine/putdown";
import { useCarry, usePikul } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { DEMO_LABEL } from "@/lib/seed/decisionDemo";
import { PERSONAS } from "@/lib/seed/personas";

/**
 * The screen the whole product is for.
 *
 * Composed around one reading and the things that can change it. On a phone
 * that is a single column in the order a student needs it: what this week
 * weighs, then what they can do about it, then the detail behind the verdict.
 * On a desktop the reading keeps the main column and everything that changes
 * the week moves into a panel beside it, so the page reads as a workspace
 * rather than a phone mockup stretched across a monitor.
 *
 * The panel is declared once and placed by the grid, not rendered twice at
 * two breakpoints — two mounts would mean two dialogs, two focus traps and
 * two independent copies of a decision that must only ever be made once.
 */
export default function TodayPage() {
  // The seed is derived from the real date and the store rehydrates from
  // localStorage, so render nothing until the client has taken over rather
  // than risk a server/client mismatch mid-demo.
  const hydrated = useHydrated();
  const reset = usePikul((s) => s.reset);
  const setPersona = usePikul((s) => s.setPersona);

  // Deep links exist so the demo can be restarted mid-sentence without
  // anyone clearing localStorage by hand in front of a judge.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("reset") === "1") reset();
    const p = q.get("persona");
    if (p && PERSONAS.some((x) => x.id === p)) setPersona(p);
  }, [reset, setPersona]);

  const { persona, asOf, events, carry, handedBack } = useCarry();

  const suggestion = useMemo(
    () => suggestPutDown(events, asOf, carry.ratio),
    [events, asOf, carry.ratio],
  );
  const reason = useMemo(
    () => putDownReason(events, asOf, carry.ratio),
    [events, asOf, carry.ratio],
  );
  const ahead = useMemo(() => {
    const from = toISODate(addDays(asOf, 1));
    const to = toISODate(addDays(asOf, 7));
    return events
      .filter((e) => e.date >= from && e.date <= to)
      .sort((a, b) => (a.date === b.date ? b.hours - a.hours : a.date.localeCompare(b.date)));
  }, [events, asOf]);

  if (!hydrated) {
    return <div className="min-h-screen bg-linen" />;
  }

  return (
    <div className="mx-auto w-full max-w-lg px-5 pb-24 pt-8 lg:max-w-6xl lg:px-10 lg:pb-16 lg:pt-10">
      <a
        href="#reading"
        className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-linen"
      >
        Skip to this week
      </a>

      {/* Thong's AppShell replaces this header wholesale. It reads the same
          NAV list, so nothing below here changes when it lands. */}
      <RouteHeader
        current="/today"
        aside={<p className="text-sm text-ink-faint">{format(asOf, "EEEE, d MMMM")}</p>}
      />

      <main
        id="reading"
        className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-12"
      >
        {/* ── what this week weighs ── */}
        <section
          aria-labelledby="reading-title"
          className="lg:col-span-7 lg:col-start-1 lg:row-start-1"
        >
          <Reveal className="mt-8 lg:mt-10">
            <p className="text-micro uppercase tracking-[0.08em] text-ink-faint">
              {TODAY.weekLabel}
            </p>
            {/* A live region wrapping the heading rather than replacing it:
                role="status" on the h1 itself would trade away the heading.
                Handing a commitment back or switching student changes this
                sentence without moving focus, so nothing would announce it. */}
            <div role="status">
              <h1 id="reading-title" className="mt-2 text-balance font-display text-h1">
                {BAND[carry.band].line}
              </h1>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="mt-7">
            <CarryBar ratio={carry.ratio} band={carry.band} />
          </Reveal>
        </section>

        {/* ── and what can still be done about it ──
            Spanning both rows rather than sitting in one is what gives the
            sticky panel somewhere to travel: a grid item sized to its own
            content has no slack, and sticky inside it never moves. */}
        <section
          aria-labelledby="decide-title"
          className="mt-10 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:mt-10"
        >
          <div className="lg:sticky lg:top-10">
            <h2 id="decide-title" className="sr-only">
              Decisions
            </h2>
            <div className="grid gap-3">
              <NoButton events={events} asOf={asOf} />
              <AddCommitmentSheet asOf={asOf} />
            </div>

            <Reveal delay={0.12} className="mt-6">
              <PutDownCard
                suggestion={suggestion}
                handedBack={handedBack}
                reason={reason}
                asOf={asOf}
                events={events}
              />
            </Reveal>
          </div>
        </section>

        {/* ── the detail behind the verdict ── */}
        <div className="lg:col-span-7 lg:col-start-1 lg:row-start-2">
          <section className="mt-12" aria-labelledby="areas-title">
            <h2
              id="areas-title"
              className="px-3 text-micro uppercase tracking-[0.08em] text-ink-faint"
            >
              {AREAS.title}
            </h2>
            <div className="mt-4">
              <AreaBreakdown events={events} asOf={asOf} />
            </div>
          </section>

          <section className="mt-12" aria-labelledby="ahead-title">
            <h2
              id="ahead-title"
              className="text-micro uppercase tracking-[0.08em] text-ink-faint"
            >
              {AHEAD.title}
            </h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {ahead.length === 0 ? (
                <p className="text-ink-muted">{AHEAD.empty}</p>
              ) : (
                ahead.map((e) => (
                  <WeightChip key={e.id} event={e} when={whenLabel(e.date, asOf)} />
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {/* ── the demo controls, kept outside the product ──
          Switching student is the fastest proof of the whole thesis: the same
          measure against a completely different normal. It is also obviously
          not something a real user would have, so it says so and it sits
          below everything else instead of inside the week. */}
      <section
        className="mt-16 border-t border-hairline pt-8 lg:mt-20"
        aria-labelledby="demo-title"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2
            id="demo-title"
            className="text-micro uppercase tracking-[0.08em] text-ink-faint"
          >
            Try someone else&rsquo;s week
          </h2>
          <p className="rounded-full bg-raised px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-ink-faint">
            {DEMO_LABEL}
          </p>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPersona(p.id)}
              aria-pressed={p.id === persona.id}
              className={`flex min-h-11 flex-col rounded-2xl border px-4 py-3 text-left transition-colors ${
                p.id === persona.id
                  ? "border-clay-600 bg-clay-100"
                  : "border-hairline hover:bg-raised"
              }`}
            >
              <span className="font-medium">{p.name}</span>
              <span className="text-sm text-ink-faint">{p.course}</span>
              <span className="mt-2 text-sm text-ink-muted">{p.blurb}</span>
            </button>
          ))}
        </div>

        <button
          onClick={reset}
          className="mt-5 min-h-11 text-sm text-ink-faint underline-offset-4 transition-colors hover:text-ink-muted hover:underline"
        >
          Reset demo
        </button>
      </section>
    </div>
  );
}
