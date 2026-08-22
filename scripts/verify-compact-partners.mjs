import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
const viewports = [
  { name: "desktop", width: 1280, height: 720 },
  { name: "mobile", width: 375, height: 812 },
];
const results = [];

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  results.push({
    viewport: viewport.name,
    ...(await page.evaluate(() => {
      const hero = document.querySelector("#hero");
      const partners = document.querySelector("#partners");
      const video = document.querySelector("#video");
      const bodyText = document.body.innerText;
      const heroBottom = hero?.getBoundingClientRect().bottom ?? 0;
      const partnerTop = partners?.getBoundingClientRect().top ?? 0;
      const partnerHeight = partners?.getBoundingClientRect().height ?? 0;
      const viewportHeight = window.innerHeight;
      const faviconHref = document.querySelector("link[rel~='icon']")?.getAttribute("href") ?? "";
      const cards = Array.from(partners?.querySelectorAll("article") ?? []).filter((card) => card.getBoundingClientRect().width > 0);
      const cardRatios = cards.map((card) => {
        const { width, height } = card.getBoundingClientRect();
        return Number((width / height).toFixed(3));
      });
      const logoSurfaceWidths = Array.from(partners?.querySelectorAll("article > div") ?? [])
        .filter((surface) => surface.getBoundingClientRect().width > 0)
        .map((surface) => Math.round(surface.getBoundingClientRect().width));
      const cardGroupCenter = cards.length > 0
        ? (cards[0].getBoundingClientRect().left + cards[cards.length - 1].getBoundingClientRect().right) / 2
        : 0;
      const mobileScroller = partners?.querySelector("[class*='overflow-x-scroll']");
      const scrollStart = mobileScroller instanceof HTMLElement ? mobileScroller.scrollLeft : 0;
      const horizontalOverflow = mobileScroller instanceof HTMLElement ? mobileScroller.scrollWidth - mobileScroller.clientWidth : 0;
      if (mobileScroller instanceof HTMLElement && horizontalOverflow > 0) {
        mobileScroller.scrollLeft = Math.min(80, horizontalOverflow);
      }
      const scrollEnd = mobileScroller instanceof HTMLElement ? mobileScroller.scrollLeft : 0;
      return {
        partnersSeparatedFromHero: Math.abs(partnerTop - heroBottom) > 2,
        partnerHeight,
        viewportHeight,
        partnerAfterVideo: Boolean(video && partners && video.compareDocumentPosition(partners) & Node.DOCUMENT_POSITION_FOLLOWING),
        faviconConfigured: faviconHref === "/manus-storage/vli-favicon_a7bf92f0.webp",
        standardHeadingHierarchy: partners?.querySelector("h2")?.textContent?.trim() === "Partners & Supporting Organizations" && bodyText.includes("Together, we are advancing fair, data-driven competition"),
        cardRatios,
        squareLogoPanels: cardRatios.length === 3 && cardRatios.every((cardRatio) => Math.abs(cardRatio - 1) <= 0.02),
        logoSurfaceWidths,
        enlargedLogoSurfaces: logoSurfaceWidths.length === 3 && logoSurfaceWidths.every((width) => width >= 112),
        desktopOrganizationGroupCentered: window.innerWidth < 768 || Math.abs(cardGroupCenter - window.innerWidth / 2) <= 2,
        mobileScrollFunctional: window.innerWidth >= 768 || (horizontalOverflow > 0 && scrollEnd > scrollStart),
        partnerBeforeVideo: Boolean(partners && video && partners.compareDocumentPosition(video) & Node.DOCUMENT_POSITION_FOLLOWING),
        removedLiveDemoCopy: !bodyText.includes("Watch the live demo"),
        removedMotionSupportCopy: !bodyText.includes("See how live motion capture can support"),
      };
    })),
  });
  await context.close();
}

console.log(JSON.stringify(results, null, 2));
await browser.close();
if (results.some((result) => !result.partnersSeparatedFromHero || !result.partnerAfterVideo || !result.faviconConfigured || !result.standardHeadingHierarchy || !result.squareLogoPanels || !result.enlargedLogoSurfaces || !result.desktopOrganizationGroupCentered || !result.mobileScrollFunctional || !result.removedLiveDemoCopy || !result.removedMotionSupportCopy)) process.exit(1);
