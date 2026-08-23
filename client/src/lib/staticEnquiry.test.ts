import { describe, expect, it } from "vitest";
import { isStaticEnquiryHost, staticEnquiryEndpoint, turnstileSiteKey } from "./staticEnquiry";

describe("static enquiry configuration", () => {
  it("recognises only the verified production hostname", () => {
    expect(isStaticEnquiryHost("velocity-lab.com")).toBe(true);
    expect(isStaticEnquiryHost("www.velocity-lab.com")).toBe(false);
    expect(isStaticEnquiryHost("carsonchan3.github.io")).toBe(false);
    expect(isStaticEnquiryHost("velolab-gkpolzge.manus.space")).toBe(false);
  });

  it("uses the dedicated Worker endpoint and a public Turnstile site key", () => {
    expect(staticEnquiryEndpoint).toBe("https://vli-enquiry-api.carsonchan3.workers.dev/enquiries");
    expect(turnstileSiteKey).toMatch(/^0x4AAAAA/);
  });
});
