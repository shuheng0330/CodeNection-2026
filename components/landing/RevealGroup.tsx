"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useAnimate, useInView } from "motion/react";
import { spring } from "@/lib/motion";
import { useLandingReducedMotion } from "./useLandingReducedMotion";

export const landingEntrance = { distance: 12, opacity: 0.15, duration: 0.65, stagger: 0.15, threshold: 0.35 } as const;

/** Visible server markup; each content block owns its viewport entrance. */
export function RevealGroup({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "figure" }) {
  const [scope, animate] = useAnimate();
  const visible = useInView(scope, { amount: landingEntrance.threshold, once: true });
  const reduced = useLandingReducedMotion();
  const played = useRef(false);
  useEffect(() => {
    if (!visible || reduced === null || played.current) return;
    played.current = true;
    if (reduced) return;
    const items = Array.from((scope.current as HTMLElement).children) as HTMLElement[];
    const controls = items.flatMap((item, i) => [
      animate(item, { y: [landingEntrance.distance, 0] }, { ...spring.settle, delay: i * landingEntrance.stagger }),
      animate(item, { opacity: [landingEntrance.opacity, 1] }, { duration: landingEntrance.duration, delay: i * landingEntrance.stagger, ease: "easeOut" }),
    ]);
    const container = scope.current as HTMLElement;
    if (as === "figure") controls.push(animate(container, { opacity: [0.4, 1] }, { duration: 0.65, ease: "easeOut" }));
    return () => {
      controls.forEach(control => control.stop());
      items.forEach(item => { item.style.transform = "none"; item.style.opacity = "1"; });
      container.style.opacity = "1";
    };
  }, [visible, reduced, animate, scope, as]);
  const Tag = as;
  return <Tag ref={scope} className={className}>{children}</Tag>;
}
