/**
 * Hours from a written time range.
 *
 * chrono returns both ends of "friday 3pm-11pm", but only while the date and
 * the time stay next to each other. Slip a noun between them — "saturday
 * shift 9am to 5pm" — and it returns the right day with no end time at all,
 * so eight hours vanish without an error. This regex is the safety net.
 */
const RANGE =
  /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(?:-|–|—|to|till|until)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/;

const to24 = (h: number, meridiem?: string): number => {
  if (meridiem === "pm") return h === 12 ? 12 : h + 12;
  if (meridiem === "am") return h === 12 ? 0 : h;
  return h;
};

export interface TimeRange {
  startHour: number;
  hours: number;
}

export function timeRange(text: string): TimeRange | null {
  const m = RANGE.exec(text);
  if (!m) return null;

  const h1 = Number(m[1]);
  const min1 = Number(m[2] ?? 0);
  const h2 = Number(m[4]);
  const min2 = Number(m[5] ?? 0);
  if (h1 > 24 || h2 > 24) return null;

  let am1 = m[3];
  let am2 = m[6];

  // "2-4pm" means both afternoon; "8pm-2am" crosses midnight. Infer the
  // missing half the way a person reads it rather than defaulting to am.
  if (!am1 && am2) am1 = h1 > h2 ? (am2 === "pm" ? "am" : "pm") : am2;
  else if (!am2 && am1) am2 = h2 < h1 ? (am1 === "am" ? "pm" : "am") : am1;
  else if (!am1 && !am2) {
    if (h1 < 8) am1 = am2 = "pm"; // "3-11" is an evening shift, not a dawn one
    else {
      am1 = "am";
      am2 = h2 < h1 ? "pm" : "am";
    }
  }

  const start = to24(h1, am1) + min1 / 60;
  let end = to24(h2, am2) + min2 / 60;
  if (end <= start) end += 24;

  const hours = Math.round((end - start) * 100) / 100;
  return hours > 0 && hours <= 24 ? { startHour: start, hours } : null;
}
