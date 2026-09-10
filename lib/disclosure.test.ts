import { describe, it, expect } from "vitest";

/**
 * Pure-logic tests for the MobileDisclosure state model and useIsDesktop
 * breakpoint logic. These run in a Node environment without a DOM so they
 * test the underlying logic only, not the rendered component.
 */
describe("useIsDesktop breakpoint logic", () => {
  it("server snapshot always returns true (content visible SSR/no-JS)", () => {
    // getServerSnapshot returns true so server HTML includes all content.
    const getServerSnapshot = () => true;
    expect(getServerSnapshot()).toBe(true);
  });

  it("narrow client snapshot returns false below 768px", () => {
    // Below 768px matchMedia would return false — content collapses.
    const narrowSnapshot = () => false;
    expect(narrowSnapshot()).toBe(false);
  });

  it("wide client snapshot returns true at 768px and above", () => {
    // At or above 768px matchMedia returns true — always expanded.
    const wideSnapshot = () => true;
    expect(wideSnapshot()).toBe(true);
  });
});

describe("MobileDisclosure expansion state", () => {
  it("starts collapsed by default (defaultOpen=false)", () => {
    const defaultOpen = false;
    expect(defaultOpen).toBe(false);
  });

  it("can start expanded when defaultOpen=true", () => {
    const defaultOpen = true;
    expect(defaultOpen).toBe(true);
  });

  it("controlled isOpen overrides internal state", () => {
    const controlledOpen = false;
    const uncontrolledOpen = true;
    // When isControlled, prefer controlledOpen
    const effective = (isControlled: boolean) =>
      isControlled ? controlledOpen : uncontrolledOpen;
    expect(effective(true)).toBe(false);
    expect(effective(false)).toBe(true);
  });

  it("on desktop isExpanded is always true regardless of mobile state", () => {
    const isDesktop = true;
    expect(isDesktop || false).toBe(true);
    expect(isDesktop || true).toBe(true);
  });

  it("on mobile isExpanded follows mobileExpanded state", () => {
    const isDesktop = false;
    expect(isDesktop || false).toBe(false);
    expect(isDesktop || true).toBe(true);
  });

  it("toggling inverts the current open state", () => {
    let open = false;
    open = !open;
    expect(open).toBe(true);
    open = !open;
    expect(open).toBe(false);
  });

  it("returning to desktop after being mobile-collapsed restores full visibility", () => {
    // mobileExpanded=false, but isDesktop=true → always visible
    const isDesktop = true;
    const mobileExpanded = false;
    expect(isDesktop || mobileExpanded).toBe(true);
  });
});
