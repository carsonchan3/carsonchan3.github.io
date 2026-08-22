import { chromium } from "playwright-core";

const baseUrl = process.env.PRICING_TEST_URL ?? "http://127.0.0.1:3000";

async function inspectDesktop() {
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/pricing`, { waitUntil: "networkidle" });

  const tierCount = await page.locator('[data-testid^="pricing-tier-"]').count();
  await page.getByTestId("pricing-tier-managed").click();
  const managedSelected = await page.getByTestId("pricing-tier-managed").getAttribute("aria-pressed");
  await page.getByTestId("acquisition-one-off-purchase").click();

  const dialog = page.locator('[data-slot="dialog-content"]');
  await dialog.waitFor({ state: "visible" });
  const initialSummary = await page.getByTestId("pricing-selection-summary").textContent();
  await page.locator('select[name="pricingTier"]').selectOption("evidence-pro");
  await page.locator('select[name="acquisition"]').selectOption("rental");
  const revisedSummary = await page.getByTestId("pricing-selection-summary").textContent();
  const getPricingButton = await dialog.getByRole("button", { name: "Get Pricing" }).count();
  await browser.close();

  return { tierCount, managedSelected, initialSummary, revisedSummary, getPricingButton };
}

async function inspectMobile() {
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/pricing`, { waitUntil: "networkidle" });
  await page.getByTestId("acquisition-rental").click();
  const dialog = page.locator('[data-slot="dialog-content"]');
  await dialog.waitFor({ state: "visible" });
  const box = await dialog.boundingBox();
  const summary = await page.getByTestId("pricing-selection-summary").textContent();
  await browser.close();
  return { dialogWidth: box?.width ?? 0, summary };
}

const [desktop, mobile] = await Promise.all([inspectDesktop(), inspectMobile()]);
const verified =
  desktop.tierCount === 3 &&
  desktop.managedSelected === "true" &&
  desktop.initialSummary?.includes("Managed · League or purchase plan") &&
  desktop.revisedSummary?.includes("Evidence Pro · Event service") &&
  desktop.getPricingButton === 1 &&
  mobile.dialogWidth > 0 &&
  mobile.dialogWidth <= 375 &&
  mobile.summary?.includes("Managed · Event service");

console.log(JSON.stringify({ desktop, mobile, verified }, null, 2));
if (!verified) process.exit(1);
