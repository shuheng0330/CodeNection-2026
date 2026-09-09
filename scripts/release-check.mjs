/**
 * The parts of the Friday release gate a machine can actually check.
 *
 * `npm run verify` proves the code compiles, the tests pass and no clinical
 * vocabulary reached a string. It says nothing about whether the page reflows
 * at 320 pixels, whether a sheet can be left with a keyboard, or whether the
 * demo survives being run five times in a row — and those are the failures
 * that actually stop a demo in front of a judge.
 *
 * Three of the defects this found on its first run had been shipped for days
 * and were invisible in the source: a forecast chart whose bars all resolved
 * to zero height, an open sheet the page painted over, and a decision that
 * was the last item in a sheet taller than the laptop it was shown on.
 *
 * What it cannot do: a screen reader, a real phone, or a judgement about
 * whether any of this reads well. Those stay manual, and the checklist in
 * PROJECT_STATUS.md says so.
 *
 *   npm run build && npm start          # in one terminal
 *   npm run check:release               # in another
 *
 * Set PIKUL_CHROME if your browser is somewhere unusual, and PIKUL_URL if the
 * server is not on http://127.0.0.1:3000.
 */
import { existsSync } from "node:fs";
import puppeteer from "puppeteer-core";

const BASE = process.env.PIKUL_URL ?? "http://127.0.0.1:3000";

const CHROME_CANDIDATES = [
  process.env.PIKUL_CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error(
    "No browser found. Set PIKUL_CHROME to a Chrome or Edge executable.\nTried:\n  " +
      CHROME_CANDIDATES.join("\n  "),
  );
  process.exit(2);
}

const ROUTES = ["/", "/today", "/week", "/compare", "/recover", "/asks", "/method"];

/** 320 is the WCAG 1.4.10 reflow floor. 640 is what a 1280px desktop viewport
 *  becomes at 200% zoom, which is the other half of the same criterion. */
const WIDTHS = [320, 360, 390, 640, 768, 1024, 1440];

let failures = 0;
const check = (ok, label, detail = "") => {
  if (!ok) failures++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${label}${detail ? `  ${detail}` : ""}`);
};

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "new",
  args: ["--no-sandbox"],
});

/** Today holds its first paint until hydration, so every check waits for the
 *  trigger rather than for a network event. */
const ready = (page) =>
  page.waitForFunction(
    () =>
      [...document.querySelectorAll("button")].some((el) =>
        el.textContent?.includes("asking me for something"),
      ),
    { timeout: 20000 },
  );

const clickText = (page, text) =>
  page.evaluate((t) => {
    const b = [...document.querySelectorAll("button")].find((el) =>
      el.textContent?.trim().includes(t),
    );
    if (!b) return false;
    b.click();
    return true;
  }, text);

const focusInfo = (page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return { tag: "none", inDialog: false, text: "" };
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.textContent ?? "").trim().slice(0, 40),
      inDialog: Boolean(el.closest('[role="dialog"]')),
    };
  });

const readStore = (page) =>
  page.evaluate(() => {
    const raw = window.localStorage.getItem("pikul-demo");
    if (!raw) return { asks: 0, userEvents: 0, putDownId: null };
    const s = JSON.parse(raw).state;
    return {
      asks: s.asks.length,
      userEvents: s.userEvents.length,
      putDownId: s.putDownId,
      pct: s.asks[0]?.pct ?? null,
      week: s.asks[0]?.weekLabel ?? null,
    };
  });

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

// ── reflow, overflow and touch targets ───────────────────────────────
console.log("\nReflow, seven routes at seven widths");
for (const width of WIDTHS) {
  for (const route of ROUTES) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900 });
    await page.goto(BASE + route, { waitUntil: "load" });
    await pause(1200);

    const report = await page.evaluate(() => {
      const doc = document.documentElement;
      const small = [];
      for (const el of document.querySelectorAll(
        "button, a[href], input, select, textarea",
      )) {
        const r = el.getBoundingClientRect();
        // Zero-sized means hidden; the skip link is 1x1 until it is focused.
        if (r.width <= 1 || r.height <= 1) continue;
        if (r.height < 44 && r.width < 44) {
          small.push(
            `${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 20)}" ${Math.round(r.width)}x${Math.round(r.height)}`,
          );
        }
      }
      return {
        scrolls: doc.scrollWidth > doc.clientWidth + 1,
        width: doc.scrollWidth,
        client: doc.clientWidth,
        small: [...new Set(small)].slice(0, 3),
      };
    });

    check(
      !report.scrolls,
      `${width}px ${route} does not scroll sideways`,
      report.scrolls ? `${report.width} > ${report.client}` : "",
    );
    check(
      report.small.length === 0,
      `${width}px ${route} touch targets`,
      report.small.join(" | "),
    );
    await page.close();
  }
}

// ── the sheet, without a mouse ───────────────────────────────────────
console.log("\nKeyboard: opening, crossing and leaving the request sheet");
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${BASE}/today?reset=1`, { waitUntil: "load" });
  await ready(page);
  await pause(600);

  await page.evaluate(() => {
    [...document.querySelectorAll("button")]
      .find((el) => el.textContent?.includes("asking me for something"))
      ?.focus();
  });
  await page.keyboard.press("Enter");
  await pause(700);

  const opened = await focusInfo(page);
  check(opened.inDialog, "focus moves into the sheet");
  check(opened.tag === "h2", "focus lands on the heading, not a close button");

  let escaped = null;
  for (let i = 0; i < 40 && !escaped; i++) {
    await page.keyboard.press("Tab");
    const f = await focusInfo(page);
    if (!f.inDialog) escaped = f;
  }
  check(!escaped, "forty tabs never leave the sheet", escaped ? escaped.text : "");

  let back = null;
  for (let i = 0; i < 20 && !back; i++) {
    await page.keyboard.down("Shift");
    await page.keyboard.press("Tab");
    await page.keyboard.up("Shift");
    const f = await focusInfo(page);
    if (!f.inDialog) back = f;
  }
  check(!back, "shift-tab does not either");

  await page.keyboard.press("Escape");
  await pause(700);
  const after = await focusInfo(page);
  check(!after.inDialog, "escape closes it");
  check(
    after.text.includes("asking me for something"),
    "focus returns to the button that opened it",
  );

  await clickText(page, "asking me for something");
  await pause(600);
  await clickText(page, "See what it costs");
  await pause(700);
  const stepped = await focusInfo(page);
  check(
    stepped.tag === "h2" && stepped.inDialog,
    "a step change moves focus, so the new step is announced",
  );
  await page.close();
}

// ── five run-throughs, nothing cleared between them ──────────────────
console.log("\nFive run-throughs in one browser, no storage cleared");
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${BASE}/today?reset=1`, { waitUntil: "load" });
  await ready(page);

  const runs = [];
  for (let run = 1; run <= 5; run++) {
    await clickText(page, "asking me for something");
    await pause(600);
    await clickText(page, "See what it costs");
    await pause(700);

    // Three presses. A double tap, a replayed handler and an impatient judge
    // must all produce one commitment.
    await clickText(page, "I said yes");
    await clickText(page, "I said yes");
    await clickText(page, "I said yes");
    await pause(400);
    runs.push(await readStore(page));

    await clickText(page, "Close");
    await pause(500);
    await clickText(page, "Reset demo");
    await pause(500);
    const cleared = await readStore(page);
    check(
      cleared.asks === 0 && cleared.userEvents === 0,
      `run ${run}: reset clears the decision and the commitment`,
    );
  }

  const first = JSON.stringify(runs[0]);
  check(
    runs.every((r) => JSON.stringify(r) === first),
    "all five runs produce the same figures",
    first,
  );
  check(
    runs[0].asks === 1 && runs[0].userEvents === 1,
    "three presses of yes book it once",
  );
  await page.close();
}

// ── what each answer actually does ───────────────────────────────────
console.log("\nAccepting, declining and changing your mind");
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${BASE}/today?reset=1`, { waitUntil: "load" });
  await ready(page);

  await clickText(page, "asking me for something");
  await pause(600);
  await clickText(page, "See what it costs");
  await pause(700);

  await clickText(page, "I said no");
  await pause(400);
  let s = await readStore(page);
  check(
    s.asks === 1 && s.userEvents === 0,
    "declining records the decision and adds nothing",
  );

  await clickText(page, "Change my answer");
  await pause(400);
  await clickText(page, "I said yes");
  await pause(400);
  s = await readStore(page);
  check(s.asks === 1 && s.userEvents === 1, "accepting puts it on the week too");

  await clickText(page, "Change my answer");
  await pause(400);
  s = await readStore(page);
  check(
    s.asks === 0 && s.userEvents === 0,
    "undoing an acceptance takes it back off the week",
  );
  await page.close();
}

// ── adding something, and being stopped from adding nonsense ─────────
console.log("\nAdding a commitment refuses bad input instead of inventing one");
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${BASE}/today?reset=1`, { waitUntil: "load" });
  await ready(page);

  /** React tracks the input's value internally, so setting .value directly
   *  is ignored. Go through the prototype setter and fire the event React
   *  actually listens for. */
  const typeInto = (selector, text) =>
    page.evaluate(
      (sel, v) => {
        const el = document.querySelector(sel);
        if (!el) return false;
        const desc = Object.getOwnPropertyDescriptor(
          Object.getPrototypeOf(el),
          "value",
        );
        desc.set.call(el, v);
        el.dispatchEvent(new Event("input", { bubbles: true }));
        return true;
      },
      selector,
      text,
    );

  const submitState = () =>
    page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find(
        (el) => el.textContent?.trim() === "Add it",
      );
      const dialog = b?.closest('[role="dialog"]');
      const reasons = dialog
        ? [...dialog.querySelectorAll('[role="status"] li')].map((li) =>
            li.textContent.trim(),
          )
        : [];
      return { disabled: Boolean(b?.disabled), reasons };
    });

  await clickText(page, "Add something");
  await pause(700);

  const before = await readStore(page);

  // An emptied hours box used to be read as zero and written as one hour.
  await typeInto('[role="dialog"] input[type="number"]', "");
  await pause(400);
  let state = await submitState();
  check(state.disabled, "a blank duration cannot be added");
  check(state.reasons.length > 0, "and it says why", state.reasons.join(" | "));

  await clickText(page, "Add it");
  await pause(400);
  check(
    (await readStore(page)).userEvents === before.userEvents,
    "pressing add anyway changes nothing",
  );

  await typeInto('[role="dialog"] input[type="number"]', "0");
  await pause(400);
  check((await submitState()).disabled, "zero hours cannot be added either");

  await typeInto('[role="dialog"] input[type="number"]', "30");
  await pause(400);
  check((await submitState()).disabled, "nor can something longer than a day");

  await typeInto('[role="dialog"] input[type="number"]', "3");
  await pause(400);
  state = await submitState();
  check(!state.disabled, "a sensible duration can");

  await clickText(page, "Add it");
  await pause(600);
  check(
    (await readStore(page)).userEvents === before.userEvents + 1,
    "and adds exactly one commitment",
  );
  await page.close();
}

// ── the hand-back preview ────────────────────────────────────────────
console.log("\nThe hand-back preview saves nothing until it is confirmed");
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${BASE}/today?reset=1`, { waitUntil: "load" });
  await ready(page);

  await clickText(page, "Hand it back");
  await pause(500);
  check((await readStore(page)).putDownId === null, "opening it changes nothing");

  await clickText(page, "Keep it for now");
  await pause(500);
  check((await readStore(page)).putDownId === null, "cancelling changes nothing");

  await clickText(page, "Choose a different commitment");
  await pause(400);
  const choices = await page.evaluate(() =>
    [...document.querySelectorAll('input[name="put-down-choice"]')].map((input) => ({
      checked: input.checked,
      id: input.value,
    })),
  );
  check(choices.length > 1, "the recommendation can reveal other safe choices");
  check(choices[0]?.checked, "Pikul's recommendation stays selected by default");

  const chosenId = await page.evaluate(() => {
    const input = document.querySelectorAll('input[name="put-down-choice"]')[1];
    input?.click();
    return input?.value ?? null;
  });
  await pause(400);
  check(Boolean(chosenId), "a different commitment can be selected");

  await clickText(page, "Hand it back");
  await pause(500);
  await clickText(page, "Hand it back");
  await pause(600);
  check(
    (await readStore(page)).putDownId === chosenId,
    "confirming hands back the selected commitment",
  );

  await clickText(page, "Actually, keep it");
  await pause(500);
  check((await readStore(page)).putDownId === null, "and picking it up reverses it");
  await page.close();
}

await browser.close();

console.log(
  failures === 0
    ? "\nrelease check passed. A screen reader and a real phone are still yours to do.\n"
    : `\nrelease check FAILED: ${failures} problem(s).\n`,
);
process.exit(failures === 0 ? 0 : 1);
