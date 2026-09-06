/** mulberry32 — small, fast, and above all DETERMINISTIC.
 *  The demo curve must be byte-identical on the presenter's laptop, on a
 *  judge's phone, and after a mid-demo refresh. Math.random() would make
 *  the story different every time someone reloads. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** deterministic jitter in [1-amount, 1+amount] */
export const jitter = (rnd: () => number, amount: number): number =>
  1 + (rnd() * 2 - 1) * amount;
