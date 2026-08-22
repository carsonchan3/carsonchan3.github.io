import { chromium } from "playwright-core";

const baseUrl = process.env.NAVIGATION_TEST_URL ?? "http://127.0.0.1:3000/";
const removedLabels = ["Features", "How It Works", "Partners"];
const retainedLabels = ["Demo", "People", "Contact"];

async function inspectNavigation(viewport, openMobileMenu) {
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  if (openMobileMenu) {
    await page.locator("header > div > button").last().click();
  }

  const labels = (await page.locator("header nav").allTextContents()).join(" ").replace(/\s+/g, " ").trim();
  await browser.close();
  return { viewport, labels };
}

const [desktop, mobile] = await Promise.all([
  inspectNavigation({ width: 1280, height: 720 }, false),
  inspectNavigation({ width: 375, height: 812 }, true),
]);

const verified = [desktop, mobile].every(({ labels }) =>
  retainedLabels.every((label) => labels.includes(label)) &&
  removedLabels.every((label) => !labels.includes(label)),
);

console.log(JSON.stringify({ desktop, mobile, verified }, null, 2));
if (!verified) process.exit(1);
