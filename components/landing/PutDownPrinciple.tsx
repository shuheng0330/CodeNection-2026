import { LANDING } from "@/lib/copy";
import styles from "./landing.module.css";
import { RevealGroup } from "./RevealGroup";

export function PutDownPrinciple() {
  return (
    <section aria-labelledby="putdown-title" className={styles.putdown}>
      <RevealGroup>
        <p className={styles.eyebrow}>{LANDING.putdownEyebrow}</p>
        <h2 id="putdown-title">{LANDING.putdownTitle}</h2>
        <p className={styles.lead}>{LANDING.putdownBody}</p>
        <p className={styles.protected}>{LANDING.protected}</p>
      </RevealGroup>
      <RevealGroup as="figure" className={styles.relief}>
        <figcaption>{LANDING.reliefExample}</figcaption>
        <div className={styles.shift}><span aria-hidden="true">↗</span><div><p>{LANDING.shiftTitle}</p><span>{LANDING.shiftDetail}</span></div></div>
        <div className={styles.reliefOutcome}><span className={styles.hours}>{LANDING.hours}</span><p>{LANDING.hoursLabel}</p></div>
        <p className={styles.reliefNote}>{LANDING.reliefNote}</p>
      </RevealGroup>
    </section>
  );
}
