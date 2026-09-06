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
  worst: WeekPrice;
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

  for (let i = 0; i < FORECAST_WEEKS; i++) {
    const weekEnd = endOfWeek(addDays(asOf, i * 7), { weekStartsOn: 1 });
    const cutoff = format(weekEnd, "yyyy-MM-dd");

    const upTo = events.filter((e) => e.date <= cutoff);
    const before = computeCarry(upTo, weekEnd).ratio;
    const after =
      candidate.date <= cutoff
        ? computeCarry([...upTo, candidate], weekEnd).ratio
        : before;

    weeks.push({
      weekStart: format(startOfWeek(addDays(asOf, i * 7), { weekStartsOn: 1 }), "yyyy-MM-dd"),
      label: weekLabelFor(asOf, addDays(asOf, i * 7), currentWeek),
      ratioBefore: before,
      ratioAfter: after,
      pctOfUsual: Math.round(after * 100),
    });
  }

  const worst = weeks.reduce((a, b) => (b.ratioAfter > a.ratioAfter ? b : a));
  const verdict =
    worst.ratioAfter < 1.3 ? "fits" : worst.ratioAfter < 1.5 ? "tight" : "costly";

  return { weeks, worst, verdict };
}

/** What the ask costs, in the same units as everything else. */
export const ASK_WEIGHTS = {
  light: { hours: 2, intensity: 3 as const },
  medium: { hours: 5, intensity: 4 as const },
  heavy: { hours: 9, intensity: 4 as const },
};
