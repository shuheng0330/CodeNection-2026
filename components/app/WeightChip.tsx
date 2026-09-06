import type { LoadEvent } from "@/lib/engine/types";

const CATEGORY_LABEL: Record<LoadEvent["category"], string> = {
  class: "Class",
  assignment: "Coursework",
  shift: "Work",
  commute: "Travel",
  family: "Family",
  social: "Social",
  club: "Club",
  admin: "Errands",
};

export function WeightChip({ event }: { event: LoadEvent }) {
  return (
    <div className="flex items-baseline justify-between gap-4 rounded-2xl border border-hairline bg-surface px-4 py-3">
      <div className="min-w-0">
        <p className="truncate font-medium text-ink">{event.title}</p>
        <p className="text-sm text-ink-faint">{CATEGORY_LABEL[event.category]}</p>
      </div>
      <p className="tnum shrink-0 text-sm text-ink-muted">
        {event.hours < 1 ? "under an hour" : `${Math.round(event.hours)}h`}
      </p>
    </div>
  );
}
