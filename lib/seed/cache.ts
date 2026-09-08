import type { LoadEvent } from "../engine/types";
import { toISODate } from "../engine/dates";
import { demoAsOf, generateEvents } from "./generateSemester";
import type { Persona } from "./personas";

/**
 * Identity, not speed.
 *
 * `demoAsOf()` builds a fresh Date on every call, so anything holding it as a
 * dependency sees a new object each render and recomputes. That quietly
 * disabled every useMemo on /today — including the one guarding
 * priceCommitment, which runs computeCarry eight times.
 *
 * Same calendar day in, same object out.
 */
let cachedToday: { key: string; value: Date } | null = null;

export function stableAsOf(): Date {
  const d = demoAsOf();
  const key = toISODate(d);
  if (!cachedToday || cachedToday.key !== key) cachedToday = { key, value: d };
  return cachedToday.value;
}

/**
 * The generator is deterministic in (persona.seed, asOf), so caching it is
 * safe on the server as well as the client. Two or three personas across a
 * day or two — the map never grows.
 */
const bySeed = new Map<string, LoadEvent[]>();

export function seedEvents(persona: Persona, asOf: Date): LoadEvent[] {
  const key = `${persona.id}|${toISODate(asOf)}`;
  const hit = bySeed.get(key);
  if (hit) return hit;

  const made = generateEvents(persona, asOf);
  if (bySeed.size > 8) bySeed.clear();
  bySeed.set(key, made);
  return made;
}
