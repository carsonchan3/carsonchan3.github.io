import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
const results = [];

for (const viewport of [
  { name: "desktop", width: 1280, height: 720 },
  { name: "mobile", width: 375, height: 812 },
]) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "domcontentloaded" });
  await page.locator("#offerings").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);

  const cardLinks = page.locator("#offerings > div > div:last-child > a");
  const cardCount = await cardLinks.count();
  const cardHrefs = await cardLinks.evaluateAll((cards) => cards.map((card) => card.getAttribute("href")));
  const cardTitles = await cardLinks.locator("h3").allTextContents();
  const imagesLoaded = await cardLinks.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0));

  await cardLinks.first().hover();
  await page.waitForTimeout(600);
  const hoverScale = await cardLinks.first().locator("img").evaluate((image) => getComputedStyle(image).scale);
  const desktopNavLabels = await page.locator('nav[aria-label="Primary navigation"]').allTextContents();
  const headerBackground = await page.locator("header").evaluate((header) => getComputedStyle(header).backgroundColor);
  const headerLanguageControls = await page.locator('header [aria-label="Language selector"]').count();
  const englishSelected = await page.locator('header [data-testid="language-en"]').first().getAttribute("aria-pressed") === "true";
  const requestDemoInHeader = await page.locator("header").getByText("Request Demo", { exact: true }).count();
  const toolbarLanguageControl = page.locator('[data-placement="mobile-toolbar"]');
  const toolbarLanguageDisplay = await toolbarLanguageControl.evaluate((element) => getComputedStyle(element).display);
  const floatingControlAbsent = await page.locator('[data-placement="mobile-floating"]').count() === 0;
  const homepageContactSectionAbsent = await page.locator("#contact").count() === 0;
  const chineseLanguageTrigger = viewport.name === "mobile" ? page.getByTestId("language-toolbar-zh") : page.locator('header [data-testid="language-zh"]').first();
  await chineseLanguageTrigger.click();
  await page.getByText("中文內容準備中，目前只提供英文版本。", { exact: true }).waitFor({ state: "visible" });
  const chineseAvailabilityPopupCorrect = await page.getByText("中文內容準備中，目前只提供英文版本。", { exact: true }).count() === 1;

  let mobileMenuValid = true;
  let mobileLanguageControlPresent = true;
  let mobileToolbarLanguagePresent = true;
  if (viewport.name === "mobile") {
    mobileToolbarLanguagePresent = toolbarLanguageDisplay !== "none" && await toolbarLanguageControl.count() === 1;
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const mobileLinks = await page.locator('nav[aria-label="Mobile navigation"] a').allTextContents();
    mobileMenuValid = ["Smart Referee", "Product", "Services", "Contact"].every((label) => mobileLinks.includes(label)) && !mobileLinks.includes("Use Cases") && !mobileLinks.includes("Demo");
    mobileLanguageControlPresent = await page.locator('nav[aria-label="Mobile navigation"] [aria-label="Language selector"]').count() === 1;
  }

  const routes = ["/", "/dronesportsreferee", "/product", "/services", "/people", "/use-cases", "/contact", "/404"];
  const routeChecks = [];
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: "domcontentloaded" });
    const revealTargets = page.locator("main [data-reveal]");
    const revealTargetCount = await revealTargets.count();
    const explicitRevealTargetCount = await page.locator("main [data-reveal]").count();
    for (let targetIndex = 0; targetIndex < revealTargetCount; targetIndex += 1) {
      await revealTargets.nth(targetIndex).scrollIntoViewIfNeeded();
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(700);
    const allRevealTargetsVisible = await revealTargets.evaluateAll((targets) => targets.every((target) => target.hasAttribute("data-revealed") && getComputedStyle(target).opacity === "1"));
    routeChecks.push({ route, heading: await page.locator("h1").first().innerText(), footer: await page.locator("footer").count() === 1, revealTargetCount, explicitRevealTargetCount, allRevealTargetsVisible });
  }

  await page.goto("http://127.0.0.1:3000/contact", { waitUntil: "domcontentloaded" });
  const contactPage = {
    heading: await page.locator("h1").first().innerText(),
    formPresent: await page.getByTestId("contact-enquiry-form").count() === 1,
    formControlCount: await page.getByTestId("contact-enquiry-form").locator("input, select, textarea").count(),
    contactNavigationActive: await page.locator('header nav[aria-label="Primary navigation"] a[href="/contact"]').getAttribute("aria-current") === "page",
  };
  const generalOrganizationOptionStyles = await page.getByTestId("contact-enquiry-form").locator('select[name="organizationType"] option').evaluateAll((options) => options.map((option) => ({ background: getComputedStyle(option).backgroundColor, color: getComputedStyle(option).color })));
  await page.route("**/api/trpc/contact.submit*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ result: { data: { json: { success: true, notificationSent: true, message: "Contact form submitted successfully" } } } }]),
    });
  });
  const contactForm = page.getByTestId("contact-enquiry-form");
  await contactForm.locator('input[name="name"]').fill("Browser Verification");
  await contactForm.locator('input[name="email"]').fill("verification@example.com");
  await contactForm.locator('textarea[name="message"]').fill("Please confirm the dedicated Contact page form completes successfully.");
  await contactForm.getByRole("button", { name: "Send enquiry" }).click();
  await page.getByText("Enquiry received. Our team will contact you within one business day.").waitFor({ state: "visible" });
  const contactSubmissionSuccess = await page.getByText("Enquiry received. Our team will contact you within one business day.").count() === 1;
  const contactFormReset = await contactForm.locator('input[name="name"]').inputValue() === "" && await contactForm.locator('textarea[name="message"]').inputValue() === "";
  await page.unroute("**/api/trpc/contact.submit*");

  await page.goto("http://127.0.0.1:3000/dronesportsreferee", { waitUntil: "domcontentloaded" });
  const smartRefereeHero = page.getByTestId("smart-referee-hero");
  const smartRefereeHeroAction = page.getByTestId("smart-referee-hero-service-action");
  await smartRefereeHeroAction.click();
  await page.waitForFunction(() => window.location.hash === "#pricing");
  const smartRefereeHeroActionState = {
    count: await smartRefereeHeroAction.count(),
    href: await smartRefereeHeroAction.getAttribute("href"),
    pricingAnchorNavigationWorks: new URL(page.url()).hash === "#pricing",
    hasExpectedLabel: await smartRefereeHeroAction.innerText() === "Explore service",
    legacyConfigureActionAbsent: await smartRefereeHero.getByRole("link", { name: "Configure your system", exact: true }).count() === 0,
    duplicateExploreServiceActionAbsent: await smartRefereeHero.getByRole("link", { name: "Explore services", exact: true }).count() === 0,
  };
  const officiatingComparison = page.getByTestId("officiating-comparison");
  await officiatingComparison.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const officiatingComparisonText = await officiatingComparison.innerText();
  const officiatingComparisonState = {
    present: await officiatingComparison.count() === 1,
    traditionalPanelPresent: await page.getByTestId("traditional-officiating-panel").count() === 1,
    smartRefereePanelPresent: await page.getByTestId("smart-referee-support-panel").count() === 1,
    traditionalFlowPresent: await page.getByTestId("traditional-officiating-flow").count() === 1,
    smartRefereeFlowPresent: await page.getByTestId("smart-referee-support-flow").count() === 1,
    traditionalFlowStepCount: await page.getByTestId("traditional-flow-step").count(),
    smartRefereeFlowStepCount: await page.getByTestId("smart-referee-flow-step").count(),
    containsDecisionSupportPositioning: officiatingComparisonText.includes("support—not replace—official judgement"),
    containsHumanOnlyLimits: ["Limited angles", "strict-versus-loose", "difficult to explain or revisit"].every((text) => officiatingComparisonText.includes(text)),
  };
  const ecosystemAudienceCards = page.getByTestId("ecosystem-audience-card");
  const ecosystemIllustrationSources = await ecosystemAudienceCards.locator("img").evaluateAll((images) => images.map((image) => image.getAttribute("src")));
  const ecosystemIllustrationStates = await ecosystemAudienceCards.locator("img").evaluateAll((images) => images.map((image) => ({
    complete: image.complete,
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
  })));
  const smartRefereeVisualState = {
    heroHeightRatio: (await smartRefereeHero.evaluate((hero) => hero.getBoundingClientRect().height)) / viewport.height,
    traditionalComparisonGraphicPresent: await page.getByTestId("traditional-officiating-flow").locator("svg").count() === 1,
    smartRefereeComparisonGraphicPresent: await page.getByTestId("smart-referee-support-flow").locator("svg").count() === 1,
    systemFlowRemoved: await page.getByText("From movement data to a clear match decision.", { exact: true }).count() === 0,
    ecosystemAudienceCardCount: await ecosystemAudienceCards.count(),
    ecosystemIllustrationCount: await ecosystemAudienceCards.locator("img").count(),
    ecosystemIllustrationSources,
    ecosystemIllustrationStates,
  };
  const pricingSection = page.locator("#pricing");
  await pricingSection.scrollIntoViewIfNeeded();
  const pricingSectionPresent = await pricingSection.count() === 1;
  const pricingPriceLabels = await page.locator('[data-testid^="pricing-price-"]').allTextContents();
  const pricingCageNote = await page.getByTestId("pricing-cage-note").innerText();
  await page.waitForTimeout(750);
  const pricingTierSelectionStates = [];
  const pricingTierRequestStates = [];
  for (const tierId of ["assist", "managed", "evidence-pro"]) {
    await page.getByTestId(`pricing-tier-${tierId}`).click();
    await page.waitForTimeout(80);
    pricingTierSelectionStates.push({
      tierId,
      selected: await page.getByTestId(`pricing-tier-${tierId}`).getAttribute("aria-pressed") === "true",
      allTierCardsVisible: await page.locator('[data-testid^="pricing-tier-"]').evaluateAll((cards) => cards.every((card) => getComputedStyle(card).opacity === "1" && getComputedStyle(card).visibility === "visible")),
    });
    await page.getByTestId("acquisition-rental").click();
    const pricingDialog = page.getByTestId("pricing-request-dialog");
    await pricingDialog.waitFor({ state: "visible" });
    pricingTierRequestStates.push({
      tierId,
      dialogOpen: await pricingDialog.count() === 1,
      selectedTier: await pricingDialog.locator('select[name="pricingTier"]').inputValue(),
      selectedAcquisition: await pricingDialog.locator('select[name="acquisition"]').inputValue(),
    });
    if (tierId !== "evidence-pro") {
      await page.keyboard.press("Escape");
      await pricingDialog.waitFor({ state: "hidden" });
    }
  }
  const managedSelected = pricingTierSelectionStates.find((state) => state.tierId === "managed")?.selected === true;
  const pricingDialogOpened = await page.locator('[role="dialog"]').count() === 1;
  const pricingDialogStyles = await page.getByTestId("pricing-request-dialog").evaluate((dialog) => ({ background: getComputedStyle(dialog).backgroundColor, color: getComputedStyle(dialog).color }));
  const pricingDialogInputClasses = await page.getByTestId("pricing-request-dialog").locator("input, textarea, select").evaluateAll((controls) => controls.filter((control) => control.getAttribute("name") !== "website").map((control) => control.getAttribute("class")));
  const pricingDialogOptionStyles = await page.getByTestId("pricing-request-dialog").locator("select option").evaluateAll((options) => options.map((option) => ({ background: getComputedStyle(option).backgroundColor, color: getComputedStyle(option).color })));

  await page.goto("http://127.0.0.1:3000/pricing", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(150);
  const legacyPricingRedirected = new URL(page.url()).pathname === "/dronesportsreferee" && new URL(page.url()).hash === "#pricing";

  await page.goto("http://127.0.0.1:3000/equipment", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(150);
  const legacyEquipmentRedirected = new URL(page.url()).pathname === "/product";

  const productTopHeading = await page.locator("main > section").first().locator("h1").innerText();
  const productPlaceholderTextPresent = /placeholder/i.test(await page.locator("main").innerText());
  const customQuotePresent = await page.getByRole("link", { name: "Request custom quote" }).count() === 1;
  const productCustomRequestCard = page.getByTestId("product-custom-request-card");
  const productCustomRequestRect = await productCustomRequestCard.evaluate((card) => { const rect = card.getBoundingClientRect(); return { top: Math.round(rect.top), bottom: Math.round(rect.bottom), width: Math.round(rect.width) }; });
  const productPriceTags = await page.getByTestId("product-price-tag").allTextContents();
  const productImageLocator = page.getByTestId("product-image");
  for (let imageIndex = 0; imageIndex < await productImageLocator.count(); imageIndex += 1) {
    await productImageLocator.nth(imageIndex).scrollIntoViewIfNeeded();
  }
  await page.waitForFunction(() => Array.from(document.querySelectorAll('[data-testid="product-image"]')).every((image) => image.complete && image.naturalWidth > 0));
  const productImageSources = await productImageLocator.evaluateAll((images) => images.map((image) => image.getAttribute("src")));
  const productImageStates = await productImageLocator.evaluateAll((images) => images.map((image) => ({ complete: image.complete, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight })));
  const productGridColumns = await page.getByTestId("product-catalogue-grid").evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length);
  const productGridRect = await page.getByTestId("product-catalogue-grid").evaluate((grid) => { const rect = grid.getBoundingClientRect(); return { top: Math.round(rect.top), width: Math.round(rect.width) }; });
  const productCustomRequestTopPriority = await productCustomRequestCard.evaluate((card) => {
    const grid = card.parentElement?.querySelector('[data-testid="product-catalogue-grid"]');
    if (!grid) return false;
    const cardRect = card.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    return Boolean(card.compareDocumentPosition(grid) & Node.DOCUMENT_POSITION_FOLLOWING) && cardRect.width >= gridRect.width * 0.98;
  });
  const productCardRects = await page.getByTestId("product-catalogue-card").evaluateAll((cards) => cards.map((card) => { const rect = card.getBoundingClientRect(); return { top: Math.round(rect.top), height: Math.round(rect.height) }; }));
  const productCards = page.getByTestId("product-catalogue-card");
  const productCatalogueVisibilityState = {
    mainUsesSectionRevealTarget: await page.locator("main").getAttribute("data-reveal-page") !== null,
    cards: await productCards.evaluateAll((cards) => cards.map((card) => ({ opacity: getComputedStyle(card).opacity, visibility: getComputedStyle(card).visibility, display: getComputedStyle(card).display }))),
  };
  const productDiscussSetupActionsAbsent = await page.getByText("Discuss setup", { exact: true }).count() === 0;
  await productCards.first().getByTestId("product-detail-trigger").click();
  await page.getByTestId("product-detail-title").waitFor({ state: "visible" });
  const productDetailDialogState = {
    open: await page.getByTestId("product-detail-title").count() === 1,
    title: await page.getByTestId("product-detail-title").innerText(),
    variantCount: await page.getByTestId("product-detail-variant").count(),
    defaultPrice: await page.getByTestId("product-detail-price").innerText(),
    addActionPresent: await page.getByTestId("product-detail-add-to-cart").count() === 1,
  };
  await page.getByTestId("product-detail-variant").nth(1).click();
  const selectedPnpVariantState = {
    price: await page.getByTestId("product-detail-price").innerText(),
    model: await page.getByTestId("product-detail-model").innerText(),
  };
  await page.getByTestId("product-detail-add-to-cart").click();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  const productCartSummary = await page.getByTestId("product-cart-summary").innerText();
  const productAskPricingButton = page.getByTestId("product-ask-pricing");
  const productAskPricingEnabled = await productAskPricingButton.isEnabled();
  const floatingProductCart = page.getByTestId("floating-product-cart");
  await floatingProductCart.click();
  await page.getByTestId("floating-product-cart-panel").waitFor({ state: "visible" });
  await page.getByTestId("floating-cart-increase").click();
  await page.getByTestId("floating-cart-close").click();
  const floatingProductCartState = {
    count: await floatingProductCart.count(),
    enabled: await floatingProductCart.isEnabled(),
    unitCount: await page.getByTestId("floating-product-cart-count").innerText(),
    styles: await floatingProductCart.evaluate((cart) => ({ position: getComputedStyle(cart).position, bottom: getComputedStyle(cart).bottom, right: getComputedStyle(cart).right })),
  };
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByTestId("product-cart-summary").waitFor({ state: "visible" });
  const restoredCartState = {
    summary: await page.getByTestId("product-cart-summary").innerText(),
    unitCount: await page.getByTestId("floating-product-cart-count").innerText(),
    storageValue: await page.evaluate(() => window.localStorage.getItem("vli-product-quote-cart-v1")),
  };
  await page.getByTestId("floating-product-cart").click();
  const floatingCartPanel = page.getByTestId("floating-product-cart-panel");
  await floatingCartPanel.waitFor({ state: "visible" });
  const floatingCartPanelState = {
    itemCount: await page.getByTestId("floating-cart-item").count(),
    initialQuantity: await page.getByTestId("floating-cart-quantity").innerText(),
  };
  await page.getByTestId("floating-cart-decrease").click();
  const floatingCartQuantityAfterDecrease = await page.getByTestId("floating-cart-quantity").innerText();
  await page.getByTestId("floating-cart-increase").click();
  const floatingCartQuantityAfterIncrease = await page.getByTestId("floating-cart-quantity").innerText();
  await page.getByTestId("floating-cart-remove").click();
  await page.getByTestId("floating-cart-empty").waitFor({ state: "visible" });
  const emptyCartAfterRemoval = {
    panelVisible: await floatingCartPanel.count() === 1,
    storageCleared: await page.evaluate(() => window.localStorage.getItem("vli-product-quote-cart-v1") === null),
    askPricingDisabled: await page.getByTestId("product-ask-pricing").isDisabled(),
  };
  await page.getByTestId("floating-cart-close").click();
  await productCards.first().getByTestId("product-detail-trigger").click();
  await page.getByTestId("product-detail-title").waitFor({ state: "visible" });
  await page.getByTestId("product-detail-variant").nth(1).click();
  await page.getByTestId("product-detail-add-to-cart").click();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  await page.getByTestId("floating-product-cart").click();
  await page.getByTestId("floating-product-cart-panel").waitFor({ state: "visible" });
  await page.getByTestId("floating-cart-increase").click();
  await page.getByTestId("floating-cart-ask-pricing").click();
  await page.getByTestId("cart-pricing-form").waitFor({ state: "visible" });
  const cartPricingDialogState = {
    open: await page.getByTestId("cart-pricing-form").count() === 1,
    cartSummary: await page.getByTestId("cart-pricing-summary").innerText(),
    productQuantityIncluded: (await page.getByTestId("cart-pricing-summary").innerText()).includes("2 ×"),
  };
  const cartPricingForm = page.getByTestId("cart-pricing-form");
  const deliveryAddressField = page.getByTestId("cart-pricing-delivery-address");
  const browserDeliveryAddress = "Unit 12, 8 Science Park West Avenue, Hong Kong";
  let productPricingRequestBody = "";
  await page.route("**/api/trpc/contact.submit*", async (route) => {
    productPricingRequestBody = route.request().postData() ?? "";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ result: { data: { json: { success: true, notificationSent: true, message: "Contact form submitted successfully" } } } }]),
    });
  });
  await cartPricingForm.locator('input[name="name"]').fill("Product Verification");
  await cartPricingForm.locator('input[name="email"]').fill("product-verification@example.com");
  await deliveryAddressField.fill(browserDeliveryAddress);
  await cartPricingForm.locator('textarea[name="message"]').fill("Please confirm delivery timing for this product selection.");
  await cartPricingForm.getByRole("button", { name: "Ask for pricing" }).click();
  await page.getByText("Pricing request received. Our team will review your cart and reply within one business day.").waitFor({ state: "visible" });
  await page.unroute("**/api/trpc/contact.submit*");
  const cartPricingDeliveryAddressState = {
    present: await deliveryAddressField.count() === 1,
    required: await deliveryAddressField.getAttribute("required") === "",
    payloadIncluded: productPricingRequestBody.includes(browserDeliveryAddress),
  };

  await page.goto("http://127.0.0.1:3000/owner/enquiries", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  const ownerDashboardPublicState = {
    signInRequired: await page.getByRole("button", { name: "Sign in" }).count() === 1,
    enquiryContentHidden: await page.getByText("Enquiry command centre").count() === 0,
  };

  await page.goto("http://127.0.0.1:3000/services", { waitUntil: "domcontentloaded" });
  const serviceBannerTitles = await page.locator("main h3").allTextContents();
  const serviceBannerCtaCount = await page.getByRole("button", { name: "Discuss this service" }).count();
  const serviceBannerHeights = await page.locator("main article").evaluateAll((articles) => articles.map((article) => Math.round(article.getBoundingClientRect().height)));
  const serviceHeroHeight = await page.getByTestId("services-page-hero").evaluate((hero) => Math.round(hero.getBoundingClientRect().height));
  const serviceGuidanceCount = await page.getByTestId("service-guidance").count();
  const durationGuidanceCount = await page.getByText("Estimated duration", { exact: true }).count();
  const pricingGuidanceCount = await page.getByText("Pricing guidance", { exact: true }).count();
  await page.getByTestId("service-enquiry-trigger-01").click();
  const serviceEnquiryDialogOpen = await page.locator('[role="dialog"]').count() === 1;
  const preselectedService = await page.getByTestId("selected-service-summary").innerText();
  const repairMailInGuidance = await page.getByTestId("repair-mail-in-guidance").innerText();
  const repairDialogDescription = await page.locator('[role="dialog"] [data-slot="dialog-description"]').innerText();
  const repairIntakeChecklistState = {
    present: await page.getByTestId("repair-intake-checklist").count() === 1,
    requiredFieldsPresent: await page.locator('[role="dialog"] [name="droneModel"][required], [role="dialog"] [name="faultSymptoms"][required], [role="dialog"] [name="priorRepairs"][required], [role="dialog"] [name="powerState"][required]').count() === 4,
    photoConfirmationPresent: await page.locator('[role="dialog"] [name="hasPhotos"][type="checkbox"]').count() === 1,
  };
  const serviceOrganizationSelectClass = await page.getByTestId("service-organization-type-select").getAttribute("class");
  const serviceOrganizationOptionStyles = await page.getByTestId("service-organization-type-select").locator("option").evaluateAll((options) => options.map((option) => ({ background: getComputedStyle(option).backgroundColor, color: getComputedStyle(option).color })));
  await page.keyboard.press("Escape");
  const serviceThumbnailSources = await page.locator("main article img").evaluateAll((images) => images.map((image) => image.getAttribute("src")));
  const serviceThumbnailWidths = await page.locator("main article img").evaluateAll((images) => images.map((image) => Math.round(image.getBoundingClientRect().width)));
  const serviceImageFadeStyles = await page.getByTestId("service-image-fade").evaluateAll((fades) => fades.map((fade) => getComputedStyle(fade).backgroundImage));
  const serviceImagePanelRatios = await page.getByTestId("service-image-panel").evaluateAll((panels) => panels.map((panel) => {
    const panelRect = panel.getBoundingClientRect();
    const cardRect = panel.closest("article")?.getBoundingClientRect();
    return cardRect ? { width: Number((panelRect.width / cardRect.width).toFixed(2)), height: Number((panelRect.height / cardRect.height).toFixed(2)) } : null;
  }));
  const serviceThumbnailLocator = page.locator("main article img");
  for (let thumbnailIndex = 0; thumbnailIndex < await serviceThumbnailLocator.count(); thumbnailIndex += 1) {
    await serviceThumbnailLocator.nth(thumbnailIndex).scrollIntoViewIfNeeded();
  }
  await page.waitForFunction(() => Array.from(document.querySelectorAll("main article img")).every((image) => image.complete && image.naturalWidth > 1000));
  const serviceThumbnailStates = await serviceThumbnailLocator.evaluateAll((images) => images.map((image) => ({
    complete: image.complete,
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
  })));

  results.push({
    viewport: viewport.name,
    cardCount,
    cardHrefs,
    cardTitles,
    imagesLoaded,
    hoverScale,
    desktopNavLabels,
    headerBackground,
    headerLanguageControls,
    englishSelected,
    requestDemoInHeader,
    toolbarLanguageDisplay,
    floatingControlAbsent,
    homepageContactSectionAbsent,
    chineseAvailabilityPopupCorrect,
    generalOrganizationOptionStyles,
    mobileMenuValid,
    mobileLanguageControlPresent,
    mobileToolbarLanguagePresent,
    routeChecks,
    contactPage,
    contactSubmissionSuccess,
    contactFormReset,
    smartRefereeHeroActionState,
    officiatingComparisonState,
    smartRefereeVisualState,
    pricingSectionPresent,
    pricingPriceLabels,
    pricingCageNote,
    managedSelected,
    pricingTierSelectionStates,
    pricingTierRequestStates,
    pricingDialogOpened,
    pricingDialogStyles,
    pricingDialogInputClasses,
    pricingDialogOptionStyles,
    legacyPricingRedirected,
    legacyEquipmentRedirected,
    productTopHeading,
    productPlaceholderTextPresent,
    customQuotePresent,
    productCustomRequestTopPriority,
    productPriceTags,
    productImageSources,
    productImageStates,
    productGridColumns,
    productCardRects,
    productCatalogueVisibilityState,
    selectedPnpVariantState,
    productDiscussSetupActionsAbsent,
    productCartSummary,
    productAskPricingEnabled,
    floatingProductCartState,
    restoredCartState,
    floatingCartPanelState,
    floatingCartQuantityAfterDecrease,
    floatingCartQuantityAfterIncrease,
    emptyCartAfterRemoval,
    productDetailDialogState,
    cartPricingDialogState,
    cartPricingDeliveryAddressState,
    ownerDashboardPublicState,
    serviceBannerTitles,
    serviceBannerCtaCount,
    serviceBannerHeights,
    serviceHeroHeight,
    serviceGuidanceCount,
    durationGuidanceCount,
    pricingGuidanceCount,
    serviceEnquiryDialogOpen,
    preselectedService,
    repairMailInGuidance,
    repairDialogDescription,
    repairIntakeChecklistState,
    serviceOrganizationSelectClass,
    serviceOrganizationOptionStyles,
    serviceThumbnailSources,
    serviceThumbnailWidths,
    serviceImageFadeStyles,
    serviceImagePanelRatios,
    serviceThumbnailStates,
  });
  await context.close();
}

console.log(JSON.stringify(results, null, 2));

const reducedMotionContext = await browser.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: "reduce" });
const reducedMotionPage = await reducedMotionContext.newPage();
const reducedMotionRevealState = [];
for (const route of ["/dronesportsreferee", "/services", "/people", "/contact"]) {
  await reducedMotionPage.goto(`http://127.0.0.1:3000${route}`, { waitUntil: "domcontentloaded" });
  await reducedMotionPage.waitForTimeout(100);
  const revealTargets = reducedMotionPage.locator("main[data-reveal-page] > section, main [data-reveal]");
  const interactiveControls = reducedMotionPage.locator("main a, main button");
  reducedMotionRevealState.push({
    route,
    count: await revealTargets.count(),
    allVisible: await revealTargets.evaluateAll((targets) => targets.every((target) => target.hasAttribute("data-revealed") && getComputedStyle(target).opacity === "1" && getComputedStyle(target).transform === "none")),
    controlsVisible: await interactiveControls.evaluateAll((controls) => controls.every((control) => getComputedStyle(control).opacity === "1")),
  });
}
await reducedMotionContext.close();
console.log(JSON.stringify({ reducedMotionRevealState }, null, 2));
await browser.close();

const expectedHrefs = ["/dronesportsreferee", "/product", "/services"];
const expectedTitles = ["Smart Referee", "Drone Equipment", "Services"];
const expectedServiceThumbnails = [
  "/manus-storage/vli-service-repair_13ee3faf.png",
  "/manus-storage/vli-service-pid-tuning_e541b71d.png",
  "/manus-storage/vli-service-building-skills_c32759ba.png",
  "/manus-storage/vli-service-advanced-course_d14dd579.png",
];
const failed = results.some((result) =>
  result.cardCount !== 3
  || JSON.stringify(result.cardHrefs) !== JSON.stringify(expectedHrefs)
  || JSON.stringify(result.cardTitles) !== JSON.stringify(expectedTitles)
  || !result.imagesLoaded
  || result.hoverScale === "none"
  || result.hoverScale === "1"
  || !result.desktopNavLabels.join(" ").includes("Product")
  || !result.desktopNavLabels.join(" ").includes("Services")
  || !result.desktopNavLabels.join(" ").includes("Smart Referee")
  || result.desktopNavLabels.join(" ").includes("Use Cases")
  || result.desktopNavLabels.join(" ").includes("Demo")
  || result.desktopNavLabels.join(" ").includes("Pricing")
  || result.headerBackground !== "rgb(255, 255, 255)"
  || result.headerLanguageControls !== 1
  || !result.englishSelected
  || result.requestDemoInHeader !== 0
  || (result.viewport === "desktop" && result.toolbarLanguageDisplay !== "none")
  || !result.floatingControlAbsent
  || !result.homepageContactSectionAbsent
  || !result.chineseAvailabilityPopupCorrect
  || !result.mobileMenuValid
  || !result.mobileLanguageControlPresent
  || !result.mobileToolbarLanguagePresent
  || result.routeChecks.some((route) => !route.heading || (route.route !== "/404" && !route.footer) || route.revealTargetCount < 1 || route.explicitRevealTargetCount < (route.route === "/404" ? 1 : 2) || !route.allRevealTargetsVisible)
  || result.contactPage.heading !== "Let’s build the right next step."
  || !result.contactPage.formPresent
  || result.contactPage.formControlCount !== 7
  || !result.contactPage.contactNavigationActive
  || !result.contactSubmissionSuccess
  || !result.contactFormReset
  || result.smartRefereeHeroActionState.count !== 1
  || result.smartRefereeHeroActionState.href !== "#pricing"
  || !result.smartRefereeHeroActionState.pricingAnchorNavigationWorks
  || !result.smartRefereeHeroActionState.hasExpectedLabel
  || !result.smartRefereeHeroActionState.legacyConfigureActionAbsent
  || !result.smartRefereeHeroActionState.duplicateExploreServiceActionAbsent
  || !result.officiatingComparisonState.present
  || !result.officiatingComparisonState.traditionalPanelPresent
  || !result.officiatingComparisonState.smartRefereePanelPresent
  || !result.officiatingComparisonState.traditionalFlowPresent
  || !result.officiatingComparisonState.smartRefereeFlowPresent
  || result.officiatingComparisonState.traditionalFlowStepCount !== 3
  || result.officiatingComparisonState.smartRefereeFlowStepCount !== 3
  || !result.officiatingComparisonState.containsDecisionSupportPositioning
  || !result.officiatingComparisonState.containsHumanOnlyLimits
  || (result.viewport === "desktop" && (result.smartRefereeVisualState.heroHeightRatio < 0.65 || result.smartRefereeVisualState.heroHeightRatio > 0.85))
  || !result.smartRefereeVisualState.traditionalComparisonGraphicPresent
  || !result.smartRefereeVisualState.smartRefereeComparisonGraphicPresent
  || !result.smartRefereeVisualState.systemFlowRemoved
  || result.smartRefereeVisualState.ecosystemAudienceCardCount !== 3
  || result.smartRefereeVisualState.ecosystemIllustrationCount !== 3
  || !result.smartRefereeVisualState.ecosystemIllustrationSources.includes("/manus-storage/vli-ecosystem-clubs-replacement_e3af6edd.png")
  || !result.smartRefereeVisualState.ecosystemIllustrationSources.includes("/manus-storage/vli-ecosystem-educators-replacement_3c55b4c5.png")
  || result.smartRefereeVisualState.ecosystemIllustrationStates.some((image) => !image.complete || image.naturalWidth < 100 || image.naturalHeight < 100)
  || !result.pricingSectionPresent
  || JSON.stringify(result.pricingPriceLabels) !== JSON.stringify(["From $XXXX", "From $XXXX", "From $XXXX"])
  || !result.pricingCageNote.includes("quoted separately")
  || !result.managedSelected
  || result.pricingTierSelectionStates.length !== 3
  || result.pricingTierSelectionStates.some((state) => !state.selected || !state.allTierCardsVisible)
  || result.pricingTierRequestStates.length !== 3
  || result.pricingTierRequestStates.some((state) => !state.dialogOpen || state.selectedTier !== state.tierId || state.selectedAcquisition !== "rental")
  || !result.pricingDialogOpened
  || result.pricingDialogStyles.background !== "rgb(28, 29, 32)"
  || result.pricingDialogStyles.color !== "rgb(255, 255, 255)"
  || result.pricingDialogInputClasses.some((className) => !className?.includes("bg-black/20") || !className?.includes("text-white"))
  || result.pricingDialogOptionStyles.some((style) => style.background !== "rgb(28, 29, 32)" || style.color !== "rgb(255, 255, 255)")
  || !result.legacyPricingRedirected
  || !result.legacyEquipmentRedirected
  || result.productTopHeading !== "Select a starting point."
  || result.productPlaceholderTextPresent
  || !result.customQuotePresent
  || !result.productCustomRequestTopPriority
  || result.productPriceTags.length !== 13
  || result.productPriceTags.some((price) => !price.includes("HK$") || price.length <= 3)
  || result.productImageSources.length !== 13
  || result.productImageSources.some((source) => !source?.startsWith("/manus-storage/excel_prod_"))
  || result.productImageStates.some((state) => !state.complete || state.naturalWidth < 1 || state.naturalHeight < 1)
  || result.productGridColumns !== (result.viewport === "mobile" ? 2 : 3)
  || result.productCardRects.length !== 13
  || result.productCatalogueVisibilityState.mainUsesSectionRevealTarget
  || result.productCatalogueVisibilityState.cards.length !== 13
  || result.productCatalogueVisibilityState.cards.some((state) => state.opacity !== "1" || state.visibility !== "visible" || state.display === "none")
  || (result.viewport === "mobile" && result.productCardRects[1].top - result.productCardRects[0].top < 20)
  || (result.viewport === "mobile" && result.productCardRects[1].height <= result.productCardRects[0].height)
  || !result.productDiscussSetupActionsAbsent
  || !result.productCartSummary.includes("1 item type · 1 unit")
  || !result.productAskPricingEnabled
  || result.floatingProductCartState.count !== 1
  || !result.floatingProductCartState.enabled
  || result.floatingProductCartState.unitCount !== "2"
  || result.floatingProductCartState.styles.position !== "fixed"
  || (result.viewport === "mobile" && result.floatingProductCartState.styles.bottom === "auto")
  || result.floatingProductCartState.styles.right === "auto"
  || !result.restoredCartState.summary.includes("1 item type · 2 units")
  || result.restoredCartState.unitCount !== "2"
  || !result.restoredCartState.storageValue?.includes('"26":2')
  || result.floatingCartPanelState.itemCount !== 1
  || result.floatingCartPanelState.initialQuantity !== "2"
  || result.floatingCartQuantityAfterDecrease !== "1"
  || result.floatingCartQuantityAfterIncrease !== "2"
  || !result.emptyCartAfterRemoval.panelVisible
  || !result.emptyCartAfterRemoval.storageCleared
  || !result.emptyCartAfterRemoval.askPricingDisabled
  || !result.productDetailDialogState.open
  || result.productDetailDialogState.title !== "TOPS Shield 205"
  || result.productDetailDialogState.variantCount !== 2
  || result.productDetailDialogState.defaultPrice !== "HK$3,330"
  || !result.productDetailDialogState.addActionPresent
  || result.selectedPnpVariantState.price !== "HK$2,110"
  || result.selectedPnpVariantState.model !== "TZ009"
  || !result.cartPricingDialogState.open
  || !result.cartPricingDialogState.productQuantityIncluded
  || !result.cartPricingDeliveryAddressState.present
  || !result.cartPricingDeliveryAddressState.required
  || !result.cartPricingDeliveryAddressState.payloadIncluded
  || !result.ownerDashboardPublicState.signInRequired
  || !result.ownerDashboardPublicState.enquiryContentHidden
  || JSON.stringify(result.serviceBannerTitles) !== JSON.stringify(["Drone Repair Service", "PID tuning service", "Drone Building Course", "Advanced drone course for adults"])
  || result.serviceBannerCtaCount !== 4
  || result.serviceBannerHeights.length !== 4
  || result.serviceBannerHeights.some((height) => height > (result.viewport === "desktop" ? 430 : 640))
  || result.serviceHeroHeight > (result.viewport === "desktop" ? 340 : 320)
  || result.serviceGuidanceCount !== 4
  || result.durationGuidanceCount !== 4
  || result.pricingGuidanceCount !== 4
  || !result.serviceEnquiryDialogOpen
  || result.preselectedService !== "Drone Repair Service"
  || !/mail-in instructions.*quotation/i.test(result.repairDialogDescription)
  || !/mail-in assessment and quotation/i.test(result.repairMailInGuidance)
  || !/delivery fees can be waived/i.test(result.repairMailInGuidance)
  || !result.repairIntakeChecklistState.present
  || !result.repairIntakeChecklistState.requiredFieldsPresent
  || !result.repairIntakeChecklistState.photoConfirmationPresent
  || !result.serviceOrganizationSelectClass?.includes("[&>option]:bg-black")
  || !result.serviceOrganizationSelectClass?.includes("[&>option]:text-white")
  || JSON.stringify(result.serviceOrganizationOptionStyles) !== JSON.stringify(result.generalOrganizationOptionStyles)
  || JSON.stringify(result.serviceThumbnailSources) !== JSON.stringify(expectedServiceThumbnails)
  || result.serviceThumbnailWidths.length !== 4
  || result.serviceThumbnailWidths.some((width) => width < (result.viewport === "desktop" ? 280 : 300))
  || result.serviceImageFadeStyles.length !== 4
  || result.serviceImageFadeStyles.some((backgroundImage) => !backgroundImage.includes("linear-gradient"))
  || result.serviceImagePanelRatios.length !== 4
  || result.serviceImagePanelRatios.some((ratio) => !ratio || (result.viewport === "desktop" ? ratio.width < 0.45 || ratio.width > 0.55 : ratio.height < 0.35 || ratio.height > 0.55))
  || result.serviceThumbnailStates.length !== 4
  || result.serviceThumbnailStates.some((state) => !state.complete || state.naturalWidth < 1000 || state.naturalHeight < 1000)
);

if (reducedMotionRevealState.some((state) => state.count < 2 || !state.allVisible || !state.controlsVisible)) {
  process.exit(1);
}

if (failed) process.exit(1);
