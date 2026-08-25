import { describe, expect, it } from "vitest";
import { peopleContent } from "./People";

describe("About VLI / People page", () => {
  it("keeps concise bilingual founder and delivery-confidence content", () => {
    expect(peopleContent.en.founders).toHaveLength(2);
    expect(peopleContent["zh-Hant"].founders).toHaveLength(2);
    expect(peopleContent.en.principles.map((principle) => principle.title)).toEqual(["Competition-aware", "Engineering-led", "Built for the next step"]);
    expect(peopleContent["zh-Hant"].title).toMatch(/[\u3400-\u9fff]/);
  });
});
