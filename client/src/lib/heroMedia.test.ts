import { describe, expect, it } from "vitest";
import { homepageHeroVideoMobileMedia, homepageHeroVideoMobileSrc, homepageHeroVideoPosterSrc, homepageHeroVideoSrc } from "./heroMedia";

describe("homepage hero media", () => {
  it("serves the compressed hero video from the site's own media folder", () => {
    expect(homepageHeroVideoSrc).toBe("/media/vli-hero-video-1920_90873ce0.mp4");
    expect(homepageHeroVideoMobileSrc).toBe("/media/vli-hero-video-mobile-720x900_2d9ab73f.mp4");
    expect(homepageHeroVideoMobileMedia).toBe("(max-width: 767px)");
  });

  it("uses the first video frame as the hero loading poster", () => {
    expect(homepageHeroVideoPosterSrc).toBe("/media/vli-hero-video-poster-1920_a4941146.jpg");
  });
});
