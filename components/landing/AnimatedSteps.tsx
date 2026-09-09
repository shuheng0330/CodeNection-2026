"use client";

import { useEffect, useRef } from "react";
import { useAnimate } from "motion/react";
import { HOW } from "@/lib/copy";
import { spring } from "@/lib/motion";
import { useLandingReducedMotion } from "./useLandingReducedMotion";
import styles from "./landing.module.css";

export function AnimatedSteps() {
  const [scope, animate] = useAnimate();
  const reduced = useLandingReducedMotion();
  const played = useRef(new Set<number>());
  useEffect(() => {
    if (reduced === null) return;
    const list = scope.current as HTMLOListElement;
    const items = Array.from(list.children) as HTMLLIElement[];
    const controls: ReturnType<typeof animate>[] = [];
    if (reduced) {
      items.forEach((_, i) => played.current.add(i));
      return;
    }
    const media = window.matchMedia("(min-width: 768px)");
    function play(index: number, delay = 0) {
      if (played.current.has(index)) return;
      played.current.add(index);
      Array.from(items[index].children).forEach((child, childIndex) => {
        const start = delay + childIndex * 0.12;
        controls.push(animate(child, { y: [12, 0] }, { ...spring.settle, delay: start }));
        controls.push(animate(child, { opacity: [0.15, 1] }, { duration: 0.65, delay: start, ease: "easeOut" }));
      });
    }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (media.matches && entry.target === list) items.forEach((_, i) => play(i, i * 0.18));
        if (!media.matches && entry.target !== list) play(items.indexOf(entry.target as HTMLLIElement));
      }
    }, { threshold: 0.35 });
    function observe() {
      observer.disconnect();
      if (media.matches) observer.observe(list);
      else items.forEach(item => observer.observe(item));
    }
    observe();
    media.addEventListener("change", observe);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", observe);
      controls.forEach(control => control.stop());
      items.flatMap(item => Array.from(item.children) as HTMLElement[]).forEach(item => { item.style.opacity = "1"; item.style.transform = "none"; });
    };
  }, [animate, reduced, scope]);
  return <ol ref={scope} className={styles.steps}>
    {HOW.points.map((point, i) => <li key={point.t}>
      <span className={styles.stepNumber} aria-hidden="true">0{i + 1}</span>
      <h3>{point.t}</h3><p>{point.d}</p>
    </li>)}
  </ol>;
}
