"use client";

import { useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ADD, NO_BUTTON, beforeAfterLine } from "@/lib/copy";
import { draftDecline, type AskKind, type Tone } from "@/lib/decline";
import { toISODate } from "@/lib/engine/dates";
import {
  priceCommitment,
  verdictFor,
  type CommitmentPrice,
} from "@/lib/engine/forecast";
import { checkRequest, horizonEnd } from "@/lib/engine/validate";
import type { LoadCategory, LoadEvent } from "@/lib/engine/types";
import { extract } from "@/lib/parse/extract";
import { decisionDemo } from "@/lib/seed/decisionDemo";
import { CURRENT_WEEK } from "@/lib/seed/generateSemester";
import { sheetMotion, spring } from "@/lib/motion";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { usePikul } from "@/lib/store";
import { DateField } from "./DateField";

type FieldKey = "title" | "date" | "hours" | "category" | "intensity";

const CATEGORIES = Object.keys(ADD.categories) as LoadCategory[];

const VERDICT_TONE = {
  fits: "text-sage",
  tight: "text-amber",
  costly: "text-rust",
} as const;

/**
 * Which drafted reply suits the thing being asked for.
 *
 * The student used to pick this from a list of four, which is a question
 * about our data model rather than about their life. The message already
 * says what kind of ask it is, so the category the parser found decides it.
 */
const REPLY_KIND: Record<LoadCategory, AskKind> = {
  shift: "shift",
  assignment: "project",
  class: "project",
  club: "event",
  social: "event",
  family: "event",
  commute: "favour",
  admin: "favour",
};

/**
 * The demo moment.
 *
 * Everything else in this space is retrospective — it shows you the damage
 * after you already agreed. This owns the decision point instead: it prices
 * the yes before you give it, then writes the no for you, because rebalancing
 * always needs a counterparty and that is the part nobody builds.
 *
 * It opens on a request that has already arrived and already been read, so
 * there is nothing to type before the forecast appears. What we read of it is
 * on screen field by field, labelled as read or as guessed, and every one of
 * them is editable — the price follows the boxes, never our guess.
 */
export function NoButton({ events, asOf }: { events: LoadEvent[]; asOf: Date }) {
  const demo = decisionDemo();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState(demo.message);
  const [swapping, setSwapping] = useState(false);
  const [edited, setEdited] = useState<Partial<Record<FieldKey, string>>>({
    title: demo.candidate.title,
  });
  const [tone, setTone] = useState<Tone>("soften");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [decided, setDecided] = useState<"yes" | "no" | null>(null);
  /** The forecast exactly as it read at the moment they answered. */
  const [settled, setSettled] = useState<CommitmentPrice | null>(null);

  const decideAsk = usePikul((s) => s.decideAsk);
  const undoAsk = usePikul((s) => s.undoAsk);
  // A new intent per opening: pressing the button twice answers once, but
  // asking again later is a different question and gets its own entry.
  const [intentId, setIntentId] = useState(() => `ask-${Date.now()}`);
  const still = useReducedMotion();
  const titleId = useId();
  const replyRef = useRef<HTMLParagraphElement | null>(null);

  const isSample = message === demo.message;

  // The sample's parse is precomputed in the fixture, so opening the sheet
  // repeats no work the landing page has already done.
  const draft = useMemo(
    () => (isSample ? demo.draft : extract(message, asOf)),
    [isSample, demo.draft, message, asOf],
  );

  // A field the student has touched is theirs; everything else follows the
  // message, so pasting a new one genuinely re-reads rather than half-updating.
  const value = (k: FieldKey): string => edited[k] ?? String(draft[k].value);
  const isGuess = (k: FieldKey): boolean =>
    edited[k] === undefined && draft[k].from === "guessed";
  const set = (k: FieldKey, v: string) => setEdited((e) => ({ ...e, [k]: v }));

  const title = value("title");
  const date = value("date");
  const hours = value("hours");
  const category = value("category") as LoadCategory;
  const intensity = value("intensity");

  const check = useMemo(
    () => checkRequest({ title, date, hours, category, intensity }, asOf),
    [title, date, hours, category, intensity, asOf],
  );

  const candidate: LoadEvent | null = useMemo(() => {
    if (!check.event) return null;
    return {
      ...check.event,
      title: check.event.title || ADD.untitled,
      id: "ask",
      source: "user",
    };
  }, [check.event]);

  const live = useMemo(
    () => (candidate ? priceCommitment(events, candidate, asOf, CURRENT_WEEK) : null),
    [events, candidate, asOf],
  );

  // Once they have answered, the commitment is on the calendar — and handing
  // a committed event back to priceCommitment as a candidate counts it twice,
  // so the week would jump a second time the instant they said yes. Show them
  // what they were actually looking at when they decided.
  const price = settled ?? live;
  const landing = price?.landing ?? null;

  const reply = draftDecline(REPLY_KIND[category] ?? "favour", tone);

  const repaste = (text: string) => {
    setMessage(text);
    setEdited({});
    setCopyState("idle");
  };

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      setStep(0);
      setSwapping(false);
      setCopyState("idle");
      setDecided(null);
      setSettled(null);
    }, 300);
  };

  // Armed on open and released on close-request, so focus goes back to the
  // trigger immediately rather than waiting out the exit animation.
  const sheetRef = useFocusTrap<HTMLDivElement>({
    active: open,
    onClose: close,
    focusKey: step,
  });

  const copyReply = async () => {
    try {
      await navigator.clipboard.writeText(reply);
      setCopyState("copied");
    } catch {
      // Plain HTTP, several in-app browsers and an unfocused tab all fail
      // here, and the old code claimed success regardless. Select the text so
      // the fallback is one keystroke rather than a careful drag.
      setCopyState("failed");
      const node = replyRef.current;
      const selection = window.getSelection();
      if (node && selection) {
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const answer = (decision: "yes" | "no") => {
    if (!candidate || !landing || decided) return;
    setSettled(live);
    setDecided(decision);
    decideAsk({
      intentId,
      decision,
      title: candidate.title,
      pct: landing.pctOfUsual,
      weekLabel: landing.label,
      verdict: verdictFor(landing.ratioAfter),
      event: {
        date: candidate.date,
        category: candidate.category,
        title: candidate.title,
        hours: candidate.hours,
        intensity: candidate.intensity,
      },
    });
  };

  /**
   * Portalled to the body, not rendered where it is mounted.
   *
   * `position: fixed` and a z-index are not enough on their own: any ancestor
   * with a transform, a filter or `position: sticky` starts a stacking
   * context, and the sheet's z-50 then only means "above its siblings inside
   * that context". Today's decision panel is sticky, so the week's own
   * content — which comes after the panel in the DOM — painted straight over
   * the top of an open sheet.
   *
   * At the body there is nothing left to be trapped inside, which is also
   * where the focus trap's inert walk expects to end up.
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

              {step === 0 && (
                <Step title={NO_BUTTON.step1Title} titleId={titleId} step={step}>
                  {/* ---- what arrived ---- */}
                  <div className="rounded-2xl rounded-bl-md border border-hairline bg-raised/70 px-4 py-3.5">
                    {isSample && (
                      <p className="mb-2 text-micro uppercase tracking-[0.08em] text-ink-faint">
                        {NO_BUTTON.sampleLabel}
                      </p>
                    )}
                    <p className="text-ink">{message || NO_BUTTON.swapPlaceholder}</p>
                  </div>

                  <div className="mt-2 flex flex-wrap items-baseline gap-4">
                    <button
                      type="button"
                      onClick={() => setSwapping((s) => !s)}
                      className="min-h-11 text-sm text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                    >
                      {swapping ? NO_BUTTON.swapCancel : NO_BUTTON.swap}
                    </button>
                    {!isSample && (
                      <button
                        type="button"
                        onClick={() => {
                          setMessage(demo.message);
                          setEdited({ title: demo.candidate.title });
                          setCopyState("idle");
                          setSwapping(false);
                        }}
                        className="min-h-11 text-sm text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                      >
                        {NO_BUTTON.restore}
                      </button>
                    )}
                  </div>

                  <AnimatePresence initial={false}>
                    {swapping && (
                      <motion.div
                        initial={still ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <label className="mt-3 block">
                          <span className="text-micro uppercase tracking-[0.08em] text-ink-faint">
                            {NO_BUTTON.swapLabel}
                          </span>
                          <textarea
                            value={isSample ? "" : message}
                            onChange={(e) => repaste(e.target.value)}
                            rows={2}
                            placeholder={NO_BUTTON.swapPlaceholder}
                            className="mt-2 w-full resize-none rounded-2xl border border-hairline bg-surface px-4 py-3 text-ink placeholder:text-ink-faint"
                          />
                        </label>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ---- and what we made of it ---- */}
                  <div className="mt-7 border-t border-hairline pt-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-micro uppercase tracking-[0.08em] text-ink-faint">
                        {NO_BUTTON.readTitle}
                      </p>
                      {draft.matchedOn && (
                        <p className="text-sm text-ink-muted">
                          {ADD.readFrom(draft.matchedOn)}
                        </p>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-ink-muted">{NO_BUTTON.readLead}</p>

                    <div className="mt-5 grid gap-5">
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
                        max={horizonEnd(asOf)}
                        events={events}
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
                            className="tnum w-full rounded-2xl border border-hairline px-4 py-3"
                          />
                        </Row>
                      </DateField>

                      <Row label="" guessed={isGuess("category")}>
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
                      </Row>

                      <Row label={ADD.fields.intensity} guessed={isGuess("intensity")}>
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
                      </Row>
                    </div>
                  </div>

                </Step>
              )}

              {step === 1 && (
                <Step
                  // The heading is the dialog's accessible name and it is what
                  // gets announced on the step change, so it cannot promise a
                  // price the next paragraph then refuses to give.
                  title={
                    price && landing ? NO_BUTTON.step2Title : NO_BUTTON.cantPriceTitle
                  }
                  titleId={titleId}
                  step={step}
                >
                  {!price || !landing ? (
                    <CannotPrice
                      problems={
                        check.problems.length > 0 ? check.problems : ["date-beyond"]
                      }
                      onBack={() => setStep(0)}
                    />
                  ) : (
                    <>
                      <p
                        className={`font-display text-2xl ${
                          VERDICT_TONE[verdictFor(landing.ratioAfter)]
                        }`}
                      >
                        {NO_BUTTON.verdict[verdictFor(landing.ratioAfter)]}
                      </p>
                      <p className="mt-3 text-lead text-ink-muted">
                        {beforeAfterLine(
                          Math.round(landing.ratioBefore * 100),
                          landing.pctOfUsual,
                          landing.label,
                        )}
                      </p>

                      <ForecastStrip price={price} />

                      {/* ---- the reply, for if the answer is no ---- */}
                      <div className="mt-8 border-t border-hairline pt-6">
                        <p className="text-micro uppercase tracking-[0.08em] text-ink-faint">
                          {NO_BUTTON.replyTitle}
                        </p>
                        <div className="mt-3 flex gap-2">
                          {NO_BUTTON.tones.map((t) => (
                            <button
                              type="button"
                              key={t.key}
                              onClick={() => {
                                setTone(t.key as Tone);
                                setCopyState("idle");
                              }}
                              aria-pressed={tone === t.key}
                              className={`min-h-11 flex-1 rounded-full border px-3 py-2 text-sm transition-colors ${
                                tone === t.key
                                  ? "border-clay-600 bg-clay-100 text-clay-700"
                                  : "border-hairline text-ink-muted hover:bg-raised"
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>

                        <div className="mt-4 rounded-2xl border border-hairline bg-raised/60 p-4">
                          <p ref={replyRef} className="select-all text-ink">
                            {reply}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={copyReply}
                          className="mt-3 min-h-11 w-full rounded-full bg-clay-600 px-6 py-3.5 font-medium text-white transition-colors hover:bg-clay-500"
                        >
                          {copyState === "copied"
                            ? NO_BUTTON.copied
                            : NO_BUTTON.copyAction}
                        </button>
                        <p className="mt-2 text-sm text-ink-muted" role="status">
                          {copyState === "failed"
                            ? NO_BUTTON.copyFailed
                            : NO_BUTTON.copyManualHint}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setStep(0)}
                        className="mt-6 min-h-11 w-full py-2 text-sm text-ink-muted transition-colors hover:text-ink"
                      >
                        {NO_BUTTON.back}
                      </button>
                    </>
                  )}
                </Step>
              )}

              {/* The action, pinned.
                  The sheet is taller than a phone and taller than a laptop,
                  and the thing it exists for was the last item in it — so
                  every reading of the forecast ended in a scroll to find the
                  buttons. Sticky to the bottom of the sheet's own scroller,
                  with the padding the container gives up below, so it clears
                  a home indicator and an Android keyboard alike. */}
              <div className="sticky bottom-0 -mx-6 mt-7 border-t border-hairline bg-surface px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
                {step === 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="min-h-11 w-full rounded-full bg-ink px-6 py-3.5 font-medium text-linen transition-opacity hover:opacity-90"
                  >
                    {NO_BUTTON.next}
                  </button>
                )}

                {step === 1 && landing && (
                  <>
                    <p className="text-micro uppercase tracking-[0.08em] text-ink-faint">
                      {NO_BUTTON.decisionTitle}
                    </p>
                    <div className="mt-2.5 flex gap-2">
                      {(["yes", "no"] as const).map((d) => (
                        <button
                          type="button"
                          key={d}
                          onClick={() => answer(d)}
                          aria-pressed={decided === d}
                          className={`min-h-11 flex-1 rounded-full border px-4 py-2.5 text-sm transition-colors ${
                            decided === d
                              ? "border-ink bg-ink text-linen"
                              : "border-hairline text-ink-muted hover:bg-raised"
                          }`}
                        >
                          {d === "yes" ? NO_BUTTON.saidYes : NO_BUTTON.saidNo}
                        </button>
                      ))}
                    </div>
                    {decided && (
                      <div
                        className="mt-2.5 flex flex-wrap items-baseline gap-3"
                        role="status"
                      >
                        <p className="text-sm text-ink-muted">
                          {decided === "yes"
                            ? NO_BUTTON.acceptedNote
                            : NO_BUTTON.declinedNote}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            undoAsk(intentId);
                            setDecided(null);
                            setSettled(null);
                          }}
                          className="min-h-11 text-sm text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                        >
                          {NO_BUTTON.undo}
                        </button>
                      </div>
                    )}
                  </>
                )}

                <button
                  type="button"
                  onClick={close}
                  className="min-h-11 w-full py-2 text-sm text-ink-muted transition-colors hover:text-ink"
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
        onClick={() => {
          setIntentId(`ask-${Date.now()}`);
          setOpen(true);
        }}
        className="min-h-11 w-full rounded-full bg-clay-600 px-6 py-4 font-medium text-white shadow-soft transition-colors hover:bg-clay-500"
      >
        {NO_BUTTON.trigger}
      </button>
      {/* Today holds its first paint until hydration, so this component only
          ever renders in the browser — but guarding costs nothing. */}
      {typeof document === "undefined" ? null : createPortal(overlay, document.body)}
    </>
  );
}

/**
 * A refusal, not a softer number.
 *
 * The four weeks we can see either contain this request or they do not. When
 * they do not, there is no honest figure to show — and showing a cautious one
 * anyway is exactly the failure this screen exists to prevent.
 */
function CannotPrice({
  problems,
  onBack,
}: {
  problems: string[];
  onBack: () => void;
}) {
  return (
    <div>
      <ul className="grid gap-2">
        {problems.map((p) => (
          <li key={p} className="flex gap-3 text-ink-muted">
            <span
              aria-hidden
              className="mt-2.5 h-1 w-3 shrink-0 rounded-full bg-clay-600"
            />
            <span>{NO_BUTTON.problems[p]}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink-muted">{NO_BUTTON.fixHint}</p>
      <button
        type="button"
        onClick={onBack}
        className="mt-6 min-h-11 w-full rounded-full bg-ink px-6 py-3.5 font-medium text-linen transition-opacity hover:opacity-90"
      >
        {NO_BUTTON.back}
      </button>
    </div>
  );
}

function Step({
  title,
  titleId,
  step,
  children,
}: {
  title: string;
  titleId: string;
  step: number;
  children: React.ReactNode;
}) {
  const still = useReducedMotion();
  return (
    <motion.div
      initial={still ? false : { opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={spring.settle}
    >
      {/* key forces a remount per step: focusing a node that already holds
          focus announces nothing, which is why step changes were silent. */}
      <h2
        key={step}
        id={titleId}
        tabIndex={-1}
        data-autofocus
        className="font-display text-h2 outline-none"
      >
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </motion.div>
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

/** Four weeks ahead, with the ask shaded on top. The dashed line is your usual. */
function ForecastStrip({ price }: { price: CommitmentPrice }) {
  const max = Math.max(1.7, ...price.weeks.map((w) => w.ratioAfter));

  return (
    <div className="mt-6">
      {/* No `items-end` on this row.
          Each column's bar is a percentage of its column's height, and
          align-items:end sizes a column to its content — so the height
          resolved against nothing and every bar collapsed to zero. The strip
          has been drawing an empty frame with labels under it. Stretching the
          columns gives the percentages the definite height they need. */}
      <div
        className="relative flex h-32 gap-3"
        role="img"
        aria-label={forecastLabel(price)}
      >
        <div
          className="absolute inset-x-0 border-t border-dashed border-ink-faint/60"
          style={{ bottom: `${(1 / max) * 100}%` }}
        >
          <span className="absolute -top-5 right-0 text-micro uppercase tracking-[0.08em] text-ink-faint">
            your usual
          </span>
        </div>

        {price.weeks.map((w) => (
          <div key={w.label} className="relative flex h-full flex-1 flex-col justify-end">
            <motion.div
              className={`w-full rounded-t-md ${
                w.ratioAfter >= 1.5
                  ? "bg-rust"
                  : w.ratioAfter >= 1.3
                    ? "bg-amber"
                    : w.ratioAfter >= 1.1
                      ? "bg-ember"
                      : "bg-sage"
              } ${price.landing && w.label === price.landing.label ? "" : "opacity-40"}`}
              initial={{ height: `${(w.ratioBefore / max) * 100}%` }}
              animate={{ height: `${(w.ratioAfter / max) * 100}%` }}
              transition={{ ...spring.settle, delay: 0.15 }}
            />
          </div>
        ))}
      </div>

      <div aria-hidden className="mt-2 flex gap-3">
        {price.weeks.map((w) => (
          <p
            key={w.label}
            className="flex-1 text-center text-micro uppercase tracking-[0.08em] text-ink-faint"
          >
            {w.label.replace("week ", "wk ")}
          </p>
        ))}
      </div>
    </div>
  );
}

/**
 * The chart, said out loud.
 *
 * A screen reader got four week labels and no bars at all. The spoken version
 * carries the same claim the picture does and nothing more: which week moves,
 * from what to what, and that the rest are untouched.
 */
function forecastLabel(price: CommitmentPrice): string {
  const rest = price.weeks
    .filter((w) => w.label !== price.landing?.label)
    .map((w) => `${w.label} ${w.pctOfUsual}%`)
    .join(", ");
  if (!price.landing) {
    return `The next four weeks, unchanged by this: ${rest}.`;
  }
  return `The next four weeks, as a share of a usual week. ${price.landing.label} goes from ${Math.round(price.landing.ratioBefore * 100)}% to ${price.landing.pctOfUsual}%. The rest are unchanged: ${rest}.`;
}
