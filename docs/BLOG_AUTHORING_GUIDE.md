# VLI Blog Authoring Guide

The VLI blog is generated from Markdown files in `content/blog/`. You can add or edit articles directly in GitHub without opening Manus. After the change is committed to the `main` branch, the existing GitHub Pages workflow regenerates the blog data, prerenders every article, rebuilds the sitemap, and publishes the site.

## Add an article through GitHub

Open the repository on GitHub and navigate to `content/blog/`. Choose **Add file → Create new file**, then use a filename that matches the permanent slug, such as `how-to-prepare-a-drone-sports-venue.md`. The filename is only for organisation; the `slug` in the frontmatter is the public URL identifier.

Every article must include the following frontmatter fields:

```yaml
---
slug: how-to-prepare-a-drone-sports-venue
publishedAt: 2026-09-20
author: Velocity Lab Innovation
coverImage: /manus-storage/vli-hero-video-first-frame_6e981c30.jpg
title.en: How to Prepare a Drone Sports Venue
title.zh-Hant: 如何準備無人機運動場地
description.en: A concise search-result summary of the article.
description.zh-Hant: 文章在搜尋結果中顯示的簡短摘要。
category.en: Event operations
category.zh-Hant: 賽事營運
---
```

The optional `updatedAt` field can be added when an article receives a substantial revision. Keep `publishedAt` stable after publication so the article’s URL and date remain predictable.

After the frontmatter, add exactly two locale sections. The English section begins with `<!-- locale:en -->` and the Traditional Chinese section begins with `<!-- locale:zh-Hant -->`.

```markdown
<!-- locale:en -->
# Article title

Write the English article here using normal Markdown.

## A useful subheading

Use short paragraphs, descriptive headings, and links where they help the reader.

<!-- locale:zh-Hant -->
# 文章標題

在此加入繁體中文文章內容。
```

## Publish and verify

Commit the file directly to `main`. The workflow named **Deploy static content to Pages** will run automatically. The article will be available at both:

```text
https://velocity-lab.com/blog/<slug>/
https://velocity-lab.com/zh-hant/blog/<slug>/
```

The build also adds both language versions to `sitemap.xml`, emits canonical and `hreflang` links, and adds Article and breadcrumb structured data. If the workflow fails, open the failed GitHub Actions run and correct the Markdown frontmatter or locale markers before committing again.

## Editorial and SEO checklist

Use a specific, useful title rather than a slogan. Keep each description concise and accurate to the article. Use one clear H1, then organise the article with H2 headings. Make the first paragraph answer the reader’s likely question quickly. Avoid copying the same article into multiple URLs; update the existing Markdown file instead. Use only images that VLI has permission to publish, and provide meaningful alt text if image syntax is added to an article.

The current CMS-ready structure means a GitHub-connected editor such as Decap CMS or Sveltia CMS can be added later without changing the public article format. Until a CMS is connected, GitHub’s web editor is the simplest secure manual publishing method because it uses the repository’s existing authenticated workflow and does not expose a write token in the public website.
