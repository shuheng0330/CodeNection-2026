import { describe, expect, it } from "vitest";
import { addDays } from "date-fns";
import { freeBlocks, nextDayIsClear, typicalDayHours } from "./recover";
import { toISODate } from "./dates";
import type { Intensity, LoadCategory, LoadEvent } from "./types";

const asOf = new Date(2026, 8, 9); // Wednesday 9 Sep 2026

const ev = (
  date: string,
  hours: number,
  category: LoadCategory = "class",
  intensity: Intensity = 3,
): LoadEvent => ({
  id: `${date}-${hours}-${category}`,
  date,
  category,
  title: `${category} ${date}`,
  hours,
  intensity,
  source: "seed",
});

/** A month of eight-hour days, so "typical" is unambiguous. */
const background = (hours = 8): LoadEvent[] =>
  Array.from({ length: 28 }, (_, i) => ev(toISODate(addDays(asOf, -(i + 1))), hours));

const ahead = (hours: number): LoadEvent[] =>
  Array.from({ length: 12 }, (_, i) => ev(toISODate(addDays(asOf, i + 1)), hours));

describe("typicalDayHours", () => {
  it("takes the median of days that had something on them", () => {
    expect(typicalDayHours(background(8), asOf)).toBe(8);
  });

  it("returns zero rather than dividing by nothing", () => {
    expect(typicalDayHours([], asOf)).toBe(0);
  });
});

describe("freeBlocks", () => {
  it("finds nothing when every day ahead is as busy as usual", () => {
    expect(freeBlocks([...background(8), ...ahead(8)], asOf)).toEqual([]);
  });

  it("measures quiet against this person's own ordinary day", () => {
    // 5h is a quiet day for someone whose usual is 12, and a normal one for
    // someone whose usual is 6 — a fixed threshold finds nothing for anyone
    // who works every week
    const busyPerson = [...background(12), ...ahead(5)];
    const lightPerson = [...background(6), ...ahead(5)];
    expect(freeBlocks(busyPerson, asOf).length).toBeGreaterThan(0);
    expect(freeBlocks(lightPerson, asOf)).toEqual([]);
  });

  it("never offers today, which is already half spent", () => {
    const blocks = freeBlocks([...background(8), ...ahead(1)], asOf);
    expect(blocks.every((b) => b.date > toISODate(asOf))).toBe(true);
  });

  it("ranks a quiet day whose morning after is clear above one that is not", () => {
    // day 3 is quiet but day 4 is heavy; day 6 is quiet and day 7 is quiet too
    const days = [8, 8, 1, 12, 8, 1, 1, 8, 8, 8, 8, 8];
    const events = [
      ...background(8),
      ...days.map((h, i) => ev(toISODate(addDays(asOf, i + 1)), h)),
    ];
    const blocks = freeBlocks(events, asOf);
    expect(blocks.length).toBeGreaterThanOrEqual(2);
    // the one followed by calm comes first, even though both days are 1h
    expect(blocks[0].date).toBe(toISODate(addDays(asOf, 6)));
  });

  it("stops at the horizon rather than promising relief next month", () => {
    const far = [...background(8), ev(toISODate(addDays(asOf, 40)), 0.5)];
    expect(freeBlocks(far, asOf).every((b) => b.daysAway <= 10)).toBe(true);
  });

  it("knows whether the day after is genuinely clear", () => {
    expect(nextDayIsClear({ date: "x", hours: 1, nextDayLoad: 0, daysAway: 1 })).toBe(true);
    expect(nextDayIsClear({ date: "x", hours: 1, nextDayLoad: 20, daysAway: 1 })).toBe(false);
  });

  it("says nothing rather than guessing with no history", () => {
    expect(freeBlocks([], asOf)).toEqual([]);
  });
});
