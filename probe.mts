import { extract } from "./lib/parse/extract";
const REF = new Date(2026, 8, 7, 9, 0); // Monday 7 Sep 2026, 9am
const inputs = [
  "eh can you cover my shift this friday 3pm-11pm?",
  "can you help with the group project this weekend",
  "boleh tolong ambil shift sabtu?",
  "meeting tomorrow 2-4pm",
  "Our demo moved to Thursday. Please finish the slides by Wednesday night.",
  "free ah this sunday? my cousin wedding",
  "sabtu ni shift 9 pagi sampai 5 petang",
  "tues 8-10pm badminton",
  "shift on 12/9 8pm-2am",
  "jumaat ada kelas 2 petang sampai 4 petang",
  "need to finish my FYP report",
  "kfjshdkfjh random nonsense",
];
for (const s of inputs) {
  const d = extract(s, REF);
  const f = (x: { value: unknown; from: string }) => `${x.value}${x.from === "guessed" ? "?" : ""}`;
  console.log(`"${s}"`);
  console.log(`   ${f(d.date).padEnd(12)} ${String(f(d.hours)).padEnd(7)} ${f(d.category).padEnd(12)} i${f(d.intensity)}  "${d.title.value}"  [${d.matchedOn ?? "-"}]`);
}
console.log("\n(? = we guessed it, the message did not say)");
