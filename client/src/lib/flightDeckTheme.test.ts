import { describe, expect, it } from "vitest";
import { flightDeckTheme } from "./flightDeckTheme";

describe("VLI flight-deck visual system", () => {
  it("uses the reference editorial palette while preserving VLI signal turquoise", () => {
    expect(flightDeckTheme.rootClass).toBe("vli-flight-deck");
    expect(flightDeckTheme.palette.ink).toBe("#08131C");
    expect(flightDeckTheme.palette.signal).toBe("#40E0D0");
  });
});
