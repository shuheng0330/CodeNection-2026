"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { AppShell } from "@/components/app/shell/AppShell";
import { Reveal } from "@/components/shared/Reveal";
import { RECOVER } from "@/lib/copy";
import { suggestPutDown } from "@/lib/engine/putdown";
import { freeBlocks, nextDayIsClear } from "@/lib/engine/recover";
import { useCarry } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

/**
 * The brief's last instruction is to push students toward recovery. Every
 * wellbeing app answers that with a content library or a breathing circle,
 * which is advice, not time.
 *
 * This finds a block that already exists in their own week and names it. When
 * there is no such block — which is true for two of our three students, and
 * is the honest state for anyone working every weekend — it says so, and
 * points at the one commitment that would create one. That is the whole loop:
 * measurement, decision, and then somewhere for the reclaimed hours to land.
 *
 * Nothing on this screen is recorded. The moment we log whether someone
 * rested, we have rebuilt the streak we spent the whole product avoiding.
 */
export default function RecoverPage() {
  const hydrated = useHydrated();
  const [choice, setChoice] = useState<string | null>(null);
  const { asOf, events, carry } = useCarry();

  const best = useMemo(() => freeBlocks(events, asOf)[0] ?? null, [events, asOf]);
  const suggestion = useMemo(
    () => suggestPutDown(events, asOf, carry.ratio),
    [events, asOf, carry.ratio],
  );

  if (!hydrated) return <div className="min-h-screen bg-linen" />;

  const dayName = best ? format(parseISO(best.date), "EEEE") : "";
  const nextName = best
    ? format(parseISO(best.date), "EEEE") === "Sunday"
      ? "Monday"
      : format(new Date(parseISO(best.date).getTime() + 864e5), "EEEE")
    : "";
  const chosenLabel = RECOVER.choices.find((c) => c.key === choice)?.label ?? "";

  return (
    <AppShell>
      <main className="mx-auto min-h-screen w-full max-w-lg px-5 pb-28 pt-10">
      <Reveal className="mt-10">
        <h1 className="font-display text-h1">{RECOVER.title}</h1>
      </Reveal>

      {best ? (
        <>
          <Reveal delay={0.08} className="mt-8">
            <div className="rounded-3xl border border-dusk/25 bg-dusk-100/60 p-6 shadow-soft">
              <p className="text-micro uppercase tracking-[0.08em] text-dusk">
                {RECOVER.found}
              </p>
              <p className="mt-3 font-display text-2xl text-ink">
                {RECOVER.foundLine(dayName)}
              </p>
              <p className="mt-2 text-ink-muted">
                {nextDayIsClear(best)
                  ? RECOVER.clearAfter(nextName)
                  : RECOVER.busyAfter}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.14} className="mt-10">
            <h2 className="text-micro uppercase tracking-[0.08em] text-ink-faint">
              {RECOVER.planTitle}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {RECOVER.choices.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setChoice(choice === c.key ? null : c.key)}
                  aria-pressed={choice === c.key}
                  className={`min-h-11 rounded-full border px-4 py-2 text-sm transition-colors ${
                    choice === c.key
                      ? "border-dusk bg-dusk text-white"
                      : "border-dusk/30 text-ink-muted hover:bg-dusk-100"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {choice && (
              <p className="mt-6 font-display text-xl text-dusk">
                {RECOVER.planLine(dayName, chosenLabel)}
              </p>
            )}
          </Reveal>

          <Reveal delay={0.2} className="mt-12 border-t border-hairline pt-8">
            <p className="text-micro uppercase tracking-[0.08em] text-ink-faint">
              {RECOVER.noteTitle}
            </p>
            <p className="mt-3 text-ink-muted">{RECOVER.note}</p>
          </Reveal>
        </>
      ) : (
        <Reveal delay={0.08} className="mt-8">
          <div className="rounded-3xl border border-hairline bg-surface p-6">
            <p className="font-display text-2xl text-ink">{RECOVER.none}</p>
            {suggestion ? (
              <>
                <p className="mt-3 text-lead text-ink-muted">
                  {RECOVER.noneFix(suggestion.event.title, suggestion.when)}
                </p>
                <Link
                  href="/today"
                  className="mt-6 inline-flex min-h-11 items-center rounded-full bg-dusk px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
                >
                  {RECOVER.noneAction}
                </Link>
              </>
            ) : (
              <p className="mt-3 text-ink-muted">{RECOVER.noneHard}</p>
            )}
          </div>
        </Reveal>
      )}
      </main>
    </AppShell>
  );
}
