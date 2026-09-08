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

/** The three answers we can give about a week we can actually see. */
export type Verdict = "fits" | "tight" | "costly";

export interface CommitmentPrice {
  weeks: WeekPrice[];
  /** heaviest week ahead — context for the strip, not the price of this ask */
  worst: WeekPrice;
  /** the week this ask actually falls in, and the only one it changes.
   *  null when it lands beyond the horizon we can see. */
  landing: WeekPrice | null;
  /** "beyond" is not a fourth degree of heaviness. It means there is no week
   *  here to measure the request against, and we are declining to invent one. */
  verdict: Verdict | "beyond";
}

/**
 * The bands, in one place rather than inline in the loop.
 *
 * Deliberately generous. 1.3 is where a week starts costing something a
 * student would notice; 1.5 is where the weeks people describe afterwards as
 * the bad one tend to sit. Anything tighter turns an ordinary busy fortnight
 * into an alarm, which is the failure mode this product exists to avoid.
 */
export function verdictFor(ratio: number): Verdict {
  if (!Number.isFinite(ratio)) return "fits";
  return ratio < 1.3 ? "fits" : ratio < 1.5 ? "tight" : "costly";
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

  // An ask beyond the horizon has no week here to be measured against.
  //
  // This used to answer "fits", which reads as reassurance and is not one:
  // a request in April does not fit into four weeks we can see, it is simply
  // absent from them. Anyone consuming `verdict` without also checking
  // `landing` was being handed a confident wrong answer.
  const verdict = landing ? verdictFor(landing.ratioAfter) : "beyond";

  return { weeks, worst, landing, verdict };
}
