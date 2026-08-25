import { describe, expect, it } from "vitest";
import { startupConversionEvents, trackConversion } from "./conversionTracking";

describe("startup conversion tracking", () => {
  it("defines the approved commercial intent events", () => {
    expect(startupConversionEvents).toEqual(["plan_event_click", "smart_referee_cta", "quote_request_start", "contact_submit", "direct_contact_click"]);
  });

  it("safely does nothing when a compatible analytics client is unavailable", () => {
    expect(trackConversion("plan_event_click", { route: "home" })).toBe(false);
  });
});
