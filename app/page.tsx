import Link from "next/link";
import { BuildsQuietly } from "@/components/landing/BuildsQuietly";
import { CarryLine } from "@/components/landing/CarryLine";
import { GrainOverlay } from "@/components/landing/GrainOverlay";
import { MeshBackdrop } from "@/components/landing/MeshBackdrop";
import { Reveal } from "@/components/shared/Reveal";
import { SplitText } from "@/components/shared/SplitText";
import { HERO, HOW, PRODUCT } from "@/lib/copy";

export default function Home() {
  return (
    <main className="relative">
      <GrainOverlay />

      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24 sm:pt-28">
        <MeshBackdrop />
        <div className="relative mx-auto max-w-5xl">
          <p className="text-center text-micro uppercase tracking-[0.08em] text-ink-muted">
            {HERO.eyebrow}
          </p>

          <h1 className="mt-6 text-center font-display text-display">
            <SplitText text={HERO.headline} />
            <span className="block text-ink-muted">
              <SplitText text={HERO.headline2} accent={HERO.headlineAccent} delay={0.35} />
            </span>
          </h1>

          <div className="mt-14 sm:mt-16">
            <CarryLine />
          </div>

          <Reveal delay={0.1} className="mx-auto mt-10 max-w-xl text-center">
            <p className="text-lead text-ink-muted">{HERO.sub}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/today"
                className="rounded-full bg-clay-600 px-7 py-3.5 font-medium text-white shadow-soft transition-colors hover:bg-clay-500"
              >
                {HERO.cta}
              </Link>
              <a
                href="#how"
                className="rounded-full border border-hairline px-7 py-3.5 font-medium text-ink transition-colors hover:bg-raised"
              >
                {HERO.ctaSecondary}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- it builds quietly ---------------- */}
      <BuildsQuietly />

      {/* ---------------- how it works ---------------- */}
      <section id="how" className="border-t border-hairline bg-raised/40 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="font-display text-h1">{HOW.title}</h2>
            <p className="mt-5 max-w-2xl text-lead text-ink-muted">{HOW.body}</p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {HOW.points.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-hairline bg-surface p-7 shadow-soft">
                  <p className="font-display text-xl">{p.t}</p>
                  <p className="mt-3 text-ink-muted">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-hairline px-6 py-14">
        <div className="mx-auto flex max-w-5xl flex-wrap items-baseline justify-between gap-3">
          <p className="font-display text-xl">
            {PRODUCT.name}
            <span className="ml-3 text-sm text-ink-faint">— {PRODUCT.meaning}</span>
          </p>
          <p className="text-sm text-ink-faint">CodeNection 2026 · Lifestyle track</p>
        </div>
      </footer>
    </main>
  );
}
