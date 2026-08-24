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

  it("leaves unreviewed copy unchanged instead of inventing a runtime translation", () => {
    expect(translateReviewedCopy("Unreviewed source", "zh-Hant")).toBe("Unreviewed source");
  });
});
