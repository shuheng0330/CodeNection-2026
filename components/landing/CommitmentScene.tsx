"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useInView, useSpring, useTransform, type MotionValue, type MotionStyle } from "motion/react";
import { LANDING } from "@/lib/copy";
import { spring } from "@/lib/motion";
import { useLandingReducedMotion } from "./useLandingReducedMotion";
import { storyFrame, STORY_DURATIONS } from "./ropeMotion";
import styles from "./landing.module.css";

function subscribeVisibility(notify: () => void) {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
}
const visibleSnapshot = () => document.visibilityState === "visible";
const serverVisible = () => false;

export function CommitmentScene() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const reduced = useLandingReducedMotion();
  const tabVisible = useSyncExternalStore(subscribeVisibility, visibleSnapshot, serverVisible);
  const [paused, setPaused] = useState(false);
  const [stage, setStage] = useState(0);
  const remaining = useRef<number>(STORY_DURATIONS[0]);
  const running = reduced === false && inView && tabVisible && !paused;
  const frame = storyFrame(reduced === null || reduced ? 4 : stage);
  const sag = useSpring(86, spring.rope);
  const path = useTransform(sag, value => `M 0 28 Q 500 ${28 + value * 2} 1000 28`);

  useEffect(() => {
    if (reduced) { sag.jump(86); return; }
    if (!running) { sag.stop(); return; }
    sag.set(frame.sag);
    const started = performance.now();
    let fired = false;
    const timer = setTimeout(() => {
      fired = true;
      const next = (stage + 1) % STORY_DURATIONS.length;
      remaining.current = STORY_DURATIONS[next];
      setStage(next);
    }, remaining.current);
    return () => {
      clearTimeout(timer);
      if (!fired) remaining.current = Math.max(0, remaining.current - (performance.now() - started));
      sag.stop();
    };
  }, [running, reduced, stage, frame.sag, sag]);

  return <figure ref={ref} className={styles.wideScene} aria-labelledby="scene-caption" data-stage={stage} data-running={running}>
    <div className={styles.sceneTop}><span>{LANDING.sceneTitle}</span><span>{LANDING.example}</span></div>
    <div className={styles.hangingStage}>
      <svg aria-hidden="true" className={styles.wideRope} viewBox="0 0 1000 200" preserveAspectRatio="none">
        <motion.path d={path} fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" />
      </svg>
      {LANDING.commitments.map((item, index) => <HangingCard key={item.title} index={index} sag={sag} active={index < frame.count} released={frame.released && index === 3} running={running} reduced={!!reduced} item={item} />)}
    </div>
    <figcaption id="scene-caption" className={styles.wideCaption}>{frame.released ? LANDING.released : LANDING.sceneCaption}</figcaption>
    <div className={styles.playbackSlot}>
      {reduced === false && <button type="button" className={styles.playback} onClick={() => setPaused(value => !value)}>{paused ? LANDING.resume : LANDING.pause}</button>}
    </div>
  </figure>;
}

function HangingCard({ index, sag, active, released, running, reduced, item }: {
  index: number; sag: MotionValue<number>; active: boolean; released: boolean; running: boolean; reduced: boolean;
  item: (typeof LANDING.commitments)[number];
}) {
  const t = (index + 0.5) / 4;
  const desktopY = useTransform(sag, value => 28 + 4 * t * (1 - t) * value);
  const mobileY = useTransform(sag, value => 28 + 0.75 * value);
  const lift = useSpring(0, spring.settle);
  const target = released ? -30 : active ? 0 : -12;
  useEffect(() => {
    if (reduced) lift.jump(0);
    else if (running) lift.set(target);
    else lift.stop();
    return () => lift.stop();
  }, [running, reduced, target, lift]);
  return <motion.div className={`${styles.hangingAnchor} ${styles[`anchor${index}`]}`} style={{ "--desktop-y": desktopY, "--mobile-y": mobileY } as MotionStyle}>
    <motion.div style={{ y: lift }}>
      <span className={styles.hanger} aria-hidden="true" />
      <div className={`${styles.hangingCard} ${index === 3 ? styles.shiftCard : ""}`} data-released={released}>
        <span className={styles.cardCategory}>{item.category}</span>
        <p>{item.title}</p>
        <span className={styles.cardDetail}>{item.detail}</span>
      </div>
    </motion.div>
  </motion.div>;
}
