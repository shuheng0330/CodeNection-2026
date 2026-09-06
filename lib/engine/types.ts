/** The five areas the problem statement names, plus the ones students
 *  actually carry that no tracker counts (commute, admin). */
export type LoadCategory =
  | "class"
  | "assignment"
  | "shift"
  | "commute"
  | "family"
  | "social"
  | "club"
  | "admin";

/** How much a thing takes out of you — not how long it takes.
 *  Two hours of group-project mediation is not two hours of lecture. */
export type Intensity = 1 | 2 | 3 | 4 | 5;

export interface LoadEvent {
  id: string;
  /** ISO date, yyyy-mm-dd */
  date: string;
  category: LoadCategory;
  title: string;
  hours: number;
  intensity: Intensity;
  source: "seed" | "user";
}

export interface DailyLoad {
  date: string;
  load: number;
}

/** Band keys only. The user-facing sentence for each lives in lib/copy.ts —
 *  the engine never speaks to the user. */
export type BandKey = "light" | "usual" | "busy" | "heavy" | "toomuch";

export interface CarryState {
  acute: number;
  chronic: number;
  ratio: number;
  band: BandKey;
  dailies: DailyLoad[];
}
