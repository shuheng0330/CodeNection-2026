"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { addDays, format } from "date-fns";
import { AddCommitmentSheet } from "@/components/app/AddCommitmentSheet";
import { AreaBreakdown } from "@/components/app/AreaBreakdown";
import { CarryBar } from "@/components/app/CarryBar";
import { NoButton } from "@/components/app/NoButton";
import { PutDownCard } from "@/components/app/PutDownCard";
import { WeightChip } from "@/components/app/WeightChip";
import { Reveal } from "@/components/shared/Reveal";
import { AHEAD, AREAS, BAND, PRODUCT, WEEK } from "@/lib/copy";
import { toISODate } from "@/lib/engine/dates";
import { putDownReason, suggestPutDown, whenLabel } from "@/lib/engine/putdown";
import { useCarry, usePikul } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { PERSONAS } from "@/lib/seed/personas";

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
    <main className="mx-auto min-h-screen w-full max-w-lg px-5 pb-24 pt-10 lg:max-w-6xl lg:px-10">
      <header className="flex items-baseline justify-between">
        <Link href="/" className="font-display text-xl">
          {PRODUCT.name}
        </Link>
        <div className="flex items-baseline gap-5">
          <Link
            href="/method"
            className="text-sm text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            How it works
          </Link>
          <Link
            href="/recover"
            className="text-sm text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Recover
          </Link>
          <Link
            href="/compare"
            className="text-sm text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Compare
          </Link>
          <Link
            href="/week"
            className="text-sm text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            {WEEK.title}
          </Link>
          <p className="text-sm text-ink-faint">{format(asOf, "EEEE, d MMM")}</p>
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-14">
        {/* ---- see, explain, act ---- */}
        <div className="lg:pt-4">
          <Reveal className="mt-10">
            <h1 className="font-display text-h1">{BAND[carry.band].line}</h1>
          </Reveal>

          <Reveal delay={0.06} className="mt-8">
            <CarryBar ratio={carry.ratio} band={carry.band} />
          </Reveal>

          <Reveal delay={0.12} className="mt-12">
            <h2 className="px-3 text-micro uppercase tracking-[0.08em] text-ink-faint">
              {AREAS.title}
            </h2>
            <div className="mt-4">
              <AreaBreakdown events={events} asOf={asOf} />
            </div>
          </Reveal>

          <Reveal delay={0.18} className="mt-12">
            <PutDownCard
              suggestion={suggestion}
              handedBack={handedBack}
              reason={reason}
              asOf={asOf}
            />
          </Reveal>
        </div>

        {/* ---- decide, and see what is still changeable ---- */}
        <div className="lg:pt-14">
          <Reveal delay={0.24} className="mt-12 grid gap-3 lg:mt-0">
            <NoButton events={events} asOf={asOf} />
            <AddCommitmentSheet asOf={asOf} />
          </Reveal>

          <section className="mt-12">
            <h2 className="text-micro uppercase tracking-[0.08em] text-ink-faint">
              {AHEAD.title}
            </h2>
            <div className="mt-4 grid gap-2">
              {ahead.length === 0 ? (
                <p className="text-ink-muted">{AHEAD.empty}</p>
              ) : (
                ahead.map((e) => (
                  <WeightChip key={e.id} event={e} when={whenLabel(e.date, asOf)} />
                ))
              )}
            </div>
          </section>

          {/* Switching persona is the fastest proof of the whole thesis:
              the same measure against a completely different normal. */}
          <section className="mt-14 border-t border-hairline pt-8">
            <h2 className="text-micro uppercase tracking-[0.08em] text-ink-faint">
              Try someone else&rsquo;s week
            </h2>
            <div className="mt-4 grid gap-2">
              {PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPersona(p.id)}
                  aria-pressed={p.id === persona.id}
                  className={`min-h-11 rounded-2xl border px-4 py-3 text-left transition-colors ${
                    p.id === persona.id
                      ? "border-clay-600 bg-clay-100"
                      : "border-hairline hover:bg-raised"
                  }`}
                >
                  <p className="font-medium">
                    {p.name}
                    <span className="ml-2 text-sm font-normal text-ink-faint">
                      {p.course}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">{p.blurb}</p>
                </button>
              ))}
            </div>
            <button
              onClick={reset}
              className="mt-6 min-h-11 text-sm text-ink-faint underline-offset-4 transition-colors hover:text-ink-muted hover:underline"
            >
              Reset demo
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
