"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CarryBar } from "@/components/app/CarryBar";
import { Reveal } from "@/components/shared/Reveal";
import { BAND, COMPARE, PRODUCT } from "@/lib/copy";
import { computeCarry } from "@/lib/engine/acwr";
import { toISODate } from "@/lib/engine/dates";
import { priceCommitment } from "@/lib/engine/forecast";
import { thisWeekHours, usualWeekHours } from "@/lib/engine/horizon";
import type { LoadEvent } from "@/lib/engine/types";
import { extract } from "@/lib/parse/extract";
import { seedEvents, stableAsOf } from "@/lib/seed/cache";
import { CURRENT_WEEK } from "@/lib/seed/generateSemester";
import { NURUL, WEI_JIAN } from "@/lib/seed/personas";
import { spring } from "@/lib/motion";
import { useHydrated } from "@/lib/useHydrated";

/**
 * The whole thesis, in one screen, with the judge on the hook.
 *
 * Two students. The one carrying THIRTY-ONE FEWER HOURS is the one in
 * trouble, because the only thing that matters is the distance from your own
 * normal. Asking the viewer to commit before the reveal is what makes it
 * stick: being wrong is more memorable than being told.
 *
 * Nothing here is arranged. Both weeks come out of the same deterministic
 * generator, and the ask is whatever the viewer types.
 */
export default function ComparePage() {
  const hydrated = useHydrated();
  const still = useReducedMotion();
  const [picked, setPicked] = useState<string | null>(null);
  const [raw, setRaw] = useState("");

  const asOf = stableAsOf();

  const pair = useMemo(() => {
    return [WEI_JIAN, NURUL].map((persona) => {
      const events = seedEvents(persona, asOf);
      const carry = computeCarry(
        events.filter((e) => e.date <= toISODate(asOf)),
        asOf,
      );
      return {
        persona,
        events,
        carry,
        hours: thisWeekHours(events, asOf),
        usual: usualWeekHours(events, asOf),
      };
    });
  }, [asOf]);

  // Whoever sits furthest above their own normal — computed, never chosen.
  const inTrouble = pair.reduce((a, b) => (b.carry.ratio > a.carry.ratio ? b : a));
  const lighter = pair.reduce((a, b) => (b.hours < a.hours ? b : a));
  const heavier = pair.reduce((a, b) => (b.hours > a.hours ? b : a));

  const ask = useMemo(() => {
    if (!raw.trim()) return null;
    const d = extract(raw, asOf);
    const candidate: LoadEvent = {
      id: "ask",
      date: d.date.value,
      category: d.category.value,
      title: d.title.value,
      hours: d.hours.value,
      intensity: d.intensity.value,
      source: "user",
    };
    return {
      candidate,
      priced: pair.map((p) => ({
        persona: p.persona,
        price: priceCommitment(p.events, candidate, asOf, CURRENT_WEEK),
      })),
    };
  }, [raw, asOf, pair]);

  if (!hydrated) return <div className="min-h-screen bg-linen" />;

  const revealed = picked !== null;

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-5 pb-24 pt-10">
      <header className="flex items-baseline justify-between">
        <Link href="/" className="font-display text-xl">
          {PRODUCT.name}
        </Link>
        <Link
          href="/today"
          className="text-sm text-ink-faint underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          {COMPARE.back}
        </Link>
      </header>

      <Reveal className="mt-10">
        <h1 className="font-display text-h1">{COMPARE.title}</h1>
        <p className="mt-4 text-lead text-ink-muted">{COMPARE.lead}</p>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {pair.map((p) => {
          const chosen = picked === p.persona.id;
          const right = p.persona.id === inTrouble.persona.id;
          return (
            <button
              key={p.persona.id}
              onClick={() => !revealed && setPicked(p.persona.id)}
              disabled={revealed}
              aria-pressed={chosen}
              className={`rounded-3xl border p-6 text-left transition-colors ${
                revealed && right
                  ? "border-clay-600 bg-clay-100/50"
                  : chosen
                    ? "border-ink/30 bg-raised"
                    : "border-hairline bg-surface"
              } ${revealed ? "cursor-default" : "hover:bg-raised"}`}
            >
              <p className="font-display text-2xl">{p.persona.name}</p>
              <p className="mt-1 text-sm text-ink-faint">{p.persona.course}</p>

              <p className="tnum mt-6 font-display text-display leading-none text-ink">
                {Math.round(p.hours)}h
              </p>
              <p className="mt-1 text-micro uppercase tracking-[0.08em] text-ink-faint">
                {COMPARE.hoursThisWeek}
              </p>

              <AnimatePresence>
                {revealed && (
                  <motion.div
                    initial={still ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={spring.settle}
                    className="mt-6"
                  >
                    <CarryBar ratio={p.carry.ratio} band={p.carry.band} />
                    <p className="mt-5 font-display text-xl text-ink">
                      {BAND[p.carry.band].line}
                    </p>
                    <p className="mt-2 text-sm text-ink-muted">
                      {COMPARE.usualLine(p.usual)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      {!revealed && (
        <p className="mt-6 text-center text-sm text-ink-faint">{COMPARE.prompt}</p>
      )}

      <AnimatePresence>
        {revealed && (
          <motion.section
            initial={still ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring.settle}
            className="mt-10"
          >
            <div className="rounded-3xl border border-dusk/25 bg-dusk-100/50 p-6">
              <p className="font-display text-h2">
                {COMPARE.answer(inTrouble.persona.name)}
              </p>
              <p className="mt-3 text-lead text-ink-muted">
                {COMPARE.punchline(
                  lighter.persona.name,
                  lighter.hours,
                  heavier.persona.name,
                  heavier.hours,
                )}
              </p>
              <p className="mt-4 text-sm text-ink-faint">{COMPARE.method}</p>
            </div>

            {/* Now let them supply the ask, so nobody can say we picked it. */}
            <div className="mt-10">
              <h2 className="font-display text-h2">{COMPARE.askTitle}</h2>
              <p className="mt-3 text-ink-muted">{COMPARE.askLead}</p>
              <textarea
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                rows={2}
                placeholder={COMPARE.askPlaceholder}
                aria-label={COMPARE.askLead}
                className="mt-4 w-full resize-none rounded-2xl border border-hairline bg-surface px-4 py-3 text-ink placeholder:text-ink-faint"
              />

              {ask && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {ask.priced.map(({ persona, price }) => (
                    <div
                      key={persona.id}
                      className="rounded-2xl border border-hairline bg-surface px-4 py-4"
                    >
                      <p className="font-medium">{persona.name}</p>
                      <p className="tnum mt-2 font-display text-2xl text-clay-600">
                        {price.landing
                          ? COMPARE.askCost(price.landing.pctOfUsual, price.landing.label)
                          : COMPARE.askBeyond}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setPicked(null);
                setRaw("");
              }}
              className="mt-8 min-h-11 text-sm text-ink-faint underline-offset-4 transition-colors hover:text-ink-muted hover:underline"
            >
              {COMPARE.again}
            </button>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
