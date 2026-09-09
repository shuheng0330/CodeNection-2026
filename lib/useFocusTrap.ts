"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Keeping a sheet usable without a mouse.
 *
 * Both bottom sheets could be opened from the keyboard and then not left:
 * no Escape, no focus trap, and no way back to the button that opened them.
 *
 * Hand-rolled rather than a library. focus-trap-react is 8.5kB gzipped and
 * covers about half of what is needed here — it does not set `inert`, does
 * not lock scroll, does not route Escape into React state, and does not
 * re-focus when a multi-step sheet changes step. Most of this would still
 * have to be written around it.
 */

const FOCUSABLE = [
  "a[href]",
  "button",
  'input:not([type="hidden"])',
  "select",
  "textarea",
  "summary",
  "[tabindex]",
].join(",");

function isTabbable(el: HTMLElement): boolean {
  if (el.matches(":disabled")) return false;
  if (el.closest("[inert]") !== null) return false;
  const tabindex = el.getAttribute("tabindex");
  if (tabindex !== null && Number(tabindex) < 0) return false;
  if (el.hidden) return false;
  if (el.getClientRects().length === 0) return false;
  return getComputedStyle(el).visibility !== "hidden";
}

const tabbableWithin = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isTabbable);

/**
 * `inert`, not aria-hidden. aria-hidden removes background content from the
 * accessibility tree but leaves every button in the tab order, so the trap
 * ends up fighting the browser instead of cooperating with it.
 *
 * Walks up from the sheet marking siblings, so it works whether the sheet is
 * portalled or inline, and skips anything already inert so a second sheet
 * cannot clobber the first one's restore.
 */
function inertBackground(sheet: HTMLElement): () => void {
  const undo: Array<() => void> = [];
  let node: HTMLElement | null = sheet;

  while (node && node !== document.body && node.parentElement) {
    const parent: HTMLElement = node.parentElement;
    for (const sibling of Array.from(parent.children)) {
      if (sibling === node || !(sibling instanceof HTMLElement)) continue;
      if (sibling.tagName === "SCRIPT" || sibling.tagName === "STYLE") continue;
      if (sibling.hasAttribute("inert")) continue;
      sibling.setAttribute("inert", "");
      undo.push(() => sibling.removeAttribute("inert"));
    }
    node = parent;
  }
  return () => undo.forEach((fn) => fn());
}

function lockScroll(): () => void {
  const { body, documentElement } = document;
  const overflow = body.style.overflow;
  const paddingRight = body.style.paddingRight;
  const gutter = window.innerWidth - documentElement.clientWidth;

  body.style.overflow = "hidden";
  if (gutter > 0) body.style.paddingRight = `${gutter}px`;

  return () => {
    body.style.overflow = overflow;
    body.style.paddingRight = paddingRight;
  };
}

/**
 * The heading, not the first control.
 *
 * WAI-ARIA's dialog pattern says to focus a static element at the top when
 * landing on the first interactive one would scroll the start of the content
 * out of view. Both sheets qualify, and both have a worse specific problem:
 * the No Button's first control is a close button, which announces "Close"
 * with no context, and the add sheet's is a textarea, which raises the Android
 * keyboard over the sheet the instant it opens.
 */
function focusStart(container: HTMLElement): void {
  const marked = container.querySelector<HTMLElement>("[data-autofocus]");
  if (marked) {
    marked.focus({ preventScroll: true });
    return;
  }
  const [first] = tabbableWithin(container);
  (first ?? container).focus({ preventScroll: true });
}

export interface FocusTrapOptions {
  /** Armed while true. Flip false on close-request so focus returns at once,
   *  rather than waiting for the exit animation. */
  active: boolean;
  onClose: () => void;
  /** Change to re-run initial focus — the No Button passes its step index. */
  focusKey?: string | number;
}

export function useFocusTrap<T extends HTMLElement>({
  active,
  onClose,
  focusKey,
}: FocusTrapOptions): RefObject<T | null> {
  const containerRef = useRef<T | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Held in a ref so an inline arrow from the caller does not re-arm the trap
  // on every render, without going stale. Synced in an effect rather than
  // during render, which React 19 rejects.
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;

    previouslyFocused.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const releaseInert = inertBackground(container);
    const releaseScroll = lockScroll();
    focusStart(container);

    const onKeyDown = (event: KeyboardEvent) => {
      // Bubble phase, and yield to anything that already handled the key, so a
      // nested control can claim Escape for itself.
      if (event.defaultPrevented) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      // Queried fresh every time, so a sheet whose controls change between
      // steps needs no cache invalidation.
      const items = tabbableWithin(container);
      if (items.length === 0) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;

      if (!current || !container.contains(current)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    // Catches focus arriving by any route other than Tab — a control being
    // removed mid-step and dropping focus to the body, for instance.
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (target instanceof Node && container.contains(target)) return;
      const [first] = tabbableWithin(container);
      (first ?? container).focus({ preventScroll: true });
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);

    return () => {
      // Order matters: release inert before restoring, or the element we are
      // handing focus back to is still inert and focus() does nothing.
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      releaseScroll();
      releaseInert();

      const back = previouslyFocused.current;
      if (back?.isConnected) back.focus();
      previouslyFocused.current = null;
    };
  }, [active]);

  // A step change inside an already-open sheet. The heading is remounted by
  // its caller (key={step}), so focusing it announces the new step — focusing
  // a node that already has focus is silent.
  useEffect(() => {
    if (!active || focusKey === undefined) return;
    const container = containerRef.current;
    if (container) focusStart(container);
  }, [active, focusKey]);

  return containerRef;
}
