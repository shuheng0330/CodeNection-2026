"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { addDays, format } from "date-fns";
import { CarryBar } from "@/components/app/CarryBar";
import { NoButton } from "@/components/app/NoButton";
import { PutDownCard } from "@/components/app/PutDownCard";
import { WeightChip } from "@/components/app/WeightChip";
import { Reveal } from "@/components/landing/Reveal";
import { BAND, PRODUCT, TODAY } from "@/lib/copy";
import { eventLoad } from "@/lib/engine/acwr";
import { suggestPutDown } from "@/lib/engine/putdown";
import { useCarry, usePikul } from "@/lib/store";
import { PERSONAS } from "@/lib/seed/personas";

export default function TodayPage() {
  // The seed is derived from the real date and the store rehydrates from
  // localStorage, so render nothing until mounted rather than risk a
  // server/client mismatch mid-demo.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { persona, asOf, events, carry } = useCarry();
  const setPersona = usePikul((s) => s.setPersona);

  const thisWeek = useMemo(() => {
    const from = format(addDays(asOf, -6), "yyyy-MM-dd");
    const to = format(asOf, "yyyy-MM-dd");
    return events
      .filter((e) => e.date >= from && e.date <= to)
      .sort((a, b) => eventLoad(b) - eventLoad(a));
  }, [events, asOf]);

  const putDown = useMemo(
    () => suggestPutDown(events, addDays(asOf, -6)),
    [events, asOf],
  );

  if (!mounted) {
    return <div className="min-h-screen bg-linen" />;
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-5 pb-24 pt-10">
      <header className="flex items-baseline justify-between">
        <Link href="/" className="font-display text-xl">
          {PRODUCT.name}
        </Link>
        <p className="text-sm text-ink-faint">{format(asOf, "EEEE, d MMM")}</p>
      </header>

      {/* the sentence, before anything else */}
      <Reveal className="mt-10">
        <h1 className="font-display text-h1">{BAND[carry.band].line}</h1>
      </Reveal>

      <Reveal delay={0.06} className="mt-8">
        <CarryBar ratio={carry.ratio} band={carry.band} />
      </Reveal>

      <Reveal delay={0.12} className="mt-10">
        <PutDownCard event={putDown} />
      </Reveal>

      <Reveal delay={0.18} className="mt-8">
        <NoButton events={events} asOf={asOf} />
      </Reveal>

      <section className="mt-12">
        <h2 className="text-micro uppercase tracking-[0.08em] text-ink-faint">
          {TODAY.weekLabel}
        </h2>
        <div className="mt-4 grid gap-2">
          {thisWeek.map((e) => (
            <WeightChip key={e.id} event={e} />
          ))}
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
              className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
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
      </section>
    </main>
  );
}
