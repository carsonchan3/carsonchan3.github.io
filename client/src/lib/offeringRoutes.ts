export const offeringCards = [
  {
    eyebrow: "01 · Competition intelligence",
    title: "Smart Referee",
    description: "Bring calibrated motion capture, configurable rules, and review-ready evidence to every match-day decision.",
    cta: "Explore the referee system",
    href: "/dronesportsreferee",
    image: "/manus-storage/drone_referee_action_ff9fa49b.png",
  },
  {
    eyebrow: "02 · Ready-to-deploy hardware",
    title: "Drone Equipment",
    description: "Source the drones, tracking-ready components, and field hardware needed for a dependable setup.",
    cta: "View equipment",
    href: "/product",
    image: "/manus-storage/vli-equipment-offering_bb273cf2.png",
  },
  {
    eyebrow: "03 · From pilot to event day",
    title: "Services",
    description: "Plan, deploy, and improve drone-sports programmes with practical technical and event support.",
    cta: "Explore services",
    href: "/services",
    image: "/manus-storage/vli-services-offering_b4c06bb0.png",
  },
] as const;

export const offeringPaths = offeringCards.map(({ title, href }) => ({ title, href }));
