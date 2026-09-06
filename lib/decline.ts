/**
 * Drafted replies. Deterministic templates — 3 tones x 4 kinds of ask.
 *
 * Explicitly NOT an LLM call: offline, instant, no API key to leak, no
 * latency on stage, and no chance of generating something unhinged in front
 * of a judge. The hard part of saying no was never the wording, it was
 * knowing you were allowed to.
 */
export type AskKind = "shift" | "project" | "favour" | "event";
export type Tone = "soften" | "renegotiate" | "firm";

export const ASK_KINDS: { key: AskKind; label: string }[] = [
  { key: "shift", label: "Cover a shift" },
  { key: "project", label: "Take on group work" },
  { key: "favour", label: "Do them a favour" },
  { key: "event", label: "Come to something" },
];

const T: Record<AskKind, Record<Tone, string>> = {
  shift: {
    soften:
      "Sorry, I can't take this one — I'm already stacked that week. If nobody else can cover, ask me again on the day and I'll see where I'm at.",
    renegotiate:
      "I can't do the full shift, but I could take the first few hours if that helps you cover the gap. Would that work?",
    firm: "I can't take this shift. I'm at my limit that week and I need to keep it clear.",
  },
  project: {
    soften:
      "I want to pull my weight on this, but I'm overloaded that week and I'd rather flag it now than hand in something rushed. Can we look at who else has room?",
    renegotiate:
      "I can take a smaller piece of this — say the part I've already started — if someone else picks up the rest. That way it still gets done on time.",
    firm: "I can't take this on. I'm already carrying more than I can finish properly that week.",
  },
  favour: {
    soften:
      "I really wish I could, but I've got almost nothing left that week. Ask me again after — I'd genuinely like to help when I can actually be useful.",
    renegotiate:
      "I can't do the whole thing, but I could help with one part of it. Which bit would take the most off you?",
    firm: "I can't help with this one. I'm stretched thin and I'd be no use to you anyway.",
  },
  event: {
    soften:
      "I'm going to sit this one out — that week's a lot for me. Save me a spot next time though, I do want to come.",
    renegotiate:
      "I can't do the whole thing, but I could come for an hour early on. Would that still be worth it?",
    firm: "I'm not going to make it. I need that time to keep my head above water.",
  },
};

export const draftDecline = (kind: AskKind, tone: Tone): string => T[kind][tone];
