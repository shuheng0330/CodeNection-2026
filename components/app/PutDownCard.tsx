import type { LoadEvent } from "@/lib/engine/types";
import { TODAY } from "@/lib/copy";

/** Exactly one recommendation. Never a list — the restraint IS the product.
 *  A ranked list of five things to drop is just another backlog. */
export function PutDownCard({ event }: { event: LoadEvent | null }) {
  if (!event) {
    return (
      <div className="rounded-3xl border border-hairline bg-surface p-6">
        <p className="text-ink-muted">{TODAY.nothingToPutDown}</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-dusk/25 bg-dusk-100/60 p-6 shadow-soft">
      <p className="text-micro uppercase tracking-[0.08em] text-dusk">
        {TODAY.putDownTitle}
      </p>
      <p className="mt-3 font-display text-2xl text-ink">{event.title}</p>
      <p className="mt-2 text-ink-muted">{TODAY.putDownHint}</p>
    </div>
  );
}
