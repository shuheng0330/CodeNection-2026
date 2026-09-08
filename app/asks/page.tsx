"use client";

import { useMemo } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Reveal } from "@/components/shared/Reveal";
import { ASKS, PRODUCT } from "@/lib/copy";
import { usePikul } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

const VERDICT_TONE = {
  fits: "text-sage",
  tight: "text-amber",
  costly: "text-rust",
} as const;

/**
 * The No Button, turned from a party trick into a practice.
 *
 * Boundary apps ship scripts and a decision log; schedulers ship a capacity
 * number. Nobody keeps a log where each entry carries what the thing would
 * actually have cost, because nobody else computed it.
 *
 * Both answers are recorded identically and the totals sit side by side. A
 * screen that scored you on declines would be actively harmful for the people
 * this is built for, who already say yes too easily and already feel bad
 * about it.
 */
export default function AsksPage() {
  const hydrated = useHydrated();
  const asks = usePikul((s) => s.asks);
  const clearAsks = usePikul((s) => s.clearAsks);

  const totals = useMemo(() => {
    let yes = 0;
    let no = 0;
    for (const a of asks) {
      if (a.decision === "yes") yes += a.hours;
      else no += a.hours;
    }
    return { yes, no };
  }, [asks]);

  if (!hydrated) return <div className="min-h-screen bg-linen" />;

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-5 pb-24 pt-10">
      <header className="flex items-baseline justify-between">
        <Link href="/" className="font-display text-xl">
          {PRODUCT.name}
        </Link>
        <Link
          href="/today"
          className="text-sm text-ink-faint underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          {ASKS.back}
        </Link>
      </header>

      <Reveal className="mt-10">
        <h1 className="font-display text-h1">{ASKS.title}</h1>
        <p className="mt-4 text-lead text-ink-muted">{ASKS.lead}</p>
      </Reveal>

      {asks.length === 0 ? (
        <Reveal delay={0.08} className="mt-10">
          <div className="rounded-3xl border border-hairline bg-surface p-6">
            <p className="text-ink-muted">{ASKS.empty}</p>
            <Link
              href="/today"
              className="mt-5 inline-flex min-h-11 items-center rounded-full bg-clay-600 px-6 py-3 font-medium text-white transition-colors hover:bg-clay-500"
            >
              {ASKS.emptyAction}
            </Link>
          </div>
        </Reveal>
      ) : (
        <>
          <Reveal delay={0.08} className="mt-10 grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-hairline bg-surface p-5">
              <p className="tnum font-display text-h2 text-ink">
                {ASKS.hours(totals.yes)}
              </p>
              <p className="mt-1 text-sm text-ink-muted">{ASKS.tookOn}</p>
            </div>
            <div className="rounded-3xl border border-dusk/25 bg-dusk-100/60 p-5">
              <p className="tnum font-display text-h2 text-dusk">
                {ASKS.hours(totals.no)}
              </p>
              <p className="mt-1 text-sm text-ink-muted">{ASKS.handedBack}</p>
            </div>
          </Reveal>

          <Reveal delay={0.14} className="mt-8">
            <ul className="grid gap-2">
              {asks.map((a) => (
                <li
                  key={a.id}
                  className="rounded-2xl border border-hairline bg-surface px-4 py-4"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="min-w-0 truncate font-medium">{a.title}</p>
                    <p className="shrink-0 text-sm text-ink-faint">
                      {a.decision === "yes" ? ASKS.yes : ASKS.no}
                    </p>
                  </div>
                  <p className={`tnum mt-2 text-sm ${VERDICT_TONE[a.verdict]}`}>
                    {ASKS.cost(a.pct, a.weekLabel)}
                  </p>
                  <p className="mt-1 text-sm text-ink-faint">
                    {ASKS.hours(a.hours)} · {format(parseISO(a.at), "d MMM")}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2} className="mt-10 border-t border-hairline pt-8">
            <p className="text-ink-muted">{ASKS.note}</p>
            <button
              onClick={clearAsks}
              className="mt-5 min-h-11 text-sm text-ink-faint underline-offset-4 transition-colors hover:text-ink-muted hover:underline"
            >
              {ASKS.clear}
            </button>
          </Reveal>
        </>
      )}
    </main>
  );
}
