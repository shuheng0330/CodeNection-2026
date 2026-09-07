"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AREAS } from "@/lib/copy";
import { eventsInArea, summariseWeek, type AreaKey } from "@/lib/engine/areas";
import type { LoadEvent } from "@/lib/engine/types";
import { spring } from "@/lib/motion";

const hoursLabel = (h: number) => (h < 1 ? "under an hour" : `${Math.round(h)}h`);

/**
 * Why the week is heavy, not merely that it is.
 *
 * Bar length is weight; the number beside it is plain hours. Those two
 * disagree on purpose — an eight-hour shift and eight hours of lectures are
 * not the same week — and the footnote says so rather than hiding it.
 */
export function AreaBreakdown({ events, asOf }: { events: LoadEvent[]; asOf: Date }) {
  const still = useReducedMotion();
  const [open, setOpen] = useState<AreaKey | null>(null);
  const areas = summariseWeek(events, asOf);

  if (areas.length === 0) {
    return <p className="text-ink-muted">{AREAS.empty}</p>;
  }

  return (
    <div>
      <ul className="grid gap-1">
        {areas.map((a, i) => {
          const isOpen = open === a.key;
          return (
            <li key={a.key}>
              <button
                onClick={() => setOpen(isOpen ? null : a.key)}
                aria-expanded={isOpen}
                className="flex w-full min-h-11 items-center gap-4 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-raised"
              >
                <span className="w-32 shrink-0 truncate font-medium">
                  {AREAS.labels[a.key]}
                </span>
                <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-raised">
                  <motion.span
                    className={`absolute inset-y-0 left-0 rounded-full ${
                      i === 0 ? "bg-clay-600" : "bg-clay-100"
                    }`}
                    initial={still ? false : { scaleX: 0 }}
                    animate={{ scaleX: a.share }}
                    style={{ width: "100%", originX: 0 }}
                    transition={{ ...spring.settle, delay: 0.05 * i }}
                  />
                </span>
                <span className="tnum w-16 shrink-0 text-right text-sm text-ink-muted">
                  {hoursLabel(a.hours)}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    initial={still ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ml-3 grid gap-1 border-l border-hairline pl-4 pb-2"
                  >
                    {eventsInArea(events, asOf, a.key).map((e) => (
                      <li
                        key={e.id}
                        className="flex items-baseline justify-between gap-3 py-1 text-sm"
                      >
                        <span className="min-w-0 truncate text-ink-muted">{e.title}</span>
                        <span className="tnum shrink-0 text-ink-faint">
                          {hoursLabel(e.hours)}
                        </span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 px-3 text-sm text-ink-faint">{AREAS.footnote}</p>
    </div>
  );
}
