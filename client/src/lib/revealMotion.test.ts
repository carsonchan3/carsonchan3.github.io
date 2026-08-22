import { describe, expect, it } from "vitest";
import { getRevealTransitionDelay, MOBILE_REVEAL_BREAKPOINT, REVEAL_TARGET_SELECTOR, shouldRevealImmediately } from "./revealMotion";

describe("reveal motion utilities", () => {
  it("creates a consistent non-negative stagger delay", () => {
    expect(getRevealTransitionDelay(0)).toBe("0ms");
    expect(getRevealTransitionDelay(2)).toBe("180ms");
    expect(getRevealTransitionDelay(-1)).toBe("0ms");
  });

  it("shows content immediately when motion should not be animated", () => {
    expect(shouldRevealImmediately(true, true)).toBe(true);
    expect(shouldRevealImmediately(false, false)).toBe(true);
    expect(shouldRevealImmediately(false, true)).toBe(false);
    expect(shouldRevealImmediately(false, true, MOBILE_REVEAL_BREAKPOINT - 1)).toBe(true);
    expect(shouldRevealImmediately(false, true, MOBILE_REVEAL_BREAKPOINT)).toBe(false);
  });

  it("selects existing opt-in targets and each public page section", () => {
    expect(REVEAL_TARGET_SELECTOR).toContain("[data-reveal]");
    expect(REVEAL_TARGET_SELECTOR).toContain("main[data-reveal-page] > section");
  });
});
