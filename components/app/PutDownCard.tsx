"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PUT_DOWN, putDownLine, reclaimedLine } from "@/lib/copy";
import type { PutDown, PutDownReason } from "@/lib/engine/putdown";
import { whenLabel } from "@/lib/engine/putdown";
import type { LoadEvent } from "@/lib/engine/types";
import { spring } from "@/lib/motion";
import { usePikul } from "@/lib/store";

/**
 * Exactly one recommendation, and then the part every other tool stops short
 * of: what the time is actually for. A number that goes down is not relief.
 * Handing something back and being asked what you'd do with the evening is.
 *
 * Never a list. A ranked set of five things to drop is just another backlog.
 */
export function PutDownCard({
  suggestion,
  handedBack,
  reason,
  asOf,
}: {
  suggestion: PutDown | null;
  handedBack: LoadEvent | null;
  reason: PutDownReason;
  asOf: Date;
}) {
  const still = useReducedMotion();
  const putDown = usePikul((s) => s.putDown);
  const pickUpAgain = usePikul((s) => s.pickUpAgain);
  const recovery = usePikul((s) => s.recovery);
  const setRecovery = usePikul((s) => s.setRecovery);

  // ---- after: the time is back, and it belongs to them ----
  if (handedBack) {
    const when = whenLabel(handedBack.date, asOf);
    return (
      <motion.div
        layout={!still}
        transition={spring.settle}
        className="rounded-3xl border border-dusk/25 bg-dusk-100/60 p-6 shadow-soft"
      >
        <p className="text-micro uppercase tracking-[0.08em] text-dusk">
          {PUT_DOWN.doneTitle}
        </p>
        <p className="mt-3 font-display text-2xl text-ink line-through decoration-dusk/40">
          {handedBack.title}
        </p>
        <p className="mt-2 text-lead text-ink-muted">
          {reclaimedLine(handedBack.hours, when)}
        </p>

        <fieldset className="mt-6">
          <legend className="text-micro uppercase tracking-[0.08em] text-dusk">
            {PUT_DOWN.recoveryTitle}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {PUT_DOWN.recovery.map((r) => (
              <button
                key={r.key}
                onClick={() => setRecovery(recovery === r.key ? null : r.key)}
                aria-pressed={recovery === r.key}
                className={`min-h-11 rounded-full border px-4 py-2 text-sm transition-colors ${
                  recovery === r.key
                    ? "border-dusk bg-dusk text-white"
                    : "border-dusk/30 text-ink-muted hover:bg-dusk-100"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <AnimatePresence>
            {recovery && (
              <motion.p
                initial={still ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-sm text-dusk"
              >
                {PUT_DOWN.recoveryHint}
              </motion.p>
            )}
          </AnimatePresence>
        </fieldset>

        <button
          onClick={pickUpAgain}
          className="mt-5 min-h-11 text-sm text-ink-faint underline-offset-4 transition-colors hover:text-ink-muted hover:underline"
        >
          {PUT_DOWN.undo}
        </button>
      </motion.div>
    );
  }

  // ---- the offer ----
  if (suggestion) {
    return (
      <motion.div
        layout={!still}
        transition={spring.settle}
        className="rounded-3xl border border-dusk/25 bg-dusk-100/60 p-6 shadow-soft"
      >
        <p className="text-micro uppercase tracking-[0.08em] text-dusk">
          {PUT_DOWN.title}
        </p>
        <p className="mt-3 font-display text-2xl text-ink">{suggestion.event.title}</p>
        <p className="mt-2 text-ink-muted">
          {putDownLine(suggestion.hoursBack, suggestion.when)}
        </p>
        <button
          onClick={() => putDown(suggestion.event.id)}
          className="mt-5 min-h-11 w-full rounded-full bg-dusk px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
        >
          {PUT_DOWN.action}
        </button>
      </motion.div>
    );
  }

  // ---- nothing to offer, which is itself worth saying ----
  return (
    <div className="rounded-3xl border border-hairline bg-surface p-6">
      <p className="text-ink-muted">{PUT_DOWN.reasons[reason]}</p>
    </div>
  );
}
