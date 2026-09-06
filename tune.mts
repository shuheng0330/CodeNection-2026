import { addDays, format } from "date-fns";
import { computeCarry } from "./lib/engine/acwr";
import { demoAsOf, generateEvents } from "./lib/seed/generateSemester";
import { PERSONAS } from "./lib/seed/personas";

const asOf = demoAsOf(new Date("2026-09-09T00:00:00"));
console.log("asOf:", format(asOf, "yyyy-MM-dd EEEE"), "\n");

for (const p of PERSONAS) {
  const ev = generateEvents(p, asOf);
  console.log(`--- ${p.name} (${ev.length} events) ---`);
  for (let w = -2; w <= 2; w++) {
    const at = addDays(asOf, w * 7);
    const c = computeCarry(ev.filter((e) => e.date <= format(at, "yyyy-MM-dd")), at);
    const label = w === 0 ? "TODAY  " : `wk ${10 + w}  `;
    console.log(
      `  ${label} ratio ${c.ratio.toFixed(2)}  band ${c.band.padEnd(8)} acute ${c.acute.toFixed(1)} chronic ${c.chronic.toFixed(1)}`,
    );
  }
}
