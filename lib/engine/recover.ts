import { addDays, parseISO } from "date-fns";
import type { LoadEvent } from "./types";
import { eventLoad } from "./acwr";
import { toISODate } from "./dates";

/**
 * Finding time that is already free, rather than asking anyone to make some.
 *
 * The brief's last instruction is to push students toward recovery — rest, or
 * getting out of the house. Every wellbeing app answers that with a content
 * library or a breathing circle, which is advice, not time.
 *
 * The honest answer is a specific block that already exists on their calendar,
 * named, with the cost already paid. "Thursday evening" beats "try to rest"
 * because it is checkable, and because they cannot object that they have no
 * time — we found it in their own week.
 */
export interface FreeBlock {
  date: string;
  /** what is already on that day, in hours */
  hours: number;
  /** load landing the day after — an evening is not free if tomorrow is a wall */
  nextDayLoad: number;
  /** how far ahead it sits, in days */
  daysAway: number;
}

export const RECOVERY_HORIZON = 10;
/** A day counts as quiet at this share of their own ordinary day. A fixed
 *  hour threshold finds nothing for anyone who works every week, which is
 *  most of the people this is for. Quiet has to mean quiet FOR YOU. */
export const QUIET_SHARE = 0.7;

/** Median hours on a day that has anything on it at all, over the last month. */
export function typicalDayHours(events: LoadEvent[], asOf: Date, days = 28): number {
  const from = toISODate(addDays(asOf, -(days - 1)));
  const to = toISODate(asOf);
  const byDay = new Map<string, number>();
  for (const e of events) {
    if (e.date < from || e.date > to) continue;
    byDay.set(e.date, (byDay.get(e.date) ?? 0) + e.hours);
  }
  const vals = [...byDay.values()].sort((a, b) => a - b);
  if (vals.length === 0) return 0;
  const m = Math.floor(vals.length / 2);
  return vals.length % 2 ? vals[m] : (vals[m - 1] + vals[m]) / 2;
}

/**
 * Quietest days first, ranked by the day itself AND the morning after.
 * A free evening in front of a deadline is not recovery, it is denial.
 */
export function freeBlocks(
  events: LoadEvent[],
  asOf: Date,
  horizon: number = RECOVERY_HORIZON,
): FreeBlock[] {
  const byDay = new Map<string, { hours: number; load: number }>();
  for (let i = 0; i <= horizon + 1; i++) {
    byDay.set(toISODate(addDays(asOf, i)), { hours: 0, load: 0 });
  }
  for (const e of events) {
    const day = byDay.get(e.date);
    if (!day) continue;
    day.hours += e.hours;
    day.load += eventLoad(e);
  }

  // With no history we do not know what quiet means for this person, and an
  // empty calendar would otherwise report every day as free time.
  const typical = typicalDayHours(events, asOf);
  if (typical <= 0) return [];
  const quietBelow = typical * QUIET_SHARE;

  const out: FreeBlock[] = [];
  // Start at tomorrow: today is already half spent, and offering someone
  // "this evening" when it is nine at night is not an offer.
  for (let i = 1; i <= horizon; i++) {
    const date = toISODate(addDays(asOf, i));
    const day = byDay.get(date);
    const next = byDay.get(toISODate(addDays(asOf, i + 1)));
    if (!day || day.hours > quietBelow) continue;
    out.push({
      date,
      hours: day.hours,
      nextDayLoad: next?.load ?? 0,
      daysAway: i,
    });
  }

  return out.sort((a, b) => {
    const byCalm = a.hours + a.nextDayLoad * 0.5 - (b.hours + b.nextDayLoad * 0.5);
    // A tie goes to the sooner one: relief you have to wait a week for is
    // not relief.
    return byCalm !== 0 ? byCalm : a.daysAway - b.daysAway;
  });
}

/** Whether the morning after is genuinely clear, for the second sentence. */
export const nextDayIsClear = (b: FreeBlock): boolean => b.nextDayLoad < 4;

export const blockWeekday = (b: FreeBlock): Date => parseISO(b.date);
