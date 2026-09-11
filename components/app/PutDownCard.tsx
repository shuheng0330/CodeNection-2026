"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PUT_DOWN, putDownLine, reclaimedLine } from "@/lib/copy";
import type { PutDown, PutDownReason } from "@/lib/engine/putdown";
import { whenLabel } from "@/lib/engine/putdown";
import type { LoadEvent } from "@/lib/engine/types";
import { spring } from "@/lib/motion";
import { freeBlocks } from "@/lib/engine/recover";
import { usePikul } from "@/lib/store";

/**
 * One recommendation by default, with the student's other safe choices kept
 * behind an explicit action. The engine still decides what is negotiable; the
 * student decides which of those commitments they can actually hand back.
 */
export function PutDownCard({
  suggestions,
  handedBack,
  reason,
  asOf,
  events,
}: {
  suggestions: PutDown[];
  handedBack: LoadEvent | null;
  reason: PutDownReason;
  asOf: Date;
  events: LoadEvent[];
}) {
  const still = useReducedMotion();
  const [previewing, setPreviewing] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const putDown = usePikul((s) => s.putDown);
  const pickUpAgain = usePikul((s) => s.pickUpAgain);
  const recovery = usePikul((s) => s.recovery);
  const setRecovery = usePikul((s) => s.setRecovery);
  const suggestion =
    suggestions.find((choice) => choice.event.id === selectedId) ?? suggestions[0] ?? null;

  // What the week would look like without it. Computed, never saved — the
  // preview has to be able to be cancelled with nothing left behind.
  const freedDay = useMemo(() => {
    if (!suggestion) return null;
    const without = events.filter((e) => e.id !== suggestion.event.id);
    const gained = freeBlocks(without, asOf).filter(
      (b) => !freeBlocks(events, asOf).some((had) => had.date === b.date),
    );
    return gained[0] ? format(parseISO(gained[0].date), "EEEE") : null;
  }, [suggestion, events, asOf]);

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
                type="button"
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
          type="button"
          onClick={() => {
            pickUpAgain();
            setSelectedId(null);
            setChoosing(false);
          }}
          className="mt-5 min-h-11 text-sm text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
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

        {suggestions.length > 1 && !previewing && (
          <div className="mt-4 border-t border-dusk/20 pt-4">
            <button
              type="button"
              aria-expanded={choosing}
              aria-controls="put-down-choices"
              onClick={() => setChoosing((open) => !open)}
              className="min-h-11 text-sm text-dusk underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {choosing ? PUT_DOWN.hideChoices : PUT_DOWN.chooseDifferent}
            </button>

            <AnimatePresence initial={false}>
              {choosing && (
                <motion.fieldset
                  id="put-down-choices"
                  initial={still ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-3 grid gap-2"
                >
                  <legend className="sr-only">{PUT_DOWN.chooseLegend}</legend>
                  {suggestions.map((choice, index) => (
                    <label
                      key={choice.event.id}
                      className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-colors focus-within:ring-2 focus-within:ring-dusk focus-within:ring-offset-2 ${
                        choice.event.id === suggestion.event.id
                          ? "border-dusk bg-white/70"
                          : "border-dusk/20 bg-white/35 hover:bg-white/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name="put-down-choice"
                        value={choice.event.id}
                        checked={choice.event.id === suggestion.event.id}
                        onChange={() => {
                          setSelectedId(choice.event.id);
                          setPreviewing(false);
                        }}
                        className="mt-1 size-4 shrink-0 accent-dusk"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-ink">
                          {choice.event.title}
                        </span>
                        <span className="mt-1 block text-sm text-ink-muted">
                          {PUT_DOWN.choiceDetail(choice.hoursBack, choice.when)}
                        </span>
                        {index === 0 && (
                          <span className="mt-1 block text-xs text-dusk">
                            {PUT_DOWN.recommended}
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </motion.fieldset>
              )}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence initial={false} mode="wait">
          {previewing ? (
            <motion.div
              key="preview"
              initial={still ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-5 border-t border-dusk/20 pt-5"
            >
              <p className="text-micro uppercase tracking-[0.08em] text-dusk">
                {PUT_DOWN.previewTitle}
              </p>
              <p className="mt-3 text-ink">
                {PUT_DOWN.previewIntro(suggestion.event.title)}
              </p>
              <ul className="mt-2 grid gap-1.5">
                <li className="flex gap-3 text-ink-muted">
                  <span aria-hidden className="mt-2.5 h-1 w-3 shrink-0 rounded-full bg-dusk" />
                  <span>
                    {PUT_DOWN.previewHours(suggestion.hoursBack, suggestion.when)}
                  </span>
                </li>
                {freedDay && (
                  <li className="flex gap-3 text-ink-muted">
                    <span aria-hidden className="mt-2.5 h-1 w-3 shrink-0 rounded-full bg-dusk" />
                    <span>{PUT_DOWN.previewOpensDay(freedDay)}</span>
                  </li>
                )}
              </ul>

              {/* The half nobody else would print. */}
              <p className="mt-4 text-sm text-ink-muted">{PUT_DOWN.previewUnchanged}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    putDown(suggestion.event.id);
                    setPreviewing(false);
                    setChoosing(false);
                  }}
                  className="min-h-11 flex-1 rounded-full bg-dusk px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
                >
                  {PUT_DOWN.previewConfirm}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewing(false)}
                  className="min-h-11 flex-1 rounded-full border border-dusk/30 px-6 py-3 text-ink-muted transition-colors hover:bg-dusk-100"
                >
                  {PUT_DOWN.previewCancel}
                </button>
              </div>
              <p className="mt-3 text-sm text-ink-muted">{PUT_DOWN.previewNote}</p>
            </motion.div>
          ) : (
            <motion.button
              key="offer"
              initial={still ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setChoosing(false);
                setPreviewing(true);
              }}
              className="mt-5 min-h-11 w-full rounded-full bg-dusk px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
            >
              {PUT_DOWN.action}
            </motion.button>
          )}
        </AnimatePresence>
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
