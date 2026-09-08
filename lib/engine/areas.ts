import { addDays } from "date-fns";
import type { LoadCategory, LoadEvent } from "./types";
import { ACUTE_DAYS, eventLoad } from "./acwr";
import { toISODate } from "./dates";

/**
 * Eight categories is the right resolution for the engine and far too much
 * for a glance. These five are what a student would actually name if you
 * asked them where their week went.
 *
 * Labels live in lib/copy.ts — the engine never speaks to the user.
 */
export type AreaKey = "coursework" | "work" | "travel" | "people" | "upkeep";

export const AREA_OF: Record<LoadCategory, AreaKey> = {
  class: "coursework",
  assignment: "coursework",
  shift: "work",
  commute: "travel",
  family: "people",
  social: "people",
  club: "upkeep",
  admin: "upkeep",
};

export const AREA_ORDER: AreaKey[] = ["coursework", "work", "travel", "people", "upkeep"];

export interface AreaSummary {
  key: AreaKey;
  /** hours × how much it takes out of you */
  load: number;
  /** plain hours, which is what the student recognises */
  hours: number;
  /** share of the week's total weight, 0..1 */
  share: number;
}

/**
 * The same window the headline is computed over, so the breakdown can never
 * contradict the sentence above it.
 */
export function summariseWeek(
  events: LoadEvent[],
  asOf: Date,
  days: number = ACUTE_DAYS,
): AreaSummary[] {
  const from = toISODate(addDays(asOf, -(days - 1)));
  const to = toISODate(asOf);

  const totals = new Map<AreaKey, { load: number; hours: number }>();
  for (const e of events) {
    if (e.date < from || e.date > to) continue;
    const key = AREA_OF[e.category];
    const acc = totals.get(key) ?? { load: 0, hours: 0 };
    acc.load += eventLoad(e);
    acc.hours += e.hours;
    totals.set(key, acc);
  }

  const total = [...totals.values()].reduce((s, v) => s + v.load, 0);
  if (total <= 0) return [];

  return AREA_ORDER.filter((k) => totals.has(k))
    .map((key) => {
      const { load, hours } = totals.get(key)!;
      return { key, load, hours, share: load / total };
    })
    .sort((a, b) => b.load - a.load);
}

/** What's in an area this week, heaviest first — for the expandable rows. */
export function eventsInArea(
  events: LoadEvent[],
  asOf: Date,
  area: AreaKey,
  days: number = ACUTE_DAYS,
): LoadEvent[] {
  const from = toISODate(addDays(asOf, -(days - 1)));
  const to = toISODate(asOf);
  return events
    .filter((e) => e.date >= from && e.date <= to && AREA_OF[e.category] === area)
    .sort((a, b) => eventLoad(b) - eventLoad(a));
}
