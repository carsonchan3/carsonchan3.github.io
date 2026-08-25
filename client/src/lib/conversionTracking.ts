export const startupConversionEvents = [
  "plan_event_click",
  "smart_referee_cta",
  "quote_request_start",
  "contact_submit",
  "direct_contact_click",
] as const;

export type StartupConversionEvent = (typeof startupConversionEvents)[number];
export type ConversionProperties = Record<string, string | number | boolean | undefined>;

type UmamiTracker = { track?: (eventName: string, properties?: ConversionProperties) => void };

export function trackConversion(eventName: StartupConversionEvent, properties?: ConversionProperties) {
  if (typeof window === "undefined") return false;
  const tracker = (window as Window & { umami?: UmamiTracker }).umami;
  if (typeof tracker?.track !== "function") return false;
  tracker.track(eventName, properties);
  return true;
}
