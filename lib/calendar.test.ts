import { describe, expect, it } from "vitest";
import { clampISO, fillByDay, monthWeeks } from "./calendar";
import { toISODate } from "./engine/dates";

describe("clampISO", () => {
  it("keeps a date that is already in range", () => {
    expect(clampISO("2026-09-18", "2026-09-09", "2026-10-04")).toBe("2026-09-18");
  });

  it("stops at each edge rather than stepping past it", () => {
    expect(clampISO("2026-09-01", "2026-09-09", "2026-10-04")).toBe("2026-09-09");
    expect(clampISO("2026-11-01", "2026-09-09", "2026-10-04")).toBe("2026-10-04");
  });

  it("has no ceiling when the screen has no forecast to blow past", () => {
    // The add sheet prices nothing, so December is an ordinary thing to record.
    expect(clampISO("2026-12-25", "2026-09-09")).toBe("2026-12-25");
  });

  it("falls back to the first pickable day rather than to nothing", () => {
    // An empty or unreadable value still has to leave the keyboard somewhere.
    expect(clampISO("", "2026-09-09")).toBe("2026-09-09");
    expect(clampISO("next tuesday", "2026-09-09")).toBe("2026-09-09");
  });
});

describe("monthWeeks", () => {
  it("starts every row on a Monday", () => {
    for (const week of monthWeeks(new Date(2026, 8, 1))) {
      expect(week).toHaveLength(7);
      expect(week[0].getDay()).toBe(1);
    }
  });

  it("covers the whole month and nothing further than the weeks holding it", () => {
    const weeks = monthWeeks(new Date(2026, 8, 1)); // September 2026
    const days = weeks.flat().map(toISODate);
    expect(days[0]).toBe("2026-08-31"); // the Monday that carries 1 September
    expect(days.at(-1)).toBe("2026-10-04"); // the Sunday that carries 30 September
    expect(days).toContain("2026-09-01");
    expect(days).toContain("2026-09-30");
  });

  it("spends five rows where five will do", () => {
    // Six is the safe constant and it costs a whole row of next month on a
    // phone. September 2026 needs five; February 2027 starts on a Monday and
    // needs only four.
    expect(monthWeeks(new Date(2026, 8, 1))).toHaveLength(5);
    expect(monthWeeks(new Date(2027, 1, 1))).toHaveLength(4);
  });

  it("still finds a sixth row for a month that genuinely spans one", () => {
    // August 2026 starts on a Saturday and has 31 days, so it reaches into a
    // sixth Monday-started week.
    expect(monthWeeks(new Date(2026, 7, 1))).toHaveLength(6);
  });
});

describe("fillByDay", () => {
  it("counts what lands on a day and adds up its hours separately", () => {
    const days = fillByDay([
      { date: "2026-09-18", hours: 8 },
      { date: "2026-09-18", hours: 1.5 },
      { date: "2026-09-19", hours: 3 },
    ]);
    expect(days.get("2026-09-18")).toEqual({ count: 2, hours: 9.5 });
    expect(days.get("2026-09-19")).toEqual({ count: 1, hours: 3 });
    expect(days.get("2026-09-20")).toBeUndefined();
  });

  it("keeps the count exact on a day whose hours overflow a day", () => {
    // 18 September in the seeded week really does hold a 14-hour family
    // commitment on top of coursework. The hours are what the generator
    // attributes; only the count is safe to read out.
    const days = fillByDay([
      { date: "2026-09-18", hours: 14 },
      { date: "2026-09-18", hours: 11.01 },
      { date: "2026-09-18", hours: 2.16 },
      { date: "2026-09-18", hours: 1.72 },
      { date: "2026-09-18", hours: 1.47 },
    ]);
    expect(days.get("2026-09-18")?.count).toBe(5);
    expect(days.get("2026-09-18")?.hours).toBeGreaterThan(24);
  });
});
