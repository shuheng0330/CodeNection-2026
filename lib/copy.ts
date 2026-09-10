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
 * OWNERSHIP
 * ---------
 * Three of us write into this file, so every block carries a name:
 *
 *   Ku     Today, Compare, the request flow, the put-down, adding things
 *   Lim    the landing page, the hero, brand voice
 *   Thong  navigation, Week, Recover, Asks, Method
 *
 * Add strings to YOUR block. Appending to someone else's is how three
 * people produce a conflict in the one file everybody needs. If you want a
 * string in a block that isn't yours, say so in the group first — it is a
 * ten-second conversation and it saves a merge.
 *
 * Never reformat the whole file. A prettier pass here rewrites every line
 * and turns a two-line change into a full-file conflict for the other two.
 */
import type { BandKey } from "./engine/types";

/* ── FROZEN · all three agreed this. Changing it needs a message in the group ─── */
export const PRODUCT = {
  name: "Pikul",
  /** Malay: to shoulder a load. Also a historic SEA unit of weight. */
  meaning: "to shoulder a load",
  tagline: "You're carrying more than usual.",
} as const;

/* ── Thong · getting between screens ─────────────────────────────────── */
/**
 * Every route's name in one place, so the shell and the pages that mount it
 * cannot drift apart. `short` is the phone label — the bottom bar has five
 * slots and no room for "How it works".
 *
 * Today's header reads from here already. When AppShell lands it consumes
 * the same list and the per-page headers come out.
 */
export const NAV = {
  appLabel: "Your week",
  primaryLabel: "Pikul",
  secondaryLabel: "More from Pikul",
  mobileLabel: "Pikul pages",
  skip: "Skip to content",
  today: "Today",
  week: "Week",
  recover: "Recover",
  asks: "Asks",
  more: "More",
  moreTitle: "More from Pikul",
  compare: "Compare weeks",
  method: "How it works",
  closeMore: "Close more pages",
} as const;

type BandCopy = {
  /** the sentence shown on /today */
  line: string;
  /** a two-word chip label */
  short: string;
  /** design token name, not a colour value */
  tone: "sage" | "ember" | "amber" | "rust";
};

/* ── Ku · the sentence /today leads with ─────────────────────────────── */
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

/* ── Lim · landing & brand ───────────────────────────────────────────── */
export const LANDING_DECISION = {
  eyebrow: "Before you say yes",
  title: "What would one more yes mean?",
  description: "Try both answers to a sample request. Nothing here changes your week.",
  sample: "sample week",
  hours: "hours",
  proposed: "A new request, not an existing commitment. These choices only preview the outcome.",
  accept: "Accept the shift",
  decline: "Decline the shift",
  choiceLabel: "Preview your answer",
  forecast: "Request forecast",
  without: "Without this request",
  with: "If you accept",
  declined: "If you decline",
  usual: "of a usual week",
  unavailable: "This request falls outside the available forecast.",
  reply: "Example reply · not sent",
  fallback: "Explore how a new request could change a sample week. Open the sample demo to try the decision flow.",
} as const;

export const HERO = {
  eyebrow: "Pikul · to shoulder a load",
  headline: "Your week is more",
  headline2: "than your timetable.",
  headlineAccent: "carrying",
  sub: "Assignments, shifts, commuting, family. See your week against your own normal—and find one thing to put down.",
  cta: "Try a sample week",
  ctaSecondary: "How it works",
  restingCaption: "about your usual",
  heavyCaption: "heavier than usual for you",
  reliefCaption: "that's enough to breathe again",
  usualLabel: "your usual",
} as const;

/* ── Lim · landing & brand ───────────────────────────────────────────── */
export const QUIETLY = {
  a: "No single week broke you.",
  b: "It was the four before it.",
  c: "Your normal. Nobody else's.",
  note: "A full week can feel familiar to one student and unusually heavy to another. Pikul compares your last seven days with the month behind them, so your own experience is the starting point.",
} as const;

/* ── Ku · Today ──────────────────────────────────────────────────────── */
export const TODAY = {
  weekLabel: "This week",
  usualBandLabel: "your usual",
  /** Thong's addition, kept: the band means nothing to someone who cannot
   *  see it shaded, and no per-band sentence should have to repeat it. */
  bandExplainer: "The shaded area marks your usual.",
} as const;

/* ── Ku · what the bar says out loud ─────────────────────────────────── */
/**
 * The bar is the product's main output and, until now, it said nothing to a
 * screen reader — the marker and the band carried everything.
 *
 * Deliberately no number. A sighted student cannot read a figure off the bar
 * either; what they get is which side of the band they are on and roughly how
 * far. The spoken version has to match that precision, not exceed it. Giving
 * one group a percentage the design withholds from the other is not a fix.
 */
export const CARRY_LABEL: Record<BandKey, string> = {
  light: "Your week sits below the range you usually carry.",
  usual: "Your week sits inside the range you usually carry.",
  busy: "Your week sits a little above the range you usually carry.",
  heavy: "Your week sits above the range you usually carry.",
  toomuch: "Your week sits well above the range you usually carry.",
};

/* ── Ku · where the week actually went ───────────────────────────────── */
export const AREAS = {
  /**
   * A calm week is not heavy, and a heading that insists it is undoes the
   * sentence directly above it. Nurul's Today read "a bit more than your
   * usual — still fine" with "what's making this week heavy" underneath.
   *
   * The release gate's wording for this is that a calm week must not
   * manufacture a need to decline. Nor a need to worry.
   */
  titleFor: (band: BandKey): string =>
    band === "heavy" || band === "toomuch"
      ? "What's making this week heavy"
      : "Where this week is going",
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

/* ── Ku · the one thing to put down ──────────────────────────────────── */
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
  /* ---- preview, before anything is actually handed back ---- */
  previewTitle: "Before you do",
  previewIntro: (title: string): string => `Handing back ${title} would:`,
  previewHours: (hours: number, when: string): string =>
    `free about ${Math.round(hours)} hours ${when === "today" || when === "tomorrow" ? when : `on ${when}`}`,
  previewOpensDay: (day: string): string => `leave ${day} genuinely clear`,
  /** The honest half. A future commitment coming off does not change a week
   *  that has already been lived, and pretending otherwise would be the one
   *  lie this product cannot afford. */
  previewUnchanged:
    "It will not change this week's reading. That week has already happened — what changes is what is still ahead of you.",
  previewConfirm: "Hand it back",
  previewCancel: "Keep it for now",
  previewNote: "Nothing is saved until you confirm.",

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

/* ── Ku · the days you can still change ──────────────────────────────── */
export const AHEAD = {
  title: "Still ahead of you",
  empty: "Nothing else on this week.",
  /** A day is named by the heaviest thing on it. Naming all of them turns
   *  this into the backlog the whole product refuses to be. */
  dayLine: (heaviest: string, others: number): string =>
    others === 0 ? heaviest : `${heaviest}, and ${others} more`,
  hours: (h: number): string => (h < 1 ? "under an hour" : `${Math.round(h)}h`),
  /** Today shows the next few days; the whole run belongs on its own screen. */
  more: "See the weeks ahead",
} as const;

/* ── Thong · the decisions, kept ─────────────────────────────────────── */
export const ASKS = {
  eyebrow: "Decision history",
  title: "What you were asked",
  lead: "Every request you priced, and what you decided. Both answers count the same.",
  empty: "Nothing yet. The next time someone asks you for something, price it first.",
  emptyAction: "Try it",
  tookOn: "took on",
  keptFree: "kept free",
  historyTitle: "Each decision",
  hours: (h: number): string => `${Math.round(h)}h`,
  /** "118% of a usual week in week 11" */
  cost: (pct: number, week: string): string => `${pct}% of a usual week in ${week}`,
  yes: "said yes",
  no: "said no",
  /** Not a scoreboard. A person who says yes to everything they love is not
   *  failing at anything. */
  note: "This is a record, not a report card. Saying yes to something worth it is the whole point of knowing what it costs.",
  clear: "Clear this list",
  back: "Today",
} as const;


/* ── Thong · showing the working ─────────────────────────────────────── */
export const METHOD = {
  eyebrow: "The method",
  title: "How this works",
  lead: "No model, no guessing, and nothing about you leaves your phone. Here is the whole of it.",
  steps: [
    {
      t: "Everything becomes one measure",
      d: "Each commitment is its hours multiplied by how much it takes out of you, on a one-to-five dial. That is why a two-hour group meeting can outweigh a four-hour lecture, and why a shift, an assignment and a weekend at home can finally be compared at all.",
    },
    {
      t: "Your last seven days, against your own last four weeks",
      d: "Both are weighted averages, so a hard Tuesday fades rather than falling off a cliff. The recent number divided by the settled one is the only figure the app cares about. Above one means this stretch is heavier than you usually carry. It is never compared to anyone else's.",
    },
    {
      t: "The bands are deliberately wide",
      d: "A perfectly steady life computes to exactly one, so “about your usual” has to contain it. We would rather say nothing than tell someone whose weeks have not changed that something is wrong.",
    },
    {
      t: "Nothing is predicted",
      d: "The weeks ahead use the same arithmetic on commitments already in your calendar. It is not a forecast of how you will feel. It is what you have already agreed to, added up.",
    },
  ],
  limitsTitle: "What it cannot tell you",
  limits: [
    "This is a way of noticing a change in your own pattern, not a diagnosis, and not a medical opinion. It cannot tell you whether you are unwell.",
    "The idea is borrowed from how sports scientists watch training load. It has never been tested on coursework, shifts or family duty — that part is our design decision, and it is unvalidated.",
    "The method is argued about in the field it came from, including whether comparing a recent window against a longer one that contains it is sound at all. We think it is still the most honest simple signal available, and we would rather you knew the objection.",
    "The one-to-five dial is ours. Nobody has established that a draining hour weighs exactly 1.7 ordinary ones.",
    "It only knows what it has been told. A month of history has to exist before the comparison means very much.",
  ],
  refTitle: "The sources, and the maths written out",
  ref: "The full working — the formula, where it comes from, and the papers arguing against it — is in the project README.",
  privacyTitle: "Where your week is kept",
  privacy: "In this browser, and nowhere else. There is no account, no server and no network call. Close the tab and it is still only yours.",
  back: "Today",
} as const;


/* ── Thong · time that is already yours ──────────────────────────────── */
export const RECOVER = {
  eyebrow: "Recovery",
  title: "Somewhere to put the time down",
  lead: "Find time that is already yours, then decide what you want to protect it for.",
  found: "The quietest day you have coming",
  /** "Saturday is the quietest day in your next ten." */
  foundLine: (day: string): string =>
    `${day} is the quietest day you have coming.`,
  clearAfter: (day: string): string => `And ${day} after it is clear.`,
  busyAfter: "It is the calmest one there is, though the day after is not.",
  planTitle: "What would you do with it?",
  /** Naming when and what, rather than resolving to rest, is the part that
   *  actually survives contact with a heavy week. */
  planLine: (day: string, choice: string): string =>
    `If ${day} comes and nothing has caught fire — ${choice}.`,
  choices: [
    { key: "empty", label: "leave it empty" },
    { key: "sleep", label: "sleep in" },
    { key: "outside", label: "get out of the house" },
    { key: "someone", label: "see someone" },
  ],
  noteTitle: "We are not going to check",
  note: "Nothing here is logged, counted, or held against you next week. It is your time, and the only reason it exists is that you made room for it.",
  none: "There is no unclaimed time in your next ten days.",
  /** The one screen that points at another: relief has to come from somewhere. */
  noneFix: (title: string, day: string): string =>
    `Handing back ${title} would give you ${day} back.`,
  noneAction: "See what to put down",
  noneHard:
    "Nothing in the next ten days is yours to hand back. The thing that helps is not taking on anything more.",
  back: "Today",
} as const;


/* ── Ku · same hours, different answer ───────────────────────────────── */
export const COMPARE = {
  title: "Two students, one week each.",
  lead: "One of them is closer to breaking. Before you look at anything else — which?",
  prompt: "Pick one",
  hoursThisWeek: "this week",
  reveal: "Show me",
  again: "Try it again",
  answer: (name: string): string => `${name} is.`,
  /**
   * The sentence the whole product exists to make true.
   *
   * Subtract the figures on the cards, not the raw ones. Rounding last made
   * this read "32 hours more" above two cards showing 53h and 84h, because
   * 84.49 − 52.98 rounds up where 84 − 53 does not. Small, and precisely the
   * kind of thing a judge checks with their own arithmetic on a screen whose
   * entire argument is that the numbers are trustworthy.
   */
  punchline: (
    lighterName: string,
    lighterHours: number,
    heavierName: string,
    heavierHours: number,
  ): string =>
    `${heavierName} is carrying ${Math.round(heavierHours) - Math.round(lighterHours)} hours more than ${lighterName}, and it is an ordinary week for ${heavierName}.`,
  usualLine: (hours: number): string =>
    `An ordinary week for them is about ${Math.round(hours)} hours.`,
  method:
    "Nobody chose these two. Both weeks are built from the same generator, and each verdict is measured against that student's own last four weeks — not against each other, and not against a target.",
  askTitle: "Now give them both the same thing to do",
  askLead: "Paste a message someone might send you. It gets priced against each of them.",
  askPlaceholder: "eh can you cover my shift this friday 3pm-11pm?",
  askCost: (pct: number, week: string): string =>
    `${pct}% of a usual week in ${week}`,
  askBeyond: "Too far ahead to price",
  /** What we made of the message, before either number appears.
   *  A figure without its input is unfalsifiable, and unfalsifiable is
   *  exactly the impression this screen is trying not to leave. */
  askReadTitle: "What we read from that",
  askRead: (when: string, hours: number, kind: string): string =>
    `${hours}${hours === 1 ? " hour" : " hours"} of ${kind.toLowerCase()}, on ${when}.`,
  /** The parser found nothing it recognised, so every field below is ours.
   *  Saying so is the difference between a demonstration and a magic trick. */
  askGuessed:
    "Nothing in that message was something we recognised, so all of it is our guess. Try naming a day and a time.",
  askProblemTitle: "We can't price that one",
  back: "Today",
} as const;


/* ── Thong · the weeks you can still change ──────────────────────────── */
export const WEEK = {
  title: "The weeks ahead",
  lead: "Everything already on your calendar, weighed the same way as this week.",
  livingTitle: "Pick a day. See what is in it.",
  livingLead:
    "Four weeks on the same scale, so a tall day means the same thing in every panel.",
  sharedScale: "One shared scale",
  selectHint: "Choose a day to open it.",
  heaviestWeek: "Your heaviest week ahead.",
  selectedDay: "Selected day",
  alreadyCarried: "Already carried",
  dayEmpty: "Nothing is planned for this day.",
  noHorizon: "There are no weeks to show yet.",
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
  eventHours: (h: number): string =>
    h < 1 ? "under an hour" : `${Number.isInteger(h) ? h : h.toFixed(1)}h`,
  weekSummary: (label: string, hours: number): string =>
    `${label}, ${Math.round(hours)} hours`,
  daysLabel: (label: string): string => `Days in ${label}`,
  dayLabel: (date: string, hours: number, past: boolean): string =>
    `${date}, ${Math.round(hours)} hours${past ? ", already carried" : ""}`,
  dayDetailsLabel: (date: string): string => `Commitments for ${date}`,
  categories: {
    class: "Class",
    assignment: "Assignment",
    shift: "Shift",
    commute: "Commute",
    family: "Family",
    social: "Social",
    club: "Club",
    admin: "Admin",
  },
  backToToday: "Today",
} as const;

/* ── Ku · paste it, don't type it ────────────────────────────────────── */
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
    /** Thong's addition, kept: the category chips were an unlabelled group,
     *  which is a row of buttons with no question attached to them. */
    category: "What kind of thing?",
    intensity: "How much does this take out of you?",
  },
  intensityScale: ["Barely", "A little", "Some", "A lot", "Everything"],

  /**
   * Why this cannot be added yet.
   *
   * The old submit handler read a blank or zero hours box and quietly wrote
   * a one-hour commitment. The student never typed one, never saw one, and
   * the week moved anyway. Worded for logging something rather than for
   * pricing a request — there is no forecast on this screen, so the ceiling
   * the request sheet has does not apply here.
   */
  problems: {
    "hours-missing": "How long it takes is blank, so there is nothing to weigh.",
    "hours-tiny": "How long it takes has to be more than zero.",
    "hours-absurd":
      "That is longer than a day. If it runs across several days, add one for each day.",
    "date-missing": "The date isn't one we can read.",
    "date-past": "That day has already gone. Add something that is still ahead of you.",
  } as Record<string, string>,
  cannotAdd: "Not quite yet",
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

/* ── Ku · the request, priced before you answer ──────────────────────── */
export const NO_BUTTON = {
  trigger: "Someone's asking me for something",

  /* ---- step one: the message, already read ---- */
  step1Title: "What they're asking",
  step2Title: "Here's what saying yes costs",
  /** Nothing here is on anyone's calendar and nothing was received from
   *  anywhere. Every surface showing it has to say so. */
  sampleLabel: "sample message",
  messageLabel: "What they sent",
  readTitle: "What we read from it",
  readLead:
    "We filled this in from the message. Anything wrong is yours to correct — the price follows whatever is in these boxes, not what we guessed.",
  swap: "Use a different message",
  swapCancel: "Keep this one",
  swapLabel: "Paste what they sent you",
  swapPlaceholder: "eh can you cover my shift this friday 3pm-11pm?",
  restore: "Back to the sample",
  next: "See what it costs",
  back: "Back to the message",

  /* ---- when we will not produce a number ---- */
  /**
   * A forecast we cannot honestly compute is refused, not softened. Saying
   * "this fits" about a request four months away is not caution, it is a
   * wrong answer delivered confidently — the weeks we can see genuinely do
   * not contain it, so there is nothing for it to fit into.
   */
  cantPriceTitle: "We can't price this one",
  problems: {
    "hours-missing": "How long it takes is blank, so there is nothing to weigh.",
    "hours-tiny": "How long it takes has to be more than zero.",
    "hours-absurd":
      "That is longer than a day. If it really runs across several days, add it as one commitment per day.",
    "date-missing": "The date isn't a date we can read.",
    "date-past":
      "That day has already been and gone, so there is no decision left to make about it.",
    "date-beyond":
      "That is further out than the four weeks we can see, so we have no week to measure it against. Ask again when it is closer and the answer will mean something.",
  } as Record<string, string>,
  fixHint: "Fix it above and the forecast comes back.",

  /* ---- the reply ---- */
  tones: [
    { key: "soften", label: "Soften it" },
    { key: "renegotiate", label: "Offer less" },
    { key: "firm", label: "Hold firm" },
  ],
  replyTitle: "If the answer is no",
  copyAction: "Copy reply",
  copied: "Copied",
  /** The clipboard fails in plain HTTP, in some in-app browsers, and whenever
   *  the tab is not focused. Claiming success when the buffer is empty is
   *  worse than not offering the button. */
  copyFailed: "Couldn't copy — select the text above and copy it yourself.",
  copyManualHint: "Nothing was sent. This is yours to send, or not.",

  decisionTitle: "What did you do?",
  /** A yes weighs exactly as much as a no here. A tool that only ever
   *  validates declining is just a different voice telling you what to do. */
  saidYes: "I said yes",
  saidNo: "I said no",
  /** Saying yes puts it on the week. Saying so is the difference between a
   *  record and a decision. */
  acceptedNote: "Added to your week, and kept in what you were asked.",
  declinedNote: "Kept in what you were asked. Nothing was added.",
  undo: "Change my answer",
  verdict: {
    fits: "This fits.",
    tight: "This would make it tight.",
    costly: "This is the week it breaks.",
  },
} as const;

/** "accepting this puts you at 118% of a usual week in week 11" */
export const priceLine = (pct: number, weekLabel: string): string =>
  `Saying yes puts you at ${pct}% of a usual week in ${weekLabel}.`;

/**
 * The same figure with its starting point attached: "week 11 goes from 128%
 * to 132%".
 *
 * The after-figure alone is unreadable — 132% of a usual week sounds severe
 * until you know the week was already at 128% before anyone asked, at which
 * point the honest reading is that this request is not what made the week
 * hard. Withholding the before-figure would let a four-point change carry
 * the weight of the whole overload, which is exactly the kind of quiet
 * exaggeration this product cannot afford.
 */
export const beforeAfterLine = (
  before: number,
  after: number,
  weekLabel: string,
): string =>
  `${weekLabel.charAt(0).toUpperCase()}${weekLabel.slice(1)} is at ${before}% of a usual week already. Saying yes makes it ${after}%.`;

/* ── Lim · landing & brand ───────────────────────────────────────────── */
export const HOW = {
  title: "A little perspective. A little room.",
  body: "Start with a sample student's week. See what's adding up, consider the next request, and decide what works for you.",
  points: [
    {
      t: "See your week",
      d: "Look at everything you're carrying together, compared with your own usual month.",
    },
    {
      t: "Consider the request",
      d: "See how a new commitment would change the weeks ahead, before you say yes.",
    },
    {
      t: "Make room",
      d: "Decide what you can take on, or hand back something negotiable. What you do with that time is up to you.",
    },
  ],
} as const;

/* OWNER: B (landing & design) — illustrative landing content */
export const LANDING = {
  pause: "Pause animation",
  resume: "Resume animation",
  released: "One negotiable commitment handed back",
  skip: "Skip to content",
  audience: "For students carrying more than classes",
  openDemo: "Open demo",
  demoNote: "Sample data · no account needed · resets the demo",
  sceneTitle: "A student's week",
  example: "Illustrative example",
  sceneCaption: "Different commitments. One person carrying them.",
  commitments: [
    { category: "Coursework", title: "The group assignment", detail: "Slides, edits, one more meeting" },
    { category: "Commuting", title: "The journey there", detail: "Campus, work, and back again" },
    { category: "Family", title: "Showing up at home", detail: "The things a timetable misses" },
    { category: "Work", title: "An extra shift", detail: "Another yes in an already full week" },
  ],
  baselineEyebrow: "A week needs context",
  monthLabel: "The month behind you",
  weekLabel: "Your last 7 days",
  chartDescription: "Illustrative pattern: the last seven days carry more than the earlier days. Pikul uses your own commitments for the comparison in the app.",
  putdownEyebrow: "Make a little room",
  putdownTitle: "One thing you can put down.",
  putdownBody: "Already said yes? Pikul can help you find an existing commitment to hand back, while protecting classes, coursework, health needs and family responsibilities. The choice stays yours.",
  protected: "Classes, coursework, health needs and family responsibilities stay protected. The choice is always yours.",
  reliefExample: "Illustrative example · handing back an existing commitment",
  shiftTitle: "The extra Saturday shift",
  shiftDetail: "8 hours · a negotiable commitment",
  hours: "8h",
  hoursLabel: "reclaimed from your week",
  reliefNote: "If you hand this shift back, those eight hours are yours to use. Rest, see someone, or leave them unplanned.",
  howEyebrow: "How it works",
  event: "CodeNection 2026 · Lifestyle track",
} as const;
