/**
 * Load each start, wait for the loop to settle, score the WebGL canvas.
 * Target band: mean luma 0.18–0.48, stddev (structure), little clipped white.
 */
import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";

const BASE = process.env.EVAL_URL ?? "http://127.0.0.1:5173";
const OUT = new URL("../eval-out/", import.meta.url);

const browser = await chromium.launch({
  channel: "chrome",
  args: ["--use-gl=angle", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.addInitScript(() => {
  sessionStorage.setItem("dlh-entered", "1");
  localStorage.setItem("dlh-coached", "1");
});
await page.goto(`${BASE}/?eval=1`, { waitUntil: "networkidle" });
await page.waitForTimeout(900);

const ids = await page.evaluate(() => window.__foldlight.ids());
await mkdir(new URL(".", OUT), { recursive: true });

const rows = [];
for (const id of ids) {
  await page.evaluate((sid) => window.__foldlight.start(sid), id);
  await page.waitForTimeout(2400);
  const buf = await page.locator("#view").screenshot({ type: "png" });
  await writeFile(new URL(`${id}.png`, OUT), buf);
  const s = await page.evaluate(() => {
    const src = document.querySelector("#view");
    const off = document.createElement("canvas");
    off.width = src.width;
    off.height = src.height;
    const ctx = off.getContext("2d");
    ctx.drawImage(src, 0, 0);
    const data = ctx.getImageData(0, 0, off.width, off.height).data;
    let sum = 0;
    let sum2 = 0;
    let white = 0;
    let black = 0;
    const n = off.width * off.height;
    for (let i = 0; i < data.length; i += 4) {
      const y = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
      sum += y;
      sum2 += y * y;
      if (y > 0.92) white++;
      if (y < 0.04) black++;
    }
    const mean = sum / n;
    const std = Math.sqrt(Math.max(0, sum2 / n - mean * mean));
    const whitePct = white / n;
    const blackPct = black / n;
    let band = "ok";
    if (mean < 0.14) band = "dark";
    else if (mean > 0.55) band = "hot";
    if (whitePct > 0.12) band = "white";
    if (std < 0.06 && mean > 0.2) band = "flat";
    return {
      mean: Number(mean.toFixed(3)),
      std: Number(std.toFixed(3)),
      whitePct: Number(whitePct.toFixed(3)),
      blackPct: Number(blackPct.toFixed(3)),
      band,
    };
  });
  rows.push({ id, ...s });
  console.log(id.padEnd(16), s.band.padEnd(6), `mean=${s.mean}`, `std=${s.std}`, `w=${s.whitePct}`, `k=${s.blackPct}`);
}

await writeFile(new URL("scores.json", OUT), JSON.stringify(rows, null, 2));
await browser.close();

const wow = rows.filter((r) => r.band === "ok").map((r) => r.id);
const sad = rows.filter((r) => r.band !== "ok");
console.log("\nOK:", wow.join(", ") || "(none)");
if (sad.length) console.log("Needs work:", sad.map((r) => `${r.id}(${r.band})`).join(", "));
