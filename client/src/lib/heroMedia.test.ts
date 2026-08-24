import { describe, expect, it } from "vitest";
import { homepageHeroVideoPosterSrc, homepageHeroVideoSrc } from "./heroMedia";

describe("homepage hero media", () => {
  it("uses the supplied VLI hero video", () => {
    expect(homepageHeroVideoSrc).toBe("/manus-storage/vli-hero-video_21-9SHORT_a09002e3.mp4");
  });

  it("uses the first video frame as the hero loading poster", () => {
    expect(homepageHeroVideoPosterSrc).toBe("/manus-storage/vli-hero-video-first-frame_6e981c30.jpg");
  });
});
