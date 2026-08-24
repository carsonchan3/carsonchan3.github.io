import { describe, expect, it } from "vitest";
import { translateReviewedCopy } from "./WebsiteTranslationObserver";

describe("reviewed Traditional Chinese copy layer", () => {
  it("uses the user-approved brand and partner overrides in the Chinese experience", () => {
    expect(translateReviewedCopy("Velocity Lab Innovation", "zh-Hant")).toBe("速研創新");
    expect(translateReviewedCopy("Hong Kong Drone Sports Association", "zh-Hant")).toBe("中國香港無人機運動總會");
    expect(translateReviewedCopy("Hong Kong, China", "zh-Hant")).toBe("中國香港");
    expect(translateReviewedCopy("01 slot", "zh-Hant")).toBe("1x 時段");
    expect(translateReviewedCopy("04 roles", "zh-Hant")).toBe("4 個負責人");
    expect(translateReviewedCopy("Choose your operating starting point.", "zh-Hant")).toBe("選擇您所需的起點");
    expect(translateReviewedCopy("Assist", "zh-Hant")).toBe("Assist");
    expect(translateReviewedCopy("Managed", "zh-Hant")).toBe("Managed");
  });

  it("restores the original English source and preserves surrounding whitespace", () => {
    expect(translateReviewedCopy("  Every Frame Matters.  ", "zh-Hant")).toBe("  每一幀都同樣重要。  ");
    expect(translateReviewedCopy("Every Frame Matters.", "en")).toBe("Every Frame Matters.");
  });

  it("translates adjacent reviewed fragments without translating unreviewed material", () => {
    const rules = "Smart Referee can be configured around an organisation’s active rule set, scoring conditions, and review workflow. Making the selected rules explicit in the operating configuration helps officials apply the intended standard consistently and reduces the risk that a rule is overlooked or incorrectly recalled under event pressure.";
    const reference = "Supplied rule and federation references are shown for event-context discussion only; their display does not indicate endorsement.";
    expect(translateReviewedCopy(`${rules} ${reference}`, "zh-Hant")).toContain("Smart Referee 可依據組織採用中的規則集");
    expect(translateReviewedCopy(`${rules} ${reference}`, "zh-Hant")).toContain("其展示不代表任何背書");
  });

  it("leaves unreviewed copy unchanged instead of inventing a runtime translation", () => {
    expect(translateReviewedCopy("Unreviewed source", "zh-Hant")).toBe("Unreviewed source");
  });
});
