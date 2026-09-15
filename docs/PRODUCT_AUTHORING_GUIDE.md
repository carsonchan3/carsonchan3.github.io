# VLI Product Detail Authoring Guide

The customer-facing product catalogue is managed through Markdown files in `content/products/`. You can update the English and Traditional Chinese product brief and, for premium product families, the complete detail experience without opening Manus.

Prices, images, variant identifiers, tier matching rules, quote-cart behavior, and database-managed product records remain protected by the application code. The Markdown layer controls the words customers read: the product brief, premium title, package labels, package summaries, included features, VLI CARE wording, technical specifications, and in-the-box contents.

## Edit a product

From the Equipment catalogue, choose **Edit product content on GitHub**. GitHub opens the `content/products/` folder. Edit the matching file rather than renaming it. The filename and `familyId` are stable identifiers used by the site.

For example, `content/products/tops-shield-220.md` controls the TOPS Shield 220 family, including its RTF, travel, and PNP package descriptions.

## Full Markdown structure

A premium product file uses frontmatter for the stable family identifier and bilingual catalogue description, followed by bilingual locale and detail sections:

```markdown
---
familyId: tops-shield-220
title.en: TOPS Shield 220
title.zh-Hant: TOPS Shield 220
description.en: The product brief shown in English.
description.zh-Hant: 顯示於繁體中文的產品簡介。
---

<!-- locale:en -->
The product brief shown in English.

<!-- locale:zh-Hant -->
顯示於繁體中文的產品簡介。

<!-- detail:en -->
platformLabel: 220 mm platform
premiumTitle: TOPS Shield 220: The Competition Workhorse
careTitle: Includes 1-Year VLI CARE
careDescription: Coverage for heavy collision damage, water damage, and rapid replacements.
tier.certified.label: VLI Certified Edition
tier.certified.subtitle: Ready-to-fly for competition teams and schools.
tier.certified.features: Competition-ready receiver and flight setup. || VLI pre-flight configuration check before handover.
tier.builder.label: Builder's Edition
tier.builder.subtitle: PNP platform for teams with their own control system.
tier.builder.features: Bring your own receiver and control equipment. || Flexible starting point for technical teams.
specifications: Frame Diameter | 220 mm || Configuration | RTF or PNP platform options
inTheBox: 1x Competition Ball Drone || 2x Sets of Competition Propellers

<!-- detail:zh-Hant -->
platformLabel: 220 毫米平台
premiumTitle: TOPS Shield 220：競賽主力平台
careTitle: 包括一年 VLI CARE
careDescription: 涵蓋嚴重碰撞損壞、進水損壞及快速更換支援。
tier.certified.label: VLI Certified Edition
tier.certified.subtitle: 適合競賽隊伍及學校的開箱即飛配置。
tier.certified.features: 競賽就緒的接收器及飛行設定。 || 交付前由 VLI 進行配置檢查。
tier.builder.label: Builder’s Edition
tier.builder.subtitle: 適合使用自備控制系統的隊伍的 PNP 平台。
tier.builder.features: 使用自備接收器及控制設備。 || 為技術隊伍提供靈活起點。
specifications: 機架直徑 | 220 毫米 || 配置 | RTF 或 PNP 平台選項
inTheBox: 1x 競賽球形無人機 || 2x 套競賽螺旋槳
```

Every detail field is editable in both languages. The `platformLabel` appears beside the product image. `premiumTitle` is the detail-page heading. Each `tier.<name>.label`, `subtitle`, and `features` entry controls a package card; separate feature items are divided with ` || `. The `certified` tier is the package selected by default for the existing premium families, and its VLI CARE badge uses `careTitle` and `careDescription`.

The `specifications` field controls the technical specification table. Separate rows are divided with ` || ` and each row uses `Label | Value`. The `inTheBox` field controls the package contents list, with each included item divided by ` || `.

## Current premium families

The complete detail schema is currently active for **TOPS Shield 205**, **TOPS Shield 220**, **R220F**, and **TOPS Shield 400**. These files control the visible package tiers, including **VLI Certified Edition**, **Builder’s Edition**, **Certified Travel Edition**, **VLI Ready-to-Deploy Edition**, and **VLI Certified Arena Edition**, as applicable to each product.

Other product files already support bilingual catalogue descriptions. They can receive full detail blocks later without changing their existing product IDs or pricing records.

## Publish an update

Commit the Markdown change to the `main` branch. The existing GitHub Pages workflow automatically regenerates the typed product-content module, rebuilds the static catalogue, validates the bilingual output, and publishes the update. The public catalogue is available at:

```text
https://velocity-lab.com/product/
https://velocity-lab.com/zh-hant/product/
```

For premium product families, the updated detail content appears inside the product modal. Prices, images, variant matching, tier default selection, VLI CARE eligibility, and Add to Quote behavior remain application-controlled.

## What not to change

Do not change the Markdown filename, `familyId`, prices, image paths, source identifiers, or variant definitions. Do not put HK$ prices or managed-media URLs into Markdown. If a price, image, product variant, or quote configuration needs to change, use the existing owner catalogue workflow or request a separate site change.

Keep copy accurate and suitable for business buyers. Avoid unsupported performance claims, invented reviews, fake testimonials, or unverified specifications. The build fails if a detail block is provided in only one language or if the locale description does not match its metadata description.
