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
  putDownTitle: "One thing worth putting down",
  putDownHint: "You can hand this back. Here's how.",
  weekLabel: "This week",
  nothingToPutDown: "Nothing needs to come off this week.",
  usualBandLabel: "your usual",
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
