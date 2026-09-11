"use client";

import { useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { AddCommitmentSheet } from "@/components/app/AddCommitmentSheet";
import { AreaBreakdown } from "@/components/app/AreaBreakdown";
import { CarryBar } from "@/components/app/CarryBar";
import { NoButton } from "@/components/app/NoButton";
import { PutDownCard } from "@/components/app/PutDownCard";
import { AppShell } from "@/components/app/shell/AppShell";
import { MobileDisclosure } from "@/components/shared/MobileDisclosure";
import { Reveal } from "@/components/shared/Reveal";
import { AHEAD, AREAS, BAND, TODAY } from "@/lib/copy";
import { daysAhead } from "@/lib/engine/horizon";
import { eligiblePutDowns, putDownReason, whenLabel } from "@/lib/engine/putdown";
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
 *
 * AppShell owns navigation, the skip link and the demo deep-links, so none
 * of that is here any more.
 */
export default function TodayPage() {
  // The seed is derived from the real date and the store rehydrates from
  // localStorage, so render nothing until the client has taken over rather
  // than risk a server/client mismatch mid-demo.
  const hydrated = useHydrated();
  const reset = usePikul((s) => s.reset);
  const setPersona = usePikul((s) => s.setPersona);

  const { persona, asOf, events, carry, handedBack } = useCarry();

  const suggestions = useMemo(
    () => eligiblePutDowns(events, asOf, carry.ratio),
    [events, asOf, carry.ratio],
  );
  const reason = useMemo(
    () => putDownReason(events, asOf, carry.ratio),
    [events, asOf, carry.ratio],
  );
  const ahead = useMemo(() => daysAhead(events, asOf), [events, asOf]);

  if (!hydrated) {
    return <div className="min-h-screen bg-linen" />;
  }

  return (
    <AppShell>
      {/* pb-28 on a phone clears the shell's fixed bottom bar. */}
      <main className="mx-auto w-full max-w-lg px-5 pb-28 pt-8 lg:max-w-6xl lg:px-10 lg:pb-20 lg:pt-10">
        <p className="text-right text-sm text-ink-muted">
          {format(asOf, "EEEE, d MMMM")}
        </p>

        {/* Four blocks in one order on a phone and two columns on a desktop.
            The grid places them explicitly rather than reflowing them, so the
            reading and its explanation keep the wide column while the panel
            beside it holds everything that can still change — and neither
            column ends in a long stretch of nothing. */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
          {/* ── what this week weighs ── */}
          <section
            aria-labelledby="reading-title"
            className="lg:col-span-7 lg:col-start-1 lg:row-start-1"
          >
            <Reveal className="mt-6 lg:mt-8">
              <p className="text-micro uppercase tracking-[0.08em] text-ink-faint">
                {TODAY.weekLabel}
              </p>
              {/* A live region wrapping the heading rather than replacing it:
                  role="status" on the h1 itself would trade away the heading.
                  Handing a commitment back or switching student changes this
                  sentence without moving focus, so nothing would announce it. */}
              <div role="status">
                <h1
                  id="reading-title"
                  className="mt-2 text-balance font-display text-h1"
                >
                  {BAND[carry.band].line}
                </h1>
              </div>
            </Reveal>

            <Reveal delay={0.06} className="mt-7">
              <CarryBar ratio={carry.ratio} band={carry.band} />
            </Reveal>
          </section>

          {/* ── and what can still be done about it ── */}
          <section
            aria-labelledby="decide-title"
            className="mt-10 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mt-8"
          >
            <h2 id="decide-title" className="sr-only">
              Decisions
            </h2>
            <div className="grid gap-3">
              <NoButton events={events} asOf={asOf} />
              <AddCommitmentSheet
                asOf={asOf}
                events={events}
                triggerAppearance="link"
              />
            </div>

            <Reveal delay={0.12} className="mt-6">
              <PutDownCard
                key={persona.id}
                suggestions={suggestions}
                handedBack={handedBack}
                reason={reason}
                asOf={asOf}
                events={events}
              />
            </Reveal>
          </section>

          {/* ── the detail behind the verdict ── */}
          <section
            className="mt-12 lg:col-span-7 lg:col-start-1 lg:row-start-2"
            aria-labelledby="areas-title"
          >
            <MobileDisclosure
              buttonClassName="px-3 py-2 rounded-xl hover:bg-raised"
              title={
                <h2
                  id="areas-title"
                  className="text-micro uppercase tracking-[0.08em] text-ink-faint"
                >
                  {AREAS.titleFor(carry.band)}
                </h2>
              }
              metadata={
                <span className="text-xs text-clay-700 font-medium">
                  View breakdown
                </span>
              }
            >
              <div className="mt-4">
                <AreaBreakdown events={events} asOf={asOf} />
              </div>
            </MobileDisclosure>
          </section>

          <section
            className="mt-12 lg:col-span-5 lg:col-start-8 lg:row-start-2"
            aria-labelledby="ahead-title"
          >
            <MobileDisclosure
              buttonClassName="py-2 rounded-xl hover:bg-raised px-1"
              title={
                <h2
                  id="ahead-title"
                  className="text-micro uppercase tracking-[0.08em] text-ink-faint"
                >
                  {AHEAD.title}
                </h2>
              }
              metadata={
                <span className="text-xs text-ink-muted">
                  {ahead.length} {ahead.length === 1 ? "day" : "days"} ahead
                </span>
              }
            >
              {ahead.length === 0 ? (
                <p className="mt-4 text-ink-muted">{AHEAD.empty}</p>
              ) : (
                <ul className="mt-4 grid">
                  {ahead.map((d) => (
                    <li
                      key={d.date}
                      className="flex items-baseline justify-between gap-4 border-b border-hairline py-3 last:border-0"
                    >
                      <div className="min-w-0">
                        <p className="font-medium capitalize">
                          {whenLabel(d.date, asOf)}
                        </p>
                        <p className="truncate text-sm text-ink-muted">
                          {AHEAD.dayLine(d.heaviest.title, d.others)}
                        </p>
                      </div>
                      <p className="tnum shrink-0 text-sm text-ink-muted">
                        {AHEAD.hours(d.hours)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </MobileDisclosure>
            {ahead.length > 0 && (
              <Link
                href="/week"
                className="mt-4 inline-flex min-h-11 items-center text-sm text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                {AHEAD.more}
              </Link>
            )}
          </section>
        </div>

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

          <MobileDisclosure
            className="mt-4"
            buttonClassName="py-2.5 px-3 rounded-2xl border border-hairline hover:bg-raised"
            title={
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-ink">{persona.name}</span>
                <span className="text-xs text-ink-muted">{persona.course}</span>
              </div>
            }
            metadata={
              <span className="text-xs text-clay-700 font-medium">
                Change sample student
              </span>
            }
          >
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
                  <span className="text-sm text-ink-muted">{p.course}</span>
                  <span className="mt-2 text-sm text-ink-muted">{p.blurb}</span>
                </button>
              ))}
            </div>
          </MobileDisclosure>

          <button
            onClick={reset}
            className="mt-5 min-h-11 text-sm text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Reset demo
          </button>
        </section>
      </main>
    </AppShell>
  );
}
