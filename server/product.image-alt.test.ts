import { describe, expect, it } from "vitest";
import { productImageAltInput } from "./routers";

describe("product image alternative-text input", () => {
  it("converts an empty image alternative-text value into a safe product fallback", () => {
    expect(productImageAltInput.parse("")).toBe("Product image");
  });

  it("keeps a supplied image alternative-text value", () => {
    expect(productImageAltInput.parse("Blue drone frame")).toBe("Blue drone frame");
  });
});
