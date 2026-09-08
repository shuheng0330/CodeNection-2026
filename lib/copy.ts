/**
 * EVERY user-facing string in Pikul lives in this file.
 *
 * Not for i18n — for register. The engine thinks in acute:chronic ratios;
 * the user must never meet that vocabulary. With several people writing UI
 * in parallel, a single source is the only thing that keeps the voice intact.
 *
 * BANNED in any user-facing string:
 *   ACWR · acute · chronic · ratio · score · risk · burnout · productivity
 *   streak · capacity % · "you're at 90%"
 *
 * The one sanctioned number is "% of a usual week" in the No Button forecast,
 * which is relative-to-self by construction and therefore not a grade.
 *
 * Enforced before submission by:
 *   npm run gate
 *
 * OWNERSHIP: each block below is owned by one person. Add your strings to
 * YOUR block only — appending to someone else's is how three agents produce
 * a merge conflict in the one file everybody needs.
 */
import type { BandKey } from "./engine/types";

/* ── FROZEN · nobody edits without telling the team ───────────────── */
export const PRODUCT = {
  name: "Pikul",
  /** Malay: to shoulder a load. Also a historic SEA unit of weight. */
  meaning: "to shoulder a load",
  tagline: "You're carrying more than usual.",
} as const;

type BandCopy = {
  /** the sentence shown on /today */
  line: string;
  /** a two-word chip label */
  short: string;
  /** design token name, not a colour value */
  tone: "sage" | "ember" | "amber" | "rust";
};

/* ── OWNER: A (engine & app) · band sentences shown on /today ─────── */
export const BAND: Record<BandKey, BandCopy> = {
  light: {
    line: "This week's lighter than your usual.",
    short: "lighter than usual",
    tone: "sage",
  },
  usual: {
    line: "This week's about your usual.",
    short: "about usual",
    tone: "sage",
  },
  busy: {
    line: "A bit more than your usual — still fine.",
    short: "a bit more",
    tone: "ember",
  },
  heavy: {
    line: "This week's heavier than usual for you.",
    short: "heavier than usual",
    tone: "amber",
  },
  toomuch: {
    line: "That's a lot more than you usually carry.",
    short: "a lot to carry",
    tone: "rust",
  },
};

/* ── OWNER: B (landing & design) ──────────────────────────────────── */
export const HERO = {
  eyebrow: "Pikul · to shoulder a load",
  headline: "It's never one big thing.",
  headline2: "It's everything you're carrying at once.",
  headlineAccent: "carrying",
  sub: "It's everything at once, and nobody notices until it's too late. Pikul weighs what you're carrying against your own normal — not against anyone else's.",
  cta: "See what you're carrying",
  ctaSecondary: "How it works",
  restingCaption: "about your usual",
  heavyCaption: "heavier than usual for you",
  reliefCaption: "that's enough to breathe again",
  usualLabel: "your usual",
} as const;

/* ── OWNER: B (landing & design) ──────────────────────────────────── */
export const QUIETLY = {
  a: "No single week broke you.",
  b: "It was the four before it.",
  c: "Pikul watches the four.",
  note: "Your last seven days, weighed against the month behind them.",
} as const;

/* ── OWNER: A (engine & app) ──────────────────────────────────────── */
export const TODAY = {
  weekLabel: "This week",
  usualBandLabel: "your usual",
} as const;

/* ── OWNER: A (engine & app) · where the week actually went ─────── */
export const AREAS = {
  title: "What's making this week heavy",
  labels: {
    coursework: "Coursework",
    work: "Work",
    travel: "Getting there",
    people: "Family & friends",
    upkeep: "Everything else",
  } as Record<string, string>,
  /** the bars are weight, the numbers are hours, and those genuinely differ */
  footnote:
    "The longest bar isn't always the most hours — some things take more out of you than the clock says.",
  empty: "Nothing on this week yet.",
} as const;

/* ── OWNER: A (engine & app) · the one thing to put down ───────── */
export const PUT_DOWN = {
  title: "One thing worth putting down",
  action: "Hand it back",
  undo: "Actually, keep it",
  doneTitle: "Handed back",
  /** Saying nothing is also information: it says the week is heavy for
   *  reasons that are not the student's to negotiate away. */
  reasons: {
    settled: "Nothing needs to come off this week.",
    "none-optional":
      "This week is heavy, and none of it is yours to hand back — it's class, coursework and family. What helps now is not taking on anything more.",
    "all-small":
      "The only flexible things this week are small ones, and handing them back wouldn't buy you enough to feel. What helps now is not taking on anything more.",
  } as Record<string, string>,
  recoveryTitle: "What would you do with it?",
  recovery: [
    { key: "empty", label: "Leave it empty" },
    { key: "sleep", label: "Sleep" },
    { key: "outside", label: "Get outside" },
    { key: "someone", label: "See someone" },
  ],
  recoveryHint: "No wrong answer. It's your time.",
} as const;

const whenPhrase = (when: string): string =>
  when === "today" || when === "tomorrow" ? when : `on ${when}`;

/** "Handing this back gives you about 9 hours on Saturday." */
export const putDownLine = (hours: number, when: string): string =>
  `Handing this back gives you about ${Math.round(hours)} hours ${whenPhrase(when)}.`;

export const reclaimedLine = (hours: number, when: string): string =>
  `About ${Math.round(hours)} hours ${whenPhrase(when)} are yours again.`;

/* ── OWNER: A (engine & app) · the days you can still change ───── */
export const AHEAD = {
  title: "Still ahead of you",
  empty: "Nothing else on this week.",
} as const;

/* ── OWNER: A (engine & app) · same hours, different answer ──── */
export const COMPARE = {
  title: "Two students, one week each.",
  lead: "One of them is closer to breaking. Before you look at anything else — which?",
  prompt: "Pick one",
  hoursThisWeek: "this week",
  reveal: "Show me",
  again: "Try it again",
  answer: (name: string): string => `${name} is.`,
  /** the sentence the whole product exists to make true */
  punchline: (
    lighterName: string,
    lighterHours: number,
    heavierName: string,
    heavierHours: number,
  ): string =>
    `${heavierName} is carrying ${Math.round(heavierHours - lighterHours)} hours more than ${lighterName}, and it is an ordinary week for ${heavierName}.`,
  usualLine: (hours: number): string =>
    `An ordinary week for them is about ${Math.round(hours)} hours.`,
  method:
    "Nobody chose these two. Both weeks are built from the same generator, and each verdict is measured against that student's own last four weeks — not against each other, and not against a target.",
  askTitle: "Now give them both the same thing to do",
  askLead: "Paste a message someone might send you. It gets priced against each of them.",
  askPlaceholder: "eh can you cover my shift this friday 3pm-11pm?",
  askCost: (pct: number, week: string): string =>
    `${pct}% of a usual week in ${week}`,
  back: "Today",
} as const;


/* ── OWNER: A (engine & app) · the weeks you can still change ── */
export const WEEK = {
  title: "The weeks ahead",
  lead: "Everything already on your calendar, weighed the same way as this week.",
  empty: "Nothing on this week.",
  wallLabel: "Worth knowing about now",
  /** "Week 11 is the one to watch — seven things land across four days." */
  wallLine: (label: string, count: number, days: number): string =>
    `${label.charAt(0).toUpperCase()}${label.slice(1)} is the one to watch — ${count} things land across ${days} days.`,
  wallDensity: (times: number): string =>
    `That is about ${times.toFixed(1)} times a usual few days for you.`,
  wallHint:
    "None of it is optional, so the thing that helps is not adding anything to it.",
  quiet: "Nothing ahead looks unusual for you.",
  hoursLabel: (h: number): string => `${Math.round(h)}h`,
  backToToday: "Today",
} as const;

/* ── OWNER: A (engine & app) · paste it, don't type it ──────────── */
export const ADD = {
  trigger: "Add something",
  title: "What have you taken on?",
  pasteLabel: "Paste what they sent you",
  pastePlaceholder: "eh can you cover my shift this friday 3pm-11pm?",
  pasteHint: "Or just fill it in below.",
  /** Provenance, said plainly. The point is to send the eye to the fields
   *  we made up rather than to hide that we made them up. */
  guessed: "we guessed",
  readFrom: (word: string) => `read from “${word}”`,
  fields: {
    title: "What is it",
    date: "When",
    hours: "How long",
    intensity: "How much does this take out of you?",
  },
  intensityScale: ["Barely", "A little", "Some", "A lot", "Everything"],
  categories: {
    class: "Class",
    assignment: "Coursework",
    shift: "Work",
    commute: "Travel",
    family: "Family",
    social: "Social",
    club: "Club",
    admin: "Errands",
  } as Record<string, string>,
  submit: "Add it",
  cancel: "Close",
  untitled: "Something",
} as const;

/* ── OWNER: A (engine & app) ──────────────────────────────────────── */
export const NO_BUTTON = {
  trigger: "Someone's asking me for something",
  step1Title: "What are they asking?",
  step2Title: "How heavy is it, roughly?",
  step3Title: "Here's what saying yes costs",
  weights: [
    { key: "light", label: "Light", hint: "an hour or two" },
    { key: "medium", label: "Medium", hint: "half a day" },
    { key: "heavy", label: "Heavy", hint: "a day or more" },
  ],
  tones: [
    { key: "soften", label: "Soften it" },
    { key: "renegotiate", label: "Offer less" },
    { key: "firm", label: "Hold firm" },
  ],
  copyAction: "Copy reply",
  copied: "Copied",
  verdict: {
    fits: "This fits.",
    tight: "This would make it tight.",
    costly: "This is the week it breaks.",
  },
} as const;

/** "accepting this puts you at 118% of a usual week in week 11" */
/* ── OWNER: A (engine & app) ──────────────────────────────────────── */
export const priceLine = (pct: number, weekLabel: string): string =>
  `Saying yes puts you at ${pct}% of a usual week in ${weekLabel}.`;

/* ── OWNER: B (landing & design) ──────────────────────────────────── */
export const HOW = {
  title: "How Pikul works",
  body: "Pikul borrows a model athletes use to avoid overtraining: your last seven days, weighed against your own rolling month. Not a target, not a grade — your own normal. Everything you carry converts to one measure, so a shift, an assignment and a family weekend can finally be compared.",
  points: [
    {
      t: "One measure for everything",
      d: "An 8-hour shift, a group project and a 90-minute commute finally sit on the same scale — so they can be traded against each other.",
    },
    {
      t: "Measured against you",
      d: "The same week is not the same load for two people. Pikul compares you to your own month, never to anyone else.",
    },
    {
      t: "No prediction model",
      d: "The forecast is your own calendar projected forward through the same maths. Nothing is guessed.",
    },
  ],
} as const;
