import { chromium } from "playwright-core";

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || "/usr/bin/chromium";
const browser = await chromium.launch({ executablePath, headless: true });

for (const [name, viewport] of [["desktop", { width: 1280, height: 900 }], ["mobile", { width: 375, height: 812 }]]) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/services", { waitUntil: "domcontentloaded" });
  await page.getByTestId("service-enquiry-trigger-01").click();
  await page.waitForTimeout(350);
  await page.screenshot({ path: `/home/ubuntu/repair-intake-${name}.png`, fullPage: name === "mobile" });
  if (name === "mobile") {
    await page.locator('[role="dialog"]').evaluate((dialog) => { dialog.scrollTop = dialog.scrollHeight; });
    await page.waitForTimeout(200);
    await page.screenshot({ path: "/home/ubuntu/repair-intake-mobile-checklist.png", fullPage: false });
  }
  await context.close();
}

await browser.close();
