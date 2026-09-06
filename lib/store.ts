"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LoadEvent } from "./engine/types";
import { computeCarry } from "./engine/acwr";
import { demoAsOf, generateEvents } from "./seed/generateSemester";
import { DEFAULT_PERSONA, personaById } from "./seed/personas";

interface PikulState {
  personaId: string;
  /** only what the user added during the session — seed events are derived */
  userEvents: LoadEvent[];
  setPersona: (id: string) => void;
  addEvent: (e: Omit<LoadEvent, "id" | "source">) => void;
  reset: () => void;
}

export const usePikul = create<PikulState>()(
  persist(
    (set) => ({
      personaId: DEFAULT_PERSONA.id,
      userEvents: [],
      setPersona: (personaId) => set({ personaId, userEvents: [] }),
      addEvent: (e) =>
        set((s) => ({
          userEvents: [
            ...s.userEvents,
            { ...e, id: `u${s.userEvents.length}`, source: "user" as const },
          ],
        })),
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
  const carry = computeCarry(
    events.filter((e) => e.date <= asOf.toISOString().slice(0, 10)),
    asOf,
  );

  return { persona, asOf, events, carry };
}
