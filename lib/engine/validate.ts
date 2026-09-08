import { addDays, endOfWeek, isValid, parseISO } from "date-fns";
import { toISODate } from "./dates";
import { FORECAST_WEEKS } from "./forecast";
import type { Intensity, LoadCategory, LoadEvent } from "./types";

/**
 * The gate between a draft and a number.
 *
 * Everything the parser hands back is editable, which means everything the
 * parser hands back can be edited into nonsense: a shift of zero hours, a
 * date in June, a request for next April. The engine will happily price any
 * of those, and the answer will be confidently wrong.
 *
 * A forecast we cannot honestly produce has to be refused and explained.
 * "This fits" for a request four months out is not a cautious answer, it is
 * a false one — the four weeks we can see genuinely do not contain it, so
 * there is no week for it to fit into.
 *
 * Nothing here is a warning the student can click past. If this returns
 * problems, the decision buttons are not available.
 */
export type RequestProblem =
  | "hours-missing"
  | "hours-tiny"
  | "hours-absurd"
  | "date-missing"
  | "date-past"
  | "date-beyond";

export interface RequestDraft {
  title: string;
  /** yyyy-mm-dd, as it sits in the input */
  date: string;
  /** whatever is in the number field, which may not be a number at all */
  hours: string | number;
  category: LoadCategory;
  intensity: string | number;
}

export interface RequestCheck {
  ok: boolean;
  /** in the order they should be read out, worst first */
  problems: RequestProblem[];
  /** what would go on the calendar, present only when there are no problems */
  event: Omit<LoadEvent, "id" | "source"> | null;
}

/** A day has 24 hours. Anything longer is a typo, not a commitment. */
const MAX_HOURS = 24;

/** The last day the forecast can see. An ask after this is not "far away",
 *  it is outside what we are able to measure — a different statement. */
export function horizonEnd(asOf: Date, weeks: number = FORECAST_WEEKS): string {
  return toISODate(endOfWeek(addDays(asOf, (weeks - 1) * 7), { weekStartsOn: 1 }));
}

const clampIntensity = (n: number): Intensity =>
  (Math.min(5, Math.max(1, Math.round(n))) || 3) as Intensity;

export function checkRequest(
  draft: RequestDraft,
  asOf: Date,
  weeks: number = FORECAST_WEEKS,
): RequestCheck {
  const problems: RequestProblem[] = [];

  // ---- when ----
  const today = toISODate(asOf);
  const parsed = draft.date ? parseISO(draft.date) : null;
  const dateOk = parsed != null && isValid(parsed);

  if (!dateOk) problems.push("date-missing");
  else if (draft.date < today) problems.push("date-past");
  else if (draft.date > horizonEnd(asOf, weeks)) problems.push("date-beyond");

  // ---- how long ----
  // Number("") is 0 and Number(" ") is 0, so an empty box would otherwise
  // read as a zero-hour commitment rather than as a missing answer.
  const raw = typeof draft.hours === "string" ? draft.hours.trim() : draft.hours;
  const hours = raw === "" ? NaN : Number(raw);

  if (!Number.isFinite(hours)) problems.push("hours-missing");
  else if (hours <= 0) problems.push("hours-tiny");
  else if (hours > MAX_HOURS) problems.push("hours-absurd");

  if (problems.length > 0) return { ok: false, problems, event: null };

  return {
    ok: true,
    problems,
    event: {
      date: draft.date,
      category: draft.category,
      title: draft.title.trim(),
      hours,
      intensity: clampIntensity(Number(draft.intensity)),
    },
  };
}
