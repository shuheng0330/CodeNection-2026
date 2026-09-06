import { addDays, format } from "date-fns";
import type { LoadEvent } from "./types";
import { eventLoad } from "./acwr";

/**
 * The single thing worth handing back this week.
 *
 * Deliberately never suggests dropping class, coursework or family. Telling a
 * Malaysian student to skip their cousin's wedding is not advice, it is a bug —
 * and telling anyone to skip an assessment is worse. What is actually
 * negotiable is the extra shift, the favour, the optional commitment: the
 * things you said yes to rather than the things you owe.
 */
const NEGOTIABLE: ReadonlySet<LoadEvent["category"]> = new Set([
  "shift",
  "social",
  "club",
  "admin",
]);

export function suggestPutDown(events: LoadEvent[], asOf: Date): LoadEvent | null {
  const from = format(asOf, "yyyy-MM-dd");
  const to = format(addDays(asOf, 7), "yyyy-MM-dd");

  const candidates = events
    .filter((e) => e.date >= from && e.date <= to && NEGOTIABLE.has(e.category))
    .sort((a, b) => eventLoad(b) - eventLoad(a));

  return candidates[0] ?? null;
}
