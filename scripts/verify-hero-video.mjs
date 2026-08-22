import { chromium } from "playwright-core";

const baseUrl = process.env.HERO_VIDEO_TEST_URL ?? "http://127.0.0.1:3000";
const heroVideoPath = "/manus-storage/vli-hero-background_3b81117a.mp4";

async function inspectHero(viewport, reducedMotion = "no-preference") {
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
  const context = await browser.newContext({ viewport, reducedMotion });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const result = await page.locator("#hero").evaluate((hero, path) => {
    const video = hero.querySelector("video");
    const headline = hero.querySelector("h1");
    const scrollCue = hero.querySelector('a[href="#features"]');
    const nextSection = document.querySelector("#features");
    const headlineRect = headline?.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();

    return {
      hasVideo: Boolean(video),
      source: video?.currentSrc ?? "",
      poster: video?.poster ?? "",
      muted: video?.muted ?? false,
      loop: video?.loop ?? false,
      playsInline: video?.playsInline ?? false,
      paused: video?.paused ?? true,
      readyState: video?.readyState ?? 0,
      headlineLeft: headlineRect?.left ?? -1,
      heroWidth: heroRect.width,
      heroHeight: heroRect.height,
      heroAspect: heroRect.width / heroRect.height,
      nextSectionTop: nextSection?.getBoundingClientRect().top ?? -1,
      scrollCueVisible: scrollCue ? getComputedStyle(scrollCue).display !== "none" : false,
      scrollCueText: scrollCue?.textContent?.replace(/\s+/g, " ").trim() ?? "",
      expectedSource: path,
    };
  }, heroVideoPath);

  await browser.close();
  return result;
}

const [desktop, mobile, reducedMotion] = await Promise.all([
  inspectHero({ width: 1280, height: 720 }),
  inspectHero({ width: 375, height: 812 }),
  inspectHero({ width: 1280, height: 720 }, "reduce"),
]);

const hasRequiredVideoSettings = (result) =>
  result.hasVideo &&
  result.source.includes(result.expectedSource) &&
  result.poster.includes("velocity_lab_hero_product_8a3500e8.png") &&
  result.muted &&
  result.loop &&
  result.playsInline &&
  result.readyState >= 1;

const verified =
  hasRequiredVideoSettings(desktop) &&
  hasRequiredVideoSettings(mobile) &&
  desktop.headlineLeft > 0 &&
  desktop.headlineLeft < 100 &&
  mobile.headlineLeft > 0 &&
  mobile.headlineLeft < 60 &&
  desktop.heroAspect > 2.25 &&
  desktop.heroAspect < 2.4 &&
  desktop.nextSectionTop > 0 &&
  desktop.nextSectionTop < 720 &&
  desktop.scrollCueVisible &&
  desktop.scrollCueText.includes("Scroll to explore") &&
  !mobile.scrollCueVisible &&
  reducedMotion.paused;

console.log(JSON.stringify({ desktop, mobile, reducedMotion, verified }, null, 2));
if (!verified) process.exit(1);
