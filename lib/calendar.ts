import {
  addDays,
  differenceInCalendarWeeks,
  endOfMonth,
  endOfWeek,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { toISODate } from "./engine/dates";

/** Monday, because that is where this app's weeks start everywhere else. */
const WEEK_START = { weekStartsOn: 1 } as const;

/**
 * Keep a date inside the range a screen can actually accept.
 *
 * The calendar's keyboard cursor is not the same thing as the chosen date:
 * arrow keys move it a day at a time and it has to stop at the edges rather
 * than wander into days the field would refuse. An unreadable value lands on
 * the first day that can be picked, which is somewhere sensible to start
 * rather than a crash.
 */
export function clampISO(iso: string, min: string, max?: string): string {
  const parsed = iso ? parseISO(iso) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return min;
  if (iso < min) return min;
  if (max !== undefined && iso > max) return max;
  return iso;
}

/**
 * The weeks a month needs, and no more.
 *
 * Always drawing six rows leaves a trailing week belonging entirely to the
 * next month, which on a phone is a row of dead space between the calendar
 * and the button underneath it.
 */
export function monthWeeks(month: Date): Date[][] {
  const first = startOfWeek(startOfMonth(month), WEEK_START);
  const last = endOfWeek(endOfMonth(month), WEEK_START);
  const rows = differenceInCalendarWeeks(last, first, WEEK_START) + 1;
  return Array.from({ length: rows }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(first, w * 7 + d)),
  );
}

export interface DayFill {
  /** how many commitments land on the day — exact, and safe to say out loud */
  count: number;
  /** their hours added up, for sizing a mark rather than for stating */
  hours: number;
}

/**
 * What is already on each day, so a calendar can mark the days that are not
 * as free as they look.
 *
 * The count and the hours are kept apart on purpose. Seeded days can stack a
 * fourteen-hour family commitment on top of coursework and total more than a
 * day holds, which is how the generator attributes effort rather than a
 * promise about a clock. The count is exact either way, so that is the half
 * the interface is allowed to say.
 */
export function fillByDay(events: { date: string; hours: number }[]): Map<string, DayFill> {
  const days = new Map<string, DayFill>();
  for (const e of events) {
    const day = days.get(e.date) ?? { count: 0, hours: 0 };
    days.set(e.date, { count: day.count + 1, hours: day.hours + e.hours });
  }
  return days;
}

export { toISODate };
