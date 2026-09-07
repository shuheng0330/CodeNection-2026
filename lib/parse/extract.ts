import { en } from "chrono-node";
import type { Intensity, LoadCategory } from "../engine/types";
import { toISODate } from "../engine/dates";
import { classify, DEFAULT_HOURS } from "./classify";
import { normalize } from "./normalize";
import { timeRange } from "./timeRange";

/**
 * Paste what they sent you.
 *
 * The adoption problem with every workload tracker is that it asks an
 * already-overloaded student to type in one more thing. They should not have
 * to: the commitment already exists, as a message somebody sent them. This
 * turns that message into a draft they confirm.
 *
 * Deterministic on purpose — pattern matching, no model, no network. It runs
 * offline, instantly, and the same message always produces the same draft.
 * The whole parser is one function, so a language model could later replace
 * this step alone without touching how load is calculated.
 */
export type Provenance = "parsed" | "guessed";

export interface Field<T> {
  value: T;
  /** "guessed" means we filled it in, not that the message said so */
  from: Provenance;
}

export interface Draft {
  date: Field<string>;
  hours: Field<number>;
  category: Field<LoadCategory>;
  intensity: Field<Intensity>;
  title: Field<string>;
  matchedOn: string | null;
}

/** The Malay day-parts appear here as well as in the normaliser, because a
 *  title is built from the original message, not the normalised one. */
const TIME_NOISE =
  /\d{1,2}(?::\d{2})?\s*(?:am|pm|pagi|petang|malam)?\s*(?:-|–|—|to|till|until|sampai|hingga)\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|pagi|petang|malam)?|\b\d{1,2}(?::\d{2})?\s*(?:am|pm|pagi|petang|malam)\b/gi;

/** chrono matched the normalised text, so its phrase may not appear in the
 *  original at all — "sabtu" had already become "saturday" by then. Strip the
 *  day and time words in both languages rather than mapping positions back. */
const DATE_NOISE =
  /\b(?:mon|tue|tues|wed|weds|thu|thur|thurs|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday|isnin|selasa|rabu|khamis|jumaat|jumat|sabtu|ahad|minggu|hujung|esok|besok|lusa|semalam|today|tomorrow|tonight|weekend|ni|nanti|tadi|pagi|petang|malam|ada)\b/gi;

/** Filler left behind once the date and time have been lifted out. */
const NOISE =
  /\b(?:eh|can|you|u|pls|please|tolong|boleh|ah|ya|ok|okay|hey|hi|my|me|i|the|a|to|for|on|at|this|next|and|is|are|it|that|do|got|free|nak|tak|moved|by)\b/gi;

/** Case-insensitive removal of the phrase chrono already claimed, without
 *  the escaping dance a dynamic RegExp would need. */
function stripPhrase(text: string, phrase: string): string {
  if (!phrase) return text;
  const i = text.toLowerCase().indexOf(phrase.toLowerCase());
  return i < 0 ? text : `${text.slice(0, i)} ${text.slice(i + phrase.length)}`;
}

const squash = (s: string): string => s.replace(/\s+/g, " ").trim();

function titleFrom(raw: string, remove: string[]): string {
  let t = raw;
  for (const r of remove) t = stripPhrase(t, r);
  t = squash(
    t.replace(TIME_NOISE, " ").replace(DATE_NOISE, " ").replace(/[?!.,;:]+/g, " "),
  );
  // Drop the filler too, but only if something recognisable survives it.
  const lean = squash(t.replace(NOISE, " "));
  const best = lean.length >= 3 ? lean : t;
  if (!best) return "";
  return (best.charAt(0).toUpperCase() + best.slice(1)).slice(0, 60);
}

/**
 * Always returns a draft. There is no failure state by design: a message we
 * cannot read produces the same form the student would have filled in
 * anyway, with the text already in the title. Failing is indistinguishable
 * from choosing to type it manually.
 */
export function extract(raw: string, ref: Date): Draft {
  const text = normalize(raw);

  // en.GB, not the default: Malaysia writes 12/9 as 12 September, and the
  // US-first parser reads that as 9 December.
  const results = en.GB.parse(text, ref, { forwardDate: true });
  const dated =
    results.find((r) => r.start.isCertain("day") || r.start.isCertain("weekday")) ??
    results[0];

  const chronoHours =
    dated?.end != null
      ? (dated.end.date().getTime() - dated.start.date().getTime()) / 3_600_000
      : null;
  // chrono drops the end time whenever a noun sits between the day and the
  // hours — "saturday shift 9am to 5pm" — and does it silently, so the regex
  // is a safety net rather than a fallback.
  const regexHours = timeRange(text)?.hours ?? null;
  const hours = chronoHours ?? regexHours;

  const { category, intensity, matchedOn } = classify(text);
  const dateKnown =
    dated != null && (dated.start.isCertain("day") || dated.start.isCertain("weekday"));

  return {
    date: {
      value: toISODate(dated ? dated.start.date() : ref),
      from: dateKnown ? "parsed" : "guessed",
    },
    hours: {
      value: hours ?? DEFAULT_HOURS[category],
      from: hours != null ? "parsed" : "guessed",
    },
    category: { value: category, from: matchedOn ? "parsed" : "guessed" },
    // Never stated in a message. Always ours, and always labelled as ours.
    intensity: { value: intensity, from: "guessed" },
    title: { value: titleFrom(raw, [dated?.text ?? ""]), from: "guessed" },
    matchedOn,
  };
}
