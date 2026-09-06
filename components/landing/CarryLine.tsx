"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { HERO } from "@/lib/copy";
import { spring } from "@/lib/motion";

/**
 * A rope under weight.
 *
 * Everything is driven by ONE spring on a single number (total load), which
 * feeds a quadratic bezier. The spring is deliberately underdamped, so the
 * rope overshoots and wobbles when something lands on it — that one detail is
 * most of why this reads as physical rather than merely animated.
 *
 * The weights are the pitch: a judge reads five chips and understands the
 * product before anyone says a word.
 */

const X0 = 40;
const X1 = 760;
const Y = 110;
/** cross this much sag and you are past your usual */
const USUAL = 55;

interface Weight {
  id: string;
  t: number;
  label: string;
  sub: string;
  load: number;
  /** the one Pikul says to put down */
  removable?: boolean;
}

const WEIGHTS: Weight[] = [
  { id: "ds", t: 0.16, label: "Data Structures", sub: "assignment", load: 14 },
  { id: "commute", t: 0.34, label: "Commute", sub: "90 min a day", load: 10 },
  { id: "group", t: 0.52, label: "Group project", sub: "merge conflicts", load: 16 },
  { id: "wedding", t: 0.7, label: "Cousin's wedding", sub: "Melaka", load: 12 },
  { id: "shift", t: 0.87, label: "Cover Danish's shift", sub: "Saturday, 8 hours", load: 26, removable: true },
];

const TOTAL = WEIGHTS.reduce((s, w) => s + w.load, 0);

/** B(t) for the quadratic bezier, so weights ride the rope instead of
 *  floating over it. They slide inward as it deepens — an emergent effect
 *  that costs nothing and looks deliberate. */
function pointAt(t: number, sag: number) {
  const cy = Y + sag * 2;
  return {
    x: (1 - t) ** 2 * X0 + 2 * (1 - t) * t * ((X0 + X1) / 2) + t ** 2 * X1,
    y: (1 - t) ** 2 * Y + 2 * (1 - t) * t * cy + t ** 2 * Y,
  };
}

export function CarryLine() {
  const still = useReducedMotion();
  const [stage, setStage] = useState(0); // 0..WEIGHTS.length = loading, +1 = relief
  const load = useMotionValue(0);
  const sag = useSpring(load, spring.rope);

  const d = useTransform(sag, (s) => {
    const cy = Y + s * 2;
    return `M ${X0} ${Y} Q ${(X0 + X1) / 2} ${cy} ${X1} ${Y}`;
  });
  const stroke = useTransform(sag, [0, USUAL, TOTAL], ["#E08D3C", "#E08D3C", "#B4462F"]);
  const strokeWidth = useTransform(sag, [0, TOTAL], [3, 4.5]);

  const relieved = stage > WEIGHTS.length;
  const shown = relieved ? WEIGHTS.filter((w) => !w.removable) : WEIGHTS.slice(0, stage);
  const currentLoad = shown.reduce((s, w) => s + w.load, 0);
  const over = currentLoad > USUAL;

  useEffect(() => {
    if (still) return;
    load.set(currentLoad);
  }, [currentLoad, load, still]);

  useEffect(() => {
    if (still) return;
    const last = WEIGHTS.length + 1;
    const delay = stage === 0 ? 700 : stage === WEIGHTS.length ? 1900 : stage === last ? 2600 : 620;
    const id = setTimeout(() => setStage((s) => (s >= last ? 0 : s + 1)), delay);
    return () => clearTimeout(id);
  }, [stage, still]);

  // reduced motion: render the settled "over your usual" state, no loop
  const staticSag = still ? TOTAL : 0;
  const staticShown = still ? WEIGHTS : shown;

  const caption = still
    ? HERO.heavyCaption
    : relieved
      ? HERO.reliefCaption
      : over
        ? HERO.heavyCaption
        : HERO.restingCaption;

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 800 300"
        className="w-full overflow-visible"
        role="img"
        aria-label="A rope carrying five commitments, sagging past a line marked your usual, then springing back when one is removed."
      >
        {/* the line marked "your usual" */}
        <line
          x1={X0}
          y1={Y + USUAL}
          x2={X1}
          y2={Y + USUAL}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeDasharray="6 7"
          className="text-ink-faint/50"
        />
        <text
          x={X1}
          y={Y + USUAL - 10}
          textAnchor="end"
          className="fill-ink-faint text-[13px] tracking-[0.08em] uppercase"
        >
          {HERO.usualLabel}
        </text>

        {/* anchors */}
        <circle cx={X0} cy={Y} r={5} className="fill-ink/25" />
        <circle cx={X1} cy={Y} r={5} className="fill-ink/25" />

        {/* the rope */}
        {still ? (
          <path
            d={`M ${X0} ${Y} Q ${(X0 + X1) / 2} ${Y + staticSag * 2} ${X1} ${Y}`}
            fill="none"
            stroke="#B4462F"
            strokeWidth={4.5}
            strokeLinecap="round"
          />
        ) : (
          <motion.path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        )}

        {/* what's hanging on it */}
        <AnimatePresence>
          {staticShown.map((w) => (
            <WeightCard key={w.id} weight={w} sag={sag} still={still} staticSag={staticSag} />
          ))}
        </AnimatePresence>
      </svg>

      <div className="mt-2 flex h-7 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={caption}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className={`text-lead font-display ${
              caption === HERO.reliefCaption ? "text-dusk" : over || still ? "text-clay-600" : "text-ink-muted"
            }`}
          >
            {caption}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function WeightCard({
  weight,
  sag,
  still,
  staticSag,
}: {
  weight: Weight;
  sag: ReturnType<typeof useSpring>;
  still: boolean | null;
  staticSag: number;
}) {
  const x = useTransform(sag, (s) => pointAt(weight.t, s).x);
  const y = useTransform(sag, (s) => pointAt(weight.t, s).y);
  const p = pointAt(weight.t, staticSag);

  const w = 150;
  const h = 46;

  return (
    <motion.g
      initial={still ? false : { opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -70, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
      transition={spring.settle}
      style={still ? { x: p.x, y: p.y } : { x, y }}
    >
      {/* hanger */}
      <line x1={0} y1={0} x2={0} y2={22} stroke="currentColor" strokeWidth={1.5} className="text-ink/25" />
      <g transform={`translate(${-w / 2}, 22)`}>
        <rect
          width={w}
          height={h}
          rx={12}
          className="fill-surface stroke-hairline"
          strokeWidth={1}
          style={{ filter: "drop-shadow(0 6px 14px rgb(43 33 28 / 0.10))" }}
        />
        <text x={12} y={19} className="fill-ink text-[13px] font-medium">
          {weight.label}
        </text>
        <text x={12} y={35} className="fill-ink-faint text-[11px]">
          {weight.sub}
        </text>
      </g>
    </motion.g>
  );
}
