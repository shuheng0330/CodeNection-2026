"use client";

import { motion, useReducedMotion } from "motion/react";
import { stagger } from "@/lib/motion";

/** Word-by-word entrance. The blur is the part that reads as premium —
 *  a plain fade-up is the default everyone ships. */
export function SplitText({
  text,
  className,
  accent,
  delay = 0,
}: {
  text: string;
  className?: string;
  /** one word rendered in clay with a drawn underline */
  accent?: string;
  delay?: number;
}) {
  const still = useReducedMotion();
  const words = text.split(" ");

  if (still) return <span className={className}>{text}</span>;

  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="shown"
      transition={{ staggerChildren: stagger.words, delayChildren: delay }}
    >
      {words.map((w, i) => {
        const isAccent = accent && w.replace(/[.,]/g, "") === accent;
        return (
          <motion.span
            key={`${w}-${i}`}
            className="inline-block whitespace-pre"
            variants={{
              hidden: { opacity: 0, y: "0.6em", filter: "blur(8px)" },
              shown: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            {isAccent ? (
              <span className="relative text-clay-600">
                {w}
                <motion.svg
                  aria-hidden
                  viewBox="0 0 120 10"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-[0.18em] w-full overflow-visible"
                >
                  <motion.path
                    d="M2 6 C 30 2, 90 2, 118 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    className="text-clay-500"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, delay: delay + 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.svg>
              </span>
            ) : (
              w
            )}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        );
      })}
    </motion.span>
  );
}
