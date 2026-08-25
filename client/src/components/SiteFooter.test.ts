import { describe, expect, it } from "vitest";
import { footerSocialLinks } from "./SiteFooter";

describe("footer social-media placeholders", () => {
  it("provides the four requested branded social destinations as replaceable external links", () => {
    expect(footerSocialLinks.map((link) => link.label)).toEqual(["LinkedIn", "Instagram", "YouTube", "Facebook"]);
    expect(footerSocialLinks.map((link) => link.href)).toEqual([
      "https://www.linkedin.com/",
      "https://www.instagram.com/",
      "https://www.youtube.com/",
      "https://www.facebook.com/",
    ]);
  });
});
