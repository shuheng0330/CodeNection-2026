"use client";

import { useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ADD } from "@/lib/copy";
import { toISODate } from "@/lib/engine/dates";
import { checkRequest } from "@/lib/engine/validate";
import type { LoadCategory, LoadEvent } from "@/lib/engine/types";
import { extract } from "@/lib/parse/extract";
import { sheetMotion } from "@/lib/motion";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { usePikul } from "@/lib/store";
import { DateField } from "./DateField";

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
export function AddCommitmentSheet({
  asOf,
  events,
}: {
  asOf: Date;
  events: LoadEvent[];
}) {
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState("");
  const [edited, setEdited] = useState<Partial<Record<FieldKey, string>>>({});
  const addEvent = usePikul((s) => s.addEvent);
  const still = useReducedMotion();
  const titleId = useId();
  const problemsId = useId();

  const draft = useMemo(() => extract(raw, asOf), [raw, asOf]);

  // A field the student has touched is theirs; everything else follows the
  // paste box, so re-pasting genuinely re-reads rather than half-updating.
  const value = (k: FieldKey): string => edited[k] ?? String(draft[k].value);
  const isGuess = (k: FieldKey): boolean =>
    edited[k] === undefined && draft[k].from === "guessed";
  const set = (k: FieldKey, v: string) => setEdited((e) => ({ ...e, [k]: v }));

  const title = value("title");
  const date = value("date");
  const hours = value("hours");
  const category = value("category") as LoadCategory;
  const intensity = value("intensity");

  /**
   * "any", because this screen makes no forecast.
   *
   * The request sheet has to refuse anything outside the four weeks it can
   * price. Writing a commitment on your own calendar has no such ceiling —
   * something in December is an ordinary thing to record, it simply will not
   * appear in a forecast that only reaches four weeks. Everything else is
   * checked exactly as it is there.
   */
  const check = useMemo(
    () => checkRequest({ title, date, hours, category, intensity }, asOf, "any"),
    [title, date, hours, category, intensity, asOf],
  );

  // Which box is actually wrong, so the invalid state lands on that control
  // rather than on the form as a whole.
  const badDate = check.problems.some((p) => p.startsWith("date-"));
  const badHours = check.problems.some((p) => p.startsWith("hours-"));

  const repaste = (text: string) => {
    setRaw(text);
    setEdited({});
  };

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      setRaw("");
      setEdited({});
    }, 300);
  };

  // Focus lands on the heading, not the paste box. Focusing a textarea on
  // open raises the Android keyboard over the sheet before anyone has read it.
  const sheetRef = useFocusTrap<HTMLDivElement>({ active: open, onClose: close });

  /**
   * Nothing is invented on the way in.
   *
   * This used to read the hours box, find a blank or a zero, and write a
   * one-hour commitment anyway. The student never typed that hour, never saw
   * it, and their week moved because of it. The check either produces the
   * event or it produces reasons, and there is no third path.
   */
  const submit = () => {
    if (!check.event) return;
    addEvent({ ...check.event, title: check.event.title || ADD.untitled });
    close();
  };

  /**
   * Portalled to the body for the same reason the request sheet is: a fixed
   * overlay inside an ancestor that creates a stacking context — a transform,
   * a filter, `position: sticky` — is only above that ancestor's own
   * siblings, and Today's decision panel is sticky.
   */
  const overlay = (
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
              ref={sheetRef}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-y-auto rounded-t-[28px] border-t border-hairline bg-surface p-6 pb-0 shadow-lift outline-none sm:bottom-8 sm:mx-auto sm:max-w-lg sm:rounded-[28px]"
              {...sheetMotion(!!still)}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
            >
              <div className="mx-auto mb-6 h-1.5 w-10 rounded-full bg-hairline" />
              <h2
                id={titleId}
                tabIndex={-1}
                data-autofocus
                className="font-display text-h2 outline-none"
              >
                {ADD.title}
              </h2>

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
                    value={title}
                    onChange={(e) => set("title", e.target.value)}
                    className="w-full rounded-2xl border border-hairline px-4 py-3"
                  />
                </Row>

                <DateField
                  label={ADD.fields.date}
                  guessed={isGuess("date")}
                  value={date}
                  min={toISODate(asOf)}
                  today={toISODate(asOf)}
                  events={events}
                  invalid={badDate}
                  describedBy={badDate ? problemsId : undefined}
                  onChange={(d) => set("date", d)}
                >
                  <Row label={ADD.fields.hours} guessed={isGuess("hours")}>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0.5}
                      step={0.5}
                      value={hours}
                      onChange={(e) => set("hours", e.target.value)}
                      aria-invalid={badHours || undefined}
                      aria-describedby={badHours ? problemsId : undefined}
                      className="tnum w-full rounded-2xl border border-hairline px-4 py-3"
                    />
                  </Row>
                </DateField>

                <ChoiceRow label={ADD.fields.category} guessed={isGuess("category")}>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        type="button"
                        key={c}
                                                onClick={() => set("category", c)}
                        aria-pressed={category === c}
                        className={`min-h-11 rounded-full border px-4 py-2 text-sm transition-colors ${
                          category === c
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
                          type="button"
                          key={level}
                                                    onClick={() => set("intensity", level)}
                          aria-pressed={intensity === level}
                          className={`min-h-11 flex-1 rounded-2xl border px-1 py-2 text-xs transition-colors ${
                            intensity === level
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

              {/* The action, pinned — the same treatment the request sheet
                  gets, and for the same reason: this form is taller than a
                  phone, so its one button was below the fold on open. The
                  reasons sit above it in reading order, and the button points
                  at them, so nobody meets a dead control with no explanation
                  for why it is dead. */}
              <div className="sticky bottom-0 -mx-6 mt-7 border-t border-hairline bg-surface px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
                {!check.ok && (
                  <div id={problemsId} className="mb-3" role="status">
                    <p className="text-micro uppercase tracking-[0.08em] text-ink-faint">
                      {ADD.cannotAdd}
                    </p>
                    <ul className="mt-1.5 grid gap-1">
                      {check.problems.map((p) => (
                        <li key={p} className="text-sm text-ink-muted">
                          {ADD.problems[p]}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  type="button"
                  onClick={submit}
                  disabled={!check.ok}
                  aria-describedby={check.ok ? undefined : problemsId}
                  className="min-h-11 w-full rounded-full bg-clay-600 px-6 py-3.5 font-medium text-white transition-colors hover:bg-clay-500 disabled:cursor-not-allowed disabled:border disabled:border-hairline disabled:bg-raised disabled:text-ink-faint"
                >
                  {ADD.submit}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="min-h-11 w-full py-2 text-sm text-ink-faint transition-colors hover:text-ink-muted"
                >
                  {ADD.cancel}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="min-h-11 w-full rounded-full border border-hairline px-6 py-3.5 font-medium text-ink transition-colors hover:bg-raised"
      >
        {ADD.trigger}
      </button>
      {typeof document === "undefined" ? null : createPortal(overlay, document.body)}
    </>
  );
}

/** One field with one control: a label wrapping its input. */
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

/**
 * One question with several buttons under it.
 *
 * Thong's, kept over my version of the same thing. A `<label>` can only name
 * one control, so wrapping a row of eight category buttons in one made the
 * label meaningless — and the category group had no visible question at all.
 * A fieldset and legend is what a group of choices actually is, and it gets
 * announced when focus enters any button in it.
 */
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
