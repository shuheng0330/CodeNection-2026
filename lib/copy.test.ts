import { describe, expect, it } from "vitest";
import { NAV, RECOVER } from "./copy";

describe("Quiet Day copy", () => {
  it("uses the clear navigation and first-time-user framing", () => {
    expect(NAV.recover).toBe("Quiet Day");
    expect(NAV.asks).toBe("Decisions");
    expect(RECOVER.title).toBe("Find your next quiet day");
    expect(RECOVER.none).toBe("Your next 10 days are full.");
    expect(RECOVER.makeRoomTitle).toBe("Want to make some room?");
  });

  it("describes empty and partly planned quiet days plainly", () => {
    expect(RECOVER.plannedHours(0)).toBe("Nothing is planned on this day.");
    expect(RECOVER.plannedHours(0.5)).toBe(
      "You have under an hour planned on this day.",
    );
    expect(RECOVER.plannedHours(2)).toBe(
      "You have 2 hours planned on this day.",
    );
    expect(RECOVER.plannedHours(2.5)).toBe(
      "You have 2.5 hours planned on this day.",
    );
  });
});
