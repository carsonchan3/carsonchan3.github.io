# Startup-readiness inputs still owned by Velocity Lab Innovation

The website now includes the controllable startup-readiness foundation: public About VLI and Privacy routes, buyer-focused messaging, an enquiry privacy disclosure, and provider-safe conversion event calls. The following inputs require an authorised business owner, verified source material, external-account access, or legal review; they have not been guessed or fabricated.

## 1. Official social destinations

Replace the generic social-platform placeholders in `client/src/components/SiteFooter.tsx` only with the verified official VLI profile URLs. If a platform is not active, remove or hide that icon rather than directing visitors to a generic platform homepage.

| Platform | Official profile URL | Status |
|---|---|---|
| LinkedIn | Provide URL | Needed |
| Instagram | Provide URL | Needed |
| YouTube | Provide URL | Needed |
| Facebook | Provide URL | Needed |

## 2. Team and factual review

Confirm the founder names, roles, images, biographies, specialty tags, and any statements in `/people` and `/zh-hant/people`. The published page intentionally avoids education timelines, competition rankings, unapproved affiliation language, and unsupported claims; retain that restraint unless each new fact is independently verified.

## 3. Proof inventory

Before publishing any case study or customer proof, record the source, owner, date, permission status, audience, approved description, and expiry/review date for every asset.

| Proof type | Required approval |
|---|---|
| Event photo or video | Photographer/venue/event permission and approved caption |
| Partner logo | Permission and accurate description of the relationship |
| Customer quote | Named source, exact approved wording, and publication consent |
| Outcome or performance metric | Underlying evidence, timeframe, measurement method, and approval |
| Product/workflow screenshot | Confirmation that no confidential data or third-party rights are exposed |

## 4. Measurement setup

The site calls the existing Umami-compatible client only when it is already available. The startup conversion events are `plan_event_click`, `smart_referee_cta`, `quote_request_start`, `contact_submit`, and `direct_contact_click`.

The owner should verify analytics collection in the analytics provider, create or verify the Google Search Console property for `https://velocity-lab.com`, submit the sitemap, and establish a monthly review of organic clicks, queries, CTA events, and qualified enquiries. Do not add tracking IDs, dashboards, or cookies without the owner’s approved account access and privacy decisions.

## 5. Legal and operational review

The public Privacy Notice is a plain-language operational notice, not legal advice. A qualified reviewer should confirm it against actual data flows, processors, retention practices, business location, customer geography, and applicable privacy requirements before relying on it as a formal policy. Confirm any response-time promise separately; the public website now deliberately avoids claiming a specific reply deadline.
