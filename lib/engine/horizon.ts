import { addDays, endOfWeek, startOfWeek } from "date-fns";
import type { LoadEvent } from "./types";
import { computeCarry, eventLoad } from "./acwr";
import { toISODate } from "./dates";
import { weekLabelFor } from "./forecast";

/**
 * The weeks you can still change.
 *
 * Everything before this screen was retrospective — it told you about a week
 * you had already lived. The brief's actual verb is preventive ("before
 * burnout hits"), and you cannot act on a week that has already happened.
 *
 * No new maths: this walks the same computeCarry over dates that have not
 * arrived yet, using commitments already on the calendar. Nothing is guessed.
 */
export interface DayLoad {
  date: string;
  load: number;
  hours: number;
  /** already lived through — shown, but not something you can move */
  past: boolean;
}

export interface WeekAhead {
  label: string;
  start: string;
  end: string;
  days: DayLoad[];
  hours: number;
  load: number;
  ratio: number;
  /** the heaviest few things, for the panel caption */
  notable: LoadEvent[];
}

export const HORIZON_WEEKS = 4;

export function weeksAhead(
  events: LoadEvent[],
  asOf: Date,
  currentWeek: number,
  count: number = HORIZON_WEEKS,
): WeekAhead[] {
  const today = toISODate(asOf);
  const out: WeekAhead[] = [];

  for (let i = 0; i < count; i++) {
    const anchor = addDays(asOf, i * 7);
    const start = startOfWeek(anchor, { weekStartsOn: 1 });
    const end = endOfWeek(anchor, { weekStartsOn: 1 });
    const from = toISODate(start);
    const to = toISODate(end);

    const inWeek = events.filter((e) => e.date >= from && e.date <= to);

    const days: DayLoad[] = [];
    for (let d = 0; d < 7; d++) {
      const date = toISODate(addDays(start, d));
      const onDay = inWeek.filter((e) => e.date === date);
      days.push({
        date,
        load: onDay.reduce((s, e) => s + eventLoad(e), 0),
        hours: onDay.reduce((s, e) => s + e.hours, 0),
        past: date < today,
      });
    }

    out.push({
      label: weekLabelFor(asOf, anchor, currentWeek),
      start: from,
      end: to,
      days,
      hours: inWeek.reduce((s, e) => s + e.hours, 0),
      load: inWeek.reduce((s, e) => s + eventLoad(e), 0),
      // Measured at the end of the week, so a week still ahead is priced on
      // everything currently committed to it.
      ratio: computeCarry(
        events.filter((e) => e.date <= to),
        end,
      ).ratio,
      notable: [...inWeek].sort((a, b) => eventLoad(b) - eventLoad(a)).slice(0, 3),
    });
  }

  return out;
}

/** Small multiples only tell the truth on a shared scale. */
export const peakDayLoad = (weeks: WeekAhead[]): number =>
  Math.max(1, ...weeks.flatMap((w) => w.days.map((d) => d.load)));
