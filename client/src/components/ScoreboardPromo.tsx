import { ArrowRight, Timer } from "lucide-react";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";
import { localizedPath } from "@/lib/seo";
import { staticSitePath } from "@/lib/staticPreview";

/** Internal link to the free Score Board, used on the home and Smart Referee pages. */
export default function ScoreboardPromo({ className = "" }: { className?: string }) {
  const { language } = useWebsiteLanguage();
  const copy = language === "zh-Hant"
    ? { label: "免費工具", text: "免費網上無人機足球記分板：FAI F9A 比賽計時、比分、黃牌及罰球計時，毋須註冊。", cta: "開啟記分板" }
    : { label: "Free tool", text: "Free online drone soccer scoreboard: FAI F9A match timer, scores, yellow cards and penalty shot clock. No sign-up.", cta: "Open the scoreboard" };
  return (
    <a href={staticSitePath(localizedPath("/scoreboard", language))} className={`group flex flex-col gap-3 rounded-lg border border-accent/35 bg-accent/10 px-5 py-4 transition-colors hover:border-accent sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <span className="flex items-start gap-3 text-sm leading-6 text-white/80 sm:items-center"><Timer size={20} className="mt-0.5 shrink-0 text-accent sm:mt-0" aria-hidden="true" /><span><b className="mr-2 font-semibold uppercase tracking-[0.14em] text-accent">{copy.label}</b>{copy.text}</span></span>
      <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-accent">{copy.cta}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></span>
    </a>
  );
}
