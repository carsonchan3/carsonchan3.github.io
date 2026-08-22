import { chromium } from "playwright-core";

const baseUrl = process.env.PRICING_TEST_URL ?? "http://127.0.0.1:3000";
let capturedPayload = "";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

await page.route("**/api/trpc/contact.submit**", async (route) => {
  const request = route.request();
  capturedPayload = `${request.url()}\n${request.postData() ?? ""}`;
  await route.fulfill({
    contentType: "application/json",
    body: JSON.stringify([{ result: { data: { json: { success: true, notificationSent: true } } } }]),
  });
});

await page.goto(`${baseUrl}/pricing`, { waitUntil: "networkidle" });
await page.getByTestId("pricing-tier-evidence-pro").click();
await page.getByTestId("acquisition-one-off-purchase").click();

const dialog = page.locator('[data-slot="dialog-content"]');
await dialog.waitFor({ state: "visible" });
await dialog.locator('input[name="name"]').fill("Pricing Test Visitor");
await dialog.locator('input[name="email"]').fill("pricing-test@example.com");
await dialog.locator('textarea[name="message"]').fill("We would like a test quote for a planned event.");
await dialog.getByRole("button", { name: "Get Pricing" }).click();
await dialog.waitFor({ state: "hidden" });

const verified =
  capturedPayload.includes("Pricing request") &&
  capturedPayload.includes("Evidence Pro") &&
  capturedPayload.includes("League or purchase plan");

console.log(JSON.stringify({ capturedPricingConfiguration: verified, modalClosed: true, verified }, null, 2));
await browser.close();
if (!verified) process.exit(1);
