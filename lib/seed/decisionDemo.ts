import { computeCarry } from "../engine/acwr";
import { toISODate } from "../engine/dates";
import { priceCommitment, type CommitmentPrice } from "../engine/forecast";
import { thisWeekHours, usualWeekHours } from "../engine/horizon";
import type { CarryState, LoadEvent } from "../engine/types";
import { extract, type Draft } from "../parse/extract";
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
  /** what the parser made of that message, field by field, so the screen
   *  showing the request can say which parts it read and which it guessed */
  draft: Draft;
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

/** The message reads as a request, not as a title. The parser is honest
 *  about having guessed this, and the student can edit it. */
const DEMO_TITLE = "Cover Kelly's shift";

let cached: DecisionDemo | null = null;

export function decisionDemo(): DecisionDemo {
  const asOf = stableAsOf();
  if (cached && cached.asOf === asOf) return cached;

  const persona = AISYAH;
  const events = seedEvents(persona, asOf);

  // Read out of the message rather than written alongside it.
  //
  // These used to be two independent derivations that agreed — the date came
  // from nextFriday(asOf) + 7, the message said "next friday", and a test
  // checked the two matched. They matched because the demo day is always a
  // Wednesday, which is a fact about the seed generator that nothing in this
  // file depended on deliberately. Parsing the message makes the agreement
  // structural: the landing, the request sheet and the forecast are now
  // reading the same sentence, and cannot drift apart.
  const draft = extract(DEMO_MESSAGE, asOf);
  const candidate: LoadEvent = {
    id: "demo-request",
    date: draft.date.value,
    category: draft.category.value,
    title: DEMO_TITLE,
    hours: draft.hours.value,
    intensity: draft.intensity.value,
    source: "user",
  };

  cached = {
    persona,
    asOf,
    message: DEMO_MESSAGE,
    draft,
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
