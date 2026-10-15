import { describe, expect, it } from "vitest";
import { footerSocialLinks } from "./SiteFooter";

describe("footer social-media links", () => {
  it("links to the official VLI profiles", () => {
    expect(footerSocialLinks.map((link) => link.label)).toEqual(["LinkedIn", "YouTube", "Facebook"]);
    expect(footerSocialLinks.map((link) => link.href)).toEqual([
      "https://www.linkedin.com/company/velocity-lab-innovation",
      "https://www.youtube.com/@VelocityLabInnovation",
      "https://www.facebook.com/people/Velocity-Lab-Innovation/61594792029836/",
    ]);
  });
});
