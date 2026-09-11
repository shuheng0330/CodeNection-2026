"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarDays } from "lucide-react";
import { WEEK } from "@/lib/copy";
import { peakDayLoad, type DayLoad, type WeekAhead } from "@/lib/engine/horizon";
import type { LoadEvent } from "@/lib/engine/types";
import { MobileDisclosure } from "@/components/shared/MobileDisclosure";

/**
 * Four weeks on one shared scale, with one inspectable day.
 *
 * The interface takes the calculated weeks and their source events. Selection,
 * defaults, labels and detail presentation stay inside this module so the page
 * does not need to coordinate chart state.
 */
export function WeekPanels({
  weeks,
  events,
}: {
  weeks: WeekAhead[];
  events: LoadEvent[];
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // Track mobile expanded state per week label. Local state for current page visit.
  const [openWeeks, setOpenWeeks] = useState<Record<string, boolean>>({});

  const peak = peakDayLoad(weeks);
  const heaviestWeek = weeks.reduce<WeekAhead | null>(
    (best, week) => (!best || week.load > best.load ? week : best),
    null,
  );
  const days = useMemo(() => weeks.flatMap((week) => week.days), [weeks]);

  const defaultDay = useMemo(() => {
    const upcoming = days.filter((day) => !day.past);
    const candidates = upcoming.length > 0 ? upcoming : days;
    return candidates.reduce<DayLoad | null>(
      (best, day) => (!best || day.load > best.load ? day : best),
      null,
    );
  }, [days]);

  const selectedDay =
    days.find((day) => day.date === selectedDate) ?? defaultDay;
  const selectedEvents = useMemo(
    () =>
      selectedDay
        ? events
            .filter((event) => event.date === selectedDay.date)
            .sort((a, b) => b.hours - a.hours || a.title.localeCompare(b.title))
        : [],
    [events, selectedDay],
  );

  const selectedWeek = useMemo(
    () =>
      selectedDay
        ? weeks.find((w) => w.days.some((d) => d.date === selectedDay.date)) ??
          null
        : null,
    [weeks, selectedDay],
  );

  const isSelectedWeekOpen = selectedWeek
    ? Boolean(openWeeks[selectedWeek.label])
    : false;

  const handleShowSelectedWeek = () => {
    if (selectedWeek) {
      setOpenWeeks((prev) => ({
        ...prev,
        [selectedWeek.label]: true,
      }));
    }
  };

  if (!selectedDay) {
    return (
      <div className="rounded-3xl border border-hairline bg-surface p-6 text-ink-muted">
        {WEEK.noHorizon}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-h2">{WEEK.livingTitle}</h2>
          <p className="mt-2 text-ink-muted">{WEEK.livingLead}</p>
        </div>
        <p className="text-micro uppercase tracking-[0.08em] text-ink-faint">
          {WEEK.sharedScale}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {weeks.map((week) => (
          <Panel
            key={week.label}
            week={week}
            peak={peak}
            isPeak={week.label === heaviestWeek?.label}
            selectedDate={selectedDay.date}
            isOpen={Boolean(openWeeks[week.label])}
            onToggle={(next) =>
              setOpenWeeks((prev) => ({ ...prev, [week.label]: next }))
            }
            onSelect={setSelectedDate}
          />
        ))}
      </div>

      <DayDetails
        day={selectedDay}
        events={selectedEvents}
        selectedWeekLabel={selectedWeek?.label ?? null}
        isSelectedWeekOpen={isSelectedWeekOpen}
        onShowSelectedWeek={handleShowSelectedWeek}
      />
    </div>
  );
}
function Panel({
  week,
  peak,
  isPeak,
  selectedDate,
  isOpen,
  onToggle,
  onSelect,
}: {
  week: WeekAhead;
  peak: number;
  isPeak: boolean;
  selectedDate: string;
  isOpen: boolean;
  onToggle: (next: boolean) => void;
  onSelect: (date: string) => void;
}) {
  const containsSelection = week.days.some((day) => day.date === selectedDate);
  const startDate = parseISO(week.start);
  const endDate = parseISO(week.end);
  const dateRange = `${format(startDate, "d MMM")} – ${format(endDate, "d MMM")}`;

  return (
    <section
      aria-label={WEEK.weekSummary(week.label, week.hours)}
      className={`overflow-hidden rounded-3xl border transition-colors md:p-5 ${
        containsSelection
          ? "border-dusk/45 bg-dusk-100/35"
          : isPeak
            ? "border-clay-600/40 bg-clay-100/40"
            : "border-hairline bg-surface"
      }`}
    >
      <MobileDisclosure
        isOpen={isOpen}
        onToggle={onToggle}
        buttonClassName="px-5 py-4 hover:bg-black/[0.02]"
        title={
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-micro uppercase tracking-[0.08em] text-ink-faint">
                {week.label}
              </span>
              {containsSelection && (
                <span className="rounded-full bg-dusk/15 px-2 py-0.5 text-[10px] font-medium text-dusk">
                  Selected
                </span>
              )}
              {isPeak && (
                <span className="rounded-full bg-clay-500/15 px-2 py-0.5 text-[10px] font-medium text-clay-700">
                  Heaviest
                </span>
              )}
            </div>
            <span className="mt-0.5 text-xs text-ink-muted">{dateRange}</span>
          </div>
        }
        metadata={
          <span className="tnum font-medium text-sm text-ink-muted">
            {WEEK.hoursLabel(week.hours)}
          </span>
        }
      >
        <div className="px-5 pb-5 pt-1 md:p-0">
          {/* Desktop header (hidden on mobile where MobileDisclosure renders its own toggle button) */}
          <div className="hidden items-baseline justify-between gap-3 md:flex">
            <div className="flex items-center gap-2">
              <p className="text-micro uppercase tracking-[0.08em] text-ink-faint">
                {week.label}
              </p>
              {containsSelection && (
                <span className="rounded-full bg-dusk/15 px-2 py-0.5 text-[10px] font-medium text-dusk">
                  Selected
                </span>
              )}
            </div>
            <p className="tnum text-sm text-ink-muted">
              {WEEK.hoursLabel(week.hours)}
            </p>
          </div>

          <div
            className="mt-4 grid h-28 grid-cols-7 items-end gap-0 sm:gap-1"
            role="group"
            aria-label={WEEK.daysLabel(week.label)}
          >
            {week.days.map((day) => (
              <DayButton
                key={day.date}
                day={day}
                peak={peak}
                selected={day.date === selectedDate}
                emphasized={isPeak}
                onSelect={onSelect}
              />
            ))}
          </div>

          <p className="mt-4 text-sm text-ink-muted">
            {isPeak ? WEEK.heaviestWeek : WEEK.selectHint}
          </p>
        </div>
      </MobileDisclosure>
    </section>
  );
}
function DayButton({
  day,
  peak,
  selected,
  emphasized,
  onSelect,
}: {
  day: DayLoad;
  peak: number;
  selected: boolean;
  emphasized: boolean;
  onSelect: (date: string) => void;
}) {
  const date = parseISO(day.date);
  const barHeight = Math.max(4, (day.load / peak) * 100);

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={WEEK.dayLabel(
        format(date, "EEEE, d MMMM"),
        day.hours,
        day.past,
      )}
      onClick={() => onSelect(day.date)}
      className={`group flex min-h-24 min-w-0 flex-col items-center justify-end gap-1 rounded-xl px-0.5 pb-1 transition-colors ${
        selected
          ? "bg-surface text-dusk shadow-soft ring-2 ring-dusk/50"
          : "text-ink-muted hover:bg-surface/75 hover:text-ink"
      }`}
    >
      <span className="flex h-16 w-full items-end justify-center" aria-hidden>
        <span
          className={`w-full max-w-4 rounded-t-[3px] transition-colors ${
            day.past
              ? "bg-hairline"
              : selected
                ? "bg-dusk"
                : emphasized
                  ? "bg-clay-600"
                  : "bg-clay-500/60"
          }`}
          style={{ height: `${barHeight}%` }}
        />
      </span>
      <span className="text-[10px] font-medium" aria-hidden>
        {format(date, "EEEEE")}
      </span>
      <span className="tnum text-[10px]" aria-hidden>
        {format(date, "d")}
      </span>
    </button>
  );
}

function DayDetails({
  day,
  events,
  selectedWeekLabel,
  isSelectedWeekOpen,
  onShowSelectedWeek,
}: {
  day: DayLoad;
  events: LoadEvent[];
  selectedWeekLabel: string | null;
  isSelectedWeekOpen: boolean;
  onShowSelectedWeek: () => void;
}) {
  const date = format(parseISO(day.date), "EEEE, d MMMM");

  return (
    <section
      aria-live="polite"
      aria-label={WEEK.dayDetailsLabel(date)}
      className="mt-6 rounded-3xl border border-dusk/25 bg-surface p-5 shadow-soft sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-micro uppercase tracking-[0.08em] text-dusk">
              {day.past ? WEEK.alreadyCarried : WEEK.selectedDay}
            </p>
            {/* Show selected week action on mobile when that week is collapsed */}
            {selectedWeekLabel && !isSelectedWeekOpen && (
              <button
                type="button"
                onClick={onShowSelectedWeek}
                className="md:hidden text-xs font-medium text-dusk underline underline-offset-2 transition-colors hover:text-ink"
              >
                Show selected week
              </button>
            )}
          </div>
          <h3 className="mt-2 font-display text-2xl">{date}</h3>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-dusk-100 px-3 py-2 text-sm text-dusk">
          <CalendarDays aria-hidden size={16} strokeWidth={1.8} />
          <span className="tnum">{WEEK.hoursLabel(day.hours)}</span>
        </div>
      </div>

      {events.length === 0 ? (
        <p className="mt-6 text-ink-muted">{WEEK.dayEmpty}</p>
      ) : (
        <ul className="mt-6 grid gap-2">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex min-w-0 items-start justify-between gap-4 rounded-2xl border border-hairline bg-linen/60 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink">{event.title}</p>
                <p className="mt-1 text-sm text-ink-muted">
                  {WEEK.categories[event.category]}
                </p>
              </div>
              <p className="tnum shrink-0 text-sm text-ink-muted">
                {WEEK.eventHours(event.hours)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
