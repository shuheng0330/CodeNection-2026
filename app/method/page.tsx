import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { METHOD, PRODUCT } from "@/lib/copy";

export const metadata: Metadata = {
  title: "How Pikul works",
  description:
    "The whole method, in plain language: what gets measured, what it is compared against, and what it cannot tell you.",
};

/**
 * The screen that answers "is any of this real?".
 *
 * Written in the words you would use out loud rather than the vocabulary of
 * the paper it came from — partly because the voice gate forbids the clinical
 * register anywhere a user can read it, and partly because plain language is
 * the better test: a method you cannot explain in a sentence is one you have
 * not understood.
 *
 * The limitations are ours to name first. Volunteering the strongest
 * objection is what makes the rest of it credible, and a judge who finds an
 * objection we hid discounts everything else on the page.
 *
 * A server component: no state, no store, so it renders with real metadata.
 */
export default function MethodPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-5 pb-24 pt-10">
      <header className="flex items-baseline justify-between">
        <Link href="/" className="font-display text-xl">
          {PRODUCT.name}
        </Link>
        <Link
          href="/today"
          className="text-sm text-ink-faint underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          {METHOD.back}
        </Link>
      </header>

      <Reveal className="mt-10">
        <h1 className="font-display text-h1">{METHOD.title}</h1>
        <p className="mt-4 text-lead text-ink-muted">{METHOD.lead}</p>
      </Reveal>

      <ol className="mt-12 grid gap-5">
        {METHOD.steps.map((s, i) => (
          <Reveal key={s.t} delay={i * 0.05}>
            <li className="rounded-3xl border border-hairline bg-surface p-6">
              <p className="font-display text-xl">{s.t}</p>
              <p className="mt-3 text-ink-muted">{s.d}</p>
            </li>
          </Reveal>
        ))}
      </ol>

      <Reveal className="mt-12">
        <h2 className="font-display text-h2">{METHOD.limitsTitle}</h2>
        <ul className="mt-5 grid gap-4">
          {METHOD.limits.map((l) => (
            <li key={l} className="flex gap-3 text-ink-muted">
              <span aria-hidden className="mt-2 h-1 w-4 shrink-0 rounded-full bg-clay-500" />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-12 rounded-3xl border border-hairline bg-raised/50 p-6">
        <p className="font-display text-xl">{METHOD.refTitle}</p>
        <p className="mt-3 text-ink-muted">{METHOD.ref}</p>
      </Reveal>

      <Reveal className="mt-8 rounded-3xl border border-dusk/25 bg-dusk-100/50 p-6">
        <p className="font-display text-xl text-ink">{METHOD.privacyTitle}</p>
        <p className="mt-3 text-ink-muted">{METHOD.privacy}</p>
      </Reveal>
    </main>
  );
}
