import { describe, expect, it } from "vitest";
import { suggestPutDown } from "./putdown";
import type { LoadCategory, Intensity, LoadEvent } from "./types";

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
  title: `${category} ${date}`,
  hours,
  intensity,
  source: "seed",
});

describe("suggestPutDown", () => {
  it("only ever offers back things you agreed to, never things you owe", () => {
    const owed: LoadCategory[] = ["class", "assignment", "family", "commute"];
    for (const category of owed) {
      expect(suggestPutDown([ev("2026-09-10", category, 20, 5)], asOf)).toBeNull();
    }
  });

  it("looks at the week ahead, not the week behind", () => {
    // you cannot hand back a shift you already worked
    const past = ev("2026-09-05", "shift", 12, 5);
    const upcoming = ev("2026-09-12", "shift", 4, 3);
    expect(suggestPutDown([past], asOf)).toBeNull();
    expect(suggestPutDown([past, upcoming], asOf)?.id).toBe(upcoming.id);
  });

  it("stops at the end of the week rather than reaching into next month", () => {
    expect(suggestPutDown([ev("2026-09-30", "shift", 8, 4)], asOf)).toBeNull();
  });

  it("ranks by what it takes out of you, not by hours", () => {
    const longButEasy = ev("2026-09-11", "club", 6, 1); // 6 * 0.6 = 3.6
    const shortButDraining = ev("2026-09-11", "shift", 3, 5); // 3 * 1.7 = 5.1
    expect(suggestPutDown([longButEasy, shortButDraining], asOf)?.id).toBe(
      shortButDraining.id,
    );
  });

  it("says nothing rather than inventing something to drop", () => {
    expect(suggestPutDown([], asOf)).toBeNull();
    expect(suggestPutDown([ev("2026-09-10", "class", 8, 4)], asOf)).toBeNull();
  });
});
