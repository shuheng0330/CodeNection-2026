"use client";

import { useSyncExternalStore } from "react";

/**
 * False on the server and on the first client render, true from the commit
 * onward — so the hydrating tree matches what the server sent.
 *
 * The obvious version of this is a useState flipped in an effect, which is
 * what /today used to do. React 19's lint rule rejects it (setState inside an
 * effect body causes cascading renders) and it is genuinely the wrong tool:
 * "are we on the client yet" is external state, not component state.
 */
const subscribe = () => () => {};

export const useHydrated = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
