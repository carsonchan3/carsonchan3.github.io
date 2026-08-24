export type PageKey = "referee" | "product" | "services" | "useCases" | "people" | "contact";

export type NavigationItem = {
  label: string;
  href: string;
  key?: PageKey;
};

export const siteNavigation: NavigationItem[] = [
  { label: "Smart Referee", href: "/dronesportsreferee", key: "referee" },
  { label: "Products", href: "/product", key: "product" },
  { label: "Services", href: "/services", key: "services" },
  { label: "Contact", href: "/contact", key: "contact" },
];
