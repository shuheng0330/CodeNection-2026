"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
} from "date-fns";
import { ADD, DATE_FIELD } from "@/lib/copy";
import { clampISO, fillByDay, monthWeeks, type DayFill } from "@/lib/calendar";
import { toISODate } from "@/lib/engine/dates";
import { spring } from "@/lib/motion";
import type { LoadEvent } from "@/lib/engine/types";

/**
 * A date field that belongs to this product.
 *
 * `<input type="date">` is correct and free and its calendar cannot be
 * styled: the popup is painted by the browser rather than by the page, so
 * `::-webkit-calendar-picker-indicator` reaches the little icon and nothing
 * else. On warm paper the result is a white panel with a system font and a
 * blue selection, which reads as a piece of a different application at the
 * exact moment somebody is deciding something.
 *
 * So the calendar is ours. Two things it does that the native one cannot:
 * the days already carrying something are marked, because choosing a date
 * for a new commitment without seeing what is already on it is choosing
 * blind; and the range this screen can actually price is shown rather than
 * silently enforced.
 *
 * The panel expands in the flow rather than floating. Both sheets scroll
 * inside `overflow-y-auto`, which clips absolutely positioned children and
 * scrolls them away from their trigger, and this repository has already lost
 * an afternoon to a sheet being painted over by a stacking context.
 */
export function DateField({
  label,
  guessed,
  value,
  min,
  max,
  today,
  events,
  invalid,
  describedBy,
  onChange,
  children,
}: {
  label: string;
  guessed: boolean;
  value: string;
  min: string;
  max?: string;
  /** the day the app is treating as today, which on a seeded demo is not
   *  the day the machine thinks it is */
  today: string;
  events: LoadEvent[];
  invalid?: boolean;
  describedBy?: string;
  onChange: (date: string) => void;
  /** whatever shares the row with this field. It belongs to this component
   *  because the calendar has to come after it in the DOM: a panel that
   *  opens between two fields pushes the second one below itself, and the
   *  reading order stops matching the order things were asked in. */
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const labelId = useId();
  const panelId = useId();

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) trigger.current?.focus();
  };

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 items-start gap-3">
        <div className="min-w-0">
          <span className="mb-2 flex items-baseline gap-2">
            <span
              id={labelId}
              className="text-micro uppercase tracking-[0.08em] text-ink-faint"
            >
              {label}
            </span>
            {guessed && (
              <span className="rounded-full bg-raised px-2 py-0.5 text-[11px] text-ink-faint">
                {ADD.guessed}
              </span>
            )}
          </span>
          <button
            ref={trigger}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={open ? panelId : undefined}
            aria-labelledby={`${labelId} ${panelId}-value`}
            aria-describedby={describedBy}
            className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-left transition-colors ${
              open
                ? "border-clay-500 bg-clay-100/40"
                : invalid
                  ? "border-rust/60"
                  : "border-hairline hover:border-clay-500/50"
            }`}
          >
            <span id={`${panelId}-value`} className="truncate">
              {/* Half a 320px sheet leaves about seventy pixels for this, and
                  "Fri, 18 Sep" truncated to "Fri, 18 …" loses the month —
                  the one thing the field exists to state. The weekday is the
                  part worth dropping. Only the visible span reaches the
                  accessible name, so each width is read out whole. */}
              <span className="min-[380px]:hidden">{readableDate(value, false)}</span>
              <span className="hidden min-[380px]:inline">{readableDate(value, true)}</span>
            </span>
            <CalendarGlyph open={open} />
          </button>
        </div>
        {children}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <CalendarPanel
            id={panelId}
            value={value}
            min={min}
            max={max}
            today={today}
            events={events}
            onPick={(date) => {
              onChange(date);
              close(true);
            }}
            onDismiss={() => close(true)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/** "Fri, 18 Sep" beats "2026-09-18" for the one glance this field usually
 *  gets, and an unreadable value stays visible rather than being hidden. */
function readableDate(iso: string, weekday: boolean): string {
  const d = iso ? parseISO(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return iso || "—";
  return format(d, weekday ? "EEE, d MMM" : "d MMM");
}

function CalendarGlyph({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`size-5 shrink-0 transition-colors ${open ? "text-clay-600" : "text-ink-faint"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <rect x="2.75" y="4.25" width="14.5" height="13" rx="3" />
      <path d="M2.75 8.25h14.5M6.75 2.75v3M13.25 2.75v3" />
    </svg>
  );
}

function CalendarPanel({
  id,
  value,
  min,
  max,
  today,
  events,
  onPick,
  onDismiss,
}: {
  id: string;
  value: string;
  min: string;
  max?: string;
  today: string;
  events: LoadEvent[];
  onPick: (date: string) => void;
  onDismiss: () => void;
}) {
  const still = useReducedMotion();
  const grid = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const captionId = useId();

  // Where the arrow keys are, which is not the same as what is chosen. An
  // unreadable or out-of-range value still has to leave the keyboard
  // somewhere sensible, so it falls back to the first day that can be picked.
  const [cursor, setCursor] = useState(() => clampISO(value || min, min, max));
  const month = startOfMonth(parseISO(cursor));

  const committed = fillByDay(events);

  // Focus follows the cursor, which is what makes an arrow key announce the
  // day it landed on rather than moving a highlight in silence. It runs on
  // open too: a calendar you have to tab into before you can use it has
  // quietly excluded everyone not holding a mouse.
  useEffect(() => {
    grid.current?.querySelector<HTMLButtonElement>('[data-cursor="true"]')?.focus();
  }, [cursor]);

  const step = (days: number) => {
    setCursor((c) => clampISO(toISODate(addDays(parseISO(c), days)), min, max));
  };

  const stepMonth = (months: number) => {
    setCursor((c) => clampISO(toISODate(addMonths(parseISO(c), months)), min, max));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const moves: Record<string, () => void> = {
      ArrowLeft: () => step(-1),
      ArrowRight: () => step(1),
      ArrowUp: () => step(-7),
      ArrowDown: () => step(7),
      PageUp: () => stepMonth(-1),
      PageDown: () => stepMonth(1),
      Home: () => setCursor(clampISO(toISODate(startOfMonth(parseISO(cursor))), min, max)),
      End: () => setCursor(clampISO(toISODate(endOfMonth(parseISO(cursor))), min, max)),
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    move();
  };

  const weeks = monthWeeks(month);

  const prevDisabled = toISODate(endOfMonth(addMonths(month, -1))) < min;
  const nextDisabled = max !== undefined && toISODate(startOfMonth(addMonths(month, 1))) > max;

  return (
    <motion.div
      ref={panel}
      id={id}
      role="group"
      aria-label={DATE_FIELD.legend}
      initial={still ? { opacity: 0 } : { opacity: 0, height: 0 }}
      animate={still ? { opacity: 1 } : { opacity: 1, height: "auto" }}
      exit={still ? { opacity: 0 } : { opacity: 0, height: 0 }}
      transition={still ? { duration: 0.15, ease: "linear" } : spring.ui}
      // Focusing a day scrolls it into view, but that happens while the panel
      // is still animating open from zero height, so on a phone the calendar
      // settles below the fold behind the sticky footer and looks broken.
      onAnimationComplete={() =>
        panel.current?.scrollIntoView({ block: "center", behavior: still ? "auto" : "smooth" })
      }
      onKeyDown={(e) => {
        // Escape puts the calendar away and stops there. Letting it reach the
        // sheet would throw away the whole request because somebody wanted to
        // close a date picker.
        if (e.key !== "Escape") return;
        e.stopPropagation();
        onDismiss();
      }}
      className="col-span-2 overflow-hidden"
    >
      <div className="mt-1 rounded-[20px] border border-hairline bg-linen p-3 shadow-soft">
        <div className="flex items-center justify-between gap-2">
          <MonthStep
            direction={-1}
            disabled={prevDisabled}
            label={DATE_FIELD.previousMonth}
            onClick={() => stepMonth(-1)}
          />
          <p
            id={captionId}
            aria-live="polite"
            className="font-display text-lg text-ink"
          >
            {format(month, "MMMM yyyy")}
          </p>
          <MonthStep
            direction={1}
            disabled={nextDisabled}
            label={DATE_FIELD.nextMonth}
            onClick={() => stepMonth(1)}
          />
        </div>

        {/* Every cell speaks its own weekday, so the initials are for the
            eye only and would otherwise be read out twice per row. */}
        <div aria-hidden="true" className="mt-2 grid grid-cols-7">
          {DATE_FIELD.weekdayInitials.map((initial, i) => (
            <span
              key={DATE_FIELD.weekdayNames[i]}
              className="pb-1 text-center text-[11px] uppercase tracking-[0.08em] text-ink-faint"
            >
              {initial}
            </span>
          ))}
        </div>

        <div ref={grid} role="grid" aria-labelledby={captionId} onKeyDown={onKeyDown}>
          {weeks.map((week) => (
            <div key={toISODate(week[0])} role="row" className="grid grid-cols-7">
              {week.map((day) => {
                const iso = toISODate(day);
                const blocked = iso < min || (max !== undefined && iso > max);
                return (
                  <Day
                    key={iso}
                    iso={iso}
                    day={day}
                    outside={!isSameMonth(day, month)}
                    blocked={blocked}
                    fill={committed.get(iso)}
                    selected={iso === value}
                    today={iso === today}
                    cursor={iso === cursor}
                    onPick={onPick}
                    onFocus={() => setCursor(iso)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 border-t border-hairline pt-2">
          <p className="text-[11px] text-ink-faint">{DATE_FIELD.hint}</p>
          <button
            type="button"
            disabled={today < min || (max !== undefined && today > max)}
            onClick={() => onPick(today)}
            className="min-h-11 shrink-0 rounded-full px-3 text-sm text-clay-600 underline-offset-4 transition-colors hover:underline disabled:text-ink-faint disabled:no-underline"
          >
            {DATE_FIELD.today}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function MonthStep({
  direction,
  disabled,
  label,
  onClick,
}: {
  direction: 1 | -1;
  disabled: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-11 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-raised hover:text-ink disabled:text-ink-faint/50 disabled:hover:bg-transparent"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={direction === -1 ? "M12.5 4.5 7 10l5.5 5.5" : "M7.5 4.5 13 10l-5.5 5.5"} />
      </svg>
    </button>
  );
}

function Day({
  iso,
  day,
  outside,
  blocked,
  fill,
  selected,
  today,
  cursor,
  onPick,
  onFocus,
}: {
  iso: string;
  day: Date;
  outside: boolean;
  blocked: boolean;
  fill: DayFill | undefined;
  selected: boolean;
  today: boolean;
  cursor: boolean;
  onPick: (iso: string) => void;
  onFocus: () => void;
}) {
  // Spoken as one sentence, because a screen reader landing on a bare "18"
  // in a grid learns nothing about whether the day is free.
  const spoken = [
    format(day, "EEEE d MMMM yyyy"),
    blocked
      ? DATE_FIELD.outOfRange
      : fill
        ? DATE_FIELD.alreadyOn(fill.count)
        : DATE_FIELD.nothingOn,
  ].join(", ");

  return (
    <div role="gridcell" aria-selected={selected} className="grid place-items-center">
      <button
        type="button"
        data-cursor={cursor || undefined}
        tabIndex={cursor ? 0 : -1}
        disabled={blocked}
        aria-label={spoken}
        aria-current={today ? "date" : undefined}
        onClick={() => onPick(iso)}
        onFocus={onFocus}
        className={`relative grid h-11 w-full place-items-center rounded-xl text-sm tabular-nums transition-colors ${
          selected
            ? "bg-clay-600 font-medium text-white"
            : blocked
              ? "text-ink-faint/40"
              : outside
                ? "text-ink-faint hover:bg-raised"
                : "text-ink hover:bg-raised"
        } ${today && !selected ? "bg-clay-100 font-medium text-clay-700" : ""}`}
      >
        {format(day, "d")}
        {fill && !blocked && (
          <span
            aria-hidden="true"
            className={`absolute bottom-1 h-1 rounded-full ${selected ? "bg-white/70" : "bg-clay-500"}`}
            style={{
              width: `${Math.min(18, 5 + fill.hours * 1.6)}px`,
              opacity: selected ? 1 : Math.min(1, 0.35 + fill.hours / 12),
            }}
          />
        )}
      </button>
    </div>
  );
}
