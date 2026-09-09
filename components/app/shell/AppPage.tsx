import type { ReactNode } from "react";

/**
 * Shared page framing for the supporting app routes.
 *
 * The shell owns navigation; this module gives each route the same content
 * edge, responsive top rhythm and readable line length without making page
 * owners repeat a long class list.
 */
export function AppPage({
  children,
  reading = false,
}: {
  children: ReactNode;
  reading?: boolean;
}) {
  return (
    <main
      className={`mx-auto min-h-screen w-full px-5 pb-32 pt-12 sm:px-8 lg:px-10 lg:pb-20 lg:pt-20 ${
        reading ? "max-w-4xl" : "max-w-6xl"
      }`}
    >
      {children}
    </main>
  );
}

export function AppPageIntro({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="max-w-2xl">
      <p className="text-micro uppercase tracking-[0.08em] text-clay-700">
        {eyebrow}
      </p>
      <h1 className="mt-3 font-display text-h1">{title}</h1>
      {lead && <p className="mt-4 text-lead text-ink-muted">{lead}</p>}
    </header>
  );
}
