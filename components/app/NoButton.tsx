"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { addDays, format } from "date-fns";
import { NO_BUTTON, priceLine } from "@/lib/copy";
import { ASK_KINDS, draftDecline, type AskKind, type Tone } from "@/lib/decline";
import { ASK_WEIGHTS, priceCommitment } from "@/lib/engine/forecast";
import type { LoadEvent } from "@/lib/engine/types";
import { CURRENT_WEEK } from "@/lib/seed/generateSemester";
import { sheetMotion, spring } from "@/lib/motion";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { usePikul } from "@/lib/store";

type Heft = keyof typeof ASK_WEIGHTS;

const VERDICT_TONE = {
  fits: "text-sage",
  tight: "text-amber",
  costly: "text-rust",
} as const;

/**
 * The demo moment.
 *
 * Everything else in this space is retrospective — it shows you the damage
 * after you already agreed. This owns the decision point instead: it prices
 * the yes before you give it, then writes the no for you, because rebalancing
 * always needs a counterparty and that is the part nobody builds.
 */
export function NoButton({ events, asOf }: { events: LoadEvent[]; asOf: Date }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState<AskKind>("shift");
  const [heft, setHeft] = useState<Heft>("heavy");
  const [tone, setTone] = useState<Tone>("soften");
  const [copied, setCopied] = useState(false);
  const [decided, setDecided] = useState<"yes" | "no" | null>(null);
  const logAsk = usePikul((s) => s.logAsk);
  const still = useReducedMotion();
  const titleId = useId();

  // The ask lands next week — the week that is already loaded before anyone asks.
  const candidate: LoadEvent = useMemo(
    () => ({
      id: "ask",
      date: format(addDays(asOf, 9), "yyyy-MM-dd"),
      category:
        kind === "shift" ? "shift" : kind === "project" ? "assignment" : "social",
      title: "What they are asking",
      hours: ASK_WEIGHTS[heft].hours,
      intensity: ASK_WEIGHTS[heft].intensity,
      source: "user",
    }),
    [asOf, kind, heft],
  );

  const price = useMemo(
    () => priceCommitment(events, candidate, asOf, CURRENT_WEEK),
    [events, candidate, asOf],
  );

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      setStep(0);
      setCopied(false);
      setDecided(null);
    }, 300);
  };

  // Armed on open and released on close-request, so focus goes back to the
  // trigger immediately rather than waiting out the exit animation.
  const sheetRef = useFocusTrap<HTMLDivElement>({
    active: open,
    onClose: close,
    focusKey: step,
  });

  const draft = draftDecline(kind, tone);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-full bg-clay-600 px-6 py-4 font-medium text-white shadow-soft transition-colors hover:bg-clay-500"
      >
        {NO_BUTTON.trigger}
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
              ref={sheetRef}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-y-auto rounded-t-[28px] border-t border-hairline bg-surface p-6 pb-10 shadow-lift outline-none sm:bottom-8 sm:mx-auto sm:max-w-lg sm:rounded-[28px]"
              {...sheetMotion(!!still)}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
            >
              <div className="mx-auto mb-6 h-1.5 w-10 rounded-full bg-hairline" />

              {step === 0 && (
                <Step title={NO_BUTTON.step1Title} titleId={titleId} step={step}>
                  <div className="grid gap-2">
                    {ASK_KINDS.map((k) => (
                      <Choice
                        key={k.key}
                        active={kind === k.key}
                        onClick={() => setKind(k.key)}
                      >
                        {k.label}
                      </Choice>
                    ))}
                  </div>
                  <Next onClick={() => setStep(1)} />
                </Step>
              )}

              {step === 1 && (
                <Step title={NO_BUTTON.step2Title} titleId={titleId} step={step}>
                  <div className="grid gap-2">
                    {NO_BUTTON.weights.map((w) => (
                      <Choice
                        key={w.key}
                        active={heft === w.key}
                        onClick={() => setHeft(w.key as Heft)}
                      >
                        <span className="font-medium">{w.label}</span>
                        <span className="ml-2 text-ink-faint">{w.hint}</span>
                      </Choice>
                    ))}
                  </div>
                  <Next onClick={() => setStep(2)} label="See what it costs" />
                </Step>
              )}

              {step === 2 && (
                <Step title={NO_BUTTON.step3Title} titleId={titleId} step={step}>
                  <p className={`font-display text-2xl ${VERDICT_TONE[price.verdict]}`}>
                    {NO_BUTTON.verdict[price.verdict]}
                  </p>
                  <p className="mt-3 text-lead text-ink-muted">
                    {price.landing
                      ? priceLine(price.landing.pctOfUsual, price.landing.label)
                      : NO_BUTTON.beyondHorizon}
                  </p>

                  <ForecastStrip price={price} />

                  <div className="mt-7">
                    <div className="flex gap-2">
                      {NO_BUTTON.tones.map((t) => (
                        <button
                          key={t.key}
                          onClick={() => {
                            setTone(t.key as Tone);
                            setCopied(false);
                          }}
                          className={`flex-1 rounded-full border px-3 py-2 text-sm transition-colors ${
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
                      <p className="text-ink">{draft}</p>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(draft);
                        setCopied(true);
                      }}
                      className="mt-3 w-full rounded-full bg-clay-600 px-6 py-3.5 font-medium text-white transition-colors hover:bg-clay-500"
                    >
                      {copied ? NO_BUTTON.copied : NO_BUTTON.copyAction}
                    </button>

                    {/* The decision is the point, and it is worth keeping.
                        Both answers are recorded the same way. */}
                    <div className="mt-7 border-t border-hairline pt-5">
                      <p className="text-micro uppercase tracking-[0.08em] text-ink-faint">
                        {NO_BUTTON.decisionTitle}
                      </p>
                      <div className="mt-3 flex gap-2">
                        {(["yes", "no"] as const).map((d) => (
                          <button
                            key={d}
                            onClick={() => {
                              setDecided(d);
                              logAsk({
                                title: ASK_KINDS.find((k) => k.key === kind)!.label,
                                hours: ASK_WEIGHTS[heft].hours,
                                pct: price.landing?.pctOfUsual ?? 0,
                                weekLabel: price.landing?.label ?? "",
                                verdict: price.verdict,
                                decision: d,
                              });
                            }}
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
                        <p className="mt-3 text-sm text-ink-faint">{NO_BUTTON.logged}</p>
                      )}
                    </div>
                  </div>
                </Step>
              )}

              <button
                onClick={close}
                className="mt-5 w-full py-2 text-sm text-ink-faint transition-colors hover:text-ink-muted"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
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

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3.5 text-left transition-colors ${
        active ? "border-clay-600 bg-clay-100" : "border-hairline hover:bg-raised"
      }`}
    >
      {children}
    </button>
  );
}

function Next({ onClick, label = "Next" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="mt-6 w-full rounded-full bg-ink px-6 py-3.5 font-medium text-linen transition-opacity hover:opacity-90"
    >
      {label}
    </button>
  );
}

/** Four weeks ahead, with the ask shaded on top. The dashed line is your usual. */
function ForecastStrip({ price }: { price: ReturnType<typeof priceCommitment> }) {
  const max = Math.max(1.7, ...price.weeks.map((w) => w.ratioAfter));

  return (
    <div className="mt-6">
      <div className="relative flex h-32 items-end gap-3">
        <div
          className="absolute inset-x-0 border-t border-dashed border-ink-faint/60"
          style={{ bottom: `${(1 / max) * 100}%` }}
        >
          <span className="absolute -top-5 right-0 text-micro uppercase tracking-[0.08em] text-ink-faint">
            your usual
          </span>
        </div>

        {price.weeks.map((w) => (
          <div key={w.label} className="relative flex flex-1 flex-col justify-end">
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

      <div className="mt-2 flex gap-3">
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
