# Velocity Lab Public Website: Beginner Editing Guide

This guide is for a content editor or basic engineer who needs to make safe updates to the public Velocity Lab website without learning the whole application. The public website is a React and TypeScript project published through GitHub Pages. The live public domain is `velocity-lab.com`; the source repository is `carsonchan3.github.io`.

> **Use this guide for routine content, navigation, language, image, and layout changes.** For architecture, external enquiries, design tokens, or structural refactors, read the [Engineering Manual](./ENGINEERING_MANUAL.md) first.

## 1. The safe editing routine

Use this sequence for every change. It reduces the risk of publishing a broken page or accidentally losing the Chinese version.

| Step | What to do | Why it matters |
| --- | --- | --- |
| 1 | Create a branch or work from an up-to-date `main`. | Keeps a recoverable history of each change. |
| 2 | Identify the page in `client/src/pages/`. | Most public copy belongs to one page file. |
| 3 | Update the English source text first. | English is the source text used by the translation system. |
| 4 | Add or update the exact English-to-Chinese entry in `client/src/lib/zhTranslations.ts`. | The public Chinese view matches copy by exact English text. |
| 5 | Run tests, TypeScript, and the static build. | Catches broken imports, strings, and Pages build issues. |
| 6 | Review both English and Traditional Chinese at desktop and mobile widths. | Long Chinese headings can need a different fit treatment. |
| 7 | Push to `main` only after review. | The GitHub Pages workflow deploys automatically from `main`. |

### Required commands

Run these commands from the repository root:

```bash
pnpm test
pnpm check
pnpm build:pages
```

For a local static preview after the Pages build:

```bash
pnpm exec vite preview --host 0.0.0.0 --port 4175
```

Open `http://localhost:4175/` in a browser. Test both languages and a narrow mobile width such as 375 px.

## 2. Where normal edits belong

Do **not** edit compiled files in the root `assets/` directory. They are build output. Change source files under `client/src/` instead.

| If you want to change… | Start here | Notes |
| --- | --- | --- |
| Homepage hero, offering cards, partner section | `client/src/pages/Home.tsx` | Keep public claims supportable and update Chinese copy. |
| Smart Referee content, proof points, pricing entry, rule-support visual | `client/src/pages/Product.tsx` | The public URL is `/dronesportsreferee`. |
| Equipment catalogue presentation | `client/src/pages/Equipment.tsx` | Public static content is distinct from full-app admin data. |
| Services cards and service enquiry entry points | `client/src/pages/Services.tsx` | Keep real-world image sources and concise descriptions. |
| Contact page content and form layout | `client/src/pages/Contact.tsx` | Do not expose worker keys or email credentials. |
| Header menu | `client/src/lib/siteNavigation.ts` | Routes must also exist in `client/src/App.tsx`. |
| Footer links and public contact details | `client/src/components/SiteFooter.tsx`, `client/src/lib/contactDetails.ts` | Use the existing link helper pattern. |
| Global colours, typography, mobile rules, animation rules | `client/src/index.css` | Change carefully; this affects every page. |
| Traditional Chinese copy | `client/src/lib/zhTranslations.ts` | See the bilingual section below. |

## 3. Page and URL map

The following table is the normal public-page map. The route definitions are in [`client/src/App.tsx`](../client/src/App.tsx).

| Public URL | Main source file | Primary purpose |
| --- | --- | --- |
| `/` | `client/src/pages/Home.tsx` | Homepage, hero, offerings, partners. |
| `/dronesportsreferee` | `client/src/pages/Product.tsx` | Smart Referee proposition, operational context, rule support, pricing entry. |
| `/product` | `client/src/pages/Equipment.tsx` | Equipment offering and product quote journey. |
| `/services` | `client/src/pages/Services.tsx` | Technical, training, repair, consulting, and drone services. |
| `/contact` | `client/src/pages/Contact.tsx` | Direct contact and enquiry form. |
| `/people` | `client/src/pages/People.tsx` | Team information; not shown in the main menu. |
| `/use-cases` | `client/src/pages/UseCases.tsx` | Use-case content; not shown in the current main menu. |
| `/owner` | `client/src/pages/OwnerEnquiries.tsx` | Full-app/admin-oriented route; do not treat this as a static Pages feature. |

## 4. How to change English and Traditional Chinese copy

The website does **not** store two separate versions of every page. Instead, page components render English source text, and a runtime translation layer changes reviewed strings when the visitor chooses Traditional Chinese.

### Safe workflow

1. Change the English text in the relevant `.tsx` file.
2. Copy the new English text exactly, including punctuation.
3. In `client/src/lib/zhTranslations.ts`, add or edit its Traditional Chinese value.
4. Run the website and select Chinese to confirm the new text appears.

Example:

```ts
// client/src/lib/zhTranslations.ts
"Multiple Rule Support": "多重規則支援",
```

> **Exact-match rule:** The left-hand English key must exactly match the rendered English text. If a period, space, number, or line is different, the Chinese version falls back to English.

### Do not translate these automatically

The translation observer intentionally leaves language controls and live animated metric values alone. Do not remove `data-live-metric` from rolling number components, and do not translate package names unless the approved copy specifically requires it.

### Long Chinese headings

Chinese does not break words in the same way as English. If a Chinese heading overflows, first reduce its responsive font size or add a section-specific fit rule. Do not globally force every heading to one line; this can make unrelated pages unreadable on mobile.

## 5. How to change the header and footer

### Header navigation

Edit `client/src/lib/siteNavigation.ts`. Each item has an English desktop label, an optional short mobile label, and an `href`.

```ts
{ label: "Services", href: "/services", key: "services" },
```

If you add a new menu link:

1. Create or identify the page component in `client/src/pages/`.
2. Register its route in `client/src/App.tsx`.
3. Add the navigation item in `siteNavigation.ts`.
4. Use `staticSitePath(...)` in custom links so the site also works under a subpath preview.
5. Test desktop and mobile navigation.

### Footer

The footer is in `client/src/components/SiteFooter.tsx`. It reuses navigation and contact constants. Prefer changing a shared constant rather than duplicating an email address or route in several places.

## 6. How to add or replace real-world images and video

The public site uses managed media URLs such as:

```tsx
<img src="/manus-storage/example_abc123.jpg" alt="Describe the image clearly" />
```

Use supplied or licensed real-world material for service, event, and product imagery. Do not place large images or videos in `client/public/` or `client/src/assets/`; doing so can make deployments slow or fail.

| Step | Required action |
| --- | --- |
| 1 | Keep the original asset in `/home/ubuntu/webdev-static-assets/` when working in the managed environment. |
| 2 | Upload it with `manus-upload-file --webdev <file>`. |
| 3 | Copy the returned `/manus-storage/...` path into the relevant page or media configuration. |
| 4 | Add accurate `alt` text and confirm the image renders at desktop and mobile sizes. |
| 5 | Run `pnpm build:pages`; the workflow rewrites managed paths for GitHub Pages. |

If you do not have access to the managed asset uploader, ask the project maintainer to upload the file. Do not substitute a guessed path or commit a large local image into the React source tree.

## 7. Common content tasks

| Task | Recommended approach |
| --- | --- |
| Change a headline | Update the page’s English JSX text, then its exact Chinese mapping. |
| Replace a card image | Update the page’s media URL after uploading the real asset; retain useful `alt` text. |
| Change a price | Update `client/src/lib/pricingConfig.ts` or the page-level pricing data, then inspect the pricing dialog and Chinese copy. |
| Change a service | Update `client/src/pages/Services.tsx` and `client/src/pages/Services.test.ts`; keep static descriptions and images consistent. |
| Add a Smart Referee proof point | Edit `proofPoints` in `client/src/pages/Product.tsx`, add Chinese mapping, and inspect mobile cards. |
| Change an email address | Search the source first, then prefer `client/src/lib/contactDetails.ts` if it holds the shared value. |

## 8. Publishing to GitHub Pages

Pushing a valid commit to `main` starts [`.github/workflows/static.yml`](../.github/workflows/static.yml). It builds the static Vite site, preserves managed media through the live asset host, creates a single-page-app fallback, and deploys the result through GitHub Pages.

```bash
git status
git add <changed files>
git commit -m "Describe the change"
git push origin main
```

Check the **Actions** tab in GitHub. Wait for **Deploy static content to Pages** to succeed before treating a change as live.

## 9. Before you publish

- [ ] English copy is clear, supportable, and free of placeholder text.
- [ ] Traditional Chinese has been reviewed and appears after switching language.
- [ ] New images use managed media URLs and have accurate alt text.
- [ ] No horizontal overflow appears at a 375 px mobile width.
- [ ] `pnpm test`, `pnpm check`, and `pnpm build:pages` pass.
- [ ] The GitHub Pages action succeeds after the push.

## 10. When to stop and ask for help

Ask an experienced engineer before changing any of the following:

| Area | Why it needs extra care |
| --- | --- |
| `client/src/components/WebsiteTranslationObserver.tsx` | It controls the bilingual runtime and live-value exclusions. |
| `client/src/contexts/LanguageContext.tsx` | It persists language choice and sets the document language. |
| `.github/workflows/static.yml` | It controls deployment, SPA fallback, and managed-media rewriting. |
| `client/src/lib/staticEnquiry.ts` or `worker/` | It connects public forms to Cloudflare Turnstile and the enquiry service. |
| `client/src/index.css` | A global style change can affect the entire public site. |
| `server/`, `drizzle/`, or owner/admin files | These relate to the full application, not the GitHub Pages frontend alone. |

For deeper explanations of these areas, continue with the [Engineering Manual](./ENGINEERING_MANUAL.md).
