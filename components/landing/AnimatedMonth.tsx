"use client";

import { useEffect, useRef } from "react";
import { useAnimate, useInView, stagger } from "motion/react";
import { LANDING } from "@/lib/copy";
import { useLandingReducedMotion } from "./useLandingReducedMotion";
import styles from "./landing.module.css";

const HEIGHTS = [34,41,30,52,38,22,18,44,36,48,40,55,26,20,50,43,58,46,62,30,24,72,68,85,79,94,66,88];

export function AnimatedMonth() {
  const [scope, animate] = useAnimate();
  const visible = useInView(scope, { amount: 0.33, once: true });
  const reduced = useLandingReducedMotion();
  const played = useRef(false);
  useEffect(() => {
    if (!visible || reduced === null || played.current) return;
    played.current = true;
    if (reduced) return;
    const bars = Array.from((scope.current as HTMLElement).querySelectorAll<HTMLElement>("[data-bar]"));
    const controls = animate("[data-bar]", { scaleY: [0.08, 1] }, { duration: 0.45, delay: stagger(0.018), ease: "easeOut" });
    return () => {
      controls.stop();
      // Preference changes must leave a complete chart, not frozen partial bars.
      bars.forEach(bar => { bar.style.transform = "none"; });
    };
  }, [visible, reduced, animate, scope]);
  return <figure ref={scope} className={styles.month}>
    <div className={styles.bars} aria-hidden="true">
      {HEIGHTS.map((height, i) => <span data-bar key={i} style={{height: `${height}%`, transformOrigin: "bottom"}} className={i >= 21 ? styles.recentBar : styles.pastBar} />)}
    </div>
    <div className={styles.chartLabels} aria-hidden="true"><span>{LANDING.monthLabel}</span><span>{LANDING.weekLabel}</span></div>
    <figcaption>{LANDING.chartDescription}</figcaption>
  </figure>;
}
