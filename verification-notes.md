# Verification Notes

## 2026-08-12 — Navigation simplification

- Desktop navigation now presents only **Demo**, **People**, and **Contact**, alongside the separate **Request Demo** call to action.
- The phone viewport retains a compact menu trigger without crowding the off-white header; its expanded menu is programmatically verified to contain the same three navigation items.

## 2026-08-12 — 404 page and partner section

- The new 404 page presents a branded error state, home-return action, and demo-request action with readable hierarchy at desktop and phone widths.
- The 404-page route and actions continue to pass browser verification.

## 2026-08-12 — Corrected partner-section treatment

- The Partners & Supporting Organizations section is restored to the rich charcoal `rgb(39, 40, 43)` surface at desktop and phone widths.
- Only the individual logo panels remain pure white `rgb(255, 255, 255)`, preserving clear logo contrast without changing the overall dark section treatment.

## 2026-08-12 — Hero action placement

- The hero action group now has additional separation from the supporting copy, positioning the buttons lower without crowding the headline on desktop or phone widths.
- Browser measurement confirms a 32px copy-to-action gap and two intact action buttons at both desktop and phone breakpoints.

## 2026-08-12 — Product, use cases, and pricing pages

- Product, Use Cases, Pricing, and the updated People page were reviewed at desktop and phone widths; the shared navigation, long-form page layouts, and footer remain readable and responsive.
- The Use Cases page was refined after review so each scenario now has a distinct outcome-led headline rather than repeating generic page copy.
- The refined Drone Soccer, RoboCon competition, and Ground Truth headings were rechecked at desktop and phone widths, with the information hierarchy remaining readable at both sizes.

## 2026-08-12 — Video hero and left alignment

- The uploaded motion-capture video is active as the homepage hero background. On desktop, the hero copy begins 64px from the left edge; on phone it begins 24px from the left edge.
- A layered dark gradient keeps the headline, supporting copy, and both actions readable over the moving footage. The video is muted, loops inline, retains a poster fallback, and pauses when reduced motion is requested.

## 2026-08-12 — Cinematic hero framing and scroll cue

- The desktop hero now measures 1280 × 548.6px, matching a 21:9 ratio, with the feature section visible immediately beneath it in the viewport.
- The updated directional gradient allows the video to remain more visible while retaining readable text and actions. The desktop scroll cue is visible, and the next-section edge remains visible on both desktop and phone layouts.

## 2026-08-12 — Pricing configurator

- The new Pricing page presents Class 20, Class 40, and Custom Class tiers in a clear configuration-first layout, followed by Rental and One-off Purchase controls.
- Desktop and phone reviews confirm that the tier cards, acquisition choices, and selected-configuration summary retain their hierarchy and readability at both sizes.
- The pricing modal was visually opened with Class 40 and One-off Purchase selected. Its dropdowns retain the selection, the enquiry-style fields are readable, and the primary submit control is labelled “Get Pricing.”
- An intercepted end-to-end modal submission verified that the selected Class 40 and One-off Purchase configuration is included in the `contact.submit` request payload and that the modal closes after a successful response, without inserting test data into the database.

## 2026-08-12 — Enquiry and pricing submission hardening

- Both enquiry paths use the same server-side procedure. Database persistence already uses Drizzle’s structured `insert(...).values(...)` API rather than handcrafted SQL, so user input is passed as values rather than concatenated into a query string.
- The public procedure now enforces strict payload shape, bounded and normalised text, approved dropdown values, control-character rejection, a hidden honeypot field, and a five-submission-per-ten-minute in-memory limit per client address. Operational logs now exclude names, emails, and message content.
- Desktop and phone reviews confirm the hidden bot-detection fields do not alter the visible enquiry or pricing form layouts.
- Browser checks intercepted successful desktop and phone submissions without storing test data. They confirmed both honeypots remain empty, the pricing class and acquisition choice are preserved, and the pricing modal closes on success. Security-focused unit tests reject malformed, honeypot-filled, and rate-limited requests while retaining SQL-like strings as ordinary data.

## 2026-08-12 — Scoped alternating homepage sections

- Only Built for the Ecosystem, How It Works, and Development Focus were reshaped into alternating text-and-placeholder-image layouts.
- Desktop presents text left/image right, image left/text right, and text left/image right respectively; phone stacks each text block and placeholder image without clipping or affecting the neighbouring homepage sections.

## 2026-08-12 — Pure-black hero loading state

- Removed the hero video poster image so the browser has no static photo to display before the video is ready.
- Set the hero section loading base to literal `#000000`; the video remains the only visual background once it loads.
- Browser verification confirmed no `poster` attribute, a present video element, and a computed hero background of `rgb(0, 0, 0)` with the video request blocked. Desktop and phone hero screenshots remain readable, and TypeScript, 15 tests, and the production build passed.

## 2026-08-12 — Compact partner strip below hero

- Removed the extra “Watch the live demo” card and the “See how live motion capture can support...” copy block from the video section.
- Moved Partners & Supporting Organizations directly below the hero as a compact strip with reduced heading, logo-card, and section spacing.
- Browser verification confirmed the partner section follows the hero, remains before the video section, measures under 260px on desktop, and both requested text blocks are absent. Desktop and phone screenshots, TypeScript, 15 tests, and the production build passed.

## 2026-08-12 — Square supporting-organization panels

- Compact partner cards and their white logo surfaces now use true 1:1 square proportions. Browser measurements recorded a `1.0` width-to-height ratio for all three visible cards at desktop and phone widths.
- The desktop review confirms the three square panels keep their logos and names legible. On phone, the carousel retains horizontal overflow and an active scroll check moved the strip successfully; the compact section remains approximately 22% of the phone viewport height.

## 2026-08-12 — VLI favicon and centered organization tiles

- The supplied VLI logo has been uploaded to managed project storage and configured as the site’s WebP favicon in the document head.
- Browser verification confirms the favicon path is present. The visible desktop organization group is centered on the viewport, while the mobile presentation keeps its square cards and active horizontal scrolling.

## 2026-08-12 — Enlarged supporting-organization section

- The supporting-organization section now uses a 40svh minimum height and measures exactly 40% of the reference desktop viewport (288px of 720px) and phone viewport (324.8px of 812px).
- The three enlarged square tiles remain centered on desktop. Phone tiles preserve horizontal scrolling, with browser verification confirming active movement and no regression in the VLI favicon configuration.

## 2026-08-12 — Revised 30% supporting-organization section

- Desktop and phone visual reviews confirm the reduced section retains a clear label, centered square-tile composition on desktop, and a readable mobile presentation.
- Browser measurement reports a 30.7% desktop section ratio (221px of 720px) and an exact 30% phone ratio (243.6px of 812px), while the mobile tile strip remains horizontally scrollable.

## 2026-08-12 — Restored standalone partner section

- Partners & Supporting Organizations has been moved out of the hero-adjacent flow and placed as a distinct dark section immediately after the OptiTrack demo.
- Browser checks confirm it is separated from the hero, follows the demo in document order, retains centered square tiles on desktop, and preserves active horizontal scrolling on phone.
- A focused 375px-wide phone review confirms the standalone heading and supporting text remain readable, the first two square tiles are fully legible, and the third tile is visibly reachable through the horizontal carousel.

## 2026-08-12 — Enlarged partner logos and section hierarchy

- The standalone area now follows the homepage’s consistent structure: a small “Supporting network” label, a main Partners & Supporting Organizations headline, and a concise supporting description directly below.
- Desktop review confirms the enlarged 128px logo surfaces and centered tile group remain clear. At 375px, the 112px logo surfaces, wrapped headline, concise description, and horizontal carousel remain legible and usable.

## 2026-08-14 — Offering-focused information architecture

- Desktop review confirms the video hero now leads into three image-led offering cards for Drone Sports Referee, Drone Equipment, and Services. Each card has a dedicated CTA and a visible hover-select treatment.
- Phone review confirms the three cards stack clearly below the preserved hero, destination-page headings remain readable, and the Equipment and Services routes retain their technical content and contact paths at the narrow breakpoint.

## 2026-08-14 — Pricing consolidation and renamed routes

- The Drone Sports Referee experience at `/dronesportsreferee` now contains the full class, acquisition, selected-configuration, and pricing-request flow. Desktop and phone reviews confirm the configurator remains readable and usable in its new page location.
- The Equipment experience is now served at `/product`. Browser checks confirm the legacy `/pricing` route redirects to the referee pricing anchor and `/equipment` redirects to the canonical Product route.

## 2026-08-14 — Product catalogue and service banners

- Desktop review confirms `/product` presents five clearly labelled placeholder equipment items followed by a dedicated custom-quote area.
- Phone review confirms all five catalogue cards stack with readable labels and the custom-quote action remains visible. The Services page presents three distinct, full-width banners for PID tuning service, drone building skills, and an advanced drone course for adults.

## 2026-08-14 — Smart Referee branding and language controls

- Desktop review confirms Smart Referee replaces the former referee label in the primary navigation and referee-page eyebrow. The Request Demo action has been replaced by the compact 中 / ENG control.
- Phone review confirms the header preserves clear logo and menu spacing without the former Request Demo button. Browser checks confirm the language selector remains available from the mobile navigation menu and that English is the selected current-language state.

## 2026-08-14 — Mobile lower-left language control

- Phone review confirms the language selector has moved away from the header into a small lower-left floating pill, reducing visual competition with the logo, navigation menu, and hero content.
- The desktop view continues to show only the header language control. Responsive browser measurements confirm the floating control is fixed at 20px from the left and bottom only on mobile, while the mobile navigation retains its language option.
- The mobile toolbar now adds a compact Chinese-language entry point beside the menu button. Phone review confirms it coexists with the lower-left selector without obstructing the logo, hero controls, or navigation trigger.

## 2026-08-14 — Mobile floating language-bar removal

- Phone review confirms the lower-left floating 中 / ENG bar has been removed from the homepage and Smart Referee page. The compact toolbar entry point remains beside the mobile menu button without obstructing hero content.
- Browser verification confirms the former floating selector is absent at both breakpoints, the mobile toolbar entry point remains visible on phone, and the desktop header selector remains unchanged.

## 2026-08-14 — Drone Repair Service

- The Services page now presents Drone Repair Service as its fourth large banner, with a direct service-enquiry call to action.
- Desktop and 375px phone reviews confirm all four service banners maintain their alternating visual layout, readable content, and clear contact actions.

## 2026-08-14 — Compact Services banners

- The four Services banners were tightened for faster scanning by reducing card height, internal padding, text scale, and vertical spacing while retaining the service title, core description, identifier, icon, and contact action.
- Browser measurement confirms all desktop cards are 216px high; phone cards range from 284px to 314px. Desktop and 375px visual reviews confirm all four options remain readable and clearly actionable.

## 2026-08-14 — Distinct Services thumbnails

- Each service banner now uses a distinct image-led thumbnail for PID tuning, drone building skills, adult advanced training, and drone repair. The thumbnails retain the site’s charcoal, off-white, and turquoise visual language and carry the service icon and number as unobtrusive overlays.
- Automated browser checks confirm the four managed thumbnail sources are present in the intended card order. Measured thumbnail widths are 218px at desktop and 110px at a 375px phone viewport.
- The thumbnails preserve the concise card treatment: all desktop cards remain 216px tall, while phone cards measure 303px, 303px, 328px, and 303px. Updated desktop and phone visual reviews confirm the thumbnails are readable without obscuring titles, descriptions, or enquiry actions.
- Direct asset inspection confirms the PID tuning and drone-building thumbnails have completed as final high-resolution assets, rather than generation placeholders. The former shows tuning telemetry alongside a drone adjustment, while the latter shows a clearly differentiated hands-on drone assembly workspace.
- Direct asset inspection also confirms the advanced-course and repair thumbnails are final high-resolution assets. The course image depicts a controlled indoor flight-training environment, while the repair image focuses on component-level drone diagnosis and servicing. All four visuals are distinct, service-appropriate, free of generated visible text, and consistent with the site’s dark charcoal and turquoise palette.
- Live browser verification confirms each managed `/manus-storage` thumbnail response is complete at an intrinsic 1920 × 1440 pixels at both desktop and phone breakpoints. This rules out temporary generating or failed placeholders in the rendered page.

## 2026-08-14 — Product and Services layout refinements

- The Product route now begins directly with the equipment catalogue, removing the former top hero and all visible placeholder labels. The five cards use concise equipment-oriented copy and now direct visitors to discuss their setup.
- The Services hero is materially shorter while preserving its message hierarchy: browser measurement records 305px at desktop and 307px at a 375px phone viewport. Desktop and phone reviews confirm readable headings, supporting copy, service cards, and contact actions.
- Responsive browser checks confirm the Product heading is now “Select a starting point.”, no placeholder copy remains in the Product content, and the existing catalogue, custom-quote path, Services banners, and thumbnail checks continue to pass.

## 2026-08-14 — Services duration and pricing guidance

- Desktop and 375px phone visual reviews confirm that every Services card now displays a clearly separated **Estimated duration** and **Pricing guidance** block above its enquiry action. The guidance remains paired with the relevant service rather than being placed in a generic page-level table.
- The published guidance uses time estimates and scope-based quote factors, such as group size, venue, equipment condition, parts, and selected modules. It deliberately avoids unverified fixed prices while giving visitors enough context to start an appropriate enquiry.
- Responsive browser checks confirm four duration blocks and four pricing-guidance blocks. Cards remain compact at 294px on desktop and 373–430px on a 375px phone viewport. TypeScript, 22 Vitest tests, and the production build pass.

## 2026-08-14 — Service-specific enquiries and Product pricing tags

- Desktop and 375px phone visual reviews confirm all five Product cards now use short, explicitly drone-related descriptions with a clear **Price on request** tag beneath the description. The tags maintain the charcoal and turquoise product-card hierarchy without creating misleading fixed prices.
- Services cards remain clearly actionable across both breakpoints. Browser interaction checks confirm that the advanced-course card’s action opens the service enquiry dialog with **Advanced drone course for adults** already selected.
- The selected-service field is now persisted in the contact-submissions database table and supplied to the owner notification. Schema verification confirms the nullable `selectedService` varchar(120) column exists. TypeScript, 25 Vitest tests, responsive browser checks, and the production build pass.

## 2026-08-14 — Service Enquiry organization-type dropdown

- The Service Enquiry organization-type select now uses the same dark option surface and off-white option text treatment as the general enquiry form. The shared presentation remains readable against the dialog’s charcoal background.
- Responsive browser checks compare the computed option foreground and background values of both forms at desktop and phone breakpoints, confirming they match. TypeScript, 25 Vitest tests, and the production build pass.

## 2026-08-14 — Smart Referee pricing-request dialog dark mode

- The Smart Referee pricing-request dialog now uses the site’s charcoal dialog surface, off-white content, turquoise accent, and dark form controls. Configuration panels, fields, selects, textarea, and close affordance all follow the same dark-mode hierarchy.
- Browser checks confirm the dialog surface is `#1C1D20` and its selects expose matching dark option backgrounds with off-white option text at desktop and phone breakpoints. TypeScript, 25 Vitest tests, and the production build pass.

## 2026-08-14 — Dedicated Contact page

- Desktop review confirms the new `/contact` route presents a focused dark contact experience with an active Contact navigation state, direct email/phone/location details, response-time guidance, and the established enquiry form in a clear two-column layout.
- At a 375px phone viewport, the information blocks and form stack cleanly with readable labels, full-width fields, and an accessible submit action. The standalone page removes the long contact form from the homepage while preserving all form inputs and the existing submission workflow.
- All public contact entry points now resolve to `/contact`, including shared navigation, footer, homepage, Product, Services, People, Use Cases, and the 404 page. The public-route redirect loop was removed from client startup, restoring reliable browser verification. TypeScript, 25 Vitest tests, both browser verification suites, and the production build pass.
- A focused browser submission check intercepts only the public contact mutation response, fills the dedicated form, and confirms the visible success message, reset name/message fields, and restored **Send enquiry** action. This validates the migrated client-side success path without adding test records to the production contact database.

## 2026-08-14 — Staggered mobile Product catalogue

- The Product catalogue now uses two compact columns at a 375px phone viewport. Alternate cards begin lower and use a taller visual panel, creating the requested zig-zag, marketplace-style browsing rhythm while keeping every price tag and setup action visible.
- Desktop retains its three-column catalogue layout without staggered margins. Browser measurements confirm five Product cards, two mobile columns, a 28px alternate-card offset, and taller alternate phone cards.

## 2026-08-14 — Enlarged Services imagery with gradient fades

- Each Services banner now uses its thumbnail as a prominent full-banner image rather than a compact isolated tile. A progressive dark opacity fade blends the image into the content area—horizontal at desktop and vertical on phones—so the title, guidance, and enquiry action remain readable.
- Desktop review confirms the wide image-led banners form a clearer visual story; phone review confirms the larger 341px-wide imagery, gradient-supported contrast, compact guidance blocks, and action buttons remain legible without horizontal overflow.

## 2026-08-14 — Balanced half-image Services banners

- Each desktop Services card now splits evenly between the image panel and a solid charcoal content panel. The image-to-content boundary uses a directional fade, while the text sits exclusively on the opaque content side for dependable readability.
- At a 375px phone viewport, the image panel occupies approximately 43–47% of every card’s height before the solid content panel begins. The photo, title, duration, pricing guidance, and enquiry action remain clearly separated and readable across all four services.

## 2026-08-14 — Cross-page reveal-up motion

- The homepage reveal-up observer is now centralized and applies to every public-page section, including Smart Referee, Product, Services, People, Use Cases, Contact, and the 404 page. Existing homepage card staggers remain intact, while all other page sections use the same upward entry transition as they enter view.
- Browser verification scrolls every public-route reveal target and confirms it becomes visible. A separate reduced-motion browser context confirms all Services sections are immediately visible with no transform when reduced motion is requested. Desktop and phone top-of-page reviews confirm the animated layouts retain readable headers, content, and controls.
- Key headings, content cards, pricing tiers, media blocks, forms, and call-to-action panels now also carry explicit reveal targets with short staggered delays. Reduced-motion verification now covers Smart Referee, Services, People, and Contact, confirming immediate visible content with no transform and usable links/buttons on each route.

## 2026-08-14 — Smart Referee class-selector visibility fix

- The Class 20, Class 40, and Custom Class tier controls no longer participate in scroll-reveal state. Selecting a tier therefore cannot remove its visible animation-completion class during React state updates.
- Browser regression coverage now selects each class in turn, confirms every tier card remains visible, confirms the clicked class is selected, and continues into the pricing request dialog. TypeScript, 26 Vitest tests, browser checks, and production build pass.
- Per-tier browser coverage opens the pricing request dialog for Class 20, Class 40, and Custom Class independently. Each dialog preserves the clicked system class and the rental acquisition option, while the class cards stay visible before and after the dialog interaction.

## 2026-08-15 — Balanced officiating comparison

- The Smart Referee page now contrasts practical limits of human-only officiating—limited sightlines, differing strict-versus-loose thresholds in ambiguous moments, and difficult-to-review disputed calls—with calibrated capture, configurable rule logic, and a reviewable evidence trail.
- The language intentionally recognises that officials remain central to the game. Smart Referee is presented as a shared decision-support reference, not a replacement for official judgement or a claim that individual officials are inherently biased.
- Desktop and 375px phone visual reviews confirm the two panels sit side by side on large screens and stack cleanly on phone, with readable off-white copy, turquoise emphasis, and the support-not-replacement conclusion visible beneath them. The offering-journey browser suite and TypeScript check pass with the new comparison assertions.

## 2026-08-15 — Graphical officiating comparison

- The comparison has been reshaped into two visual three-step flows: **One sightline → Interpretation → Disputed call** and **Capture → Rule reference → Reviewable call**. CSS-built node symbols, connecting arrows, and distinct neutral/turquoise treatments make the contrast scannable without relying on a text-heavy explanation.
- Desktop review confirms the pair forms a balanced two-column graphic; at 375px, the cards stack while each individual decision flow preserves its three visual nodes, labels, arrows, contrast, and supporting message.
- Browser coverage now requires both graphical flow containers and exactly three steps in each, alongside the existing balanced decision-support statement and human-only officiating limitation checks. TypeScript and the offering-journey browser suite pass.

## 2026-08-16 — Smart Referee package pricing

- The legacy Class 20, Class 40, and Custom Class cards have been replaced by three document-defined packages: **Assist from HK$5,800 per event**, **Managed from HK$11,800 per event day**, and **Evidence Pro from HK$16,800 per event day**. Managed is clearly marked as the recommended full Class 20 service.
- The revised cards distinguish each package through its included service scope. The section also presents the Class 20 cage as an approximately HK$3,000 separate line item and states the HK$14,800 Managed-with-cage quote option.
- Desktop and 375px phone reviews confirm all three price cards, the recommended badge, cage note, engagement-path controls, and selected-package summary remain legible. Focused browser checks verify every package selection, dialog prefill, request payload, honeypot protection, and modal closure; the offering-journey suite also passes.

## 2026-08-16 — True-white visual theme

- The former warm off-white palette has been removed from shared theme tokens and public-page surfaces. Primary white, light cards, popovers, sidebars, dark-theme foreground text, and dark form-option text now resolve to literal `#FFFFFF`; warm neutral support tones are replaced with neutral greys.
- The remaining dedicated off-white Smart Referee image panel and pricing-selection panel now use true white. The charcoal foundation and turquoise accent remain unchanged to preserve the established VLI visual hierarchy.
- Full-page reviews of Home, Smart Referee, Product, Services, People, and Contact at desktop and 375px phone widths confirm the shared header is true white, light panels are crisp white, and text remains readable against dark surfaces. Browser checks also assert the `rgb(255, 255, 255)` header and true-white pricing-dialog foreground/options.

## 2026-08-16 — Chinese-language availability popup copy

- The Chinese-language trigger now shows the exact requested message: **「中文內容準備中，目前只提供英文版本。」**
- Cross-page desktop and mobile browser coverage clicks the appropriate Chinese trigger and asserts the exact visible popup message. TypeScript, 26 Vitest tests, and the production build pass.

## 2026-08-16 — Smart Referee hero action simplification

- The hero now presents one primary **Explore service** action linking directly to `/services`. The duplicate outlined service action has been removed, while lower-page pricing calls remain unchanged.
- Desktop and 375px phone reviews confirm the single turquoise action is clearly positioned and remains legible. Browser coverage verifies its exact label, single-instance count, `/services` destination, and absence of the two replaced hero actions.

## 2026-08-16 — Smart Referee hero pricing anchor

- The **Explore service** hero action now targets `#pricing` on the Smart Referee page rather than navigating away to Services. The action label and single-button layout are unchanged.
- Browser coverage clicks the hero action, verifies that the URL changes to the pricing anchor, and confirms the matching `#pricing` href. Desktop and 375px phone reviews retain clear, responsive action placement.

## 2026-08-16 — Smart Referee visual redesign

- The Smart Referee hero now occupies approximately 80% of the desktop viewport, tightening the initial narrative while retaining the page’s decision-layer image, primary action, and readable mobile flow.
- The human-only versus Smart Referee comparison now uses two larger evidence diagrams: a constrained single-view sightline map and a turquoise multi-view decision-reference map. The separate **From movement data to a clear match decision** section has been removed to avoid repeating the same explanation.
- The ecosystem section now includes dedicated graphic audience cards for event organizers, clubs, and educators, with consistent editorial-tech illustrations, role icons, and concise outcomes. Desktop and 375px phone full-page reviews confirm the redesigned content remains visible and sequenced correctly. Browser coverage verifies hero proportion, graphic comparison presence, removal of the legacy flow heading, and all three audience illustrations.

## 2026-08-16 — Ecosystem illustration replacements

- Replaced the failed Clubs and Educators illustration assets with new generation URLs and updated the corresponding Smart Referee audience cards.
- Desktop and 375px phone reviews confirm all three ecosystem cards render with visible image artwork. Browser coverage verifies the two replacement paths, three-card image count, and successful image dimensions for every ecosystem illustration.

## 2026-08-16 — Flexible pricing and prioritized custom equipment request

- Smart Referee package cards now use **From $XXXX** labels with package-dependent scope; the former fixed cage and Managed pricing has been replaced by a separate-quote note.
- The Product page now places a full-width **Need something specific?** custom-equipment request card directly above the five standard equipment quotes. Desktop and 375px phone reviews confirm the custom request appears first, spans the catalogue width, and retains a clear contact action.
- Browser coverage verifies all three flexible price labels, the revised scope note, and that the custom-request card appears before and at essentially the full width of the equipment grid.

## 2026-08-16 — Spreadsheet-backed Product catalog

- Imported all **22 items** from `productprice.xlsx` into `/product`, retaining the spreadsheet’s product names, mapped embedded photos, and HKD prices from HK$40 to HK$6,010. The custom equipment request remains the prominent full-width card above the catalog.
- Desktop full-page review confirms a three-column catalogue with visible product photography, category labels, concise descriptions, and HKD price tags. The 220 mm cage entry uses the higher-resolution mapped cage illustration rather than the spreadsheet’s tiny duplicate image.
- 375px phone review confirms the existing staggered two-column layout remains readable across the expanded catalogue, with the custom-request card first and all 22 cards visible in sequence. Browser verification confirms all hosted product images complete with usable intrinsic dimensions. TypeScript, 26 Vitest tests, and the production build pass.

## 2026-08-17 — Product cart and detail enquiry flow

- Product cards no longer use per-card reveal targets, removing the mobile visibility dependency that could leave catalogue content at zero opacity. The first four product images load eagerly, while the remaining image cards retain lazy loading for browsing performance.
- Desktop review confirms the product grid remains a three-column catalogue with clearly visible quantity steppers, **Add to cart** actions, and **View details** paths. The former **Discuss setup** actions are absent.
- The database now stores selected cart rows as JSON in the nullable `contactSubmissions.cartItems` column. Server validation constrains each cart item’s reference, name, listed HKD price, and quantity, rejects duplicates, and includes an item summary in the owner notification.
- Automated validation passes: TypeScript, 28 Vitest tests, production build, and desktop/phone browser journeys covering quantity changes, cart summary, product-detail dialog, and cart pricing dialog.
- A settled desktop detail-dialog review confirms an opaque charcoal surface, a readable image/specification grid, listed-price emphasis, and a full-width **Add 1 to cart** action.
- The 375px phone pricing-dialog review confirms the selected **2 × TOPS Shield 205 RTF** quantity is visible in the cart summary and that the required name, email, organisation, organisation-type, and quote-notes controls remain full-width and readable without horizontal overflow.
- An editable workbook, `VLI_Product_Catalogue_Template.xlsx`, was generated with the 22 live items, a Product Catalog sheet, validation-backed publication status, and separate Read Me and Field Guide sheets.

## 2026-08-17 — Floating Product cart

- The active desktop quote cart is a fixed, right-side control showing the cart label, selected-unit count, and turquoise numeric badge. It remains visible while visitors browse the catalogue and opens the established pricing-enquiry dialog.
- The active 375px phone cart uses a 56px bottom-right touch target with the same numeric badge. It is elevated above the transient add-to-cart confirmation, preserving immediate access to the cart without covering the confirmation message.

## 2026-08-17 — Editable persistent Product cart

- Selecting the floating cart now opens an editable quote-cart panel. Each selected product presents its listed HKD price, decrease/increase quantity controls, a dedicated removal action, current item/unit totals, a close control, and the existing **Ask for pricing** action.
- The 375px phone review confirms the panel expands as a full-width, bottom-positioned card with readable touch controls and a full-width pricing action. The desktop review confirms the equivalent compact right-side panel preserves catalogue visibility.
- Cart selections are saved in browser local storage under a versioned VLI key, restored only for known catalogue item IDs with whole quantities between 1 and 99, and removed from storage when the cart is emptied. Browser coverage verifies quantity edits, removal, empty-cart state, and restoration after a page reload.

## 2026-08-17 — Product pricing delivery address

- Product pricing requests now include a required **Delivery address** row beneath the organisation fields. The 375px phone review confirms the dark input surface, turquoise focus state, label, and multi-line address content remain readable in the scrollable pricing dialog.
- The nullable `contactSubmissions.deliveryAddress` text column has been migrated successfully. Cart-based requests require an address server-side, persist it with the enquiry, and include it in the owner notification; ordinary contact and service enquiries remain compatible without it.
- Unit coverage confirms address persistence, notification content, and omission rejection. Browser verification fills the field and confirms its exact value is present in the intercepted Product pricing request payload without inserting test data.

## 2026-08-17 — Mobile Product catalogue visibility regression

- The tall Product catalogue section was being treated as a single scroll-reveal target. On a 375px phone, its visible proportion could not reach the reveal observer’s threshold, leaving the entire catalogue at hidden reveal opacity despite individual cards being static.
- The Product main container no longer opts into section-level reveal targeting. Its heading and custom-equipment card retain their explicit reveal motion, while all 22 catalogue cards remain immediately rendered and usable on every viewport.
- The responsive browser suite now asserts that the Product main container cannot be a section reveal target and that all 22 cards have `opacity: 1`, `visibility: visible`, and a rendered display at desktop and phone widths. Full phone review confirms the two-column catalogue, cart controls, pricing route, and footer remain visible.

## 2026-08-17 — Streamlined Product families

- The Product grid has been reduced from 22 individual cards to 14 product-family cards while retaining all 22 original supplier variants. Related TOPS Shield, battery, balance-charger, and inflatable-field configurations now share one compact catalogue entry.
- Desktop review confirms the family cards use a clear **From HK$** label, show the number of available versions, and direct visitors to a single Choose version action rather than repeating near-identical product cards.
- The TOPS Shield 205 detail dialog presents RTF and PNP as distinct selectable options with their own prices. Selecting PNP updates the reference, product image, description, listed price, and Add PNP to cart action before the cart and pricing enquiry preserve that exact configuration.

## 2026-08-17 — Product removal and sequential references

- The former TA300 8-Channel Charger supplier item (#79) has been removed from the active Product catalogue, leaving 21 selectable variants grouped into 13 compact product families.
- Visible Product references are now generated from the active catalogue order, starting at #1 and running without gaps through #21. Desktop review confirms TOPS Shield 205 displays #1–2 on its family card and selected PNP correctly resolves to Product ref. #2 in the detail dialog.
- Unit coverage verifies the sequential reference sequence and the absence of source ID 79/TA300. Full type, test, build, and desktop/phone browser verification confirms cart, quote pricing, and variant selection remain functional.

## 2026-08-17 — Repair-first Services page

- Drone Repair Service is now the first Services card and the initial service enquiry. Its card, hero support copy, pricing guidance, and repair-specific enquiry guidance make the mail-in assessment and quotation-first flow clear.
- The repair flow now explains that VLI replies with mail-in instructions, assesses the drone, and provides a repair solution and quotation before work begins. It also states that delivery fees can be waived when the proposed repair is accepted and completed.
- Drone Building Skills is now named **Drone Building Course**. Desktop and 375px phone reviews confirm the four-card order, readable repair guidance, action access, and responsive content hierarchy. Browser coverage verifies the repair selection, mail-in dialog message, conditional delivery-fee text, thumbnail order, and all existing Services behavior.

## 2026-08-17 — Repair intake and owner enquiry management

- The repair enquiry opens a clearly separated, dark-mode **Repair intake checklist** beneath the mail-in quotation terms. Desktop review confirms the selected service, repair policy, required contact fields, and checklist hierarchy are visually distinct and readable.
- The 375px phone review confirms the dialog remains within its scrollable mobile treatment, with its mail-in terms and required fields presented before the checklist. Automated browser coverage confirms all required checklist controls and the photo-availability confirmation are present in the repair dialog.
- The lower phone dialog review confirms the remaining previous-repair, fault-symptom, power-state, photo-availability, additional-notes, and submit controls are reachable by scrolling within the modal.
- The `contactSubmissions` table now stores nullable repair intake JSON plus a non-null tracking status (`new`, `in_review`, `awaiting_customer`, `quoted`, `resolved`, or `closed`). The owner-only `/owner/enquiries` workspace lists and filters submissions, displays repair and cart context, and permits status updates through server-side admin-only procedures.
- Public browser verification confirms the owner dashboard presents a sign-in requirement without exposing enquiry content. Unit coverage verifies repair intake persistence and owner notification detail, incomplete-intake rejection, non-admin dashboard denial, safe repair-context parsing, and status update dispatch. TypeScript, 35 unit tests, production build, and browser journeys pass.
