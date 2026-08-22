import { REVEAL_TARGET_SELECTOR, shouldRevealImmediately } from "@/lib/revealMotion";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function RevealMotionController() {
  const [location] = useLocation();

  useEffect(() => {
    let observer: IntersectionObserver | undefined;
    const frame = window.requestAnimationFrame(() => {
      const revealTargets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_TARGET_SELECTOR));
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (shouldRevealImmediately(prefersReducedMotion, "IntersectionObserver" in window, window.innerWidth)) {
        revealTargets.forEach((target) => {
          target.classList.remove("reveal-up", "is-revealed");
          target.setAttribute("data-revealed", "");
        });
        return;
      }

      revealTargets.forEach((target) => {
        target.classList.add("reveal-up");
        target.classList.remove("is-revealed");
        target.removeAttribute("data-revealed");
      });

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.setAttribute("data-revealed", "");
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -7% 0px" },
      );

      revealTargets.forEach((target) => observer?.observe(target));
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [location]);

  return null;
}
