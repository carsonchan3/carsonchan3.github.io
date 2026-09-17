import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(projectRoot, "content", "products");
const outputPath = path.join(projectRoot, "client", "src", "lib", "productContent.generated.ts");

type Language = "en" | "zh-Hant";
type Localized = { en: string; "zh-Hant": string };
type Detail = {
  platformLabel: string;
  premiumTitle: string;
  careTitle: string;
  careDescription: string;
  tiers: Record<string, { label: string; subtitle: string; features: string[] }>;
  specifications: Array<[string, string]>;
  inTheBox: string[];
};
type Variant = {
  id: string;
  label: string;
  name: string;
  model: string;
  price: string;
  tier?: string;
  image: string;
  imageAlt: string;
};
type ProductContent = {
  familyId: string;
  order: number;
  visible: boolean;
  title: Localized;
  category: Localized;
  description: Localized;
  variants: Variant[];
  defaultTier?: string;
  vliCareTiers: string[];
  detail?: { en: Detail; "zh-Hant": Detail };
};

function parseKeyValue(lines: string[]) {
  const values: Record<string, string> = {};
  for (const line of lines) {
    if (line.trim().startsWith("#")) continue;
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    values[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  return values;
}

function parseDetail(source: string, language: Language, file: string): Detail | undefined {
  const marker = new RegExp(`<!--\\s*detail:${language}\\s*-->\\s*([\\s\\S]*?)(?=<!--\\s*detail:|$)`).exec(source);
  if (!marker) return undefined;
  const values = parseKeyValue(marker[1].trim().split("\n"));
  const required = ["platformLabel", "premiumTitle", "careTitle", "careDescription", "specifications", "inTheBox"];
  for (const key of required) {
    if (values[key] === undefined) throw new Error(`${file}: detail:${language} block is missing "${key}"`);
  }
  const tiers: Detail["tiers"] = {};
  for (const [key, value] of Object.entries(values)) {
    const match = /^tier\.([^.]+)\.(label|subtitle|features)$/.exec(key);
    if (!match) continue;
    const [, tier, field] = match;
    tiers[tier] ??= { label: "", subtitle: "", features: [] };
    if (field === "features") tiers[tier].features = value.split("||").map((item) => item.trim()).filter(Boolean);
    else tiers[tier][field] = value;
  }
  const specifications = values.specifications.split("||").map((item) => item.trim()).filter(Boolean).map((item) => {
    const separator = item.indexOf("|");
    if (separator === -1) throw new Error(`${file}: detail:${language} specification "${item}" must use "Label | Value"`);
    return [item.slice(0, separator).trim(), item.slice(separator + 1).trim()] as [string, string];
  });
  return {
    platformLabel: values.platformLabel,
    premiumTitle: values.premiumTitle,
    careTitle: values.careTitle,
    careDescription: values.careDescription,
    tiers,
    specifications,
    inTheBox: values.inTheBox.split("||").map((item) => item.trim()).filter(Boolean),
  };
}

function parseVariants(metadata: Record<string, string>, file: string, title: string): Variant[] {
  const ids: string[] = [];
  for (const key of Object.keys(metadata)) {
    const match = /^variant\.([^.]+)\./.exec(key);
    if (match && !ids.includes(match[1])) ids.push(match[1]);
  }
  if (!ids.length) throw new Error(`${file}: add at least one variant (variant.<id>.label, .price, .image ...)`);
  return ids.map((id) => {
    const field = (name: string) => metadata[`variant.${id}.${name}`] ?? "";
    for (const name of ["label", "price", "image"]) {
      if (!field(name)) throw new Error(`${file}: variant.${id}.${name} is required`);
    }
    return {
      id,
      label: field("label"),
      name: field("name") || `${title} ${field("label")}`,
      model: field("model"),
      price: field("price"),
      ...(field("tier") ? { tier: field("tier") } : {}),
      image: field("image"),
      imageAlt: field("imageAlt") || `${title} ${field("label")}`,
    };
  });
}

function parseProduct(rawSource: string, file: string): ProductContent {
  const source = rawSource.replace(/\r\n/g, "\n");
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing the --- frontmatter --- block at the top`);
  const metadata = parseKeyValue(match[1].split("\n"));
  for (const key of ["familyId", "title.en", "title.zh-Hant", "category.en"]) {
    if (!metadata[key]) throw new Error(`${file}: "${key}" is required`);
  }

  const sections = match[2].split(/^<!--\s*locale:(en|zh-Hant)\s*-->\s*$/m);
  const body: Localized = { en: "", "zh-Hant": "" };
  for (let index = 1; index < sections.length; index += 2) {
    const language = sections[index] as Language;
    body[language] = sections[index + 1].split(/<!--\s*detail:/, 1)[0].trim();
  }
  const description: Localized = {
    en: body.en || metadata["description.en"] || "",
    "zh-Hant": body["zh-Hant"] || metadata["description.zh-Hant"] || "",
  };
  if (!description.en || !description["zh-Hant"]) throw new Error(`${file}: add both <!-- locale:en --> and <!-- locale:zh-Hant --> descriptions`);

  const variants = parseVariants(metadata, file, metadata["title.en"]);
  const order = metadata.order ? Number(metadata.order) : 999;
  if (!Number.isFinite(order)) throw new Error(`${file}: order must be a number`);

  const detailEn = parseDetail(match[2], "en", file);
  const detailZh = parseDetail(match[2], "zh-Hant", file);
  if (Boolean(detailEn) !== Boolean(detailZh)) throw new Error(`${file}: provide detail blocks for both languages or neither`);
  const vliCareTiers = (metadata.vliCareTiers ?? "").split(",").map((tier) => tier.trim()).filter(Boolean);

  if (detailEn && detailZh) {
    const tierIds = Object.keys(detailEn.tiers);
    if (!tierIds.length) throw new Error(`${file}: detail blocks need at least one tier.<name>.label`);
    for (const tier of tierIds) {
      if (!detailZh.tiers[tier]) throw new Error(`${file}: tier "${tier}" is in detail:en but missing from detail:zh-Hant`);
      if (!variants.some((variant) => variant.tier === tier)) throw new Error(`${file}: no variant has "tier: ${tier}" — set variant.<id>.tier: ${tier}`);
    }
    for (const variant of variants) {
      if (variant.tier && !tierIds.includes(variant.tier)) throw new Error(`${file}: variant.${variant.id}.tier "${variant.tier}" has no matching tier.${variant.tier}.* lines in the detail blocks`);
    }
    if (metadata.defaultTier && !tierIds.includes(metadata.defaultTier)) throw new Error(`${file}: defaultTier "${metadata.defaultTier}" is not one of: ${tierIds.join(", ")}`);
  }

  return {
    familyId: metadata.familyId,
    order,
    visible: (metadata.visible ?? "true").toLowerCase() !== "false",
    title: { en: metadata["title.en"], "zh-Hant": metadata["title.zh-Hant"] },
    category: { en: metadata["category.en"], "zh-Hant": metadata["category.zh-Hant"] || metadata["category.en"] },
    description,
    variants,
    ...(metadata.defaultTier ? { defaultTier: metadata.defaultTier } : {}),
    vliCareTiers,
    detail: detailEn && detailZh ? { en: detailEn, "zh-Hant": detailZh } : undefined,
  };
}

const filenames = (await readdir(contentRoot)).filter((filename) => filename.endsWith(".md")).sort();
const products = (await Promise.all(filenames.map(async (filename) => parseProduct(await readFile(path.join(contentRoot, filename), "utf8"), `content/products/${filename}`))))
  .sort((a, b) => a.order - b.order || a.familyId.localeCompare(b.familyId));

const familyIds = new Set<string>();
const variantIds = new Set<string>();
for (const product of products) {
  if (familyIds.has(product.familyId)) throw new Error(`Duplicate familyId "${product.familyId}"`);
  familyIds.add(product.familyId);
  for (const variant of product.variants) {
    if (variantIds.has(variant.id)) throw new Error(`Variant id "${variant.id}" is used more than once — variant ids must be unique across all products`);
    variantIds.add(variant.id);
  }
}

const detailType = `{ platformLabel: string; premiumTitle: string; careTitle: string; careDescription: string; tiers: Record<string, { label: string; subtitle: string; features: string[] }>; specifications: Array<[string, string]>; inTheBox: string[] }`;
await writeFile(outputPath, `// Generated by scripts/generate-product-data.mts. Edit Markdown files under content/products instead.
export type ProductVariantContentRecord = {
  id: string;
  label: string;
  name: string;
  model: string;
  price: string;
  tier?: string;
  image: string;
  imageAlt: string;
};
export type ProductDetailContentRecord = {
  familyId: string;
  order: number;
  visible: boolean;
  title: { en: string; "zh-Hant": string };
  category: { en: string; "zh-Hant": string };
  description: { en: string; "zh-Hant": string };
  variants: ProductVariantContentRecord[];
  defaultTier?: string;
  vliCareTiers: string[];
  detail?: {
    en: ${detailType};
    "zh-Hant": ${detailType};
  };
};
export const productContent: readonly ProductDetailContentRecord[] = ${JSON.stringify(products, null, 2)};
`, "utf8");
console.log(`Generated ${products.length} product content record(s).`);
