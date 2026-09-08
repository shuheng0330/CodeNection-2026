/**
 * Pricing a "yes".
 *
 * Every other tool in this space is retrospective: it shows you the damage
 * after you have already agreed to it. The only place a load figure can
 * actually change behaviour is at the moment of the ask, so this runs the
 * SAME maths over the weeks ahead, with and without the thing you are
 * being asked to do.
 *
 * This is not a prediction model. It is your own calendar projected forward
 * through the identical engine — which is a stronger claim than pretending
 * otherwise, and an honest one to make on stage.
 */
import { addDays, endOfWeek, format, startOfWeek } from "date-fns";
import { computeCarry } from "./acwr";
import type { LoadEvent } from "./types";

export interface WeekPrice {
  weekStart: string;
  /** e.g. "week 11" */
  label: string;
  ratioBefore: number;
  ratioAfter: number;
  /** what the ask makes this week, as a share of a usual week */
  pctOfUsual: number;
}

export interface CommitmentPrice {
  weeks: WeekPrice[];
  /** heaviest week ahead — context for the strip, not the price of this ask */
  worst: WeekPrice;
  /** the week this ask actually falls in, and the only one it changes.
   *  null when it lands beyond the horizon we can see. */
  landing: WeekPrice | null;
  verdict: "fits" | "tight" | "costly";
}

export const FORECAST_WEEKS = 4;

/** Semester week number for a date, given which week `asOf` sits in. */
export function weekLabelFor(asOf: Date, target: Date, currentWeek: number): string {
  const a = startOfWeek(asOf, { weekStartsOn: 1 }).getTime();
  const b = startOfWeek(target, { weekStartsOn: 1 }).getTime();
  const delta = Math.round((b - a) / (7 * 24 * 3600 * 1000));
  return `week ${currentWeek + delta}`;
}

export function priceCommitment(
  events: LoadEvent[],
  candidate: LoadEvent,
  asOf: Date,
  currentWeek: number,
): CommitmentPrice {
  const weeks: WeekPrice[] = [];
  let landing: WeekPrice | null = null;

  for (let i = 0; i < FORECAST_WEEKS; i++) {
    const weekStart = startOfWeek(addDays(asOf, i * 7), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(addDays(asOf, i * 7), { weekStartsOn: 1 });
    const from = format(weekStart, "yyyy-MM-dd");
    const to = format(weekEnd, "yyyy-MM-dd");

    const upTo = events.filter((e) => e.date <= to);
    const before = computeCarry(upTo, weekEnd).ratio;

    // An ask changes exactly one week: the one it happens in.
    //
    // Measuring "with and without" at every week end looks more thorough and
    // is unusable. A commitment also raises the 28-day baseline of every LATER
    // week, and it raises it faster than it raises their 7-day window — so
    // those weeks come out LOWER with the extra work than without it. Reported
    // as a price, that says "agree to this shift and next week gets easier",
    // and picking the worst week across all four could quote a week the ask
    // never touched. Weeks the commitment does not fall in are unchanged,
    // because nothing about what is committed to them has changed.
    const lands = candidate.date >= from && candidate.date <= to;
    const after = lands ? computeCarry([...upTo, candidate], weekEnd).ratio : before;

    const week: WeekPrice = {
      weekStart: from,
      label: weekLabelFor(asOf, addDays(asOf, i * 7), currentWeek),
      ratioBefore: before,
      ratioAfter: after,
      pctOfUsual: Math.round(after * 100),
    };
    weeks.push(week);
    if (lands) landing = week;
  }

  // The heaviest week ahead — context for the strip, never the price.
  const worst = weeks.reduce((a, b) => (b.ratioAfter > a.ratioAfter ? b : a));

  // An ask beyond the horizon costs nothing we can see, and saying otherwise
  // would be inventing a number.
  const priced = landing ?? null;
  const verdict = !priced
    ? "fits"
    : priced.ratioAfter < 1.3
      ? "fits"
      : priced.ratioAfter < 1.5
        ? "tight"
        : "costly";

  return { weeks, worst, landing, verdict };
}

/** What the ask costs, in the same units as everything else. */
export const ASK_WEIGHTS = {
  light: { hours: 2, intensity: 3 as const },
  medium: { hours: 5, intensity: 4 as const },
  heavy: { hours: 9, intensity: 4 as const },
};
