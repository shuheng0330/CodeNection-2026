/** Motion tokens. Three springs, and nothing else may be invented inline —
 *  consistency of movement is what "visual consistency" actually reads as. */
export const spring = {
  /** buttons, sheets, anything under a finger */
  ui: { type: "spring", stiffness: 260, damping: 26 } as const,
  /** cards, section reveals */
  settle: { type: "spring", stiffness: 170, damping: 22 } as const,
  /** the carry line. Deliberately underdamped: real rope overshoots
   *  and wobbles when weight lands on it. This one number is most of
   *  why the hero reads as physical rather than animated. */
  rope: { type: "spring", stiffness: 90, damping: 12, mass: 1.2 } as const,
};

export const stagger = { words: 0.06, cards: 0.08 } as const;

export const reveal = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0 },
} as const;
