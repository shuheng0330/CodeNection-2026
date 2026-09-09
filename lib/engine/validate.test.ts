import { describe, expect, it } from "vitest";
import { addDays } from "date-fns";
import { checkRequest, horizonEnd, type RequestDraft } from "./validate";
import { toISODate } from "./dates";

const asOf = new Date(2026, 8, 9); // Wednesday 9 Sep 2026

const draft = (over: Partial<RequestDraft> = {}): RequestDraft => ({
  title: "Cover a shift",
  date: toISODate(addDays(asOf, 9)),
  hours: "8",
  category: "shift",
  intensity: "4",
  ...over,
});

describe("checkRequest — how long", () => {
  it("passes an ordinary request through untouched", () => {
    const c = checkRequest(draft(), asOf);
    expect(c.ok).toBe(true);
    expect(c.problems).toEqual([]);
    expect(c.event).toEqual({
      date: toISODate(addDays(asOf, 9)),
      category: "shift",
      title: "Cover a shift",
      hours: 8,
      intensity: 4,
    });
  });

  it("reads an emptied box as unanswered, not as zero hours", () => {
    // Number("") is 0, so without this an emptied field would sail through
    // as a zero-hour commitment and be priced as costing nothing.
    expect(checkRequest(draft({ hours: "" }), asOf).problems).toContain("hours-missing");
    expect(checkRequest(draft({ hours: "   " }), asOf).problems).toContain(
      "hours-missing",
    );
  });

  it("refuses text where a number belongs", () => {
    expect(checkRequest(draft({ hours: "eight" }), asOf).problems).toContain(
      "hours-missing",
    );
  });

  it("refuses nothing and less than nothing", () => {
    expect(checkRequest(draft({ hours: "0" }), asOf).problems).toContain("hours-tiny");
    expect(checkRequest(draft({ hours: "-3" }), asOf).problems).toContain("hours-tiny");
  });

  it("refuses longer than the day it is on", () => {
    expect(checkRequest(draft({ hours: "25" }), asOf).problems).toContain(
      "hours-absurd",
    );
    expect(checkRequest(draft({ hours: "24" }), asOf).ok).toBe(true);
  });

  it("accepts half an hour, because plenty of asks are that small", () => {
    expect(checkRequest(draft({ hours: 0.5 }), asOf).ok).toBe(true);
  });
});

describe("checkRequest — when", () => {
  it("refuses a day that has already been and gone", () => {
    expect(checkRequest(draft({ date: toISODate(addDays(asOf, -1)) }), asOf).problems)
      .toContain("date-past");
  });

  it("allows today, because people are asked for tonight", () => {
    expect(checkRequest(draft({ date: toISODate(asOf) }), asOf).ok).toBe(true);
  });

  it("refuses a date it cannot read at all", () => {
    expect(checkRequest(draft({ date: "" }), asOf).problems).toContain("date-missing");
    expect(checkRequest(draft({ date: "next friday" }), asOf).problems).toContain(
      "date-missing",
    );
    expect(checkRequest(draft({ date: "2026-13-45" }), asOf).problems).toContain(
      "date-missing",
    );
  });

  it("refuses what the forecast genuinely cannot see", () => {
    // Not caution — there is no week here to measure the request against, so
    // any answer would be invented.
    const far = toISODate(addDays(asOf, 120));
    expect(checkRequest(draft({ date: far }), asOf).problems).toContain("date-beyond");
  });

  it("accepts the last day of the horizon and refuses the one after it", () => {
    const last = horizonEnd(asOf);
    expect(checkRequest(draft({ date: last }), asOf).ok).toBe(true);
    const past = toISODate(addDays(new Date(`${last}T00:00:00`), 1));
    expect(checkRequest(draft({ date: past }), asOf).problems).toContain("date-beyond");
  });

  it("ends the horizon on a Sunday, because weeks are priced whole", () => {
    expect(new Date(`${horizonEnd(asOf)}T00:00:00`).getDay()).toBe(0);
  });

  it("lets a caller with no forecast to give say so", () => {
    // Writing a December commitment on your own calendar is ordinary. It
    // simply will not show up in a forecast that reaches four weeks, which
    // is a different statement from the date being wrong.
    const far = toISODate(addDays(asOf, 120));
    expect(checkRequest(draft({ date: far }), asOf, "any").ok).toBe(true);
    expect(checkRequest(draft({ date: far }), asOf).ok).toBe(false);
  });

  it("still refuses a day that has gone, however far out it can see", () => {
    const gone = toISODate(addDays(asOf, -1));
    expect(checkRequest(draft({ date: gone }), asOf, "any").problems).toContain(
      "date-past",
    );
  });

  it("still refuses nonsense hours with no horizon", () => {
    expect(checkRequest(draft({ hours: "0" }), asOf, "any").problems).toContain(
      "hours-tiny",
    );
  });
});

describe("checkRequest — what comes out", () => {
  it("gives back nothing to price when anything is wrong", () => {
    const c = checkRequest(draft({ hours: "0", date: "" }), asOf);
    expect(c.ok).toBe(false);
    expect(c.event).toBeNull();
    expect(c.problems).toEqual(["date-missing", "hours-tiny"]);
  });

  it("keeps the dial on its scale however it was edited", () => {
    expect(checkRequest(draft({ intensity: "9" }), asOf).event!.intensity).toBe(5);
    expect(checkRequest(draft({ intensity: "0" }), asOf).event!.intensity).toBe(1);
    expect(checkRequest(draft({ intensity: "3.4" }), asOf).event!.intensity).toBe(3);
    expect(checkRequest(draft({ intensity: "nonsense" }), asOf).event!.intensity).toBe(3);
  });

  it("trims a title without deciding what it should say", () => {
    expect(checkRequest(draft({ title: "  Cover a shift  " }), asOf).event!.title).toBe(
      "Cover a shift",
    );
    expect(checkRequest(draft({ title: "" }), asOf).ok).toBe(true);
  });
});
