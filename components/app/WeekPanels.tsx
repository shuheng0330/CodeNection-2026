"use client";

import { format, parseISO } from "date-fns";
import { WEEK } from "@/lib/copy";
import { peakDayLoad, type WeekAhead } from "@/lib/engine/horizon";

/**
 * Four weeks, shown at once.
 *
 * Deliberately NOT animated. A controlled study of trend comparison on
 * phones found people were faster with small multiples than with animation
 * on seven of nine tasks — and animation would also mean a judge watching a
 * five-minute video has to wait for the answer instead of seeing it.
 *
 * One shared vertical scale across all four panels. Auto-scaling each panel
 * would make a quiet week look identical to a brutal one, which is the
 * failure mode that makes small multiples lie.
 */
const DAY_INITIALS = ["M", "T", "W", "T", "F", "S", "S"];

export function WeekPanels({ weeks }: { weeks: WeekAhead[] }) {
  const peak = peakDayLoad(weeks);
  const heaviest = weeks.reduce((a, b) => (b.load > a.load ? b : a));

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {weeks.map((w) => (
        <Panel key={w.label} week={w} peak={peak} isPeak={w.label === heaviest.label} />
      ))}
    </div>
  );
}

function Panel({
  week,
  peak,
  isPeak,
}: {
  week: WeekAhead;
  peak: number;
  isPeak: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-5 ${
        isPeak ? "border-clay-600/40 bg-clay-100/40" : "border-hairline bg-surface"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <p className="text-micro uppercase tracking-[0.08em] text-ink-faint">
          {week.label}
        </p>
        <p className="tnum text-sm text-ink-muted">{WEEK.hoursLabel(week.hours)}</p>
      </div>

      <div
        className="mt-4 flex h-24 items-end gap-1"
        role="img"
        aria-label={`${week.label}: ${WEEK.hoursLabel(week.hours)} across seven days`}
      >
        {week.days.map((d, i) => (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-20 w-full items-end">
              <div
                className={`w-full rounded-t-[3px] ${
                  d.past ? "bg-hairline" : isPeak ? "bg-clay-600" : "bg-clay-500/60"
                }`}
                style={{ height: `${Math.max(2, (d.load / peak) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-ink-faint">{DAY_INITIALS[i]}</span>
          </div>
        ))}
      </div>

      <ul className="mt-4 grid gap-1">
        {week.notable.length === 0 ? (
          <li className="text-sm text-ink-faint">{WEEK.empty}</li>
        ) : (
          week.notable.map((e) => (
            <li key={e.id} className="truncate text-sm text-ink-muted">
              <span className="text-ink-faint">
                {format(parseISO(e.date), "EEE")}
              </span>{" "}
              {e.title}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
