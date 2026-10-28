export const offeringCards = [
  {
    eyebrow: "01 · Competition intelligence",
    title: "Smart Referee",
    description: "Bring calibrated motion capture, configurable rules, and review-ready evidence to every match-day decision.",
    cta: "Explore the referee system",
    href: "/dronesportsreferee",
    image: "/media/flex13camerasys-card_15bc69dd.jpg",
  },
  {
    eyebrow: "02 · Ready-to-deploy hardware",
    title: "Drone Equipment",
    description: "Source the drones, tracking-ready components, and field hardware needed for a dependable setup.",
    cta: "View equipment",
    href: "/product",
    image: "/media/Droneequipment-card_e0a531df.jpg",
  },
  {
    eyebrow: "03 · From pilot to event day",
    title: "Services",
    description: "Plan, deploy, and improve drone-sports programmes with practical technical and event support.",
    cta: "Explore services",
    href: "/services",
    image: "/media/service-card_c463c693.jpg",
  },
] as const;

export const offeringPaths = offeringCards.map(({ title, href }) => ({ title, href }));
