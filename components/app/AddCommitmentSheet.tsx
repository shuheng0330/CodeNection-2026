"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ADD } from "@/lib/copy";
import { toISODate } from "@/lib/engine/dates";
import type { Intensity, LoadCategory } from "@/lib/engine/types";
import { extract } from "@/lib/parse/extract";
import { spring } from "@/lib/motion";
import { usePikul } from "@/lib/store";
import { useModalDialog } from "@/components/app/shell/useModalDialog";

type FieldKey = "title" | "date" | "hours" | "category" | "intensity";

const CATEGORIES = Object.keys(ADD.categories) as LoadCategory[];

/**
 * Adding a commitment without typing one.
 *
 * The objection every workload tracker eventually meets is that an
 * overloaded student will not open an app to log yet another task. They
 * shouldn't have to — the commitment already exists as a message somebody
 * sent them, so they paste that instead and confirm what we read.
 *
 * Parsing is deterministic and offline, and it is wrong out loud rather than
 * quietly: anything we filled in ourselves is labelled as a guess, and a
 * message we cannot read leaves the ordinary blank form behind, which is
 * exactly what the student would have used anyway.
 */
export function AddCommitmentSheet({ asOf }: { asOf: Date }) {
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState("");
  const [edited, setEdited] = useState<Partial<Record<FieldKey, string>>>({});
  const [error, setError] = useState("");
  const addEvent = usePikul((s) => s.addEvent);

  const draft = useMemo(() => extract(raw, asOf), [raw, asOf]);

  // A field the student has touched is theirs; everything else follows the
  // paste box, so re-pasting genuinely re-reads rather than half-updating.
  const value = (k: FieldKey): string => edited[k] ?? String(draft[k].value);
  const isGuess = (k: FieldKey): boolean =>
    edited[k] === undefined && draft[k].from === "guessed";
  const set = (k: FieldKey, v: string) => {
    setEdited((current) => ({ ...current, [k]: v }));
    setError("");
  };

  const repaste = (text: string) => {
    setRaw(text);
    setEdited({});
    setError("");
  };

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      setRaw("");
      setEdited({});
      setError("");
    }, 300);
  };
  const { triggerRef, dialogRef, onKeyDown } = useModalDialog(open, close);

  const submit = () => {
    const hours = Number(value("hours"));
    const date = value("date");
    const intensity = Number(value("intensity"));
    const category = value("category") as LoadCategory;
    const valid =
      /^\d{4}-\d{2}-\d{2}$/.test(date) &&
      date >= toISODate(asOf) &&
      Number.isFinite(hours) &&
      hours > 0 &&
      CATEGORIES.includes(category) &&
      Number.isInteger(intensity) &&
      intensity >= 1 &&
      intensity <= 5;

    if (!valid) {
      setError(ADD.invalid);
      return;
    }

    addEvent({
      date,
      category,
      title: value("title").trim() || ADD.untitled,
      hours,
      intensity: intensity as Intensity,
    });
    close();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="min-h-11 w-full rounded-full border border-hairline px-6 py-3.5 font-medium text-ink transition-colors hover:bg-raised"
      >
        {ADD.trigger}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.div
              ref={dialogRef}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-y-auto rounded-t-[28px] border-t border-hairline bg-surface p-6 pb-10 shadow-lift sm:bottom-8 sm:mx-auto sm:max-w-lg sm:rounded-[28px]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={spring.ui}
              role="dialog"
              aria-modal="true"
              aria-label={ADD.title}
              onKeyDown={onKeyDown}
            >
              <div className="mx-auto mb-6 h-1.5 w-10 rounded-full bg-hairline" />
              <h2 className="font-display text-h2">{ADD.title}</h2>

              {/* ---- paste it ---- */}
              <label className="mt-6 block">
                <span className="text-micro uppercase tracking-[0.08em] text-ink-faint">
                  {ADD.pasteLabel}
                </span>
                <textarea
                  value={raw}
                  onChange={(e) => repaste(e.target.value)}
                  rows={2}
                  placeholder={ADD.pastePlaceholder}
                  className="mt-2 w-full resize-none rounded-2xl border border-hairline bg-raised/50 px-4 py-3 text-ink placeholder:text-ink-faint"
                />
              </label>
              <p className="mt-2 text-sm text-ink-faint">
                {draft.matchedOn && raw.trim()
                  ? ADD.readFrom(draft.matchedOn)
                  : ADD.pasteHint}
              </p>

              {/* ---- or correct it ---- */}
              <div className="mt-7 grid gap-5">
                <Row label={ADD.fields.title} guessed={false}>
                  <input
                    value={value("title")}
                    onChange={(e) => set("title", e.target.value)}
                    className="w-full rounded-2xl border border-hairline px-4 py-3"
                  />
                </Row>

                <div className="grid grid-cols-2 gap-3">
                  <Row label={ADD.fields.date} guessed={isGuess("date")}>
                    <input
                      type="date"
                      value={value("date")}
                      min={toISODate(asOf)}
                      required
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? "add-commitment-error" : undefined}
                      onChange={(e) => set("date", e.target.value)}
                      className="w-full rounded-2xl border border-hairline px-4 py-3"
                    />
                  </Row>
                  <Row label={ADD.fields.hours} guessed={isGuess("hours")}>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0.5}
                      step={0.5}
                      value={value("hours")}
                      required
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? "add-commitment-error" : undefined}
                      onChange={(e) => set("hours", e.target.value)}
                      className="tnum w-full rounded-2xl border border-hairline px-4 py-3"
                    />
                  </Row>
                </div>

                <ChoiceRow
                  label={ADD.fields.category}
                  guessed={isGuess("category")}
                >
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => set("category", c)}
                        aria-pressed={value("category") === c}
                        className={`min-h-11 rounded-full border px-4 py-2 text-sm transition-colors ${
                          value("category") === c
                            ? "border-clay-600 bg-clay-100 text-clay-700"
                            : "border-hairline text-ink-muted hover:bg-raised"
                        }`}
                      >
                        {ADD.categories[c]}
                      </button>
                    ))}
                  </div>
                </ChoiceRow>

                <ChoiceRow
                  label={ADD.fields.intensity}
                  guessed={isGuess("intensity")}
                >
                  <div className="flex gap-2">
                    {ADD.intensityScale.map((label, i) => {
                      const level = String(i + 1);
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => set("intensity", level)}
                          aria-pressed={value("intensity") === level}
                          className={`min-h-11 flex-1 rounded-2xl border px-1 py-2 text-xs transition-colors ${
                            value("intensity") === level
                              ? "border-clay-600 bg-clay-100 text-clay-700"
                              : "border-hairline text-ink-muted hover:bg-raised"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </ChoiceRow>
              </div>

              <p
                id="add-commitment-error"
                role="alert"
                className="mt-4 min-h-5 text-sm text-rust"
              >
                {error}
              </p>
              <button
                type="button"
                onClick={submit}
                className="mt-3 min-h-11 w-full rounded-full bg-clay-600 px-6 py-3.5 font-medium text-white transition-colors hover:bg-clay-500"
              >
                {ADD.submit}
              </button>
              <button
                type="button"
                onClick={close}
                className="mt-3 min-h-11 w-full py-2 text-sm text-ink-faint transition-colors hover:text-ink-muted"
              >
                {ADD.cancel}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function ChoiceRow({
  label,
  guessed,
  children,
}: {
  label: string;
  guessed: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="mb-2">
        <span className="flex items-baseline gap-2">
          <span className="text-micro uppercase tracking-[0.08em] text-ink-faint">
            {label}
          </span>
          {guessed && (
            <span className="rounded-full bg-raised px-2 py-0.5 text-[11px] text-ink-faint">
              {ADD.guessed}
            </span>
          )}
        </span>
      </legend>
      {children}
    </fieldset>
  );
}

function Row({
  label,
  guessed,
  children,
}: {
  label: string;
  guessed: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      {(label || guessed) && (
        <span className="mb-2 flex items-baseline gap-2">
          <span className="text-micro uppercase tracking-[0.08em] text-ink-faint">
            {label}
          </span>
          {guessed && (
            <span className="rounded-full bg-raised px-2 py-0.5 text-[11px] text-ink-faint">
              {ADD.guessed}
            </span>
          )}
        </span>
      )}
      {children}
    </label>
  );
}
