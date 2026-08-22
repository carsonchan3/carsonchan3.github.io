import { chromium } from "playwright-core";

const baseUrl = process.env.NEW_PAGES_TEST_URL ?? "http://127.0.0.1:3000";
const expectedPages = [
  ["/product", "Make every call defensible."],
  ["/use-cases", "One calibrated view. More confident competition."],
  ["/pricing", "Choose the path that fits your programme."],
  ["/people", "People behind the precision."],
];
const expectedNavigation = ["Product", "Use Cases", "Pricing", "Demo", "People", "Contact"];

async function verifyDesktop() {
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  const pages = [];

  for (const [path, heading] of expectedPages) {
    await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
    pages.push({ path, heading: (await page.locator("h1").textContent())?.replace(/\s+/g, " ").trim() });
  }

  await page.goto(`${baseUrl}/product`, { waitUntil: "networkidle" });
  const navigation = (await page.locator('header nav[aria-label="Primary navigation"]').textContent())?.replace(/\s+/g, " ").trim() ?? "";
  await browser.close();
  return { pages, navigation };
}

async function verifyMobile() {
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/product`, { waitUntil: "networkidle" });
  await page.locator("header button").click();
  const navigation = (await page.locator('header nav[aria-label="Mobile navigation"]').textContent())?.replace(/\s+/g, " ").trim() ?? "";
  await browser.close();
  return { navigation };
}

const [desktop, mobile] = await Promise.all([verifyDesktop(), verifyMobile()]);
const verified =
  desktop.pages.every((page, index) => page.heading === expectedPages[index][1]) &&
  expectedNavigation.every((label) => desktop.navigation.includes(label) && mobile.navigation.includes(label));

console.log(JSON.stringify({ desktop, mobile, verified }, null, 2));
if (!verified) process.exit(1);
