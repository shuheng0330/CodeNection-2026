/**
 * The engine. Adapted from acute:chronic workload ratio (ACWR), the model
 * sports scientists use to catch athletes ramping up faster than they can
 * absorb. Nothing here is machine learning and nothing here calls an API —
 * it is a weighted average of your own past, compared against your own present.
 *
 * Why it fits the problem: burnout is not an absolute quantity of work. It is
 * a spike relative to YOUR baseline. Two people carrying identical hours are
 * not carrying identical load. That is the whole thesis.
 *
 * NOTE: none of this vocabulary is ever shown to a user. See lib/copy.ts.
 */
import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import type { BandKey, CarryState, DailyLoad, LoadEvent } from "./types";

/** intensity 1-5 -> multiplier. Index 0 is unused so the array reads by intensity. */
export const INTENSITY_WEIGHT = [0, 0.6, 0.85, 1.0, 1.3, 1.7] as const;

/** Acute window = the last week. Chronic window = the month you're measured against. */
export const ACUTE_DAYS = 7;
export const CHRONIC_DAYS = 28;
export const HISTORY_DAYS = 84; // three chronic windows, so the baseline is warm

/** The comfortable band. Below 0.8 you are coasting; above 1.5 injury risk
 *  climbs sharply in the sports literature.
 *
 *  The usual/busy edge sits at 1.1, NOT 1.0. A perfectly steady life computes
 *  to exactly 1.0, and telling someone whose weeks have not changed that they
 *  are carrying "a bit more than usual" would be a lie the first time they
 *  open the app. 1.0 must land inside "about your usual". */
export const BAND_EDGES = { light: 0.8, usual: 1.1, busy: 1.3, heavy: 1.5 } as const;

export const eventLoad = (e: LoadEvent): number =>
  e.hours * INTENSITY_WEIGHT[e.intensity];

export function bandFor(ratio: number): BandKey {
  // Every comparison against NaN is false, so without this guard a missing
  // or corrupt ratio falls all the way through and tells someone they are
  // carrying too much. "We don't know you yet" is the honest answer, and it
  // matches the neutral 1.0 computeCarry returns on a cold start.
  if (!Number.isFinite(ratio)) return "usual";
  if (ratio < BAND_EDGES.light) return "light";
  if (ratio < BAND_EDGES.usual) return "usual";
  if (ratio < BAND_EDGES.busy) return "busy";
  if (ratio < BAND_EDGES.heavy) return "heavy";
  return "toomuch";
}

/**
 * Continuous daily totals ending at `asOf` inclusive. Days with nothing on
 * them must still appear as zero — a rest day is data, and dropping it would
 * quietly inflate the baseline.
 */
export function dailySeries(
  events: LoadEvent[],
  asOf: Date,
  days: number = HISTORY_DAYS,
): DailyLoad[] {
  const totals = new Map<string, number>();
  for (const e of events) {
    totals.set(e.date, (totals.get(e.date) ?? 0) + eventLoad(e));
  }

  const series: DailyLoad[] = [];
  const start = addDays(asOf, -(days - 1));
  for (let i = 0; i < days; i++) {
    const date = format(addDays(start, i), "yyyy-MM-dd");
    series.push({ date, load: totals.get(date) ?? 0 });
  }
  return series;
}

/**
 * Exponentially weighted moving average, returning the value at the final day.
 * EWMA rather than a flat rolling mean because a flat mean lets a day drop out
 * of the window and vanish; real load decays, it does not fall off a cliff.
 * lambda = 2 / (N + 1) is the standard smoothing factor.
 */
export function ewma(loads: number[], windowDays: number): number {
  if (loads.length === 0) return 0;
  const lambda = 2 / (windowDays + 1);
  let value = loads[0];
  for (let i = 1; i < loads.length; i++) {
    value = loads[i] * lambda + value * (1 - lambda);
  }
  return value;
}

/** The one call the whole app is built on. */
export function computeCarry(
  events: LoadEvent[],
  asOf: Date,
  days: number = HISTORY_DAYS,
): CarryState {
  const dailies = dailySeries(events, asOf, days);
  const loads = dailies.map((d) => d.load);

  const acute = ewma(loads, ACUTE_DAYS);
  const chronic = ewma(loads, CHRONIC_DAYS);
  // A cold start has no baseline to compare against, so it is not "0% load" —
  // it is "we don't know you yet". Report a neutral 1.0 rather than a false calm.
  const ratio = chronic > 0.0001 ? acute / chronic : 1;

  return { acute, chronic, ratio, band: bandFor(ratio), dailies };
}

/** How far above/below a usual week this is, as a plain multiplier of self. */
export const pctOfUsual = (ratio: number): number => Math.round(ratio * 100);

export function daysBetweenISO(a: string, b: string): number {
  return differenceInCalendarDays(parseISO(b), parseISO(a));
}
