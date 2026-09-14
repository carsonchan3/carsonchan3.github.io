import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { publicSeoPages } from "../client/src/lib/seo";
import { blogPosts } from "../client/src/lib/blog";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(projectRoot, "dist", "public");

async function assertIncludes(filePath: string, expected: string) {
  const contents = await readFile(filePath, "utf8");
  if (!contents.includes(expected)) throw new Error(`${filePath} is missing ${expected}`);
  return contents;
}

for (const page of publicSeoPages) {
  const englishPath = page.path === "/" ? path.join(outputRoot, "index.html") : path.join(outputRoot, page.path.slice(1), "index.html");
  const chinesePath = path.join(outputRoot, "zh-hant", ...(page.path === "/" ? [] : [page.path.slice(1)]), "index.html");
  const english = await assertIncludes(englishPath, 'data-seo-prerendered="true"');
  const chinese = await assertIncludes(chinesePath, 'lang="zh-Hant"');
  if (!english.includes(page.copy.en.title) || !english.includes('rel="canonical"')) throw new Error(`${englishPath} has incomplete English metadata`);
  if (!chinese.includes(page.copy["zh-Hant"].title) || !chinese.includes('hreflang="en"')) throw new Error(`${chinesePath} has incomplete Traditional Chinese metadata`);
}

await assertIncludes(path.join(outputRoot, "robots.txt"), "Sitemap: https://velocity-lab.com/sitemap.xml");
const sitemap = await assertIncludes(path.join(outputRoot, "sitemap.xml"), "https://velocity-lab.com/zh-hant/dronesportsreferee");
if (sitemap.includes("/owner")) throw new Error("Private owner routes must not be included in the sitemap");
for (const alias of ["equipment", "pricing"]) {
  await assertIncludes(path.join(outputRoot, alias, "index.html"), 'rel="canonical"');
  await assertIncludes(path.join(outputRoot, "zh-hant", alias, "index.html"), 'rel="canonical"');
}
await assertIncludes(path.join(outputRoot, "use-cases", "index.html"), 'Drone Sports Use Cases | Velocity Lab Innovation');
await assertIncludes(path.join(outputRoot, "zh-hant", "use-cases", "index.html"), '無人機運動應用場景 | 速研創新');
await assertIncludes(path.join(outputRoot, "robots.txt"), "Disallow: /owner");
for (const post of blogPosts) {
  const englishArticle = await assertIncludes(path.join(outputRoot, "blog", post.slug, "index.html"), post.title.en);
  const chineseArticle = await assertIncludes(path.join(outputRoot, "zh-hant", "blog", post.slug, "index.html"), post.title["zh-Hant"]);
  if (!englishArticle.includes('"@type":"Article"') || !chineseArticle.includes('"@type":"Article"')) throw new Error(`${post.slug} is missing Article structured data`);
  if (!sitemap.includes(`/blog/${post.slug}/`) || !sitemap.includes(`/zh-hant/blog/${post.slug}/`)) throw new Error(`${post.slug} is missing from the sitemap`);
}
await assertIncludes(path.join(outputRoot, "404.html"), 'content="noindex, nofollow"');

console.log("SEO static output verification passed.");
