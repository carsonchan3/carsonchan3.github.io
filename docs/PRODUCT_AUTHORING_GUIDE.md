# VLI Product Authoring Guide

The whole equipment catalogue lives in Markdown files under `content/products/`, one file per product family. Everything customers see is edited there: prices, versions (variants), model numbers, images, names, categories, descriptions, visibility, display order, premium package tiers, VLI CARE, technical specifications, and in-the-box contents.

Edit a file on GitHub (open it → pencil icon → **Commit changes** to `main`). The **Deploy static content to Pages** workflow rebuilds the site in about a minute. If the Markdown has a mistake, the workflow fails with a message naming the file and the problem, and the live site keeps the previous version.

## File structure

```markdown
---
familyId: tops-shield-220
order: 2
visible: true

title.en: TOPS Shield 220
title.zh-Hant: TOPS Shield 220
category.en: Drone platform
category.zh-Hant: 無人機平台

defaultTier: certified
vliCareTiers: certified

# Variant 27
variant.27.label: RTF
variant.27.name: TOPS Shield 220 RTF
variant.27.model: TZ002
variant.27.price: HK$3,718
variant.27.tier: certified
variant.27.image: /manus-storage/excel_prod_9_417b350f.png
variant.27.imageAlt: TOPS Shield 220 competition drone cage illustration
---

<!-- locale:en -->
English product description.

<!-- locale:zh-Hant -->
繁體中文產品描述。

<!-- detail:en -->
... premium detail fields (optional, see below)

<!-- detail:zh-Hant -->
... the same fields in Chinese
```

Lines starting with `#` inside the `---` block are notes and are ignored.

## Family fields

| Field | Required | What it does |
| --- | --- | --- |
| `familyId` | Yes | Permanent identifier. Do not change it after publishing. |
| `order` | No | Position in the catalogue (1 = first). Also sets the `#` reference numbers. |
| `visible` | No | `false` hides the product from the website. Default `true`. |
| `title.en` / `title.zh-Hant` | Yes | Product name on cards and in the product window. |
| `category.en` / `category.zh-Hant` | `.en` yes | Small label above the name. |
| `defaultTier` | No | Premium package selected when the window opens. |
| `vliCareTiers` | No | Comma-separated tiers that show the VLI CARE badge and “VLI CARE Activation Code”. Leave empty for none. |

The text under `<!-- locale:en -->` and `<!-- locale:zh-Hant -->` is the product description.

## Variants (versions and prices)

Each version is a group of `variant.<id>.<field>` lines. The `<id>` can be any short word or number, must be unique across **all** product files, and should not change once published (customers’ saved quote carts use it).

| Field | Required | What it does |
| --- | --- | --- |
| `label` | Yes | Version button text, e.g. `RTF`, `PNP`. |
| `price` | Yes | Shown exactly as typed, e.g. `HK$3,718`. The card shows “From …” using the lowest price. |
| `image` | Yes | Image path, e.g. `/manus-storage/…` or `/media/…` (files in the repository `media/` folder). |
| `name` | No | Full name sent in quote requests. Default: title + label. |
| `model` | No | Model number shown in the product window. |
| `imageAlt` | No | Image description for accessibility. |
| `tier` | Premium only | Which premium package this version is sold as (must match a `tier.<name>` in the detail blocks). |

**To change a price:** edit the `variant.<id>.price` line and commit.
**To add a version:** copy a variant group, give it a new unique id, and edit the values.
**To add a product:** copy an existing file, rename it, and change `familyId` and every variant id.

## Premium detail blocks (optional)

Adding `<!-- detail:en -->` and `<!-- detail:zh-Hant -->` blocks turns the product window into the premium package layout. Both languages are required.

```markdown
<!-- detail:en -->
platformLabel: 220 mm platform
premiumTitle: TOPS Shield 220: The Competition Workhorse
careTitle: Includes 1-Year VLI CARE
careDescription: Coverage for heavy collision damage, water damage, and rapid replacements.
tier.certified.label: VLI Certified Edition
tier.certified.subtitle: Ready-to-fly for competition teams and schools.
tier.certified.features: First feature. || Second feature. || Third feature.
tier.builder.label: Builder's Edition
tier.builder.subtitle: PNP platform for teams with their own control system.
tier.builder.features: Bring your own receiver. || Standard inspection.
specifications: Frame Diameter | 220 mm || Configuration | RTF or PNP
inTheBox: 1x Competition Ball Drone || 2x Sets of Competition Propellers
```

- Tiers appear in the order they are written. Tier names (`certified`, `builder`, `travel`, or any new word) must be the same in both languages, and each tier needs at least one variant with a matching `variant.<id>.tier`.
- Separate list items with `||`. In `specifications`, each row is `Label | Value`.

## Keep it accurate

Avoid unsupported performance claims, invented reviews, or unverified specifications. Use images VLI has permission to publish.
