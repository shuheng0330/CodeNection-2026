import { describe, expect, it } from "vitest";
import {
  eligiblePutDowns,
  MIN_HOURS_BACK,
  putDownReason,
  suggestPutDown,
  whenLabel,
} from "./putdown";
import type { Intensity, LoadCategory, LoadEvent } from "./types";
import { LANDING } from "../copy";

const asOf = new Date(2026, 8, 9); // Wednesday 9 Sep 2026
const HEAVY = 1.4;
const CALM = 1.0;

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
      expect(suggestPutDown([ev("2026-09-10", category, 20, 5)], asOf, HEAVY)).toBeNull();
    }
  });

  it("says nothing at all when the week is not heavy", () => {
    // a calm week has nothing that needs to come off it, and inventing
    // something to drop turns a calm tool into another backlog
    const easy = [ev("2026-09-12", "shift", 9, 4)];
    expect(suggestPutDown(easy, asOf, CALM)).toBeNull();
    expect(suggestPutDown(easy, asOf, HEAVY)?.event.hours).toBe(9);
  });

  it("looks at the week ahead, not the week behind", () => {
    const past = ev("2026-09-05", "shift", 12, 5);
    const upcoming = ev("2026-09-12", "shift", 4, 3);
    expect(suggestPutDown([past], asOf, HEAVY)).toBeNull();
    expect(suggestPutDown([past, upcoming], asOf, HEAVY)?.event.id).toBe(upcoming.id);
  });

  it("stops at the end of the week rather than reaching into next month", () => {
    expect(suggestPutDown([ev("2026-09-30", "shift", 8, 4)], asOf, HEAVY)).toBeNull();
  });

  it("ranks by what it takes out of you, not by hours", () => {
    const longButEasy = ev("2026-09-11", "club", 6, 1); // 6 * 0.6 = 3.6
    const shortButDraining = ev("2026-09-11", "shift", 5, 5); // 5 * 1.7 = 8.5
    expect(suggestPutDown([longButEasy, shortButDraining], asOf, HEAVY)?.event.id).toBe(
      shortButDraining.id,
    );
  });

  it("stays quiet rather than offering back an hour of errands", () => {
    // handing back ninety minutes is not relief, it is busywork as advice
    const trivial = [ev("2026-09-11", "admin", MIN_HOURS_BACK - 0.5, 2)];
    expect(suggestPutDown(trivial, asOf, HEAVY)).toBeNull();
  });

  it("skips a heavy-but-tiny commitment for a lighter one worth real time", () => {
    const intenseButShort = ev("2026-09-11", "shift", 2, 5); // load 3.4
    const longer = ev("2026-09-12", "shift", 6, 3); // load 6.0
    expect(suggestPutDown([intenseButShort, longer], asOf, HEAVY)?.event.id).toBe(longer.id);
  });

  it("reports the time handed back in the student's own units", () => {
    const p = suggestPutDown([ev("2026-09-12", "shift", 8.5, 4)], asOf, HEAVY);
    expect(p?.hoursBack).toBe(8.5);
    expect(p?.when).toBe("Saturday");
  });
});

describe("eligiblePutDowns", () => {
  it("returns every worthwhile negotiable choice with the recommendation first", () => {
    const protectedClass = ev("2026-09-10", "class", 12, 5);
    const tinyErrand = ev("2026-09-10", "admin", 2, 5);
    const laterShift = ev("2026-09-30", "shift", 10, 5);
    const social = ev("2026-09-11", "social", 6, 2);
    const drainingShift = ev("2026-09-12", "shift", 5, 5);

    const choices = eligiblePutDowns(
      [protectedClass, tinyErrand, laterShift, social, drainingShift],
      asOf,
      HEAVY,
    );

    expect(choices.map((choice) => choice.event.id)).toEqual([
      drainingShift.id,
      social.id,
    ]);
    expect(choices[0]).toEqual(suggestPutDown([social, drainingShift], asOf, HEAVY));
  });

  it("reveals no choices for a calm week", () => {
    expect(eligiblePutDowns([ev("2026-09-12", "shift", 8, 5)], asOf, CALM)).toEqual(
      [],
    );
  });
});

describe("the promise the landing page makes", () => {
  // The landing page names, in prose, the things Pikul will never ask you to
  // drop. Those sentences are claims about this engine, and one shipped saying
  // "health needs" — a category that has never existed in the model — while
  // leaving out commuting, which the engine really does protect. Nobody could
  // have caught that by reading either file alone.
  //
  // Every string that makes the claim is checked, not just the one that was
  // wrong first: the next rewrite of this section put "health needs" straight
  // back, in a new sentence a test naming a single key would have waved
  // through.
  // `protected` is currently unrendered — the refresh folded the claim into
  // `putdownBody` — so only the second of these is on screen today. Both are
  // checked anyway: the string is still in copy.ts and reaches a page the
  // moment anyone puts it back.
  const CLAIMS = [LANDING.protected, LANDING.putdownBody];

  const NAMED: [string, LoadCategory][] = [
    ["Classes", "class"],
    ["coursework", "assignment"],
    ["commuting", "commute"],
    ["family", "family"],
  ];

  it("names something the engine actually protects, and nothing it does not", () => {
    for (const claim of CLAIMS) {
      for (const [phrase, category] of NAMED) {
        expect(claim.toLowerCase()).toContain(phrase.toLowerCase());
        expect(suggestPutDown([ev("2026-09-12", category, 20, 5)], asOf, HEAVY)).toBeNull();
      }
    }
  });

  it("leaves out every category the engine is willing to offer back", () => {
    const offered: [string, LoadCategory][] = [
      ["shift", "shift"],
      ["social", "social"],
      ["club", "club"],
      ["errand", "admin"],
    ];
    for (const claim of CLAIMS) {
      for (const [phrase, category] of offered) {
        expect(claim.toLowerCase()).not.toContain(phrase);
        expect(suggestPutDown([ev("2026-09-12", category, 20, 5)], asOf, HEAVY)).not.toBeNull();
      }
    }
  });
});

describe("whenLabel", () => {
  it("prefers today and tomorrow over a weekday name", () => {
    expect(whenLabel("2026-09-09", asOf)).toBe("today");
    expect(whenLabel("2026-09-10", asOf)).toBe("tomorrow");
    expect(whenLabel("2026-09-12", asOf)).toBe("Saturday");
  });
});

describe("putDownReason", () => {
  it("distinguishes a calm week from a heavy week with nothing optional in it", () => {
    const coursework = [ev("2026-09-11", "assignment", 12, 5)];
    expect(putDownReason(coursework, asOf, CALM)).toBe("settled");
    expect(putDownReason(coursework, asOf, HEAVY)).toBe("none-optional");
    expect(putDownReason([ev("2026-09-11", "club", 1, 2)], asOf, HEAVY)).toBe("all-small");
  });
});
