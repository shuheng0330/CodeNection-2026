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

export interface DayAhead {
  date: string;
  hours: number;
  load: number;
  /** the heaviest thing on it, which is what the day is actually about */
  heaviest: LoadEvent;
  /** how many other things share the day */
  others: number;
}

/**
 * The next few days, one row each.
 *
 * Listing every commitment individually turns this into a backlog: twenty-odd
 * chips, half of them the word "Commute", and the one that matters buried in
 * the middle. A student looking at a heavy week does not need to be handed
 * the heavy week back as a list.
 *
 * So a day is a row, its weight is its hours, and what it is about is the
 * heaviest thing on it. Days with nothing on them are dropped rather than
 * shown as empty — a calendar of dates and durations cannot honestly promise
 * anyone that a day is free.
 */
export function daysAhead(
  events: LoadEvent[],
  asOf: Date,
  count: number = 5,
): DayAhead[] {
  const out: DayAhead[] = [];

  for (let i = 1; i <= count; i++) {
    const date = toISODate(addDays(asOf, i));
    const onDay = events.filter((e) => e.date === date);
    if (onDay.length === 0) continue;

    const ranked = [...onDay].sort((a, b) => eventLoad(b) - eventLoad(a));
    out.push({
      date,
      hours: onDay.reduce((s, e) => s + e.hours, 0),
      load: onDay.reduce((s, e) => s + eventLoad(e), 0),
      heaviest: ranked[0],
      others: ranked.length - 1,
    });
  }

  return out;
}

/**
 * What an ordinary week costs this person, in hours.
 *
 * The engine reasons in weighted load, which is the right unit for maths and
 * the wrong one for a sentence. Hours are what a student recognises, and
 * putting the baseline in the same unit as the week is what makes "84 hours
 * is an ordinary week for her" land.
 */
export function usualWeekHours(
  events: LoadEvent[],
  asOf: Date,
  days: number = 28,
): number {
  const from = toISODate(addDays(asOf, -(days - 1)));
  const to = toISODate(asOf);
  const total = events
    .filter((e) => e.date >= from && e.date <= to)
    .reduce((s, e) => s + e.hours, 0);
  return (total / days) * 7;
}

/** Hours committed in the seven days ending at asOf. */
export function thisWeekHours(events: LoadEvent[], asOf: Date): number {
  const from = toISODate(addDays(asOf, -6));
  const to = toISODate(asOf);
  return events
    .filter((e) => e.date >= from && e.date <= to)
    .reduce((s, e) => s + e.hours, 0);
}
