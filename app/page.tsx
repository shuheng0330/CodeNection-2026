import Link from "next/link";
import { BuildsQuietly } from "@/components/landing/BuildsQuietly";
import { CommitmentScene } from "@/components/landing/CommitmentScene";
import { PutDownPrinciple } from "@/components/landing/PutDownPrinciple";
import { GrainOverlay } from "@/components/landing/GrainOverlay";
import { AnimatedSteps } from "@/components/landing/AnimatedSteps";
import { RevealGroup } from "@/components/landing/RevealGroup";
import { DecisionPreview } from "@/components/landing/DecisionPreview";
import { HERO, HOW, LANDING, PRODUCT } from "@/lib/copy";
import styles from "@/components/landing/landing.module.css";

export default function Home() {
  return (
    <main id="main" className={styles.page}>
      <GrainOverlay />
      <a href="#hero" className={styles.skip}>{LANDING.skip}</a>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label={PRODUCT.name}>{PRODUCT.name}<span aria-hidden="true">.</span></Link>
        <span className={styles.brandNote}>{PRODUCT.meaning}</span>
        <Link href="/today?reset=1" className={styles.headerLink}>{LANDING.openDemo}<span aria-hidden="true"> ↗</span></Link>
      </header>
      <section id="hero" aria-labelledby="hero-title" className={styles.hero}>
        <div>
          <RevealGroup>
          <p className={styles.eyebrow}>{LANDING.audience}</p>
          <h1 id="hero-title">{HERO.headline}{" "}<span>{HERO.headline2}</span></h1>
          <p className={styles.lead}>{HERO.sub}</p>
          </RevealGroup>
          <div className={styles.actions}>
            <Link href="/today?reset=1" className={styles.primary}>{HERO.cta}<span aria-hidden="true"> ↗</span></Link>
            <a href="#how" className={styles.secondary}>{HERO.ctaSecondary}<span aria-hidden="true"> ↓</span></a>
          </div>
          <p className={styles.demoNote}>{LANDING.demoNote}</p>
        </div>
        <CommitmentScene />
      </section>
      <BuildsQuietly />
      <DecisionPreview />
      <PutDownPrinciple />
      <section id="how" aria-labelledby="how-title" className={styles.how}>
        <RevealGroup className={styles.sectionHeading}>
          <p className={styles.eyebrow}>{LANDING.howEyebrow}</p>
          <h2 id="how-title">{HOW.title}</h2>
        </RevealGroup>
        <AnimatedSteps />
        <Link href="/today?reset=1" className={styles.primary}>{HERO.cta}<span aria-hidden="true"> ↗</span></Link>
      </section>
      <footer className={styles.footer}>
        <p className={styles.brand}>{PRODUCT.name}<span aria-hidden="true">.</span></p>
        <p>{PRODUCT.meaning}</p>
      </footer>
    </main>
  );
}
