import { LANDING } from "@/lib/copy";
import styles from "./landing.module.css";

export function CommitmentScene() {
  return (
    <figure className={styles.scene} aria-labelledby="scene-caption">
      <div className={styles.sceneTop}><span>{LANDING.sceneTitle}</span><span>{LANDING.example}</span></div>
      <svg aria-hidden="true" className={styles.carryingLine} viewBox="0 0 500 430" preserveAspectRatio="none">
        <path d="M -20 60 C 120 50 60 390 250 350 S 340 80 520 145" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      <ul className={styles.commitments}>
        {LANDING.commitments.map((item, i) => <li key={item.title} className={styles.commitment}>
          <span className={styles.cardSymbol} aria-hidden="true">{["↗", "↔", "⌂", "+"][i]}</span>
          <div><span className={styles.cardCategory}>{item.category}</span><p>{item.title}</p><span className={styles.cardDetail}>{item.detail}</span></div>
        </li>)}
      </ul>
      <figcaption id="scene-caption" className={styles.sceneCaption}>{LANDING.sceneCaption}</figcaption>
    </figure>
  );
}
