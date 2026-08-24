import { Menu, X } from "lucide-react";
import { useState } from "react";
import LanguageToggle from "@/components/LanguageToggle";
import { headerLogoSrc, mobileHeaderLogoScaleClass } from "@/lib/brandAssets";
import { siteNavigation, type PageKey } from "@/lib/siteNavigation";
import { staticSitePath } from "@/lib/staticPreview";

export default function SiteHeader({ active }: { active?: PageKey }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkClass = (key?: string) => "vli-nav-link font-medium transition-colors";

  return (
    <>
      <header className="vli-site-header fixed inset-x-0 top-0 z-50 border-b">
      <div className="container flex h-16 items-center justify-between">
        <a href={staticSitePath("/")} className="flex items-center transition-opacity hover:opacity-75" aria-label="Velocity Lab Innovation home">
          <img
            src={headerLogoSrc}
            alt="Velocity Lab Innovation"
            className={`vli-brand-logo ${mobileHeaderLogoScaleClass}`}
          />
        </a>

        <nav className="hidden items-center gap-5 xl:gap-6 lg:flex" aria-label="Primary navigation">
          {siteNavigation.map((item) => (
            <a key={item.label} href={staticSitePath(item.href)} className={linkClass(item.key)} data-active={active === item.key} aria-current={active === item.key ? "page" : undefined}>
              {item.label}
            </a>
          ))}
        </nav>

        <LanguageToggle placement="desktop" />

        <div className="flex items-center gap-3 lg:hidden">
          <LanguageToggle placement="mobile-toolbar" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="text-[var(--paper)]"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="vli-mobile-menu border-t lg:hidden">
          <nav className="container space-y-1 py-4" aria-label="Mobile navigation">
            {siteNavigation.map((item) => (
              <a
                key={item.label}
                href={staticSitePath(item.href)}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 ${linkClass(item.key)} ${active === item.key ? "bg-accent/10" : "hover:bg-white/5"}`}
                data-active={active === item.key}
                aria-current={active === item.key ? "page" : undefined}
              >
                {item.mobileLabel ?? item.label}
              </a>
            ))}
            <div className="mt-3 px-4"><LanguageToggle /></div>
          </nav>
        </div>
      )}
      </header>
    </>
  );
}
