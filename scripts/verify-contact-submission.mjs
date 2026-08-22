import { chromium } from "playwright-core";

const baseUrl = process.env.ROUTE_TEST_URL ?? "http://127.0.0.1:3000";
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

await page.route("**/api/trpc/contact.submit*", async (route) => {
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify([{ result: { data: { json: { success: true, notificationSent: true, message: "Contact form submitted successfully" } } } }]),
  });
});

await page.goto(`${baseUrl}/contact`, { waitUntil: "domcontentloaded" });
const form = page.getByTestId("contact-enquiry-form");
await form.locator('input[name="name"]').fill("Browser Verification");
await form.locator('input[name="email"]').fill("verification@example.com");
await form.locator('textarea[name="message"]').fill("Please confirm the dedicated Contact page form completes successfully.");
await form.getByRole("button", { name: "Send enquiry" }).click();
await page.waitForTimeout(150);

const result = {
  successToastPresent: await page.getByText("Enquiry received. Our team will contact you within one business day.").count() === 1,
  nameReset: await form.locator('input[name="name"]').inputValue() === "",
  messageReset: await form.locator('textarea[name="message"]').inputValue() === "",
  submitButtonText: await form.getByRole("button").innerText(),
};

console.log(JSON.stringify(result));
await browser.close();

if (!result.successToastPresent || !result.nameReset || !result.messageReset || result.submitButtonText !== "Send enquiry") process.exit(1);
