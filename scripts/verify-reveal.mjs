import { chromium } from "playwright-core";

const baseUrl = process.env.REVEAL_TEST_URL ?? "http://127.0.0.1:3000/";

async function verifyStandardMotion(viewport) {
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
  const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
  const page = await context.newPage();

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector("#hero [data-reveal]")?.classList.contains("is-revealed"));

  const offscreenRevealExists = await page.locator("[data-reveal].reveal-up:not(.is-revealed)").count();

  await page.locator("#how-it-works").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const target = document.querySelector("#how-it-works [data-reveal]");
    return target?.classList.contains("is-revealed") ?? false;
  });

  const workflowRevealed = await page.locator("#how-it-works [data-reveal].is-revealed").count();
  await browser.close();

  return {
    viewport,
    offscreenRevealExists: offscreenRevealExists > 0,
    workflowRevealed,
  };
}

async function verifyReducedMotion() {
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: "reduce" });
  const page = await context.newPage();

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelectorAll("[data-reveal]").length > 0);
  const result = await page.evaluate(() => {
    const revealTargets = Array.from(document.querySelectorAll("[data-reveal]"));
    return {
      total: revealTargets.length,
      revealed: revealTargets.filter((target) => target.classList.contains("is-revealed")).length,
    };
  });

  await browser.close();
  return result;
}

const [desktop, mobile, reducedMotion] = await Promise.all([
  verifyStandardMotion({ width: 1280, height: 720 }),
  verifyStandardMotion({ width: 375, height: 812 }),
  verifyReducedMotion(),
]);

const verified =
  desktop.offscreenRevealExists &&
  desktop.workflowRevealed > 0 &&
  mobile.offscreenRevealExists &&
  mobile.workflowRevealed > 0 &&
  reducedMotion.total > 0 &&
  reducedMotion.revealed === reducedMotion.total;

console.log(JSON.stringify({ desktop, mobile, reducedMotion, verified }, null, 2));

if (!verified) process.exit(1);
