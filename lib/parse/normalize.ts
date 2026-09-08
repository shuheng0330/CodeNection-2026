/**
 * Malay and shorthand, folded into something chrono can read.
 *
 * chrono has no Malay locale, and it does not fail loudly on one — "jumaat
 * 3pm" matches only "3pm" and confidently returns today. A pre-pass is the
 * cheap fix: forty lines of replacement beats a custom parser.
 *
 * Order matters. A bare `minggu -> sunday` rule running before
 * `hujung minggu -> saturday` turns "hujung minggu" into "hujung sunday",
 * so every multi-word phrase is listed first.
 */
export const REPLACEMENTS: [RegExp, string][] = [
  // ---- multi-word, always first ----
  [/\bhujung\s*minggu\b/g, "saturday"],
  [/\bminggu\s+depan\b/g, "next week"],
  [/\bminggu\s+ni\b/g, "this week"],
  [/\bminggu\s+lepas\b/g, "last week"],
  [/\bbulan\s+depan\b/g, "next month"],
  [/\bhari\s*ini\b/g, "today"],
  [/\btengah\s*hari\b/g, "noon"],
  [/\btengah\s*malam\b/g, "midnight"],
  [/\bbalik\s+kampung\b/g, "balikkampung"],

  // ---- weekdays ----
  [/\bisnin\b/g, "monday"],
  [/\bselasa\b/g, "tuesday"],
  [/\brabu\b/g, "wednesday"],
  [/\bkhamis\b/g, "thursday"],
  [/\bjumaat\b/g, "friday"],
  [/\bjumat\b/g, "friday"],
  [/\bsabtu\b/g, "saturday"],
  [/\bahad\b/g, "sunday"],
  [/\bminggu\b/g, "sunday"],

  // ---- relative days ----
  [/\besok\b/g, "tomorrow"],
  [/\bbesok\b/g, "tomorrow"],
  [/\blusa\b/g, "in 2 days"],
  [/\bsemalam\b/g, "yesterday"],

  // ---- parts of the day ----
  [/\bpagi\b/g, "am"],
  [/\bpetang\b/g, "pm"],
  [/\bmalam\b/g, "pm"],

  // ---- connectors ----
  [/\bsampai\b/g, "to"],
  [/\bhingga\b/g, "to"],
  [/\b(?:pukul|kul|jam)\s*(?=\d)/g, ""],

  // ---- English shorthand chrono genuinely misses ----
  // "tues" and "weds" match nothing, so the weekday is silently dropped
  // and the result quietly becomes today.
  [/\btues\b/g, "tue"],
  [/\bweds\b/g, "wed"],
  [/\bthurs\b/g, "thu"],
  [/\btmrw?\b/g, "tomorrow"],
  [/\btomo+\b/g, "tomorrow"],
  [/\bnite\b/g, "night"],
];

export const normalize = (text: string): string =>
  REPLACEMENTS.reduce((acc, [re, to]) => acc.replace(re, to), text.toLowerCase());
