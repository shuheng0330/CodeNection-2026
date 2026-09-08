import { describe, expect, it } from "vitest";
import { extract } from "./extract";
import { normalize } from "./normalize";
import { timeRange } from "./timeRange";

/** Monday 7 September 2026, 9am. Frozen: the parser must never read a clock. */
const REF = new Date(2026, 8, 7, 9, 0);

describe("timeRange", () => {
  it("reads a plain range", () => {
    expect(timeRange("3pm-11pm")?.hours).toBe(8);
    expect(timeRange("9am to 5pm")?.hours).toBe(8);
  });

  it("carries the meridiem backwards across a range", () => {
    // "2-4pm" is an afternoon, not two in the morning
    expect(timeRange("2-4pm")?.hours).toBe(2);
  });

  it("rolls over midnight instead of returning a negative shift", () => {
    expect(timeRange("8pm-2am")?.hours).toBe(6);
  });

  it("reads a bare evening range the way a person would", () => {
    // nobody is asking you to cover 3am-11am
    expect(timeRange("3-11")?.startHour).toBe(15);
    expect(timeRange("3-11")?.hours).toBe(8);
  });

  it("finds nothing in a message without a range", () => {
    expect(timeRange("can you help with the group project")).toBeNull();
  });
});

describe("normalize", () => {
  it("puts multi-word phrases before single words", () => {
    // a bare minggu -> sunday rule would turn this into "hujung sunday"
    expect(normalize("hujung minggu")).toBe("saturday");
    expect(normalize("minggu depan")).toBe("next week");
  });

  it("covers the shorthand chrono silently drops", () => {
    expect(normalize("tues")).toBe("tue");
    expect(normalize("weds")).toBe("wed");
    expect(normalize("tmrw")).toBe("tomorrow");
  });
});

describe("extract", () => {
  it("reads a WhatsApp shift request end to end", () => {
    const d = extract("eh can you cover my shift this friday 3pm-11pm?", REF);
    expect(d.date.value).toBe("2026-09-11");
    expect(d.date.from).toBe("parsed");
    expect(d.hours.value).toBe(8);
    expect(d.hours.from).toBe("parsed");
    expect(d.category.value).toBe("shift");
    expect(d.title.value).toBe("Cover shift");
  });

  it("reads Malay, including a time range chrono cannot see", () => {
    const d = extract("sabtu ni shift 9 pagi sampai 5 petang", REF);
    expect(d.date.value).toBe("2026-09-12");
    expect(d.hours.value).toBe(8);
    expect(d.category.value).toBe("shift");
  });

  it("reads dates the way Malaysia writes them", () => {
    // 12/9 is 12 September here, not 9 December
    const d = extract("shift on 12/9 8pm-2am", REF);
    expect(d.date.value).toBe("2026-09-12");
    expect(d.hours.value).toBe(6);
  });

  it("resolves the shorthand that would otherwise silently mean today", () => {
    const d = extract("tues 8-10pm badminton", REF);
    expect(d.date.value).toBe("2026-09-08");
    expect(d.category.value).toBe("club");
    expect(d.title.value).toBe("Badminton");
  });

  it("only ever looks forward", () => {
    // an ask is always about a day that has not happened yet
    expect(extract("can you cover sunday", REF).date.value).toBe("2026-09-13");
  });

  it("separates what a thing is from how heavy it is", () => {
    const exam = extract("final exam on thursday", REF);
    expect(exam.category.value).toBe("class");
    expect(exam.intensity.value).toBe(5);
  });

  it("marks everything it filled in for itself", () => {
    const d = extract("can you help with the group project this weekend", REF);
    expect(d.category.from).toBe("parsed"); // the message said "group project"
    expect(d.hours.from).toBe("guessed"); // it never said how long
    expect(d.intensity.from).toBe("guessed"); // a message never states this
  });

  it("degrades to a normal empty form instead of failing", () => {
    const d = extract("kfjshdkfjh random nonsense", REF);
    expect(d.date.from).toBe("guessed");
    expect(d.hours.from).toBe("guessed");
    expect(d.category.from).toBe("guessed");
    expect(d.title.value).toContain("random nonsense");
  });

  it("does not invent a date out of a stray number", () => {
    expect(extract("finish chapter 8 of the report", REF).date.from).toBe("guessed");
    expect(extract("group of 5 people", REF).date.from).toBe("guessed");
  });

  it("is deterministic, which is the whole point of not using a model", () => {
    const msg = "boleh tolong ambil shift sabtu?";
    expect(extract(msg, REF)).toEqual(extract(msg, REF));
  });

  it("never reads the system clock", () => {
    const a = extract("shift on friday", new Date(2026, 8, 7));
    const b = extract("shift on friday", new Date(2026, 9, 7));
    expect(a.date.value).not.toBe(b.date.value);
  });
});
