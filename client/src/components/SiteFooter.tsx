import { publicContactEmail, publicContactEmailHref } from "@/lib/contactDetails";
import { staticSitePath } from "@/lib/staticPreview";
import { localizedPath } from "@/lib/seo";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";
import { Facebook, Instagram, Linkedin, Youtube, type LucideIcon } from "lucide-react";

export const footerSocialLinks: Array<{ label: "LinkedIn" | "Instagram" | "YouTube" | "Facebook"; href: string; icon: LucideIcon }> = [
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: Linkedin },
  { label: "Instagram", href: "https://www.instagram.com/", icon: Instagram },
  { label: "YouTube", href: "https://www.youtube.com/", icon: Youtube },
  { label: "Facebook", href: "https://www.facebook.com/", icon: Facebook },
];

export default function SiteFooter() {
  const { language } = useWebsiteLanguage();
  const footerCopy = language === "zh-Hant" ? { about: "關於速研創新", privacy: "私隱聲明" } : { about: "About VLI", privacy: "Privacy notice" };
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
              <li><a href={staticSitePath(localizedPath("/people", language))} className="transition-colors hover:text-accent">{footerCopy.about}</a></li>
              <li><a href={staticSitePath(localizedPath("/privacy", language))} className="transition-colors hover:text-accent">{footerCopy.privacy}</a></li>
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
            <div className="mt-7 border-t border-white/10 pt-5">
              <p className="vli-footer-label mb-3">Follow VLI</p>
              <div className="flex flex-wrap gap-2" aria-label="Social media placeholder links">
                {footerSocialLinks.map(({ label, href, icon: Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" data-social-placeholder="true" title={`${label} placeholder link — replace with the official VLI profile URL`} aria-label={`Open ${label} placeholder link`} className="inline-flex size-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-accent hover:bg-accent hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                    <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
                    <span className="sr-only">{label}</span>
                  </a>
                ))}
              </div>
            </div>
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
