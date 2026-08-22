import { chromium } from "playwright-core";

const baseUrl = process.env.ROUTE_TEST_URL ?? "http://127.0.0.1:3000";

async function verify(viewport) {
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  await page.goto(`${baseUrl}/outside-the-boundary`, { waitUntil: "networkidle" });
  const errorPage = {
    heading: await page.locator("h1").textContent(),
    returnHomeHref: await page.locator('a[href="/"]').last().getAttribute("href"),
    requestDemoHref: await page.locator('a[href="/contact"]').getAttribute("href"),
  };

  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  const partners = await page.evaluate(() => {
    const section = document.querySelector("#partners");
    const heading = section?.querySelector("h2");
    const firstPartnerLabel = section?.querySelector("article p");
    const logoPanel = section?.querySelector("article > div");
    if (!section || !heading || !firstPartnerLabel || !logoPanel) throw new Error("Partners section content is missing");

    return {
      background: getComputedStyle(section).backgroundColor,
      headingColor: getComputedStyle(heading).color,
      labelColor: getComputedStyle(firstPartnerLabel).color,
      logoPanelBackground: getComputedStyle(logoPanel).backgroundColor,
    };
  });

  await browser.close();
  return { viewport, errorPage, partners };
}

const [desktop, mobile] = await Promise.all([
  verify({ width: 1280, height: 720 }),
  verify({ width: 375, height: 812 }),
]);

const expectedHeading = "This route is outside the competition boundary.";
const verified = [desktop, mobile].every(({ errorPage, partners }) =>
  errorPage.heading?.replace(/\s+/g, " ").trim() === expectedHeading &&
  errorPage.returnHomeHref === "/" &&
  errorPage.requestDemoHref === "/contact" &&
  partners.background === "rgb(39, 40, 43)" &&
  partners.headingColor === "rgb(247, 243, 235)" &&
  partners.labelColor.includes("0.8") &&
  partners.logoPanelBackground === "rgb(255, 255, 255)",
);

console.log(JSON.stringify({ desktop, mobile, verified }, null, 2));
if (!verified) process.exit(1);
