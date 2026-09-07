import type { Intensity, LoadCategory } from "../engine/types";

/**
 * What kind of commitment a message is describing.
 *
 * Two separate axes, deliberately: the category is what the thing IS, the
 * intensity is how much it takes out of you. Keeping them apart means an
 * exam can be a class at intensity 5 without inventing a ninth category.
 *
 * First match wins, so the most specific patterns are listed first. Thirty
 * good rules beat three hundred fragile ones — this is meant to be read and
 * argued with, not to be exhaustive.
 */
interface Rule {
  re: RegExp;
  category: LoadCategory;
  intensity?: Intensity;
}

const RULES: Rule[] = [
  { re: /\b(fyp|thesis|viva|dissertation)\b/, category: "assignment", intensity: 5 },
  { re: /\b(final exam|midterm|exam|test|quiz)\b/, category: "class", intensity: 5 },
  {
    re: /\bbalikkampung\b|\b(kenduri|kahwin|wedding|majlis|raya|funeral)\b/,
    category: "family",
    intensity: 3,
  },
  { re: /\bgroup (project|assignment|meeting)\b/, category: "assignment" },
  {
    re: /\b(shift|cover|ganti|gantikan|part[- ]?time|outlet|duty|barista|waiter|cashier)\b/,
    category: "shift",
  },
  {
    re: /\b(assignment|report|slides?|deck|demo|presentation|proposal|submit|hantar|due|deadline|draft)\b/,
    category: "assignment",
  },
  {
    re: /\b(class|kelas|lecture|kuliah|tutorial|lab|makmal|seminar|practical)\b/,
    category: "class",
  },
  {
    re: /\b(club|kelab|committee|ajk|society|persatuan|mesyuarat|volunteer|rehearsal|latihan|meeting)\b/,
    category: "club",
  },
  {
    re: /\b(family|keluarga|mak|ayah|cousin|sepupu|adik|abang|kakak|hospital|nenek|atuk)\b/,
    category: "family",
  },
  // A team sport is a standing commitment you turn up to, not a night out.
  {
    re: /\b(badminton|futsal|bola|basketball|volleyball|netball|jogging|yoga|dance|choir|sukan)\b/,
    category: "club",
  },
  {
    re: /\b(lepak|mamak|makan|hangout|outing|movie|wayang|gym|karaoke|dinner|supper|birthday)\b/,
    category: "social",
  },
  {
    re: /\b(commute|drive|bas|bus|lrt|mrt|ktm|grab|airport|station|balik|pick ?up|jemput)\b/,
    category: "commute",
  },
  {
    re: /\b(form|borang|register|daftar|appointment|ptptn|jpa|bank|renew|passport|visa|clinic|doctor|admin)\b/,
    category: "admin",
  },
];

/** Used when the message says what the thing is but not how long it takes. */
export const DEFAULT_HOURS: Record<LoadCategory, number> = {
  class: 2,
  assignment: 3,
  shift: 6,
  commute: 1,
  family: 4,
  social: 3,
  club: 2,
  admin: 1,
};

/** Load per hour. Social sits lowest on purpose: seeing people is usually
 *  restorative, and counting it as heavy would make the maths lie. */
export const DEFAULT_INTENSITY: Record<LoadCategory, Intensity> = {
  class: 3,
  assignment: 5,
  shift: 4,
  commute: 2,
  family: 2,
  social: 1,
  club: 3,
  admin: 2,
};

const URGENT = /\b(urgent|asap|tonight|last minute|emergency|cepat|segera)\b/;

export interface Classification {
  category: LoadCategory;
  intensity: Intensity;
  /** the word we matched on, so the UI can show its working */
  matchedOn: string | null;
}

export function classify(text: string): Classification {
  for (const rule of RULES) {
    const m = rule.re.exec(text);
    if (!m) continue;
    let intensity = rule.intensity ?? DEFAULT_INTENSITY[rule.category];
    if (URGENT.test(text)) intensity = Math.min(5, intensity + 1) as Intensity;
    return { category: rule.category, intensity, matchedOn: m[0] };
  }
  return { category: "admin", intensity: 2, matchedOn: null };
}
