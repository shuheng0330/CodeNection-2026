"use client";

import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { WEEK } from "@/lib/copy";
import type { Collision } from "@/lib/engine/collisions";

/**
 * The wall, named before you walk into it.
 *
 * Everything else in the product speaks in relative terms because that is the
 * honest way to talk about load. This card is the exception that proves it
 * works: a pile-up is discrete and countable, so it can be stated flatly.
 * "Four things land across four days" cannot be argued with, needs no
 * baseline to warm up, and lands in a way "1.4" never does.
 */
export function CollisionCard({
  collision,
  weekLabel,
}: {
  collision: Collision;
  weekLabel: string;
}) {
  const span = differenceInCalendarDays(parseISO(collision.to), parseISO(collision.from)) + 1;
  // One title can appear on several days as it ramps toward a deadline;
  // counting rows would overstate how many separate things there are.
  const distinct = [...new Set(collision.events.map((e) => e.title))];

  return (
    <div className="rounded-3xl border border-clay-600/30 bg-clay-100/50 p-6 shadow-soft">
      <p className="text-micro uppercase tracking-[0.08em] text-clay-700">
        {WEEK.wallLabel}
      </p>

      <p className="mt-3 font-display text-h2 text-ink">
        {WEEK.wallLine(weekLabel, distinct.length, span)}
      </p>

      <p className="mt-2 text-ink-muted">{WEEK.wallDensity(collision.timesUsual)}</p>

      <ul className="mt-5 grid gap-1.5">
        {distinct.slice(0, 5).map((title) => {
          const first = collision.events.find((e) => e.title === title)!;
          return (
            <li key={title} className="flex items-baseline gap-3 text-sm">
              <span className="tnum w-12 shrink-0 text-ink-faint">
                {format(parseISO(first.date), "EEE d")}
              </span>
              <span className="min-w-0 truncate text-ink">{title}</span>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 text-sm text-ink-muted">{WEEK.wallHint}</p>
    </div>
  );
}
