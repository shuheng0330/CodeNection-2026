import { describe, expect, it } from "vitest";
import { decisionDemo } from "./seed/decisionDemo";
import { previewOutcome } from "../components/landing/previewOutcome";

describe("landing decision preview", () => {
  it("uses the request's affected week for both answers without mutating the fixture", () => {
    const demo = decisionDemo();
    const original = JSON.stringify(demo);
    expect(demo.price.landing).not.toBeNull();
    for (let i = 0; i < 5; i++) {
      expect(previewOutcome(demo, "accept").selected).toBe(Math.round(demo.price.landing!.ratioAfter * 100));
      expect(previewOutcome(demo, "decline").selected).toBe(Math.round(demo.price.landing!.ratioBefore * 100));
    }
    expect(JSON.stringify(demo)).toBe(original);
  });
  it("keeps hours free when declining and adds them when accepting", () => {
    const demo = decisionDemo();
    expect(previewOutcome(demo, "decline").hoursText).toBe(`${demo.candidate.hours} hours kept free`);
    expect(previewOutcome(demo, "accept").hoursText).toBe(`${demo.candidate.hours} hours added`);
  });
  it("omits unavailable forecast values while preserving factual hours", () => {
    const demo = decisionDemo();
    const beyond = { ...demo, price: { ...demo.price, landing: null } };
    expect(previewOutcome(beyond, "decline")).toMatchObject({ before: null, selected: null, week: null, hoursText: `${demo.candidate.hours} hours kept free` });
  });
});
