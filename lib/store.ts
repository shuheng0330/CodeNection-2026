"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LoadEvent } from "./engine/types";
import { computeCarry } from "./engine/acwr";
import { toISODate } from "./engine/dates";
import { seedEvents, stableAsOf } from "./seed/cache";
import { DEFAULT_PERSONA, personaById } from "./seed/personas";

/** One decision, kept so the No Button becomes a practice rather than a
 *  party trick. A yes is recorded exactly like a no. */
export interface Ask {
  id: string;
  title: string;
  hours: number;
  /** share of a usual week at the worst point, as the No Button showed it */
  pct: number;
  weekLabel: string;
  verdict: "fits" | "tight" | "costly";
  decision: "yes" | "no";
  at: string;
}

interface PikulState {
  personaId: string;
  /** only what the user added during the session — seed events are derived */
  userEvents: LoadEvent[];
  /** the one commitment handed back this week — never a list, the restraint
   *  is the product */
  putDownId: string | null;
  /** what the student decided to do with the time they got back */
  recovery: string | null;
  /** every ask that has been priced, and what they did about it */
  asks: Ask[];
  setPersona: (id: string) => void;
  addEvent: (e: Omit<LoadEvent, "id" | "source">) => void;
  removeEvent: (id: string) => void;
  putDown: (id: string) => void;
  pickUpAgain: () => void;
  setRecovery: (key: string | null) => void;
  decideAsk: (
    ask: Omit<Ask, "id" | "at">,
    accepted?: Omit<LoadEvent, "id" | "source">,
  ) => void;
  clearAsks: () => void;
  reset: () => void;
}

/** A fresh blank slate. Returned rather than shared so no two resets can
 *  ever hand out the same array. */
const empty = (): Pick<
  PikulState,
  "userEvents" | "putDownId" | "recovery" | "asks"
> => ({
  userEvents: [],
  putDownId: null,
  recovery: null,
  asks: [],
});

/** Ids must survive a reset and a reload without ever colliding. Deriving one
 *  from userEvents.length looks fine until something is removed, at which
 *  point two events share a React key and the list quietly corrupts. */
let seq = 0;
const nextId = () => `u${Date.now().toString(36)}${(seq++).toString(36)}`;

export const usePikul = create<PikulState>()(
  persist(
    (set) => ({
      personaId: DEFAULT_PERSONA.id,
      ...empty(),
      setPersona: (personaId) => set({ personaId, ...empty() }),
      addEvent: (e) =>
        set((s) => ({
          userEvents: [...s.userEvents, { ...e, id: nextId(), source: "user" as const }],
        })),
      removeEvent: (id) =>
        set((s) => ({ userEvents: s.userEvents.filter((e) => e.id !== id) })),
      putDown: (putDownId) => set({ putDownId, recovery: null }),
      pickUpAgain: () => set({ putDownId: null, recovery: null }),
      setRecovery: (recovery) => set({ recovery }),
      decideAsk: (ask, accepted) =>
        set((s) => ({
          asks: [
            { ...ask, id: nextId(), at: new Date().toISOString() },
            ...s.asks,
          ],
          userEvents: accepted
            ? [
                ...s.userEvents,
                { ...accepted, id: nextId(), source: "user" as const },
              ]
            : s.userEvents,
        })),
      clearAsks: () => set({ asks: [] }),
      reset: () => set({ personaId: DEFAULT_PERSONA.id, ...empty() }),
    }),
    {
      name: "pikul-demo",
      // A browser that already holds a v1 blob — the presenter's, mid-rehearsal —
      // must not restore a shape the newer screens do not expect.
      version: 3,
      migrate: (persisted, from) => {
        const base = persisted as Record<string, unknown>;
        return {
          ...base,
          ...(from < 2 ? { recovery: null } : {}),
          ...(from < 3 ? { asks: [] } : {}),
        };
      },
    },
  ),
);

/** Seed events are regenerated rather than stored: the generator is
 *  deterministic, so this is cheaper than persisting 280 rows and it can
 *  never drift out of sync with the engine.
 *
 *  Memoised on three primitives. Without this the whole body reran on every
 *  render — and because it handed back a fresh asOf and a fresh events array
 *  each time, it also invalidated every useMemo downstream of it. */
export function useCarry() {
  const personaId = usePikul((s) => s.personaId);
  const userEvents = usePikul((s) => s.userEvents);
  const putDownId = usePikul((s) => s.putDownId);

  return useMemo(() => {
    const persona = personaById(personaId);
    const asOf = stableAsOf();
    const all = [...seedEvents(persona, asOf), ...userEvents];
    // A commitment that has been handed back is gone from every calculation,
    // not merely crossed out — otherwise the relief is cosmetic.
    const events = putDownId ? all.filter((e) => e.id !== putDownId) : all;
    const handedBack = putDownId ? (all.find((e) => e.id === putDownId) ?? null) : null;
    const today = toISODate(asOf);
    const carry = computeCarry(
      events.filter((e) => e.date <= today),
      asOf,
    );

    return { persona, asOf, events, carry, handedBack };
  }, [personaId, userEvents, putDownId]);
}
