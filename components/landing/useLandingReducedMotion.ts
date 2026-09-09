"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(notify: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}

function snapshot() {
  return window.matchMedia(query).matches;
}

function serverSnapshot(): boolean | null {
  return null;
}

// Keep server content visible and react to preference changes while mounted.
export function useLandingReducedMotion() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
