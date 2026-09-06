import type { Intensity } from "../engine/types";

export interface Recurring {
  /** 0 = Sunday … 6 = Saturday */
  weekday: number;
  hours: number;
  intensity: Intensity;
  title: string;
  category: "class" | "shift" | "club" | "family" | "admin" | "social";
}

export interface Persona {
  id: string;
  name: string;
  course: string;
  /** one line, shown in the persona switcher */
  blurb: string;
  seed: number;
  /** hours of timetabled class by weekday, 0 = Sunday */
  classByWeekday: number[];
  commuteHoursPerClassDay: number;
  recurring: Recurring[];
  /** scales every assignment's crunch — a heavier course load */
  academicScale: number;
}

const WEEKDAY = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

/** The default. A recognisably ordinary Malaysian undergrad: classes,
 *  a weekend cafe shift, a long commute, family two hours away. */
export const AISYAH: Persona = {
  id: "aisyah",
  name: "Aisyah",
  course: "Year 2, Software Engineering",
  blurb: "Weekend cafe shifts, 45 minutes each way, family in Melaka.",
  seed: 20260913,
  classByWeekday: [0, 4, 2, 3, 4, 2, 0],
  commuteHoursPerClassDay: 1.5,
  academicScale: 1,
  recurring: [
    { weekday: WEEKDAY.sat, hours: 8, intensity: 4, title: "Cafe shift", category: "shift" },
    { weekday: WEEKDAY.sun, hours: 5, intensity: 4, title: "Cafe shift", category: "shift" },
    { weekday: WEEKDAY.wed, hours: 2, intensity: 2, title: "Badminton", category: "club" },
    { weekday: WEEKDAY.sun, hours: 1.5, intensity: 2, title: "Chores & laundry", category: "admin" },
  ],
};

/** Final year. A calm baseline that makes the FYP cliff read sharply. */
export const WEI_JIAN: Persona = {
  id: "weijian",
  name: "Wei Jian",
  course: "Final year, Computer Science",
  blurb: "No job, light timetable — and a final year project that just landed.",
  seed: 771102,
  classByWeekday: [0, 2, 2, 0, 3, 0, 0],
  commuteHoursPerClassDay: 0.5,
  academicScale: 1.45,
  recurring: [
    { weekday: WEEKDAY.thu, hours: 2, intensity: 2, title: "Board games night", category: "social" },
  ],
};

/** The persona that proves the entire thesis in five seconds on stage:
 *  Nurul's baseline is enormous, so her "about your usual" sits at nearly
 *  double Aisyah's absolute hours. Same measure, different normal. */
export const NURUL: Persona = {
  id: "nurul",
  name: "Nurul",
  course: "Year 3, Accounting",
  blurb: "Cares for her grandmother daily. Her usual week is most people's worst.",
  seed: 480315,
  classByWeekday: [0, 3, 3, 2, 3, 2, 0],
  commuteHoursPerClassDay: 1,
  academicScale: 0.95,
  recurring: [
    { weekday: WEEKDAY.mon, hours: 3, intensity: 4, title: "Caregiving", category: "family" },
    { weekday: WEEKDAY.tue, hours: 3, intensity: 4, title: "Caregiving", category: "family" },
    { weekday: WEEKDAY.wed, hours: 3, intensity: 4, title: "Caregiving", category: "family" },
    { weekday: WEEKDAY.thu, hours: 3, intensity: 4, title: "Caregiving", category: "family" },
    { weekday: WEEKDAY.fri, hours: 3, intensity: 4, title: "Caregiving", category: "family" },
    { weekday: WEEKDAY.sat, hours: 5, intensity: 4, title: "Caregiving", category: "family" },
    { weekday: WEEKDAY.sun, hours: 5, intensity: 4, title: "Caregiving", category: "family" },
    { weekday: WEEKDAY.sat, hours: 2, intensity: 2, title: "Groceries & errands", category: "admin" },
  ],
};

export const PERSONAS = [AISYAH, WEI_JIAN, NURUL];
export const DEFAULT_PERSONA = AISYAH;

export const personaById = (id: string): Persona =>
  PERSONAS.find((p) => p.id === id) ?? DEFAULT_PERSONA;
