import { describe, expect, it } from "vitest";
import { decisionDemo, DEMO_MESSAGE } from "./decisionDemo";
import { seedEvents } from "./cache";
import { toISODate } from "../engine/dates";
import { extract } from "../parse/extract";

describe("decisionDemo — the fixture the landing and the app share", () => {
  const demo = decisionDemo();

  it("hands back the same object every time", () => {
    // Two surfaces render this. If they computed it separately they could
    // drift, and a landing page contradicting the product is worse than no
    // landing page.
    expect(decisionDemo()).toBe(decisionDemo());
  });

  it("is a proposal, not something already on the calendar", () => {
    const committed = seedEvents(demo.persona, demo.asOf);
    expect(committed.some((e) => e.id === demo.candidate.id)).toBe(false);
    expect(demo.candidate.source).toBe("user");
  });

  it("lands inside the horizon we can actually price", () => {
    expect(demo.price.landing).not.toBeNull();
    const week = demo.price.landing!;
    expect(demo.candidate.date >= week.weekStart).toBe(true);
  });

  it("costs something, or it demonstrates nothing", () => {
    const week = demo.price.landing!;
    expect(week.ratioAfter).toBeGreaterThan(week.ratioBefore);
    expect(demo.price.verdict).not.toBe("fits");
  });

  it("leaves every other week alone", () => {
    for (const w of demo.price.weeks) {
      if (w.label === demo.price.landing!.label) continue;
      expect(w.ratioAfter).toBe(w.ratioBefore);
    }
  });

  it("opens on a student who is already carrying too much", () => {
    // A calm week has nothing to decide about
    expect(demo.carry.ratio).toBeGreaterThan(1.1);
    expect(demo.hoursThisWeek).toBeGreaterThan(demo.usualWeekHours);
  });

  it("is reachable by pasting the message it claims to have arrived as", () => {
    // The paste demonstration and the fixture have to agree, or the landing
    // shows one thing and the parser produces another.
    const parsed = extract(DEMO_MESSAGE, demo.asOf);
    expect(parsed.date.value).toBe(demo.candidate.date);
    expect(parsed.hours.value).toBe(demo.candidate.hours);
    expect(parsed.category.value).toBe(demo.candidate.category);
  });

  it("stays on the demo's own reference day", () => {
    expect(toISODate(demo.asOf)).toBe(toISODate(decisionDemo().asOf));
  });
});
