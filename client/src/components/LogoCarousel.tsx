interface Logo {
  name: string;
  logo: string;
}

interface LogoCarouselProps {
  logos: Logo[];
  compact?: boolean;
}

function PartnerCard({ logo, compact = false }: { logo: Logo; compact?: boolean }) {
  return (
    <article className={`flex flex-col items-center justify-between rounded-lg border border-white/10 bg-white/5 text-center transition-colors hover:bg-white/10 ${compact ? "aspect-square w-36 gap-2 p-2.5 md:w-40" : "h-full gap-4 p-5"}`}>
      <div className={`flex items-center justify-center rounded-md bg-[#FFFFFF] ${compact ? "aspect-square w-28 p-2 md:w-32" : "h-32 w-full p-3"}`}>
        <img src={logo.logo} alt={`${logo.name} logo`} className="max-h-full w-full object-contain" loading="lazy" draggable={false} />
      </div>
      <p className={`${compact ? "text-xs" : "text-sm"} font-medium leading-snug text-white/80`}>{logo.name}</p>
    </article>
  );
}

export default function LogoCarousel({ logos, compact = false }: LogoCarouselProps) {
  return (
    <div aria-label="Trusted partner organizations">
      <div className={`${compact ? "hidden justify-center gap-5 md:flex" : "hidden grid-cols-3 gap-6 md:grid"}`}>
        {logos.slice(0, 3).map((logo) => (
          <PartnerCard key={logo.name} logo={logo} compact={compact} />
        ))}
      </div>

      <div
        className={`-mx-4 flex snap-x snap-proximity gap-4 overflow-x-scroll overscroll-x-contain px-4 touch-auto md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${compact ? "pb-0 pt-0" : "pb-4 pt-2"}`}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {logos.slice(0, 3).map((logo) => (
          <div key={logo.name} className={`${compact ? "w-36" : "w-56"} flex-none snap-center`}>
            <PartnerCard logo={logo} compact={compact} />
          </div>
        ))}
      </div>
    </div>
  );
}
