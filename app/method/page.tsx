import type { Metadata } from "next";
import { AppPage, AppPageIntro } from "@/components/app/shell/AppPage";
import { AppShell } from "@/components/app/shell/AppShell";
import { MobileDisclosure } from "@/components/shared/MobileDisclosure";
import { Reveal } from "@/components/shared/Reveal";
import { METHOD } from "@/lib/copy";

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
    <AppShell>
      <AppPage reading>
        <Reveal>
          <AppPageIntro
            eyebrow={METHOD.eyebrow}
            title={METHOD.title}
            lead={METHOD.lead}
          />
        </Reveal>

        <ol className="mt-12 grid gap-5">
          {METHOD.steps.map((step, index) => (
            <li key={step.t}>
              <Reveal delay={index * 0.05}>
                <article className="overflow-hidden rounded-3xl border border-hairline bg-surface md:p-8">
                  <MobileDisclosure
                    buttonClassName="p-6 hover:bg-raised/40 md:hidden"
                    title={
                      <div className="flex items-center gap-4">
                        <span
                          aria-hidden
                          className="tnum font-display text-2xl text-clay-600"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h2 className="font-display text-xl">{step.t}</h2>
                      </div>
                    }
                  >
                    <div className="px-6 pb-6 pt-1 md:p-0 md:grid md:gap-4 md:grid-cols-[3rem_minmax(0,1fr)]">
                      <p
                        aria-hidden
                        className="hidden tnum font-display text-2xl text-clay-600 md:block"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <div>
                        <h2 className="hidden font-display text-xl md:block">
                          {step.t}
                        </h2>
                        <p className="leading-relaxed text-ink-muted md:mt-3">
                          {step.d}
                        </p>
                      </div>
                    </div>
                  </MobileDisclosure>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="mt-14 rounded-3xl border border-hairline bg-raised/50 p-6 sm:p-8">
          <h2 className="font-display text-h2">{METHOD.limitsTitle}</h2>
          <ul className="mt-6 grid gap-5">
            {METHOD.limits.map((limit) => (
              <li key={limit} className="flex gap-4 leading-relaxed text-ink-muted">
                <span
                  aria-hidden
                  className="mt-3 h-1 w-5 shrink-0 rounded-full bg-clay-500"
                />
                <span>{limit}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Reveal className="h-full rounded-3xl border border-hairline bg-surface p-6">
            <h2 className="font-display text-xl">{METHOD.refTitle}</h2>
            <p className="mt-3 leading-relaxed text-ink-muted">{METHOD.ref}</p>
          </Reveal>

          <Reveal className="h-full rounded-3xl border border-dusk/25 bg-dusk-100/50 p-6">
            <h2 className="font-display text-xl text-ink">{METHOD.privacyTitle}</h2>
            <p className="mt-3 leading-relaxed text-ink-muted">{METHOD.privacy}</p>
          </Reveal>
        </div>
      </AppPage>
    </AppShell>
  );
}
