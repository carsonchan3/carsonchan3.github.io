export type StaticEnquiryKind = "general" | "service" | "repair" | "product-pricing" | "smart-referee-pricing";

export type StaticEnquiryInput = {
  kind: StaticEnquiryKind;
  name: string;
  email: string;
  phone?: string;
  organisation?: string;
  organisationType?: string;
  selectedService?: string;
  selectedPackage?: string;
  message: string;
  website?: string;
  payload?: Record<string, unknown>;
  turnstileToken: string;
};

export type StaticEnquiryResult = {
  ok: boolean;
  notificationSent: boolean;
};

export const turnstileSiteKey = "0x4AAAAAAEZPTyRZAGm4Dwz3";

export const isStaticEnquiryHost = (hostname = typeof window === "undefined" ? "" : window.location.hostname) =>
  hostname === "velocity-lab.com";

export const staticEnquiryEndpoint = "https://vli-enquiry-api.carsonchan3.workers.dev/enquiries";

export async function submitStaticEnquiry(input: StaticEnquiryInput): Promise<StaticEnquiryResult> {
  const response = await fetch(staticEnquiryEndpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = (await response.json().catch(() => ({}))) as Partial<StaticEnquiryResult> & { error?: string };
  if (!response.ok || body.ok !== true) {
    throw new Error(body.error || "Unable to submit your enquiry right now.");
  }
  return { ok: true, notificationSent: body.notificationSent === true };
}
