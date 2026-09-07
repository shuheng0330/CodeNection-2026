import { addDays, format, isSameDay, parseISO } from "date-fns";
import type { LoadEvent } from "./types";
import { BAND_EDGES, eventLoad } from "./acwr";
import { toISODate } from "./dates";

/**
 * The single thing worth handing back this week.
 *
 * Deliberately never suggests dropping class, coursework or family. Telling a
 * Malaysian student to skip their cousin's wedding is not advice, it is a bug —
 * and telling anyone to skip an assessment is worse. What is actually
 * negotiable is the extra shift, the favour, the optional commitment: the
 * things you said yes to rather than the things you owe.
 *
 * Ranked by weight, NOT by how far it moves the ratio. Moving the ratio looks
 * like the smarter measure and is actually unusable: dropping a commitment
 * shrinks the baseline as well as the week, so a two-hour badminton game
 * scores above a nine-hour shift purely for falling closer to the measuring
 * date, and dropping the only social evening in a heavy week can push the
 * ratio UP. Hours off your week is the honest unit, and it is the one the
 * student actually feels.
 */
const NEGOTIABLE: ReadonlySet<LoadEvent["category"]> = new Set([
  "shift",
  "social",
  "club",
  "admin",
]);

/** Below this we say nothing. Handing back ninety minutes of errands is not
 *  relief, it is busywork dressed up as advice. */
export const MIN_HOURS_BACK = 3;

export type PutDownReason = "settled" | "none-optional" | "all-small";

export interface PutDown {
  event: LoadEvent;
  /** hours the student gets back, in their own units */
  hoursBack: number;
  /** "today", "tomorrow", or "Saturday" */
  when: string;
}

export function whenLabel(date: string, asOf: Date): string {
  const d = parseISO(date);
  if (isSameDay(d, asOf)) return "today";
  if (isSameDay(d, addDays(asOf, 1))) return "tomorrow";
  return format(d, "EEEE");
}

/**
 * `ratio` is where the student is right now. A week that is not heavy has
 * nothing that needs to come off it, and inventing something to drop is how
 * a calm tool turns into another backlog.
 */
export function suggestPutDown(
  events: LoadEvent[],
  asOf: Date,
  ratio: number,
): PutDown | null {
  if (ratio < BAND_EDGES.busy) return null;

  const from = toISODate(asOf);
  const to = toISODate(addDays(asOf, 7));

  const negotiable = events
    .filter((e) => e.date >= from && e.date <= to && NEGOTIABLE.has(e.category))
    .sort((a, b) => eventLoad(b) - eventLoad(a));

  const worthwhile = negotiable.find((e) => e.hours >= MIN_HOURS_BACK);
  if (!worthwhile) return null;

  return {
    event: worthwhile,
    hoursBack: worthwhile.hours,
    when: whenLabel(worthwhile.date, asOf),
  };
}

/** Why there is nothing to suggest — the empty state has to say something
 *  useful, because "no advice" is itself information about the week. */
export function putDownReason(
  events: LoadEvent[],
  asOf: Date,
  ratio: number,
): PutDownReason {
  if (ratio < BAND_EDGES.busy) return "settled";

  const from = toISODate(asOf);
  const to = toISODate(addDays(asOf, 7));
  const negotiable = events.filter(
    (e) => e.date >= from && e.date <= to && NEGOTIABLE.has(e.category),
  );

  return negotiable.length === 0 ? "none-optional" : "all-small";
}
