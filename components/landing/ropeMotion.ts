/** Illustration geometry only; these values are not workload calculations. */
export const STORY_DURATIONS = [500, 500, 500, 500, 2000, 1000, 3000, 1000] as const;
export function storyFrame(stage: number) {
  const released = stage === 5 || stage === 6;
  const count = stage === 7 ? 0 : Math.min(stage, 4);
  return { count, released, sag: released ? 35 : 10 + count * 19 };
}

export function ropePoint(marker: number, sag: number) {
  const t = (marker + 1) / 5;
  return { x: 24 + 432 * t, y: 42 + 4 * (1 - t) * t * sag };
}

export function introFrame(elapsed: number) {
  const count = Math.min(4, Math.floor(Math.max(0, elapsed) / 400));
  return { count, sag: 12 + count * 24.5, ready: elapsed >= 2000 };
}
