import { describe, expect, it } from "vitest";
import { addDays } from "date-fns";
import { FORECAST_WEEKS, priceCommitment, weekLabelFor } from "./forecast";
import { toISODate } from "./dates";
import type { Intensity, LoadEvent } from "./types";

const asOf = new Date(2026, 8, 9); // Wednesday 9 Sep 2026
const CURRENT_WEEK = 10;

/** A steady 84 days, so anything the forecast reports is caused by the ask. */
const steady = (): LoadEvent[] =>
  Array.from({ length: 84 }, (_, i) => {
    const date = toISODate(addDays(asOf, -i));
    return {
      id: `s${i}`,
      date,
      category: "class" as const,
      title: "steady",
      hours: 4,
      intensity: 3 as Intensity,
      source: "seed" as const,
    };
  });

const ask = (daysAhead: number, hours: number): LoadEvent => ({
  id: "ask",
  date: toISODate(addDays(asOf, daysAhead)),
  category: "shift",
  title: "what they are asking",
  hours,
  intensity: 4,
  source: "user",
});

describe("weekLabelFor", () => {
  it("counts semester weeks forward from the week you are in", () => {
    expect(weekLabelFor(asOf, asOf, CURRENT_WEEK)).toBe("week 10");
    expect(weekLabelFor(asOf, addDays(asOf, 7), CURRENT_WEEK)).toBe("week 11");
    expect(weekLabelFor(asOf, addDays(asOf, 21), CURRENT_WEEK)).toBe("week 13");
  });
});

describe("priceCommitment", () => {
  it("prices exactly the horizon it promises, labelled in order", () => {
    const p = priceCommitment(steady(), ask(9, 8), asOf, CURRENT_WEEK);
    expect(p.weeks).toHaveLength(FORECAST_WEEKS);
    expect(p.weeks.map((w) => w.label)).toEqual([
      "week 10",
      "week 11",
      "week 12",
      "week 13",
    ]);
  });

  it("charges nothing for an ask that lands beyond the horizon", () => {
    const p = priceCommitment(steady(), ask(90, 40), asOf, CURRENT_WEEK);
    for (const w of p.weeks) expect(w.ratioAfter).toBe(w.ratioBefore);
    expect(p.verdict).toBe("fits");
  });

  it("charges the week the ask actually lands in", () => {
    const p = priceCommitment(steady(), ask(9, 12), asOf, CURRENT_WEEK);
    const landed = p.weeks[1]; // asOf + 9 days is next week
    expect(landed.ratioAfter).toBeGreaterThan(landed.ratioBefore);
    expect(p.weeks[0].ratioAfter).toBe(p.weeks[0].ratioBefore);
  });

  it("names the worst week, not merely the next one", () => {
    const p = priceCommitment(steady(), ask(9, 12), asOf, CURRENT_WEEK);
    const worstRatio = Math.max(...p.weeks.map((w) => w.ratioAfter));
    expect(p.worst.ratioAfter).toBe(worstRatio);
  });

  it("escalates its verdict as the ask gets heavier", () => {
    const light = priceCommitment(steady(), ask(9, 1), asOf, CURRENT_WEEK);
    const crushing = priceCommitment(steady(), ask(9, 200), asOf, CURRENT_WEEK);
    expect(light.verdict).toBe("fits");
    expect(crushing.verdict).toBe("costly");
    expect(crushing.worst.ratioAfter).toBeGreaterThan(light.worst.ratioAfter);
  });

  it("keeps the share-of-a-usual-week figure consistent with the ratio", () => {
    const p = priceCommitment(steady(), ask(9, 12), asOf, CURRENT_WEEK);
    for (const w of p.weeks) {
      expect(w.pctOfUsual).toBe(Math.round(w.ratioAfter * 100));
    }
  });
});
