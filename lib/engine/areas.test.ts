import { describe, expect, it } from "vitest";
import { summariseWeek, eventsInArea, AREA_OF } from "./areas";
import type { Intensity, LoadCategory, LoadEvent } from "./types";

const asOf = new Date(2026, 8, 9); // Wednesday 9 Sep 2026

const ev = (
  date: string,
  category: LoadCategory,
  hours: number,
  intensity: Intensity = 3,
): LoadEvent => ({
  id: `${date}-${category}-${hours}`,
  date,
  category,
  title: `${category}`,
  hours,
  intensity,
  source: "seed",
});

describe("summariseWeek", () => {
  it("folds all eight categories into five things a student would name", () => {
    expect(new Set(Object.values(AREA_OF)).size).toBe(5);
    expect(AREA_OF.class).toBe("coursework");
    expect(AREA_OF.assignment).toBe("coursework");
    expect(AREA_OF.family).toBe("people");
    expect(AREA_OF.social).toBe("people");
  });

  it("covers the same seven days the headline is computed over", () => {
    const inside = ev("2026-09-03", "shift", 5); // asOf - 6
    const outside = ev("2026-09-02", "shift", 50); // asOf - 7
    const areas = summariseWeek([inside, outside], asOf);
    expect(areas).toHaveLength(1);
    expect(areas[0].hours).toBe(5);
  });

  it("ignores anything still ahead of today", () => {
    expect(summariseWeek([ev("2026-09-10", "shift", 8)], asOf)).toEqual([]);
  });

  it("ranks by weight but reports plain hours", () => {
    // four draining hours of coursework outweigh six easy hours of errands
    const areas = summariseWeek(
      [ev("2026-09-08", "assignment", 4, 5), ev("2026-09-08", "admin", 6, 1)],
      asOf,
    );
    expect(areas.map((a) => a.key)).toEqual(["coursework", "upkeep"]);
    expect(areas[0].hours).toBe(4);
    expect(areas[1].hours).toBe(6);
  });

  it("returns shares that add up to the whole week", () => {
    const areas = summariseWeek(
      [ev("2026-09-08", "class", 4), ev("2026-09-08", "shift", 4), ev("2026-09-07", "commute", 2)],
      asOf,
    );
    expect(areas.reduce((s, a) => s + a.share, 0)).toBeCloseTo(1, 10);
  });

  it("says nothing rather than dividing by zero on an empty week", () => {
    expect(summariseWeek([], asOf)).toEqual([]);
  });
});

describe("eventsInArea", () => {
  it("lists what is actually in an area, heaviest first", () => {
    const light = ev("2026-09-08", "class", 2, 1);
    const heavy = ev("2026-09-07", "assignment", 6, 5);
    expect(eventsInArea([light, heavy], asOf, "coursework").map((e) => e.id)).toEqual([
      heavy.id,
      light.id,
    ]);
    expect(eventsInArea([light, heavy], asOf, "work")).toEqual([]);
  });
});
