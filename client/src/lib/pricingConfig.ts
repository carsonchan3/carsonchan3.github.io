export type PricingTierId = "assist" | "managed" | "evidence-pro";

export const pricingTiers = [
  {
    id: "assist" as const,
    name: "Assist",
    eyebrow: "Software + configuration",
    price: "From HK$6,800",
    priceUnit: "package dependent",
    description: "A low-friction entry package for organisers who supply the core event infrastructure and want to experience the Smart Referee workflow.",
    features: ["Rule configuration and event workflow", "Scoring and review software", "Four hours of technical support"],
    details: [
      { included: true, title: "Core match workflow", text: "Rule configuration with scoring and review software." },
      { included: true, title: "Technical support", text: "Four hours of on-site technical support." },
      { included: false, title: "Class 20 cage", text: "Quoted separately for your venue." },
      { included: false, title: "Jury and referee", text: "Supplied by the organiser." },
    ],
  },
  {
    id: "managed" as const,
    name: "Managed",
    eyebrow: "Full Class 20 service",
    price: "From HK$11,800",
    priceUnit: "package dependent",
    recommended: true,
    description: "The recommended event-day package for organisers who need a calibrated system, an included jury and referee, and live decision support.",
    features: ["Jury and referee included", "Class 20 cage included", "Six hours of technical support", "Live decision support and basic replay handover"],
    details: [
      { included: true, title: "Class 20 event setup", text: "Cage, on-site calibration, jury and referee included." },
      { included: true, title: "Decision support", text: "Six hours of support with a basic replay handover." },
      { included: true, title: "Core match workflow", text: "Configured scoring and review for your event." },
      { included: false, title: "Expanded evidence workflow", text: "Available with Evidence Pro." },
    ],
  },
  {
    id: "evidence-pro" as const,
    name: "Evidence Pro",
    eyebrow: "Premium event package",
    price: "From HK$16,800",
    priceUnit: "package dependent",
    description: "An all-inclusive event package for important competitions and sponsor-ready experiences, with priority decision support and expanded review.",
    features: ["All-inclusive service", "Class 20 cage included", "Expanded review workflow and priority replay evidence", "Eight hours of technical support"],
    details: [
      { included: true, title: "All-inclusive event setup", text: "Class 20 cage, calibration, jury and referee included." },
      { included: true, title: "Evidence-led review", text: "Expanded review workflow with priority replay evidence." },
      { included: true, title: "Extended technical support", text: "Eight hours of support for the event programme." },
      { included: false, title: "Custom venue infrastructure", text: "Quoted separately when required." },
    ],
  },
];

export const getPricingSelectionLabel = (tierId: PricingTierId) => {
  const tier = pricingTiers.find((item) => item.id === tierId);
  return tier?.name ?? "Managed";
};

export const buildPricingRequestMessage = (
  tierId: PricingTierId,
  message: string,
) => `[Pricing request — ${getPricingSelectionLabel(tierId)}]\n\n${message}`;
