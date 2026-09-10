"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { decisionDemo, type DecisionDemo } from "@/lib/seed/decisionDemo";
import { draftDecline } from "@/lib/decline";
import { LANDING_DECISION as COPY, HERO } from "@/lib/copy";
import { previewOutcome, type PreviewChoice } from "./previewOutcome";
import styles from "./landing.module.css";
import { RevealGroup } from "./RevealGroup";

export function DecisionPreview() {
  const [demo, setDemo] = useState<DecisionDemo | null>(null);
  const [choice, setChoice] = useState<PreviewChoice>("accept");
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    // Resolve the same local reference date as the app, never a build-time date.
    const timer = setTimeout(() => setDemo(decisionDemo()), 0);
    return () => clearTimeout(timer);
  }, []);
  const outcome = demo ? previewOutcome(demo, choice) : null;
  function select(next: PreviewChoice) {
    if (!demo || next === choice) return;
    setChoice(next);
    const result = previewOutcome(demo, next);
    setAnnouncement(`${next === "accept" ? COPY.accept : COPY.decline}: ${result.hoursText}. ${result.selected === null ? COPY.unavailable : `${result.selected}% ${COPY.usual}.`}`);
  }
  return <section className={styles.decision} aria-labelledby="decision-title">
    <RevealGroup>
    <p className={styles.eyebrow}>{COPY.eyebrow}</p>
    <h2 id="decision-title">{COPY.title}</h2>
    <p className={styles.lead}>{COPY.description}</p>
    </RevealGroup>
    <div className={styles.decisionGrid}>
      {demo && outcome ? <>
        <RevealGroup className={styles.requestCard}>
          <p className={styles.eyebrow}>{demo.persona.name} · {COPY.sample}</p>
          <blockquote className={styles.requestMessage}>“{demo.message}”</blockquote>
          <p className={styles.requestTitle}>{demo.candidate.title}</p>
          <p className={styles.requestDetail}>{format(parseISO(demo.candidate.date), "EEE, d MMM yyyy")} · {demo.candidate.hours} {COPY.hours}</p>
          <p className={styles.requestNote}>{COPY.proposed}</p>
        </RevealGroup>
        <div className={styles.previewCard} data-choice={choice}>
          <RevealGroup>
          <div className={styles.previewChoices} role="group" aria-label={COPY.choiceLabel}>
            <button type="button" aria-pressed={choice === "accept"} onClick={() => select("accept")}>{COPY.accept}</button>
            <button type="button" aria-pressed={choice === "decline"} onClick={() => select("decline")}>{COPY.decline}</button>
          </div>
          <div>
          <div key={choice} className={announcement ? styles.previewChanged : undefined}>
            <p className={styles.forecastWeek}>{outcome.week ?? COPY.forecast}</p>
            {outcome.before !== null ? <div className={styles.forecastValues}>
              <div><p>{COPY.without}</p><strong>{outcome.before}%</strong><span>{COPY.usual}</span></div>
              <div className={styles.selectedForecast}><p>{choice === "accept" ? COPY.with : COPY.declined}</p><strong>{outcome.selected}%</strong><span>{COPY.usual}</span></div>
            </div> : <p className={styles.forecastUnavailable}>{COPY.unavailable}</p>}
            <p className={styles.previewHours}>{outcome.hoursText}</p>
            <div className={styles.replySlot} style={{ visibility: choice === "decline" ? "visible" : "hidden" }} aria-hidden={choice !== "decline"}>
              <p className={styles.replyLabel}>{COPY.reply}</p>
              <blockquote>{draftDecline("shift", "soften")}</blockquote>
            </div>
          </div>
          </div>
          </RevealGroup>
        </div>
      </> : <p className={styles.previewFallback}>{COPY.fallback}</p>}
    </div>
    <Link href="/today?reset=1" className={styles.primary}>{HERO.cta}<span aria-hidden="true"> ↗</span></Link>
    <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
  </section>;
}
