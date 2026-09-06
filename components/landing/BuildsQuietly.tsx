"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { QUIETLY } from "@/lib/copy";

/** Scrolling literally fills in a month of someone's life, day by day.
 *  This section explains acute-vs-chronic without ever using either word. */
const DAYS = 28;
const HEIGHTS = [
  0.34, 0.41, 0.3, 0.52, 0.38, 0.22, 0.18, 0.44, 0.36, 0.48, 0.4, 0.55, 0.26, 0.2,
  0.5, 0.43, 0.58, 0.46, 0.62, 0.3, 0.24, 0.72, 0.68, 0.85, 0.79, 0.94, 0.66, 0.88,
];

export function BuildsQuietly() {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // annotated as string, not the literal union, so it is a MotionValue<string>
  const line = useTransform(scrollYProgress, (p): string =>
    p < 0.42 ? QUIETLY.a : p < 0.74 ? QUIETLY.b : QUIETLY.c,
  );

  return (
    <section ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-6">
        <div className="mx-auto w-full max-w-4xl">
          <div className="flex h-56 items-end justify-center gap-[3px] sm:gap-2">
            {HEIGHTS.map((h, i) => {
              const from = (i / DAYS) * 0.72;
              const to = ((i + 1) / DAYS) * 0.72;
              return <Bar key={i} h={h} from={from} to={to} recent={i >= DAYS - 7} progress={scrollYProgress} still={still} />;
            })}
          </div>

          <div className="mt-4 flex justify-center gap-8 text-micro uppercase tracking-[0.08em] text-ink-faint">
            <span>28 days ago</span>
            <span className="text-clay-600">the last 7</span>
          </div>

          <div className="mt-12 text-center">
            {still ? (
              <p className="font-display text-h1">{QUIETLY.c}</p>
            ) : (
              <motion.p className="font-display text-h1">{line}</motion.p>
            )}
            <p className="mt-4 text-lead text-ink-muted">{QUIETLY.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bar({
  h,
  from,
  to,
  recent,
  progress,
  still,
}: {
  h: number;
  from: number;
  to: number;
  recent: boolean;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  still: boolean | null;
}) {
  const scaleY = useTransform(progress, [from, to], [0.02, h]);
  return (
    <motion.div
      className={`w-full origin-bottom rounded-t-[3px] ${recent ? "bg-ember" : "bg-clay-100"}`}
      style={still ? { height: `${h * 100}%` } : { height: "100%", scaleY }}
    />
  );
}
