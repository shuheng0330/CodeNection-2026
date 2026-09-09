"use client";

import { motion, useReducedMotion } from "motion/react";
import type { BandKey } from "@/lib/engine/types";
import { BAND, TODAY } from "@/lib/copy";

const TONE: Record<BandKey, string> = {
  light: "bg-sage",
  usual: "bg-sage",
  busy: "bg-ember",
  heavy: "bg-amber",
  toomuch: "bg-rust",
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
    <div
      className="w-full"
      role="img"
      aria-label={TODAY.carryBarLabel(BAND[band].short)}
    >
      <div className="relative h-12 w-full rounded-full bg-raised">
        {/* the comfortable band */}
        <div
          className="absolute inset-y-0 rounded-full bg-clay-100"
          style={{ left: `${usualFrom}%`, width: `${usualTo - usualFrom}%` }}
        />
        {/* where you are */}
        <motion.div
          className={`absolute top-1/2 h-9 w-2.5 -translate-y-1/2 rounded-full ${TONE[band]}`}
          initial={still ? false : { left: "50%", opacity: 0 }}
          animate={{ left: `calc(${pos * 100}% - 5px)`, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
      <div className="mt-2 flex justify-center">
        <span
          className="text-micro uppercase tracking-[0.08em] text-ink-faint"
          style={{ marginLeft: `${(usualFrom + usualTo) / 2 - 50}%` }}
        >
          {TODAY.usualBandLabel}
        </span>
      </div>
    </div>
  );
}
