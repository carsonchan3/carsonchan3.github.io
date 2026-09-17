# VLI Service Authoring Guide

Every card on the Services page comes from a Markdown file in `content/services/`, one file per service. Clicking a card opens a dropdown with the full description, duration, pricing guidance, and a **Discuss this service** button. All of it is edited in Markdown.

Edit a file on GitHub (open it → pencil icon → **Commit changes** to `main`). The **Deploy static content to Pages** workflow republishes the site in about a minute. If something is wrong, the workflow fails with a message naming the file and the live site keeps the previous version.

## File structure

```markdown
---
id: pid-tuning
order: 2
visible: true
icon: sliders

title.en: PID tuning service
title.zh-Hant: PID 調校服務
summary.en: Short text shown on the card.
summary.zh-Hant: 卡片上顯示的簡短文字。
duration.en: 2–4 hours, including setup and test flight.
duration.zh-Hant: 2–4 小時，包含設定與試飛。
pricing.en: Quoted after a build review; parts or venue costs are separate.
pricing.zh-Hant: 於機體檢視後報價；零件或場地費用另計。

image: /manus-storage/pidtuningthumb_fcb394b2.jpeg
imageAlt.en: Betaflight Blackbox Viewer traces used during a PID tuning review
imageAlt.zh-Hant: PID 調校檢視時使用的 Betaflight Blackbox Viewer 數據曲線
---

<!-- locale:en -->
The dropdown description. Normal Markdown works here:
paragraphs, **bold**, lists, and [links](https://velocity-lab.com/contact/).

<!-- locale:zh-Hant -->
下拉選單中的中文描述。
```

## Fields

| Field | Required | What it does |
| --- | --- | --- |
| `id` | Yes | Permanent identifier, unique per service. |
| `order` | No | Position on the page (1 = first). |
| `visible` | No | `false` hides the service. Default `true`. |
| `icon` | No | `wrench`, `sliders`, `graduation`, or `camera`. |
| `enquiryForm` | No | `repair` shows the repair intake checklist in the enquiry form. |
| `title.en` / `title.zh-Hant` | Yes | Card heading. The English title is also what you receive in enquiry emails. |
| `summary.en` / `summary.zh-Hant` | Yes | Short text on the card. |
| `duration.*`, `pricing.*` | No | Shown inside the dropdown. Leave out to hide. |
| `image` | Yes | Card image path (`/manus-storage/…` or `/media/…`). |
| `imageAlt.*` | No | Image description for accessibility. |

The text under `<!-- locale:en -->` and `<!-- locale:zh-Hant -->` is the dropdown description. Both languages are required.

**To add a service:** copy an existing file, rename it, change `id` and `order`, and edit the text.
