import { chromium } from "playwright-core";

const baseUrl = process.env.PALETTE_TEST_URL ?? "http://127.0.0.1:3000";

function relativeLuminance([red, green, blue]) {
  const channels = [red, green, blue].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}

function parseRgb(value) {
  const match = value.match(/\d+(?:\.\d+)?/g);
  return match ? match.slice(0, 3).map(Number) : [];
}

async function inspect(viewport, pathname) {
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto(`${baseUrl}${pathname}`, { waitUntil: "networkidle" });

  const colors = await page.evaluate((isHome) => {
    const read = (selector) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Missing selector: ${selector}`);
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, color: style.color };
    };

    return isHome
      ? {
          header: read("header"),
          headerLink: read("header nav a"),
          primarySection: read("#features"),
          primaryHeading: read("#features h2"),
          charcoalSection: read("#how-it-works"),
          charcoalHeading: read("#how-it-works h2"),
          footer: read("footer"),
        }
      : {
          header: read("header"),
          headerLink: read("header a"),
          primarySection: read("main > section:nth-of-type(2)"),
          primaryHeading: read("main > section:nth-of-type(2) h2"),
          lightCta: read("main > section:last-child"),
          lightHeading: read("main > section:last-child h2"),
        };
  }, pathname === "/");

  await browser.close();
  return { viewport, pathname, colors };
}

const [homeDesktop, homeMobile, peopleDesktop, peopleMobile] = await Promise.all([
  inspect({ width: 1280, height: 720 }, "/"),
  inspect({ width: 375, height: 812 }, "/"),
  inspect({ width: 1280, height: 720 }, "/people"),
  inspect({ width: 375, height: 812 }, "/people"),
]);

const offWhite = [247, 243, 235];
const ink = [28, 29, 32];
const charcoal = [39, 40, 43];
const footerCharcoal = [22, 23, 25];

const verified =
  [homeDesktop, homeMobile, peopleDesktop, peopleMobile].every((inspection) =>
    parseRgb(inspection.colors.header.background).every((value, index) => value === offWhite[index]),
  ) &&
  parseRgb(homeDesktop.colors.primarySection.background).every((value, index) => value === ink[index]) &&
  parseRgb(homeDesktop.colors.charcoalSection.background).every((value, index) => value === charcoal[index]) &&
  parseRgb(homeDesktop.colors.footer.background).every((value, index) => value === footerCharcoal[index]) &&
  contrastRatio(parseRgb(homeDesktop.colors.primaryHeading.color), ink) >= 7 &&
  contrastRatio(parseRgb(homeDesktop.colors.charcoalHeading.color), charcoal) >= 7 &&
  contrastRatio(parseRgb(peopleDesktop.colors.lightHeading.color), offWhite) >= 7;

console.log(
  JSON.stringify(
    {
      ratios: {
        homePrimary: contrastRatio(parseRgb(homeDesktop.colors.primaryHeading.color), ink).toFixed(2),
        homeCharcoal: contrastRatio(parseRgb(homeDesktop.colors.charcoalHeading.color), charcoal).toFixed(2),
        peopleLight: contrastRatio(parseRgb(peopleDesktop.colors.lightHeading.color), offWhite).toFixed(2),
      },
      verified,
    },
    null,
    2,
  ),
);

if (!verified) process.exit(1);
