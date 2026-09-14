# VLI Product Description Authoring Guide

Product marketing descriptions are managed through Markdown files in `content/products/`. You can update the English and Traditional Chinese description shown on the Equipment catalogue and in the premium product detail modal without opening Manus. Product prices, images, catalogue references, variant identifiers, and quote-cart behavior remain controlled by the existing catalogue data and owner tools.

## Edit a product

From the Equipment catalogue, choose **Edit product content on GitHub**. GitHub will open the `content/products/` folder. Each Markdown filename is the stable family identifier used by the site. Edit the matching file rather than renaming it.

For example, `content/products/tops-shield-220.md` controls the marketing description for the TOPS Shield 220 family, including its RTF, travel, and PNP options.

Each file has this structure:

```markdown
---
familyId: tops-shield-220
title.en: TOPS Shield 220
title.zh-Hant: TOPS Shield 220
description.en: The English description shown in the catalogue.
description.zh-Hant: 顯示於產品目錄的繁體中文描述。
---

<!-- locale:en -->
The English description shown in the catalogue.

<!-- locale:zh-Hant -->
顯示於產品目錄的繁體中文描述。
```

The description in each locale section must match the corresponding frontmatter description. This deliberate duplication keeps the file easy to read in GitHub while allowing the build to validate that the metadata and rendered content are consistent.

## Publish an update

Commit the change to the `main` branch. The existing GitHub Pages workflow automatically regenerates the typed product-content module, rebuilds the static catalogue, and publishes the update. The description will appear at:

```text
https://velocity-lab.com/product/
https://velocity-lab.com/zh-hant/product/
```

For premium families—TOPS Shield 205, TOPS Shield 220, R220F, and TOPS Shield 400—the Markdown description is also used as the opening product brief inside the premium detail experience. The tier cards, specifications, VLI CARE information, prices, images, and Add to Quote behavior remain unchanged.

## What not to change

Do not change `familyId`, Markdown filenames, prices, source identifiers, image paths, or variant definitions in these files. Those fields are intentionally not accepted by the product Markdown generator. If a price, product image, product variant, or quote configuration needs to change, use the existing owner catalogue workflow or request a separate site change.

Keep descriptions specific, accurate, and suitable for business buyers. Avoid unsupported performance claims, placeholder testimonials, invented reviews, or unverified specifications. Use one concise paragraph or two short paragraphs; the catalogue card truncates longer descriptions while the detail modal displays the full copy.

## Current product files

The current editable families include `tops-shield-205`, `tops-shield-220`, `fb200-racer`, `fb210-racer`, `r200`, `r200f`, `r220f`, `tops-shield-400`, `ace-lipo-battery`, `usb-charger`, `b3-balance-charger`, `d6-pro`, and `inflatable-drone-soccer-field`. Some families remain intentionally hidden from the public catalogue, but their content files are retained so the source remains organised and ready for future use.
