"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  Ellipsis,
  House,
  Inbox,
  Scale,
  Wind,
  X,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NAV, PRODUCT } from "@/lib/copy";
import { spring } from "@/lib/motion";
import { PERSONAS } from "@/lib/seed/personas";
import { usePikul } from "@/lib/store";

type AppRoute = "/today" | "/week" | "/recover" | "/asks" | "/compare" | "/method";

interface NavItem {
  href: AppRoute;
  label: string;
  icon: LucideIcon;
}

const PRIMARY: NavItem[] = [
  { href: "/today", label: NAV.today, icon: House },
  { href: "/week", label: NAV.week, icon: CalendarDays },
  { href: "/recover", label: NAV.recover, icon: Wind },
  { href: "/asks", label: NAV.asks, icon: Inbox },
];

const SECONDARY: NavItem[] = [
  { href: "/compare", label: NAV.compare, icon: Scale },
  { href: "/method", label: NAV.method, icon: BookOpen },
];

const isActive = (pathname: string, href: AppRoute) =>
  pathname === href || pathname.startsWith(`${href}/`);

/**
 * The shared seam for every product route.
 *
 * Pages supply only their content. This module owns navigation, active state,
 * mobile safe areas, the accessible More sheet, and one-time demo deep links.
 * Landing deliberately stays outside it.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const still = useReducedMotion();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const morePanelRef = useRef<HTMLDivElement>(null);
  const handledQueryRef = useRef<string | null>(null);
  const reset = usePikul((state) => state.reset);
  const setPersona = usePikul((state) => state.setPersona);

  useEffect(() => {
    const query = window.location.search;
    if (handledQueryRef.current === query) return;
    handledQueryRef.current = query;

    const params = new URLSearchParams(query);
    if (params.get("reset") === "1") reset();

    const persona = params.get("persona");
    if (persona && PERSONAS.some((candidate) => candidate.id === persona)) {
      setPersona(persona);
    }
  }, [reset, setPersona]);

  useEffect(() => {
    if (!moreOpen) return;

    const returnFocus = moreButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => {
      morePanelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      returnFocus?.focus();
    };
  }, [moreOpen]);

  const moreIsActive = SECONDARY.some((item) => isActive(pathname, item.href));

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm font-medium text-linen transition-transform focus:translate-y-0"
      >
        {NAV.skip}
      </a>

      <aside className="sticky top-0 hidden h-screen border-r border-hairline bg-surface/75 px-5 py-8 backdrop-blur-sm lg:flex lg:flex-col">
        <Link href="/" className="font-display text-2xl">
          {PRODUCT.name}
        </Link>
        <p className="mt-2 text-sm leading-relaxed text-ink-faint">{PRODUCT.meaning}</p>

        <nav aria-label={NAV.primaryLabel} className="mt-10 grid gap-1">
          {PRIMARY.map((item) => (
            <DesktopLink key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
        </nav>

        <div className="mt-auto border-t border-hairline pt-5">
          <p className="px-3 text-micro uppercase tracking-[0.08em] text-ink-faint">
            {NAV.more}
          </p>
          <nav aria-label={NAV.secondaryLabel} className="mt-2 grid gap-1">
            {SECONDARY.map((item) => (
              <DesktopLink key={item.href} item={item} active={isActive(pathname, item.href)} />
            ))}
          </nav>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex min-h-16 items-center justify-between border-b border-hairline bg-linen/90 px-5 backdrop-blur-sm lg:hidden">
          <Link href="/" className="inline-flex min-h-11 items-center font-display text-xl">
            {PRODUCT.name}
          </Link>
          <p className="text-micro uppercase tracking-[0.08em] text-ink-faint">
            {NAV.appLabel}
          </p>
        </header>

        <div id="main-content" tabIndex={-1} className="min-w-0">
          {children}
        </div>
      </div>

      <nav
        aria-label={NAV.mobileLabel}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-surface/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_-20px_rgb(43_33_28/0.35)] backdrop-blur-md lg:hidden"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {PRIMARY.map((item) => (
            <MobileLink key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
          <button
            ref={moreButtonRef}
            type="button"
            aria-expanded={moreOpen}
            aria-controls="app-more-navigation"
            onClick={() => setMoreOpen(true)}
            className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-medium transition-colors ${
              moreIsActive
                ? "bg-clay-100 text-clay-700"
                : "text-ink-muted hover:bg-raised hover:text-ink"
            }`}
          >
            <Ellipsis aria-hidden size={20} strokeWidth={1.8} />
            <span>{NAV.more}</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.button
              type="button"
              aria-label={NAV.closeMore}
              className="fixed inset-0 z-40 bg-ink/30 lg:hidden"
              initial={still ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              ref={morePanelRef}
              id="app-more-navigation"
              role="dialog"
              aria-modal="true"
              aria-labelledby="app-more-title"
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-[28px] border-t border-hairline bg-surface px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 shadow-lift lg:hidden"
              initial={still ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={spring.ui}
              onKeyDown={(event) => trapFocus(event, morePanelRef.current, () => setMoreOpen(false))}
            >
              <div className="flex items-center justify-between">
                <h2 id="app-more-title" className="font-display text-2xl">
                  {NAV.moreTitle}
                </h2>
                <button
                  type="button"
                  aria-label={NAV.closeMore}
                  onClick={() => setMoreOpen(false)}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-raised hover:text-ink"
                >
                  <X aria-hidden size={22} />
                </button>
              </div>

              <nav aria-label={NAV.secondaryLabel} className="mt-5 grid gap-2">
                {SECONDARY.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMoreOpen(false)}
                      className={`flex min-h-14 items-center gap-4 rounded-2xl border px-4 py-3 transition-colors ${
                        active
                          ? "border-clay-600/40 bg-clay-100 text-clay-700"
                          : "border-hairline text-ink-muted hover:bg-raised hover:text-ink"
                      }`}
                    >
                      <Icon aria-hidden size={22} strokeWidth={1.8} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function DesktopLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-clay-100 text-clay-700"
          : "text-ink-muted hover:bg-raised hover:text-ink"
      }`}
    >
      <Icon aria-hidden size={19} strokeWidth={1.8} />
      <span>{item.label}</span>
      {active && <span aria-hidden className="ml-auto h-1.5 w-1.5 rounded-full bg-clay-600" />}
    </Link>
  );
}

function MobileLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-medium transition-colors ${
        active
          ? "bg-clay-100 text-clay-700"
          : "text-ink-muted hover:bg-raised hover:text-ink"
      }`}
    >
      <Icon aria-hidden size={20} strokeWidth={1.8} />
      <span>{item.label}</span>
    </Link>
  );
}

function trapFocus(
  event: React.KeyboardEvent<HTMLDivElement>,
  panel: HTMLDivElement | null,
  close: () => void,
) {
  if (event.key === "Escape") {
    event.preventDefault();
    close();
    return;
  }
  if (event.key !== "Tab" || !panel) return;

  const focusable = Array.from(
    panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
