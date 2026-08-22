export const REVEAL_STAGGER_MS = 90;
export const REVEAL_TARGET_SELECTOR = "[data-reveal], main[data-reveal-page] > section";
export const MOBILE_REVEAL_BREAKPOINT = 768;

export function getRevealTransitionDelay(index: number, interval = REVEAL_STAGGER_MS): string {
  return `${Math.max(0, index) * interval}ms`;
}

export function shouldRevealImmediately(
  prefersReducedMotion: boolean,
  supportsIntersectionObserver: boolean,
  viewportWidth?: number,
): boolean {
  return prefersReducedMotion
    || !supportsIntersectionObserver
    || (viewportWidth !== undefined && viewportWidth < MOBILE_REVEAL_BREAKPOINT);
}
