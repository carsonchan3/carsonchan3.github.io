import { useEffect, useRef, useState } from "react";
import { homepageHeroVideoMobileMedia, homepageHeroVideoMobileSrc, homepageHeroVideoSrc } from "@/lib/heroMedia";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Hero background loop. Stays invisible over the poster image behind it until frames are really playing,
 * then fades in, so start-up never flashes or visibly restarts. Pauses off screen and honours reduced motion.
 */
export default function HeroVideo({ className = "", testId }: { className?: string; testId?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (prefersReducedMotion()) {
      video.pause();
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void video.play().catch(() => undefined);
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      data-testid={testId}
      aria-hidden="true"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onPlaying={() => {
        if (!prefersReducedMotion()) setPlaying(true);
      }}
      className={`${className} transition-opacity duration-700 ease-out ${playing ? "opacity-100" : "opacity-0"}`}
    >
      <source src={homepageHeroVideoMobileSrc} media={homepageHeroVideoMobileMedia} type="video/mp4" />
      <source src={homepageHeroVideoSrc} type="video/mp4" />
    </video>
  );
}
