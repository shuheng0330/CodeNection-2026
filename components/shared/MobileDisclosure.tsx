"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useIsDesktop } from "@/lib/useIsDesktop";

export interface MobileDisclosureProps {
  /**
   * Title or primary summary node shown on the toggle button / heading.
   */
  title: ReactNode;
  /**
   * Optional metadata node (e.g. tag, hours count, badge) displayed beside the title.
   */
  metadata?: ReactNode;
  /**
   * Expandable child content revealed when open or on desktop.
   */
  children: ReactNode;
  /**
   * Controlled open state for mobile. If undefined, component manages its own local state.
   */
  isOpen?: boolean;
  /**
   * Callback fired when mobile toggle is clicked.
   */
  onToggle?: (nextOpen: boolean) => void;
  /**
   * Default open state on mobile when uncontrolled. Defaults to false.
   */
  defaultOpen?: boolean;
  /**
   * Optional id for the disclosure container or content region.
   */
  id?: string;
  /**
   * Accessible aria-label for the toggle button if title alone is not sufficient.
   */
  ariaLabel?: string;
  /**
   * Additional wrapper class names.
   */
  className?: string;
  /**
   * Additional class names for the toggle button.
   */
  buttonClassName?: string;
  /**
   * Additional class names for the content panel.
   */
  panelClassName?: string;
}

/**
 * Mobile-collapsible disclosure container.
 *
 * Below 768px:
 * - Collapsible with full-width minimum 44px toggle button, aria-expanded, aria-controls.
 * - Collapsed content is hidden from keyboard and screen-reader accessibility trees.
 * - If collapsing hides the focused element, focus returns to the toggle button.
 * - Chevron rotates subtly with reduced-motion override.
 *
 * At 768px and above (and SSR fallback):
 * - Always shows all content expanded. Toggle button is hidden or content is presented normally.
 */
export function MobileDisclosure({
  title,
  metadata,
  children,
  isOpen: controlledOpen,
  onToggle,
  defaultOpen = false,
  id: customId,
  ariaLabel,
  className = "",
  buttonClassName = "",
  panelClassName = "",
}: MobileDisclosureProps) {
  const generatedId = useId();
  const id = customId ?? generatedId;
  const contentId = `${id}-content`;

  const isDesktop = useIsDesktop();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const mobileExpanded = isControlled ? controlledOpen : uncontrolledOpen;
  const isExpanded = isDesktop || mobileExpanded;

  const handleToggle = () => {
    const next = !mobileExpanded;

    // If collapsing and focus is inside the panel, restore focus to the toggle
    if (
      !next &&
      panelRef.current &&
      document.activeElement &&
      panelRef.current.contains(document.activeElement)
    ) {
      toggleRef.current?.focus();
    }

    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onToggle?.(next);
  };

  return (
    <div className={className}>
      {/* Mobile-only toggle header (hidden at md: 768px and above) */}
      <div className="md:hidden">
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={mobileExpanded}
          aria-controls={contentId}
          aria-label={ariaLabel}
          onClick={handleToggle}
          className={`flex min-h-11 w-full items-center justify-between gap-3 text-left transition-colors ${buttonClassName}`}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="min-w-0">{title}</span>
            {metadata && <span className="shrink-0">{metadata}</span>}
          </div>
          <ChevronDown
            aria-hidden="true"
            size={18}
            className={`shrink-0 text-ink-muted transition-transform duration-200 motion-reduce:transition-none ${
              mobileExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Content panel: visible on desktop, conditionally visible on mobile */}
      <div
        ref={panelRef}
        id={contentId}
        hidden={!isExpanded}
        className={`${!isExpanded ? "hidden " : ""}${panelClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
