import { describe, expect, it } from "vitest";
import { ropePoint, introFrame, storyFrame, STORY_DURATIONS } from "../components/landing/ropeMotion";

describe("landing rope choreography", () => {
  it("loops a nine-second story with relief only after all commitments land", () => {
    expect(STORY_DURATIONS.reduce((sum, duration) => sum + duration, 0)).toBe(9000);
    expect(storyFrame(4)).toEqual({ count: 4, released: false, sag: 86 });
    expect(storyFrame(5)).toEqual({ count: 4, released: true, sag: 35 });
    expect(storyFrame(7)).toEqual({ count: 0, released: false, sag: 10 });
  });
  it("keeps every marker inside its reserved illustration even during spring overshoot", () => {
    for (const sag of [0, 30, 110, 145]) {
      for (let marker = 0; marker < 4; marker++) {
        const point = ropePoint(marker, sag);
        expect(point.x).toBeGreaterThan(24);
        expect(point.x).toBeLessThan(456);
        expect(point.y).toBeGreaterThanOrEqual(42);
        expect(point.y + 48).toBeLessThan(230);
      }
    }
  });
  it("adds four commitments and settles at two seconds", () => {
    expect(introFrame(0)).toEqual({ count: 0, sag: 12, ready: false });
    expect(introFrame(400).count).toBe(1);
    expect(introFrame(1600)).toEqual({ count: 4, sag: 110, ready: false });
    expect(introFrame(2000)).toEqual({ count: 4, sag: 110, ready: true });
  });
  it("attaches markers to the same quadratic curve as the rope", () => {
    for (let marker = 0; marker < 4; marker++) {
      const t = (marker + 1) / 5;
      const expectedY = (1 - t) ** 2 * 42 + 2 * (1 - t) * t * (42 + 110 * 2) + t ** 2 * 42;
      expect(ropePoint(marker, 110).y).toBeCloseTo(expectedY);
    }
  });
});
