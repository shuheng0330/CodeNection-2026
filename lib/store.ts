"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LoadEvent } from "./engine/types";
import { computeCarry } from "./engine/acwr";
import { toISODate } from "./engine/dates";
import { demoAsOf, generateEvents } from "./seed/generateSemester";
import { DEFAULT_PERSONA, personaById } from "./seed/personas";

interface PikulState {
  personaId: string;
  /** only what the user added during the session — seed events are derived */
  userEvents: LoadEvent[];
  setPersona: (id: string) => void;
  addEvent: (e: Omit<LoadEvent, "id" | "source">) => void;
  removeEvent: (id: string) => void;
  reset: () => void;
}

/** Ids must survive a reset and a reload without ever colliding. Deriving one
 *  from userEvents.length looks fine until something is removed, at which
 *  point two events share a React key and the list quietly corrupts. */
let seq = 0;
const nextId = () => `u${Date.now().toString(36)}${(seq++).toString(36)}`;

export const usePikul = create<PikulState>()(
  persist(
    (set) => ({
      personaId: DEFAULT_PERSONA.id,
      userEvents: [],
      setPersona: (personaId) => set({ personaId, userEvents: [] }),
      addEvent: (e) =>
        set((s) => ({
          userEvents: [...s.userEvents, { ...e, id: nextId(), source: "user" as const }],
        })),
      removeEvent: (id) =>
        set((s) => ({ userEvents: s.userEvents.filter((e) => e.id !== id) })),
      reset: () => set({ personaId: DEFAULT_PERSONA.id, userEvents: [] }),
    }),
    { name: "pikul-demo" },
  ),
);

/** Seed events are regenerated rather than stored: the generator is
 *  deterministic, so this is cheaper than persisting 280 rows and it can
 *  never drift out of sync with the engine. */
export function useCarry() {
  const personaId = usePikul((s) => s.personaId);
  const userEvents = usePikul((s) => s.userEvents);

  const persona = personaById(personaId);
  const asOf = demoAsOf();
  const events = [...generateEvents(persona, asOf), ...userEvents];
  const today = toISODate(asOf);
  const carry = computeCarry(
    events.filter((e) => e.date <= today),
    asOf,
  );

  return { persona, asOf, events, carry };
}
