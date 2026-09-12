"use client";

import { motion, useReducedMotion } from "motion/react";
import type { BandKey } from "@/lib/engine/types";
import { CARRY_LABEL, TODAY } from "@/lib/copy";

const TONE: Record<BandKey, string> = {
  light: "bg-sage-700",
  usual: "bg-sage-700",
  busy: "bg-ember-700",
  heavy: "bg-amber-700",
  toomuch: "bg-rust-700",
};

/**
 * No number, no gauge, no percentage. A marker against a shaded band that
 * means "your usual". The whole point is that you can read it in half a
 * second without being graded.
 */
export function CarryBar({ ratio, band }: { ratio: number; band: BandKey }) {
  const still = useReducedMotion();
  // 0.5 .. 1.8 spans the visible track
  const pos = Math.min(Math.max((ratio - 0.5) / 1.3, 0.02), 0.98);
  const usualFrom = ((0.8 - 0.5) / 1.3) * 100;
  const usualTo = ((1.1 - 0.5) / 1.3) * 100;

  return (
    /* One graphic, one sentence.
       role="img" sits on the whole thing rather than on the track alone, so
       the "your usual" caption underneath is covered by the label instead of
       being read out on its own — two words that mean nothing by themselves.
       The band-specific sentence is ours; the line explaining what the shaded
       area is came from Thong's version and is the half a screen reader
       genuinely cannot infer. */
    <div
      className="w-full"
      role="img"
      aria-label={`${CARRY_LABEL[band]} ${TODAY.bandExplainer}`}
    >
      {/* The hairline is not decoration. On /compare the highlighted card is
          clay-tinted and the track's own warm fill vanishes into it, leaving
          the band and marker floating on nothing. */}
      <div className="relative h-12 w-full rounded-full border border-clay-600/30 bg-raised">
        {/* the comfortable band */}
        <div
          className="absolute inset-y-0 rounded-full bg-clay-500/35 ring-1 ring-inset ring-clay-600/35"
          style={{ left: `${usualFrom}%`, width: `${usualTo - usualFrom}%` }}
        />
        {/* where you are */}
        <motion.div
          className={`absolute top-1/2 h-9 w-2.5 -translate-y-1/2 rounded-full ring-2 ring-surface ${TONE[band]}`}
          initial={false}
          animate={{ left: `calc(${pos * 100}% - 5px)`, opacity: 1 }}
          transition={
            still
              ? { duration: 0 }
              : { type: "spring", stiffness: 120, damping: 20 }
          }
        />
      </div>
      <div className="mt-2 flex justify-center">
        <span
          className="text-micro uppercase tracking-[0.08em] text-ink-muted"
          style={{ marginLeft: `${(usualFrom + usualTo) / 2 - 50}%` }}
        >
          {TODAY.usualBandLabel}
        </span>
      </div>
    </div>
  );
}
