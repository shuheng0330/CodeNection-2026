import { describe, expect, it } from "vitest";
import { addDays } from "date-fns";
import { daysAhead, thisWeekHours, usualWeekHours } from "./horizon";
import { toISODate } from "./dates";
import type { Intensity, LoadCategory, LoadEvent } from "./types";

const asOf = new Date(2026, 8, 9); // Wednesday 9 Sep 2026

let n = 0;
const on = (
  dayOffset: number,
  hours: number,
  title: string,
  category: LoadCategory = "class",
  intensity: Intensity = 3,
): LoadEvent => ({
  id: `e${n++}`,
  date: toISODate(addDays(asOf, dayOffset)),
  category,
  title,
  hours,
  intensity,
  source: "seed",
});

describe("daysAhead", () => {
  it("starts tomorrow, because today is already being lived", () => {
    const days = daysAhead([on(0, 8, "Today's shift"), on(1, 2, "Class")], asOf);
    expect(days).toHaveLength(1);
    expect(days[0].date).toBe(toISODate(addDays(asOf, 1)));
  });

  it("folds a day into one row and names it by the heaviest thing", () => {
    // Four chips saying Commute, Class, Class, Cafe shift is a backlog. The
    // row has to say what the day is actually about.
    const days = daysAhead(
      [
        on(1, 1, "Commute", "commute", 2),
        on(1, 2, "Class"),
        on(1, 9, "Cafe shift", "shift", 4),
      ],
      asOf,
    );

    expect(days).toHaveLength(1);
    expect(days[0].heaviest.title).toBe("Cafe shift");
    expect(days[0].others).toBe(2);
    expect(days[0].hours).toBe(12);
  });

  it("ranks by weight, not by hours", () => {
    // Three hours of coursework takes more out of you than four of commuting,
    // and the row should say the thing that actually costs.
    const days = daysAhead(
      [on(1, 4, "Commute", "commute", 1), on(1, 3, "Final report", "assignment", 5)],
      asOf,
    );
    expect(days[0].heaviest.title).toBe("Final report");
  });

  it("drops empty days rather than showing them as free", () => {
    // Events carry a date and a duration, not clock times. An empty row here
    // would be a promise about free time we are not in a position to make.
    const days = daysAhead([on(1, 2, "Class"), on(4, 2, "Class")], asOf);
    expect(days.map((d) => d.date)).toEqual([
      toISODate(addDays(asOf, 1)),
      toISODate(addDays(asOf, 4)),
    ]);
  });

  it("stops at Sunday, because Monday is next week's problem", () => {
    // asOf is Wednesday 9 Sep 2026, so this week has four days left in it.
    // A rolling five would put Monday the 14th under a heading about this
    // week, beside a percentage measured on this week.
    const events = Array.from({ length: 14 }, (_, i) => on(i + 1, 2, "Class"));
    const days = daysAhead(events, asOf);
    expect(days).toHaveLength(4);
    expect(days.at(-1)!.date).toBe("2026-09-13"); // Sunday
    expect(days.map((d) => d.date)).not.toContain("2026-09-14"); // Monday
  });

  it("still honours a smaller window than the week has left", () => {
    const events = Array.from({ length: 14 }, (_, i) => on(i + 1, 2, "Class"));
    expect(daysAhead(events, asOf, 3)).toHaveLength(3);
  });

  it("has nothing left to show on a Sunday", () => {
    const sunday = new Date(2026, 8, 13);
    const events = Array.from({ length: 5 }, (_, i) => ({
      ...on(0, 2, "Class"),
      date: toISODate(addDays(sunday, i + 1)),
    }));
    expect(daysAhead(events, sunday)).toEqual([]);
  });

  it("says nothing at all about a calendar with nothing on it", () => {
    expect(daysAhead([], asOf)).toEqual([]);
  });

  it("ignores what has already happened", () => {
    expect(daysAhead([on(-1, 8, "Yesterday"), on(-5, 8, "Last week")], asOf)).toEqual([]);
  });
});

describe("usualWeekHours", () => {
  it("is a weekly figure, not a monthly total", () => {
    // 28 days at 2h/day is 56 hours in a month and 14 in a week.
    const events = Array.from({ length: 28 }, (_, i) => on(-i, 2, "Class"));
    expect(usualWeekHours(events, asOf)).toBeCloseTo(14, 5);
  });

  it("is zero for someone with no history, rather than undefined", () => {
    expect(usualWeekHours([], asOf)).toBe(0);
  });
});

describe("thisWeekHours", () => {
  it("counts the seven days ending today, today included", () => {
    const events = [on(0, 3, "Today"), on(-6, 3, "Six back"), on(-7, 3, "Too far")];
    expect(thisWeekHours(events, asOf)).toBe(6);
  });
});
