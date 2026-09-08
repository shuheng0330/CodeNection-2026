import { QUIETLY, LANDING } from "@/lib/copy";
import styles from "./landing.module.css";

const HEIGHTS = [34,41,30,52,38,22,18,44,36,48,40,55,26,20,50,43,58,46,62,30,24,72,68,85,79,94,66,88];

export function BuildsQuietly() {
  return (
    <section aria-labelledby="baseline-title" className={styles.baseline}>
      <div>
        <p className={styles.eyebrow}>{LANDING.baselineEyebrow}</p>
        <h2 id="baseline-title">{QUIETLY.c}</h2>
        <p className={styles.lead}>{QUIETLY.note}</p>
      </div>
      <figure className={styles.month}>
        <div className={styles.bars} aria-hidden="true">
          {HEIGHTS.map((height, i) => <span key={i} style={{height: `${height}%`}} className={i >= 21 ? styles.recentBar : styles.pastBar} />)}
        </div>
        <div className={styles.chartLabels} aria-hidden="true"><span>{LANDING.monthLabel}</span><span>{LANDING.weekLabel}</span></div>
        <figcaption>{LANDING.chartDescription}</figcaption>
      </figure>
    </section>
  );
}
