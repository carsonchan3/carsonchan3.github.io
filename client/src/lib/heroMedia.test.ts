import { describe, expect, it } from "vitest";
import { homepageHeroVideoSrc } from "./heroMedia";

describe("homepage hero media", () => {
  it("uses the supplied VLI hero video", () => {
    expect(homepageHeroVideoSrc).toBe("/manus-storage/vli-hero-video_21-9_acdcc551.mp4");
  });
});
