import { describe, expect, it } from "vitest";
import { toISODate } from "./dates";

describe("toISODate", () => {
  it("returns the local calendar date", () => {
    expect(toISODate(new Date(2026, 8, 9))).toBe("2026-09-09");
    expect(toISODate(new Date(2026, 0, 1))).toBe("2026-01-01");
    expect(toISODate(new Date(2026, 11, 31))).toBe("2026-12-31");
  });

  it("keeps today's events inside a window that ends today", () => {
    // The regression: toISOString() on a local midnight Date rolls back a day
    // anywhere east of UTC, so everything happening today drops out of the
    // calculation and a heavy week reads as an ordinary one.
    const asOf = new Date(2026, 8, 9);
    const dates = ["2026-09-08", "2026-09-09", "2026-09-10"];
    expect(dates.filter((d) => d <= toISODate(asOf))).toEqual([
      "2026-09-08",
      "2026-09-09",
    ]);
  });
});
