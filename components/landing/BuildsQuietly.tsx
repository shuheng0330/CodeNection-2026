import { QUIETLY, LANDING } from "@/lib/copy";
import { AnimatedMonth } from "./AnimatedMonth";
import styles from "./landing.module.css";

export function BuildsQuietly() {
  return (
    <section aria-labelledby="baseline-title" className={styles.baseline}>
      <div>
        <p className={styles.eyebrow}>{LANDING.baselineEyebrow}</p>
        <h2 id="baseline-title">{QUIETLY.c}</h2>
        <p className={styles.lead}>{QUIETLY.note}</p>
      </div>
      <AnimatedMonth />
    </section>
  );
}
