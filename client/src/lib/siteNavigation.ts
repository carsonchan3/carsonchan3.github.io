export type PageKey = "referee" | "product" | "services" | "blog" | "useCases" | "people" | "contact";

export type NavigationItem = {
  label: string;
  mobileLabel?: string;
  href: string;
  key?: PageKey;
};

export const siteNavigation: NavigationItem[] = [
  { label: "Smart Referee", href: "/dronesportsreferee", key: "referee" },
  { label: "Products", mobileLabel: "Drone Equipment", href: "/product", key: "product" },
  { label: "Services", href: "/services", key: "services" },
  { label: "Blog", href: "/blog", key: "blog" },
  { label: "Contact", href: "/contact", key: "contact" },
];
