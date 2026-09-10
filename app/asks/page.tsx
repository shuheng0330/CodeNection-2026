"use client";

import { useMemo } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { AppPage, AppPageIntro } from "@/components/app/shell/AppPage";
import { AppShell } from "@/components/app/shell/AppShell";
import { MobileDisclosure } from "@/components/shared/MobileDisclosure";
import { Reveal } from "@/components/shared/Reveal";
import { ASKS } from "@/lib/copy";
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
    <AppShell>
      <AppPage>
        <Reveal>
          <AppPageIntro
            eyebrow={ASKS.eyebrow}
            title={ASKS.title}
            lead={ASKS.lead}
          />
        </Reveal>

        {asks.length === 0 ? (
          <Reveal delay={0.08} className="mt-10 max-w-2xl">
            <section className="rounded-3xl border border-hairline bg-surface p-6 sm:p-8">
              <p className="max-w-xl text-ink-muted">{ASKS.empty}</p>
              <Link
                href="/today"
                className="mt-6 inline-flex min-h-11 items-center rounded-full bg-clay-600 px-6 py-3 font-medium text-white transition-colors hover:bg-clay-500"
              >
                {ASKS.emptyAction}
              </Link>
            </section>
          </Reveal>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
            <Reveal delay={0.08}>
              <aside className="grid gap-3 sm:grid-cols-2 lg:sticky lg:top-8 lg:grid-cols-1">
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
                  <p className="mt-1 text-sm text-ink-muted">{ASKS.keptFree}</p>
                </div>
                <div className="mt-2 border-t border-hairline pt-6 sm:col-span-2 lg:col-span-1">
                  <p className="text-sm leading-relaxed text-ink-muted">{ASKS.note}</p>
                  <button
                    type="button"
                    onClick={clearAsks}
                    className="mt-4 min-h-11 text-sm text-ink-faint underline-offset-4 transition-colors hover:text-ink-muted hover:underline"
                  >
                    {ASKS.clear}
                  </button>
                </div>
              </aside>
            </Reveal>

            <Reveal delay={0.14}>
              <section aria-labelledby="ask-history-title">
                <MobileDisclosure
                  buttonClassName="py-2 px-1 rounded-xl hover:bg-raised"
                  title={
                    <h2
                      id="ask-history-title"
                      className="text-micro uppercase tracking-[0.08em] text-ink-faint"
                    >
                      {ASKS.historyTitle}
                    </h2>
                  }
                  metadata={
                    <span className="text-xs text-ink-muted">
                      {asks.length} {asks.length === 1 ? "decision" : "decisions"}
                    </span>
                  }
                >
                  <ul className="mt-4 grid gap-3">
                    {asks.map((ask) => (
                      <li
                        key={ask.id}
                        className="rounded-2xl border border-hairline bg-surface px-5 py-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <p className="min-w-0 font-medium">{ask.title}</p>
                          <p className="shrink-0 rounded-full bg-raised px-3 py-1 text-xs text-ink-muted">
                            {ask.decision === "yes" ? ASKS.yes : ASKS.no}
                          </p>
                        </div>
                        <p className={`tnum mt-3 text-sm ${VERDICT_TONE[ask.verdict]}`}>
                          {ASKS.cost(ask.pct, ask.weekLabel)}
                        </p>
                        <p className="mt-1 text-sm text-ink-faint">
                          {ASKS.hours(ask.hours)} · {format(parseISO(ask.at), "d MMM")}
                        </p>
                      </li>
                    ))}
                  </ul>
                </MobileDisclosure>
              </section>
            </Reveal>
          </div>
        )}
      </AppPage>
    </AppShell>
  );
}
