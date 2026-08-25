import { describe, expect, it } from "vitest";
import { privacyContent } from "./Privacy";

describe("Privacy page", () => {
  it("provides plain-language bilingual enquiry-data context without a response-time promise", () => {
    expect(privacyContent.en.sections).toHaveLength(4);
    expect(privacyContent["zh-Hant"].sections).toHaveLength(4);
    expect(privacyContent.en.introduction).toContain("formal privacy policy");
    expect(privacyContent.en.sections.flatMap((section) => [section.title, section.body]).join(" ")).not.toMatch(/one business day/i);
  });
});
