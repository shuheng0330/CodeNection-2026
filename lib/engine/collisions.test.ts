import { describe, expect, it } from "vitest";
import { addDays } from "date-fns";
import { collisions, COLLISION_THRESHOLD } from "./collisions";
import { toISODate } from "./dates";
import type { Intensity, LoadCategory, LoadEvent } from "./types";

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

/** A steady month behind, so "usual" means something. */
const background = (): LoadEvent[] =>
  Array.from({ length: 28 }, (_, i) =>
    ev(toISODate(addDays(asOf, -(i + 1))), "class", 2),
  );

describe("collisions", () => {
  it("says nothing when the weeks ahead look like the weeks behind", () => {
    const ahead = Array.from({ length: 14 }, (_, i) =>
      ev(toISODate(addDays(asOf, i)), "class", 2),
    );
    expect(collisions([...background(), ...ahead], asOf)).toEqual([]);
  });

  it("finds a genuine pile-up and reports it against your own usual", () => {
    const wall = [
      ev("2026-09-17", "assignment", 8, 5),
      ev("2026-09-18", "assignment", 9, 5),
      ev("2026-09-19", "shift", 8, 4),
      ev("2026-09-20", "family", 12, 3),
    ];
    const found = collisions([...background(), ...wall], asOf);
    expect(found).toHaveLength(1);
    expect(found[0].timesUsual).toBeGreaterThan(COLLISION_THRESHOLD);
    expect(found[0].events.length).toBeGreaterThanOrEqual(3);
  });

  it("does not call one crowded day a wall", () => {
    // six lectures on one Tuesday is a Tuesday
    const oneDay = Array.from({ length: 6 }, (_, i) => ({
      ...ev("2026-09-17", "class", 3, 4),
      id: `same-day-${i}`,
    }));
    expect(collisions([...background(), ...oneDay], asOf)).toEqual([]);
  });

  it("ignores what you could actually move", () => {
    // social, club and errands are negotiable; a pile of them is not a wall
    const soft = [
      ev("2026-09-17", "social", 8),
      ev("2026-09-18", "club", 9),
      ev("2026-09-19", "admin", 8),
      ev("2026-09-20", "social", 12),
    ];
    expect(collisions([...background(), ...soft], asOf)).toEqual([]);
  });

  it("never reports the past", () => {
    const behind = [
      ev(toISODate(addDays(asOf, -3)), "assignment", 12, 5),
      ev(toISODate(addDays(asOf, -2)), "shift", 10, 4),
      ev(toISODate(addDays(asOf, -1)), "family", 12, 3),
    ];
    for (const c of collisions([...background(), ...behind], asOf)) {
      expect(c.from >= toISODate(asOf)).toBe(true);
    }
  });

  it("reports one crunch once, not once per overlapping window", () => {
    const wall = [
      ev("2026-09-17", "assignment", 9, 5),
      ev("2026-09-18", "assignment", 9, 5),
      ev("2026-09-19", "shift", 9, 4),
      ev("2026-09-20", "family", 9, 3),
      ev("2026-09-21", "assignment", 9, 5),
    ];
    const found = collisions([...background(), ...wall], asOf);
    expect(found).toHaveLength(1);
  });

  it("stays quiet rather than guessing when there is no history", () => {
    expect(collisions([ev("2026-09-17", "assignment", 20, 5)], asOf)).toEqual([]);
  });
});
