import { describe, expect, it } from "vitest";
import { languageSwitchPath } from "./languageNavigation";

describe("languageSwitchPath", () => {
  it("preserves the public page and fragment while changing locale", () => {
    expect(languageSwitchPath("/services#pricing", "zh-Hant")).toBe("/zh-hant/services#pricing");
    expect(languageSwitchPath("/zh-hant/dronesportsreferee#pricing", "en")).toBe("/dronesportsreferee#pricing");
  });

  it("uses the correct locale-specific homepage destinations", () => {
    expect(languageSwitchPath("/", "zh-Hant")).toBe("/zh-hant");
    expect(languageSwitchPath("/zh-hant", "en")).toBe("/");
  });
});
