import { describe, expect, it } from "vitest";
import {
  ACUTE_DAYS,
  bandFor,
  computeCarry,
  dailySeries,
  eventLoad,
  ewma,
  INTENSITY_WEIGHT,
} from "./acwr";
import type { LoadEvent } from "./types";

const ev = (date: string, hours: number, intensity: 1 | 2 | 3 | 4 | 5): LoadEvent => ({
  id: `${date}-${hours}-${intensity}`,
  date,
  category: "assignment",
  title: "test",
  hours,
  intensity,
  source: "seed",
});

/** Build one event per day for `days` days ending at 2026-03-31. */
const flatSeries = (days: number, hours: number): LoadEvent[] => {
  const out: LoadEvent[] = [];
  const end = new Date("2026-03-31T00:00:00Z");
  for (let i = 0; i < days; i++) {
    const d = new Date(end);
    d.setUTCDate(d.getUTCDate() - i);
    out.push(ev(d.toISOString().slice(0, 10), hours, 3));
  }
  return out;
};

describe("eventLoad", () => {
  it("scales hours by intensity, not just duration", () => {
    // 2h of something draining outweighs 2h of a lecture
    expect(eventLoad(ev("2026-03-01", 2, 5))).toBeCloseTo(2 * 1.7);
    expect(eventLoad(ev("2026-03-01", 2, 3))).toBeCloseTo(2 * 1.0);
    expect(eventLoad(ev("2026-03-01", 2, 1))).toBeCloseTo(2 * 0.6);
  });

  it("has a weight for every intensity level", () => {
    expect(INTENSITY_WEIGHT).toHaveLength(6); // index 0 unused
    for (let i = 1; i <= 5; i++) expect(INTENSITY_WEIGHT[i]).toBeGreaterThan(0);
  });
});

describe("dailySeries", () => {
  const asOf = new Date("2026-03-31T00:00:00Z");

  it("returns a continuous run of days ending at asOf", () => {
    const s = dailySeries(flatSeries(10, 3), asOf, 30);
    expect(s).toHaveLength(30);
    expect(s[s.length - 1].date).toBe("2026-03-31");
  });

  it("keeps empty days as zero rather than dropping them", () => {
    // a rest day is data; dropping it would silently inflate the baseline
    const s = dailySeries([ev("2026-03-31", 4, 3)], asOf, 5);
    expect(s.filter((d) => d.load === 0)).toHaveLength(4);
    expect(s[4].load).toBeCloseTo(4);
  });

  it("sums multiple events landing on the same day", () => {
    const s = dailySeries([ev("2026-03-31", 2, 3), ev("2026-03-31", 3, 3)], asOf, 3);
    expect(s[2].load).toBeCloseTo(5);
  });
});

describe("ewma", () => {
  it("holds steady on a constant series", () => {
    expect(ewma(Array(50).fill(4), ACUTE_DAYS)).toBeCloseTo(4, 5);
  });

  it("weights recent days more heavily than a flat mean would", () => {
    const spikeAtEnd = [...Array(27).fill(2), 20];
    const flatMean = spikeAtEnd.reduce((a, b) => a + b) / spikeAtEnd.length;
    expect(ewma(spikeAtEnd, ACUTE_DAYS)).toBeGreaterThan(flatMean);
  });

  it("survives an empty series", () => {
    expect(ewma([], ACUTE_DAYS)).toBe(0);
  });
});

describe("bandFor — the boundaries the whole UI keys off", () => {
  it("does not call a missing number a crisis", () => {
    // every comparison against NaN is false, so an unguarded chain falls
    // through to the last branch and tells someone they are carrying too much
    expect(bandFor(NaN)).toBe("usual");
    expect(bandFor(Infinity)).toBe("usual");
    expect(bandFor(-Infinity)).toBe("usual");
  });

  it("classifies each band at its edges", () => {
    expect(bandFor(0.5)).toBe("light");
    expect(bandFor(0.79)).toBe("light");
    expect(bandFor(0.8)).toBe("usual");
    expect(bandFor(0.99)).toBe("usual");
    expect(bandFor(1.0)).toBe("usual"); // a steady life is not a busy one
    expect(bandFor(1.09)).toBe("usual");
    expect(bandFor(1.1)).toBe("busy");
    expect(bandFor(1.29)).toBe("busy");
    expect(bandFor(1.3)).toBe("heavy");
    expect(bandFor(1.49)).toBe("heavy");
    expect(bandFor(1.5)).toBe("toomuch");
    expect(bandFor(2.4)).toBe("toomuch");
  });
});

describe("computeCarry", () => {
  const asOf = new Date("2026-03-31T00:00:00Z");

  it("reports a steady life as about your usual", () => {
    // identical load every day for 12 weeks: acute and chronic converge, ratio -> 1
    const c = computeCarry(flatSeries(84, 4), asOf);
    expect(c.ratio).toBeCloseTo(1, 2);
    expect(c.band).toBe("usual");
  });

  it("catches a spike against a person's OWN baseline", () => {
    // eleven calm weeks, then one heavy week
    const calm = flatSeries(84, 3).filter((e) => e.date < "2026-03-25");
    const heavy = flatSeries(84, 3)
      .filter((e) => e.date >= "2026-03-25")
      .map((e) => ({ ...e, hours: 11 }));
    const c = computeCarry([...calm, ...heavy], asOf);
    expect(c.ratio).toBeGreaterThan(1.5);
    expect(c.band).toBe("toomuch");
  });

  it("treats identical hours differently for two different baselines", () => {
    // THE thesis: the same week is not the same load for two people.
    const sameWeek = flatSeries(84, 6).filter((e) => e.date >= "2026-03-25");

    const lightBaseline = flatSeries(84, 2).filter((e) => e.date < "2026-03-25");
    const heavyBaseline = flatSeries(84, 9).filter((e) => e.date < "2026-03-25");

    const a = computeCarry([...lightBaseline, ...sameWeek], asOf);
    const b = computeCarry([...heavyBaseline, ...sameWeek], asOf);

    // identical week, opposite verdicts: one is drowning, one is comfortable
    expect(a.ratio).toBeGreaterThan(b.ratio);
    expect(a.band).toBe("toomuch");
    expect(b.ratio).toBeLessThan(1);
    expect(b.band).toBe("usual");
  });

  it("does not report false calm before it knows you", () => {
    // cold start: no history is "we don't know you yet", not "you're fine"
    const c = computeCarry([], asOf);
    expect(c.ratio).toBe(1);
    expect(c.chronic).toBe(0);
  });
});
