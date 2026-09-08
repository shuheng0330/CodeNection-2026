import { describe, expect, it } from "vitest";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { decisionDemo, DEMO_MESSAGE } from "./decisionDemo";
import { seedEvents } from "./cache";
import { toISODate } from "../engine/dates";
import { extract } from "../parse/extract";

describe("decisionDemo — the fixture the landing and the app share", () => {
  const demo = decisionDemo();

  it("hands back the same object every time", () => {
    // Two surfaces render this. If they computed it separately they could
    // drift, and a landing page contradicting the product is worse than no
    // landing page.
    expect(decisionDemo()).toBe(decisionDemo());
  });

  it("is a proposal, not something already on the calendar", () => {
    const committed = seedEvents(demo.persona, demo.asOf);
    expect(committed.some((e) => e.id === demo.candidate.id)).toBe(false);
    expect(demo.candidate.source).toBe("user");
  });

  it("lands inside the horizon we can actually price", () => {
    expect(demo.price.landing).not.toBeNull();
    const week = demo.price.landing!;
    expect(demo.candidate.date >= week.weekStart).toBe(true);
  });

  it("costs something, or it demonstrates nothing", () => {
    const week = demo.price.landing!;
    expect(week.ratioAfter).toBeGreaterThan(week.ratioBefore);
    expect(demo.price.verdict).not.toBe("fits");
  });

  it("leaves every other week alone", () => {
    for (const w of demo.price.weeks) {
      if (w.label === demo.price.landing!.label) continue;
      expect(w.ratioAfter).toBe(w.ratioBefore);
    }
  });

  it("opens on a student who is already carrying too much", () => {
    // A calm week has nothing to decide about
    expect(demo.carry.ratio).toBeGreaterThan(1.1);
    expect(demo.hoursThisWeek).toBeGreaterThan(demo.usualWeekHours);
  });

  it("is reachable by pasting the message it claims to have arrived as", () => {
    // The paste demonstration and the fixture have to agree, or the landing
    // shows one thing and the parser produces another.
    const parsed = extract(DEMO_MESSAGE, demo.asOf);
    expect(parsed.date.value).toBe(demo.candidate.date);
    expect(parsed.hours.value).toBe(demo.candidate.hours);
    expect(parsed.category.value).toBe(demo.candidate.category);
  });

  it("still reads the message the way the demo needs it read", () => {
    // The check above became tautological once the fixture started parsing
    // the message itself, so this is the one that would actually catch a
    // parser regression: an eight-hour Friday shift, next week, not this one.
    expect(demo.candidate.hours).toBe(8);
    expect(demo.candidate.category).toBe("shift");
    expect(parseISO(demo.candidate.date).getDay()).toBe(5);
    expect(demo.draft.date.from).toBe("parsed");
    expect(demo.draft.hours.from).toBe("parsed");
    // Nine days out from a Wednesday: the week after next, which is the one
    // the forecast already calls heavy. A request landing in a quiet week
    // prices as "this fits" — true, honest, and demonstrating nothing.
    expect(differenceInCalendarDays(parseISO(demo.candidate.date), demo.asOf)).toBe(9);
  });

  it("labels the dial as ours, because nobody wrote it in the message", () => {
    expect(demo.draft.intensity.from).toBe("guessed");
    expect(demo.candidate.intensity).toBeGreaterThanOrEqual(1);
    expect(demo.candidate.intensity).toBeLessThanOrEqual(5);
  });

  it("stays on the demo's own reference day", () => {
    expect(toISODate(demo.asOf)).toBe(toISODate(decisionDemo().asOf));
  });
});
