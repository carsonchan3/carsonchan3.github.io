import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
const page = await browser.newPage();
await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });

const diagnostic = await page.evaluate(() => ({
  forms: document.querySelectorAll("form").length,
  revealForms: document.querySelectorAll("form[data-reveal]").length,
  websiteInputs: document.querySelectorAll('input[name="website"]').length,
  formMarkup: Array.from(document.querySelectorAll("form")).map((form) => form.outerHTML.slice(0, 300)),
}));

console.log(JSON.stringify(diagnostic, null, 2));
await browser.close();
