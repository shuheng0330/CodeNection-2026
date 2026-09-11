/** Capture the README evidence from a frozen public Pikul deployment. */
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import puppeteer from "puppeteer-core";

const base = process.env.PIKUL_URL ?? "https://pikul-codenection-2026.vercel.app";
const output = resolve("docs/readme-assets");
const browserPath = [
  process.env.PIKUL_CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find(Boolean);

if (!browserPath || !existsSync(browserPath)) throw new Error("Set PIKUL_CHROME to Chrome or Edge.");

await mkdir(output, { recursive: true });
const browser = await puppeteer.launch({ executablePath: browserPath, headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();

const clickText = async (text) => {
  const clicked = await page.evaluate((needle) => {
    const control = [...document.querySelectorAll("button, a")].find((element) =>
      element.textContent?.trim().includes(needle),
    );
    control?.click();
    return Boolean(control);
  }, text);
  if (!clicked) throw new Error(`Could not find control: ${text}`);
};

const open = async (path, width) => {
  await page.setViewport({ width, height: width < 600 ? 844 : 1000, deviceScaleFactor: 2 });
  await page.goto(`${base}${path}`, { waitUntil: "networkidle0" });
  await new Promise((done) => setTimeout(done, 900));
};

const capture = (name) => page.screenshot({ path: resolve(output, name), fullPage: false });

await open("/", 390);
await capture("01-landing-mobile.png");

await open("/today?reset=1", 1440);
await page.waitForFunction(() => [...document.querySelectorAll("button")].some((button) => button.textContent?.includes("asking me for something")));
await capture("02-today-desktop.png");

await open("/today?reset=1", 390);
await clickText("asking me for something");
await new Promise((done) => setTimeout(done, 500));
await capture("03-request-mobile.png");

await open("/today?reset=1", 1440);
await clickText("asking me for something");
await new Promise((done) => setTimeout(done, 350));
await clickText("See what it costs");
await new Promise((done) => setTimeout(done, 650));
await capture("04-forecast-desktop.png");

await open("/today?reset=1", 390);
await clickText("Choose a different commitment");
await new Promise((done) => setTimeout(done, 450));
await capture("05-hand-back-mobile.png");

await open("/week", 390);
await capture("06-week-mobile.png");

await open("/recover", 390);
await capture("07-quiet-day-mobile.png");

await open("/asks", 390);
await capture("08-decisions-mobile.png");

await browser.close();
console.log(`Captured eight README images from ${base} into ${output}`);
