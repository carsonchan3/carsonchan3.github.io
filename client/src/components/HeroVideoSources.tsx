import { homepageHeroVideoMobileMedia, homepageHeroVideoMobileSrc, homepageHeroVideoSrc } from "@/lib/heroMedia";

/** Sources for the hero background video: phones get the cropped cut, wider screens the 1920 px version. */
export default function HeroVideoSources() {
  return (
    <>
      <source src={homepageHeroVideoMobileSrc} media={homepageHeroVideoMobileMedia} type="video/mp4" />
      <source src={homepageHeroVideoSrc} type="video/mp4" />
    </>
  );
}
