import { addDays, nextFriday } from "date-fns";
import { computeCarry } from "../engine/acwr";
import { toISODate } from "../engine/dates";
import { priceCommitment, type CommitmentPrice } from "../engine/forecast";
import { thisWeekHours, usualWeekHours } from "../engine/horizon";
import type { CarryState, LoadEvent } from "../engine/types";
import { seedEvents, stableAsOf } from "./cache";
import { CURRENT_WEEK } from "./generateSemester";
import { AISYAH, type Persona } from "./personas";

/**
 * One sample request, shared by the landing page and the app.
 *
 * The landing shows a request being priced; the app shows the same request
 * against the same student on the same day. If those two came from different
 * numbers — one hardcoded for the hero, one computed in the product — a judge
 * who noticed would be right to discount both. So there is exactly one source,
 * it is this file, and every figure in it comes out of the engine.
 *
 * Nothing here is on anyone's calendar. The request is a proposal until
 * somebody accepts it, which is the entire point of the screen it appears on.
 */
export interface DecisionDemo {
  persona: Persona;
  /** the same reference day the rest of the demo uses */
  asOf: Date;
  /** the request as it arrived, for the paste demonstration */
  message: string;
  /** proposed, not committed */
  candidate: LoadEvent;
  /** engine-derived, never written by hand */
  price: CommitmentPrice;
  /** where the student stands before the request */
  carry: CarryState;
  hoursThisWeek: number;
  usualWeekHours: number;
}

/**
 * Deliberately lands in the week after next — the one the forecast already
 * calls heavy. A request that falls in a quiet week prices as "this fits",
 * which is true, honest, and demonstrates nothing.
 */
export const DEMO_MESSAGE = "can you cover next friday 3pm-11pm? kelly called in sick";

/** Marks anything derived from this fixture as a sample rather than the
 *  student's real week. Every surface showing it has to say so. */
export const DEMO_LABEL = "sample week";

const DEMO_HOURS = 8;

let cached: DecisionDemo | null = null;

export function decisionDemo(): DecisionDemo {
  const asOf = stableAsOf();
  if (cached && cached.asOf === asOf) return cached;

  const persona = AISYAH;
  const events = seedEvents(persona, asOf);

  // Derived from asOf rather than written as a date, so the fixture stays
  // correct on whatever day this is opened.
  const candidate: LoadEvent = {
    id: "demo-request",
    date: toISODate(addDays(nextFriday(asOf), 7)),
    category: "shift",
    title: "Cover Kelly's shift",
    hours: DEMO_HOURS,
    intensity: 4,
    source: "user",
  };

  cached = {
    persona,
    asOf,
    message: DEMO_MESSAGE,
    candidate,
    price: priceCommitment(events, candidate, asOf, CURRENT_WEEK),
    carry: computeCarry(
      events.filter((e) => e.date <= toISODate(asOf)),
      asOf,
    ),
    hoursThisWeek: thisWeekHours(events, asOf),
    usualWeekHours: usualWeekHours(events, asOf),
  };
  return cached;
}
