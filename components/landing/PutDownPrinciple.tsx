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
      </RevealGroup>
    </section>
  );
}
