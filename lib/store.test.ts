import { beforeEach, describe, expect, it } from "vitest";
import { usePikul, type AskDecision } from "./store";

const ask = (over: Partial<AskDecision> = {}): AskDecision => ({
  intentId: "intent-1",
  decision: "yes",
  title: "Cover a shift",
  pct: 132,
  weekLabel: "week 11",
  verdict: "tight",
  event: {
    date: "2026-09-11",
    category: "shift",
    title: "Cover a shift",
    hours: 8,
    intensity: 4,
  },
  ...over,
});

const state = () => usePikul.getState();

describe("decideAsk", () => {
  beforeEach(() => state().reset());

  it("puts the commitment on the week and records the decision together", () => {
    // A log entry on its own leaves the student looking at a week that does
    // not contain the thing they just agreed to.
    state().decideAsk(ask());

    expect(state().userEvents).toHaveLength(1);
    expect(state().asks).toHaveLength(1);
    expect(state().userEvents[0].hours).toBe(8);
    expect(state().asks[0].eventId).toBe(state().userEvents[0].id);
  });

  it("records a decline without adding anything", () => {
    state().decideAsk(ask({ decision: "no" }));

    expect(state().userEvents).toHaveLength(0);
    expect(state().asks).toHaveLength(1);
    expect(state().asks[0].eventId).toBeNull();
  });

  it("answers one ask once, however many times the button is pressed", () => {
    // double tap, a replayed handler, a second click before the sheet closes
    state().decideAsk(ask());
    state().decideAsk(ask());
    state().decideAsk(ask());

    expect(state().asks).toHaveLength(1);
    expect(state().userEvents).toHaveLength(1);
  });

  it("does not let a second answer overwrite the first", () => {
    state().decideAsk(ask({ decision: "yes" }));
    state().decideAsk(ask({ decision: "no" }));

    expect(state().asks).toHaveLength(1);
    expect(state().asks[0].decision).toBe("yes");
    expect(state().userEvents).toHaveLength(1);
  });

  it("treats asking again later as a different question", () => {
    state().decideAsk(ask({ intentId: "intent-1" }));
    state().decideAsk(ask({ intentId: "intent-2" }));

    expect(state().asks).toHaveLength(2);
    expect(state().userEvents).toHaveLength(2);
  });

  it("keeps the newest answer first", () => {
    state().decideAsk(ask({ intentId: "a", title: "First" }));
    state().decideAsk(ask({ intentId: "b", title: "Second" }));

    expect(state().asks[0].title).toBe("Second");
  });

  it("weighs a yes exactly as heavily as a no", () => {
    // both are decisions, and a tool that only ever validates declining is
    // another voice telling a people-pleaser what to do
    state().decideAsk(ask({ intentId: "a", decision: "yes" }));
    state().decideAsk(ask({ intentId: "b", decision: "no" }));

    const [no, yes] = state().asks;
    expect(Object.keys(no).sort()).toEqual(Object.keys(yes).sort());
  });
});

describe("undoAsk", () => {
  beforeEach(() => state().reset());

  it("takes the commitment back off the week as well", () => {
    state().decideAsk(ask());
    expect(state().userEvents).toHaveLength(1);

    state().undoAsk("intent-1");
    expect(state().asks).toHaveLength(0);
    expect(state().userEvents).toHaveLength(0);
  });

  it("removes only the commitment that answer created", () => {
    state().decideAsk(ask({ intentId: "a" }));
    state().decideAsk(ask({ intentId: "b" }));

    state().undoAsk("a");
    expect(state().asks).toHaveLength(1);
    expect(state().userEvents).toHaveLength(1);
    expect(state().asks[0].intentId).toBe("b");
  });

  it("does nothing for an answer that was never given", () => {
    state().decideAsk(ask());
    state().undoAsk("never-happened");

    expect(state().asks).toHaveLength(1);
    expect(state().userEvents).toHaveLength(1);
  });

  it("leaves the week alone when undoing a decline", () => {
    state().decideAsk(ask({ decision: "no" }));
    state().undoAsk("intent-1");

    expect(state().asks).toHaveLength(0);
    expect(state().userEvents).toHaveLength(0);
  });
});

describe("reset", () => {
  it("clears decisions and commitments, so a rehearsal starts clean", () => {
    state().decideAsk(ask());
    state().putDown("some-seed-event");
    state().setRecovery("sleep");

    state().reset();

    expect(state().asks).toHaveLength(0);
    expect(state().userEvents).toHaveLength(0);
    expect(state().putDownId).toBeNull();
    expect(state().recovery).toBeNull();
  });

  it("does not resurrect answers after a reset", () => {
    state().decideAsk(ask());
    state().reset();
    state().decideAsk(ask());

    expect(state().asks).toHaveLength(1);
    expect(state().userEvents).toHaveLength(1);
  });
});
