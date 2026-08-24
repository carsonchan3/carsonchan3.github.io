import { publicContactEmail, publicContactEmailHref } from "@/lib/contactDetails";
import { staticSitePath } from "@/lib/staticPreview";
import { localizedPath } from "@/lib/seo";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";

export default function SiteFooter() {
  const { language } = useWebsiteLanguage();
  return (
    <footer className="vli-footer border-t py-14 text-white md:py-16">
      <div className="container">
        <div className="mb-12 grid gap-8 md:grid-cols-4">
          <div>
            <p className="vli-footer-label mb-4">Offerings</p>
            <ul className="space-y-2 text-white/70">
              <li><a href={staticSitePath(localizedPath("/dronesportsreferee", language))} className="transition-colors hover:text-accent">Smart Referee</a></li>
              <li><a href={staticSitePath(localizedPath("/product", language))} className="transition-colors hover:text-accent">Drone Equipment</a></li>
              <li><a href={staticSitePath(localizedPath("/services", language))} className="transition-colors hover:text-accent">Services</a></li>
            </ul>
          </div>
          <div>
            <p className="vli-footer-label mb-4">Explore</p>
            <ul className="space-y-2 text-white/70">
              <li><a href={staticSitePath(localizedPath("/dronesportsreferee#pricing", language))} className="transition-colors hover:text-accent">Pricing &amp; configuration</a></li>
              <li><a href={staticSitePath(localizedPath("/#partners", language))} className="transition-colors hover:text-accent">Partners</a></li>
            </ul>
          </div>
          <div>
            <p className="vli-footer-label mb-4">Contact</p>
            <ul className="space-y-2 text-white/70">
              <li><a href={publicContactEmailHref} className="transition-colors hover:text-accent">{publicContactEmail}</a></li>
              <li><a href="tel:+85266507520" className="transition-colors hover:text-accent">+852 66507520</a></li>
              <li><span>Hong Kong, China</span></li>
            </ul>
          </div>
          <div>
            <p className="vli-footer-label mb-4">Next step</p>
            <p className="mb-4 text-[var(--mist)]">Discuss the right setup for your competition, venue, or technical programme.</p>
            <a href={staticSitePath(localizedPath("/contact", language))} className="inline-flex bg-accent px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#7ff2e6]">Request a Demo</a>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t pt-6 text-xs uppercase tracking-[0.13em] text-[var(--steel)] md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 Velocity Lab Innovation. All rights reserved.</p>
          <p>Hong Kong · Drone sports systems</p>
        </div>
      </div>
    </footer>
  );
}
