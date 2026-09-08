import Link from "next/link";
import { NAV, PRODUCT } from "@/lib/copy";

/**
 * A stopgap, and deliberately a small one.
 *
 * Navigation belongs to the app shell, which is Thong's. Until it lands, the
 * two screens in this lane still have to be reachable from each other and
 * from everything else, and each of them growing its own hand-written link
 * row is how six routes end up with six different navigations.
 *
 * So: one component, reading the shared NAV list, used only by the pages in
 * this lane. When AppShell arrives it consumes the same list and this file
 * gets deleted along with both of its call sites.
 */
export function RouteHeader({
  current,
  aside,
}: {
  current: string;
  /** the date, a back link — whatever this route wants beside the wordmark */
  aside?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
      <Link href="/" className="font-display text-xl" aria-label={NAV.home}>
        {PRODUCT.name}
      </Link>
      {aside}
      <nav aria-label={NAV.landmark} className="-mx-3 w-full lg:mx-0 lg:w-auto">
        <ul className="flex flex-wrap items-baseline">
          {NAV.items.map((item) => (
            <li key={item.href}>
              {item.href === current ? (
                <span
                  aria-current="page"
                  className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-ink underline decoration-clay-600 decoration-2 underline-offset-8"
                >
                  {item.short}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-full px-3 text-sm text-ink-muted transition-colors hover:bg-raised hover:text-ink"
                >
                  {item.short}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
