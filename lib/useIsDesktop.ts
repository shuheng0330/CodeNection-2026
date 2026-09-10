"use client";

import { useSyncExternalStore } from "react";

const query = "(min-width: 768px)";

function subscribe(notify: () => void) {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia(query);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia(query).matches;
}

function getServerSnapshot(): boolean {
  // Always true on server so initial SSR output is expanded without JavaScript.
  return true;
}

export function useIsDesktop(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
