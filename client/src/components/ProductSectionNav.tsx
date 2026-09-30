import { Boxes, Package } from "lucide-react";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";
import { visibleBundles } from "@/lib/bundleContent";
import { hiddenProductFamilyIds } from "@/lib/productContent";
import { productContent } from "@/lib/productContent.generated";
import { localizedPath } from "@/lib/seo";
import { staticSitePath } from "@/lib/staticPreview";

export type ProductSection = "products" | "bundles";

const productCount = productContent.filter((record) => !hiddenProductFamilyIds.has(record.familyId)).length;

/** Products / Bundles switcher shared by /product and /product/bundles. */
export default function ProductSectionNav({ active }: { active: ProductSection }) {
  const { language } = useWebsiteLanguage();
  const sections = [
    { key: "products" as const, href: "/product", icon: Package, label: language === "zh-Hant" ? "產品" : "Products", count: productCount },
    { key: "bundles" as const, href: "/product/bundles", icon: Boxes, label: language === "zh-Hant" ? "套裝" : "Bundles", count: visibleBundles.length },
  ];

  return (
    <nav data-testid="product-section-nav" aria-label={language === "zh-Hant" ? "產品分類" : "Product sections"} className="mb-8 inline-flex w-full rounded-full border border-white/10 bg-[#161719] p-1 sm:mb-10 sm:w-auto">
      {sections.map(({ key, href, icon: Icon, label, count }) => {
        const isActive = key === active;
        return (
          <a
            key={key}
            href={staticSitePath(localizedPath(href, language))}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors sm:flex-none sm:px-6 ${isActive ? "bg-accent text-black" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${isActive ? "bg-black/15 text-black" : "bg-white/10 text-white/60"}`}>{count}</span>
          </a>
        );
      })}
    </nav>
  );
}
