import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
const page = await context.newPage();

await page.route("**/manus-storage/vli-hero-background_3b81117a.mp4", async (route) => {
  await route.abort();
});
await page.goto("http://127.0.0.1:3000/", { waitUntil: "domcontentloaded" });

const result = await page.locator("#hero").evaluate((hero) => {
  const video = hero.querySelector("video");
  const sectionStyle = getComputedStyle(hero);
  const videoStyle = video ? getComputedStyle(video) : null;
  return {
    hasPoster: Boolean(video?.getAttribute("poster")),
    heroBackground: sectionStyle.backgroundColor,
    videoBackground: videoStyle?.backgroundColor ?? "",
    videoPresent: Boolean(video),
  };
});

console.log(JSON.stringify(result, null, 2));
await browser.close();

if (result.hasPoster || result.heroBackground !== "rgb(0, 0, 0)" || !result.videoPresent) {
  process.exit(1);
}
