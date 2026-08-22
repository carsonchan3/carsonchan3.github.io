import { chromium } from "playwright-core";

const baseUrl = process.env.HERO_TEST_URL ?? "http://127.0.0.1:3000/";

async function inspect(viewport) {
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });

  const result = await page.evaluate(() => {
    const paragraphs = document.querySelectorAll("#hero p");
    const copy = paragraphs[paragraphs.length - 1];
    const actions = document.querySelector("#hero .mt-8");
    if (!copy || !actions) throw new Error("Hero copy or action group is missing");

    const copyBounds = copy.getBoundingClientRect();
    const actionBounds = actions.getBoundingClientRect();
    return {
      gap: Math.round(actionBounds.top - copyBounds.bottom),
      buttons: actions.querySelectorAll("button").length,
    };
  });

  await browser.close();
  return { viewport, ...result };
}

const [desktop, mobile] = await Promise.all([
  inspect({ width: 1280, height: 720 }),
  inspect({ width: 375, height: 812 }),
]);

const verified = [desktop, mobile].every(({ gap, buttons }) => gap >= 32 && buttons === 2);
console.log(JSON.stringify({ desktop, mobile, verified }, null, 2));
if (!verified) process.exit(1);
