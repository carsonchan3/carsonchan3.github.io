export const offeringCards = [
  {
    eyebrow: "01 · Competition intelligence",
    title: "Smart Referee",
    description: "Bring calibrated motion capture, configurable rules, and review-ready evidence to every match-day decision.",
    cta: "Explore the referee system",
    href: "/dronesportsreferee",
    image: "/manus-storage/flex13camerasys_aa73a4e5.jpg",
  },
  {
    eyebrow: "02 · Ready-to-deploy hardware",
    title: "Drone Equipment",
    description: "Source the drones, tracking-ready components, and field hardware needed for a dependable setup.",
    cta: "View equipment",
    href: "/product",
    image: "/manus-storage/Droneequipment_2ab6c2b7.jpg",
  },
  {
    eyebrow: "03 · From pilot to event day",
    title: "Services",
    description: "Plan, deploy, and improve drone-sports programmes with practical technical and event support.",
    cta: "Explore services",
    href: "/services",
    image: "/manus-storage/service_214ca02f.jpeg",
  },
] as const;

export const offeringPaths = offeringCards.map(({ title, href }) => ({ title, href }));
