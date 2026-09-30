import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(projectRoot, "content", "bundles");
const pricingPath = path.join(projectRoot, "content", "pricing.md");
const outputPath = path.join(projectRoot, "client", "src", "lib", "bundleContent.generated.ts");

type Language = "en" | "zh-Hant";
type Localized = { en: string; "zh-Hant": string };
type BundlePrice = { price: string; optionPrice?: string };
type BundleContent = {
  id: string;
  order: number;
  visible: boolean;
  featured: boolean;
  title: Localized;
  tagline: Localized;
  price: string;
  priceNote: Localized;
  optionPrice?: string;
  optionPriceNote: Localized;
  cta: Localized;
  image: string;
  imageAlt: Localized;
  summary: Localized;
  includes: { en: string[]; "zh-Hant": string[] };
};

/** Reads the "## Bundles" table in content/pricing.md: ID | Bundle | Price | Option price. */
function parseBundlePrices(rawSource: string) {
  const prices = new Map<string, BundlePrice>();
  let inBundles = false;
  let columns: string[] | null = null;
  for (const rawLine of rawSource.replace(/\r\n/g, "\n").split("\n")) {
    const line = rawLine.trim();
    if (line.startsWith("## ")) {
      inBundles = line.slice(3).trim().toLowerCase() === "bundles";
      columns = null;
      continue;
    }
    if (!inBundles) continue;
    if (!line.startsWith("|")) {
      columns = null;
      continue;
    }
    const cells = line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
    if (!columns) {
      columns = cells.map((cell) => cell.toLowerCase());
      if (!columns.includes("id") || !columns.includes("price")) throw new Error(`content/pricing.md: the "## Bundles" table needs ID and Price columns`);
      continue;
    }
    if (cells.every((cell) => /^:?-+:?$/.test(cell))) continue;
    const id = cells[columns.indexOf("id")] ?? "";
    if (!id) continue;
    const price = cells[columns.indexOf("price")] ?? "";
    if (!price) throw new Error(`content/pricing.md: bundle "${id}" has an empty Price`);
    const optionIndex = columns.indexOf("option price");
    const optionPrice = optionIndex === -1 ? "" : cells[optionIndex] ?? "";
    if (prices.has(id)) throw new Error(`content/pricing.md: bundle "${id}" appears more than once in the Bundles table`);
    prices.set(id, { price, ...(optionPrice ? { optionPrice } : {}) });
  }
  return prices;
}

const prices = parseBundlePrices(await readFile(pricingPath, "utf8"));

function parseBundle(rawSource: string, file: string): BundleContent {
  const source = rawSource.replace(/\r\n/g, "\n");
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing the --- frontmatter --- block at the top`);
  const metadata: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    if (line.trim().startsWith("#")) continue;
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    metadata[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  for (const key of ["id", "title.en", "title.zh-Hant", "image"]) {
    if (!metadata[key]) throw new Error(`${file}: "${key}" is required`);
  }
  const localized = (key: string, fallback = ""): Localized => ({
    en: metadata[`${key}.en`] || fallback,
    "zh-Hant": metadata[`${key}.zh-Hant`] || metadata[`${key}.en`] || fallback,
  });

  // Each locale section: paragraphs are the summary, "- " lines are the "What's included" list.
  const sections = match[2].split(/^<!--\s*locale:(en|zh-Hant)\s*-->\s*$/m);
  const summary: Localized = { en: "", "zh-Hant": "" };
  const includes: BundleContent["includes"] = { en: [], "zh-Hant": [] };
  for (let index = 1; index < sections.length; index += 2) {
    const language = sections[index] as Language;
    const paragraphs: string[] = [];
    for (const line of sections[index + 1].split("\n").map((item) => item.trim())) {
      if (!line) continue;
      if (/^[-*]\s+/.test(line)) includes[language].push(line.replace(/^[-*]\s+/, ""));
      else paragraphs.push(line);
    }
    summary[language] = paragraphs.join(" ");
  }
  for (const language of ["en", "zh-Hant"] as const) {
    if (!includes[language].length) throw new Error(`${file}: add the included items as "- " lines under <!-- locale:${language} -->`);
  }
  if (includes.en.length !== includes["zh-Hant"].length) throw new Error(`${file}: the English list has ${includes.en.length} items but the Chinese list has ${includes["zh-Hant"].length} — keep them in step`);

  const price = prices.get(metadata.id);
  if (!price) throw new Error(`content/pricing.md: add a row for bundle "${metadata.id}" to the Bundles table`);
  const optionPriceNote = localized("optionPriceNote");
  if (price.optionPrice && !optionPriceNote.en) throw new Error(`${file}: pricing.md gives "${metadata.id}" an Option price, so add optionPriceNote.en / optionPriceNote.zh-Hant to explain it`);
  const order = metadata.order ? Number(metadata.order) : 999;
  if (!Number.isFinite(order)) throw new Error(`${file}: order must be a number`);

  return {
    id: metadata.id,
    order,
    visible: (metadata.visible ?? "true").toLowerCase() !== "false",
    featured: (metadata.featured ?? "false").toLowerCase() === "true",
    title: localized("title"),
    tagline: localized("tagline"),
    price: price.price,
    priceNote: localized("priceNote"),
    ...(price.optionPrice ? { optionPrice: price.optionPrice } : {}),
    optionPriceNote,
    cta: { en: metadata["cta.en"] || "Request this bundle", "zh-Hant": metadata["cta.zh-Hant"] || "查詢此套裝" },
    image: metadata.image,
    imageAlt: localized("imageAlt", metadata["title.en"]),
    summary,
    includes,
  };
}

const filenames = (await readdir(contentRoot)).filter((filename) => filename.endsWith(".md")).sort();
const bundles = (await Promise.all(filenames.map(async (filename) => parseBundle(await readFile(path.join(contentRoot, filename), "utf8"), `content/bundles/${filename}`))))
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

const ids = new Set<string>();
for (const bundle of bundles) {
  if (ids.has(bundle.id)) throw new Error(`Duplicate bundle id "${bundle.id}"`);
  ids.add(bundle.id);
}
for (const id of prices.keys()) {
  if (!ids.has(id)) throw new Error(`content/pricing.md: bundle ID "${id}" does not match any file in content/bundles — fix or remove that row`);
}

await writeFile(outputPath, `// Generated by scripts/generate-bundle-data.mts. Edit Markdown files under content/bundles (and the Bundles table in content/pricing.md) instead.
export type BundleContentRecord = {
  id: string;
  order: number;
  visible: boolean;
  featured: boolean;
  title: { en: string; "zh-Hant": string };
  tagline: { en: string; "zh-Hant": string };
  price: string;
  priceNote: { en: string; "zh-Hant": string };
  optionPrice?: string;
  optionPriceNote: { en: string; "zh-Hant": string };
  cta: { en: string; "zh-Hant": string };
  image: string;
  imageAlt: { en: string; "zh-Hant": string };
  summary: { en: string; "zh-Hant": string };
  includes: { en: string[]; "zh-Hant": string[] };
};
export const bundleContent: readonly BundleContentRecord[] = ${JSON.stringify(bundles, null, 2)};
`, "utf8");
console.log(`Generated ${bundles.length} bundle content record(s).`);
