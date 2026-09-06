/**
 * Builds a believable semester of load.
 *
 * The rule that matters: we seed EVENTS, never daily totals. Daily load is
 * derived, so when a judge adds a commitment during the demo the curve
 * genuinely moves. Hardcoded totals are the most detectable fake there is.
 *
 * Four layers, applied in order:
 *   1. rhythm    — the weekly floor: classes, commute, shifts, clubs
 *   2. academic  — the shape: deadlines with an exponential crunch ramp
 *   3. noise     — the texture: jitter, two crashed days, a birthday
 *   4. story     — the beat: weeks 10 and 11 carry the demo
 */
import { addDays, differenceInCalendarDays, format, startOfWeek } from "date-fns";
import type { Intensity, LoadEvent } from "../engine/types";
import { mulberry32, jitter } from "./prng";
import type { Persona } from "./personas";

export const HISTORY_BACK = 83;
export const FUTURE_FORWARD = 28;

/** The semester week `asOf` falls in. The story is written around week 10. */
export const CURRENT_WEEK = 10;
export const SEMESTER_WEEKS = 14;

/**
 * "Today" for the demo: the most recent Wednesday on or before the real date.
 * Wednesday deliberately — a partially-elapsed week is what real usage looks
 * like, and a Monday would show an empty acute window. Anchoring to the real
 * date keeps the demo from going stale, while staying identical all day.
 */
export function demoAsOf(now: Date = new Date()): Date {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const back = (d.getDay() - 3 + 7) % 7; // 3 = Wednesday
  return addDays(d, -back);
}

const iso = (d: Date) => format(d, "yyyy-MM-dd");

interface Assignment {
  week: number;
  title: string;
  /** total hours of work the piece represents */
  weight: number;
  intensity: Intensity;
}

const ASSIGNMENTS: Assignment[] = [
  { week: 3, title: "OOP lab report", weight: 9, intensity: 3 },
  { week: 5, title: "Database ERD assignment", weight: 12, intensity: 3 },
  { week: 7, title: "Midterms", weight: 22, intensity: 5 },
  { week: 9, title: "Data Structures assignment", weight: 14, intensity: 4 },
  { week: 11, title: "Group project — final report", weight: 34, intensity: 5 },
  { week: 13, title: "Networks quiz", weight: 8, intensity: 3 },
];

export function generateEvents(persona: Persona, asOf: Date): LoadEvent[] {
  const rnd = mulberry32(persona.seed);
  const events: LoadEvent[] = [];
  let n = 0;
  const push = (
    date: Date,
    title: string,
    category: LoadEvent["category"],
    hours: number,
    intensity: Intensity,
  ) => {
    if (hours <= 0.05) return;
    events.push({
      id: `s${n++}`,
      date: iso(date),
      title,
      category,
      hours: Math.round(hours * 100) / 100,
      intensity,
      source: "seed",
    });
  };

  const start = addDays(asOf, -HISTORY_BACK);
  const end = addDays(asOf, FUTURE_FORWARD);
  const total = differenceInCalendarDays(end, start);

  // Week 1 Monday, derived so that asOf lands in CURRENT_WEEK.
  const weekMonday = startOfWeek(asOf, { weekStartsOn: 1 });
  const semesterStart = addDays(weekMonday, -(CURRENT_WEEK - 1) * 7);
  const weekOf = (d: Date) =>
    Math.floor(differenceInCalendarDays(d, semesterStart) / 7) + 1;

  for (let i = 0; i <= total; i++) {
    const day = addDays(start, i);
    const dow = day.getDay();
    const week = weekOf(day);
    const inSemester = week >= 1 && week <= SEMESTER_WEEKS;

    // ---- layer 1: rhythm -------------------------------------------------
    const classHours = persona.classByWeekday[dow];
    if (inSemester && classHours > 0) {
      push(day, "Classes", "class", classHours * jitter(rnd, 0.08), 2);
      push(
        day,
        "Commute",
        "commute",
        persona.commuteHoursPerClassDay * jitter(rnd, 0.15),
        2,
      );
    }
    for (const r of persona.recurring) {
      if (r.weekday === dow) {
        push(day, r.title, r.category, r.hours * jitter(rnd, 0.1), r.intensity);
      }
    }

    // ---- layer 2: academic structure ------------------------------------
    if (inSemester) {
      for (const a of ASSIGNMENTS) {
        const due = addDays(semesterStart, (a.week - 1) * 7 + 4); // Friday
        const daysToDue = differenceInCalendarDays(due, day);
        if (daysToDue < 0 || daysToDue > 9) continue;
        // work concentrates sharply as the deadline closes — the planning
        // fallacy made visible
        const ramp = Math.exp(-daysToDue / 2.6);
        const hours = a.weight * 0.34 * ramp * persona.academicScale * jitter(rnd, 0.12);
        push(day, a.title, "assignment", hours, a.intensity);
      }
      // the group project drags across weeks 8-12 regardless of the deadline
      if (week >= 8 && week <= 12 && (dow === 2 || dow === 5)) {
        push(day, "Group project meeting", "assignment", 1.6 * jitter(rnd, 0.2), 4);
      }
    }
  }

  // ---- layer 3: noise ----------------------------------------------------
  // two crashed days: real load is jagged, and a smooth curve reads as fake
  for (const back of [37, 58]) {
    const sick = iso(addDays(asOf, -back));
    for (const e of events) {
      if (e.date === sick) e.hours = Math.round(e.hours * 0.3 * 100) / 100;
    }
  }
  // one friend's birthday
  push(addDays(asOf, -19), "Farah's birthday dinner", "social", 5, 2);

  // ---- layer 4: the story ------------------------------------------------
  // Week 10 is the opening shot: it must read "heavier than usual for you".
  // Nothing here is a catastrophe on its own — that is the entire point of
  // the problem statement. It is five ordinary yeses landing in one week.
  push(addDays(asOf, -5), "Group project — rewrite after feedback", "assignment", 4.5, 5);
  push(addDays(asOf, -3), "Cover shift — Hana called in sick", "shift", 5.5, 4);
  push(addDays(asOf, -2), "Help Amir move house", "social", 5, 3);
  push(addDays(asOf, -1), "Cover shift for Danish", "shift", 6, 4);
  push(addDays(asOf, 0), "Group project — merge conflicts", "assignment", 7, 5);

  // Week 11 is where the No Button fires: already loaded before anyone asks.
  push(addDays(asOf, 2), "Lab makeup session", "class", 3, 3);
  push(addDays(asOf, 8), "Group project — final push", "assignment", 6, 5);
  push(addDays(asOf, 9), "Cousin's wedding — Melaka", "family", 14, 3);
  push(addDays(asOf, 10), "Drive back from Melaka", "commute", 4, 3);

  return events;
}
