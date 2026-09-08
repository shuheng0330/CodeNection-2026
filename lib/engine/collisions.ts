import { addDays, differenceInCalendarDays } from "date-fns";
import type { LoadEvent } from "./types";
import { eventLoad } from "./acwr";
import { toISODate } from "./dates";

/**
 * The days that are about to hurt, named before they arrive.
 *
 * A ratio of 1.4 is abstract. "Four things land between Thursday and Sunday"
 * is not — and unlike the ratio it is exact from day one and needs no warm-up.
 *
 * Measured against the student's OWN typical few days rather than a fixed
 * count, for the same reason everything else here is: classes happen every
 * week, so counting commitments makes every week a wall. What marks a wall is
 * density well above your own ordinary density.
 */
export interface Collision {
  from: string;
  to: string;
  events: LoadEvent[];
  /** combined weight inside the window */
  load: number;
  /** how many times an ordinary stretch of the same length this is */
  timesUsual: number;
}

export const COLLISION_DAYS = 4;
export const COLLISION_MIN_EVENTS = 3;
/** Below this it is a busy patch, not something worth interrupting anyone for. */
export const COLLISION_THRESHOLD = 1.5;

/** Things you cannot simply move, so a pile-up of them is what actually bites. */
const FIXED: ReadonlySet<LoadEvent["category"]> = new Set([
  "class",
  "assignment",
  "shift",
  "family",
]);

const median = (xs: number[]): number => {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** Load per day, for every day in [from, to]. */
function dailyFixed(events: LoadEvent[], from: Date, to: Date): Map<string, number> {
  const out = new Map<string, number>();
  const days = differenceInCalendarDays(to, from);
  for (let i = 0; i <= days; i++) out.set(toISODate(addDays(from, i)), 0);
  for (const e of events) {
    if (!FIXED.has(e.category)) continue;
    const cur = out.get(e.date);
    if (cur !== undefined) out.set(e.date, cur + eventLoad(e));
  }
  return out;
}

export function collisions(
  events: LoadEvent[],
  asOf: Date,
  daysAhead: number = 28,
): Collision[] {
  // A month behind gives us what "ordinary" means for this person; without it
  // the first window has nothing to be unusual against.
  const histStart = addDays(asOf, -28);
  const horizon = addDays(asOf, daysAhead);
  const daily = dailyFixed(events, histStart, horizon);
  const dates = [...daily.keys()].sort();

  const windowLoad = (i: number): number => {
    let sum = 0;
    for (let k = 0; k < COLLISION_DAYS && i + k < dates.length; k++) {
      sum += daily.get(dates[i + k]) ?? 0;
    }
    return sum;
  };

  const past = dates.filter((d) => d < toISODate(asOf));
  const usual = median(past.map((_, i) => windowLoad(i)).filter((v) => v > 0));
  if (usual <= 0) return [];

  const firstAhead = dates.findIndex((d) => d >= toISODate(asOf));
  const found: Collision[] = [];

  for (let i = firstAhead; i + COLLISION_DAYS - 1 < dates.length; i++) {
    const load = windowLoad(i);
    if (load < usual * COLLISION_THRESHOLD) continue;

    const from = dates[i];
    const to = dates[i + COLLISION_DAYS - 1];
    const inWindow = events
      .filter((e) => e.date >= from && e.date <= to && FIXED.has(e.category))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Six lectures on one Tuesday is a Tuesday, not a wall.
    const distinctDays = new Set(inWindow.map((e) => e.date)).size;
    if (inWindow.length < COLLISION_MIN_EVENTS || distinctDays < 2) continue;

    found.push({ from, to, events: inWindow, load, timesUsual: load / usual });
  }

  // Overlapping windows describe the same crunch; keep the heaviest of each.
  const kept: Collision[] = [];
  for (const c of found.sort((a, b) => b.load - a.load)) {
    if (kept.some((k) => c.from <= k.to && k.from <= c.to)) continue;
    kept.push(c);
  }
  return kept.sort((a, b) => b.load - a.load);
}
