import { chromium } from "playwright-core";

const baseUrl = process.env.FORM_TEST_URL ?? "http://127.0.0.1:3000";

async function runViewport(viewport) {
  const capturedBodies = [];
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  await page.route("**/api/trpc/contact.submit**", async (route) => {
    capturedBodies.push(route.request().postData() ?? "");
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify([{ result: { data: { json: { success: true, notificationSent: true } } } }]),
    });
  });

  await page.goto(`${baseUrl}/contact`, { waitUntil: "networkidle" });
  const enquiryForm = page.getByTestId("contact-enquiry-form");
  const enquiryHoneypotHidden = await page.evaluate(() =>
    Array.from(document.querySelectorAll('input[name="website"]')).some((node) => node.classList.contains("sr-only")),
  );
  await enquiryForm.locator('input[name="name"]').fill("Security Check Visitor");
  await enquiryForm.locator('input[name="email"]').fill("security-check@example.com");
  await enquiryForm.locator('textarea[name="message"]').fill("Please provide information about a secure demo request.");
  await enquiryForm.getByRole("button", { name: "Send enquiry" }).click();
  await page.waitForTimeout(100);

  await page.goto(`${baseUrl}/pricing`, { waitUntil: "networkidle" });
  await page.getByTestId("pricing-tier-managed").click();
  await page.getByTestId("acquisition-rental").click();
  const dialog = page.locator('[data-slot="dialog-content"]');
  await dialog.waitFor({ state: "visible" });
  const pricingHoneypotHidden = await page.evaluate(() =>
    Array.from(document.querySelectorAll('input[name="website"]')).some((node) => node.classList.contains("sr-only")),
  );
  await dialog.locator('input[name="name"]').fill("Security Check Visitor");
  await dialog.locator('input[name="email"]').fill("security-check@example.com");
  await dialog.locator('textarea[name="message"]').fill("Please provide information about a secure pricing request.");
  await dialog.getByRole("button", { name: "Get Pricing" }).click();
  await dialog.waitFor({ state: "hidden" });

  const result = {
    hiddenHoneypots: enquiryHoneypotHidden && pricingHoneypotHidden,
    requestCount: capturedBodies.length,
    sentNoHoneypotValue: capturedBodies.every((body) => !body.includes("security-check@example.com\"},\"website\":\"")),
    pricingSelectionPreserved: capturedBodies.some((body) => body.includes("Managed") && body.includes("Event service")),
    pricingModalClosed: await dialog.count() === 0 || !(await dialog.isVisible().catch(() => false)),
  };

  await browser.close();
  return result;
}

const [desktop, mobile] = await Promise.all([
  runViewport({ width: 1280, height: 720 }),
  runViewport({ width: 375, height: 812 }),
]);

const verified =
  desktop.hiddenHoneypots &&
  mobile.hiddenHoneypots &&
  desktop.requestCount === 2 &&
  mobile.requestCount === 2 &&
  desktop.sentNoHoneypotValue &&
  mobile.sentNoHoneypotValue &&
  desktop.pricingSelectionPreserved &&
  mobile.pricingSelectionPreserved &&
  desktop.pricingModalClosed &&
  mobile.pricingModalClosed;

console.log(JSON.stringify({ desktop, mobile, verified }, null, 2));
if (!verified) process.exit(1);
