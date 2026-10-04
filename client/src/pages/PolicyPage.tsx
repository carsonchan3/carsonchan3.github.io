import { useEffect, useState } from "react";
import { ChevronDown, FileText, Mail, Printer } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";
import { publicContactEmail, publicContactEmailHref } from "@/lib/contactDetails";
import { formatPolicyDate, policiesForPage, policyPagePaths, policySections, renderPolicy, type PolicyPageKey } from "@/lib/policyContent";
import { localizedPath } from "@/lib/seo";
import { staticSitePath } from "@/lib/staticPreview";

const pageCopy = {
  legal: {
    en: { eyebrow: "Legal", title: "Legal", intro: "How Velocity Lab Innovation handles personal data, the terms for using this website and requesting quotations, and the regulatory guidance for flying our drone equipment in Hong Kong." },
    "zh-Hant": { eyebrow: "法律", title: "法律條款", intro: "速研創新如何處理個人資料、使用本網站及索取報價的條款，以及在香港操作我們無人機器材時適用的規管指引。" },
  },
  sales: {
    en: { eyebrow: "Sales and Policy", title: "Sales and Policy", intro: "The terms behind every order, workshop and programme: returns, refunds, warranty and repairs, participant safety, and institutional referral credits." },
    "zh-Hant": { eyebrow: "銷售及政策", title: "銷售及政策", intro: "每張訂單、工作坊及計劃背後的條款：退貨、退款、保養及維修、參加者安全，以及機構轉介積分。" },
  },
} as const;

/** Prints one document: marks it as the print target, prints, then clears the mark (see .policy-doc print rules in index.css). */
function printDocument(id: string) {
  const article = document.getElementById(id);
  if (!article) return;
  const root = document.documentElement;
  const clear = () => {
    root.removeAttribute("data-printing-doc");
    article.removeAttribute("data-print-target");
    window.removeEventListener("afterprint", clear);
  };
  root.setAttribute("data-printing-doc", id);
  article.setAttribute("data-print-target", "");
  window.addEventListener("afterprint", clear);
  window.print();
}

export default function PolicyPage({ page }: { page: PolicyPageKey }) {
  const { language } = useWebsiteLanguage();
  const zh = language === "zh-Hant";
  const copy = pageCopy[page][language];
  const policies = policiesForPage(page);
  const otherPage: PolicyPageKey = page === "legal" ? "sales" : "legal";
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());
  const ui = zh
    ? { contents: "目錄", version: "版本", effective: "生效", print: "列印此文件", englishNote: "以下政策文件只提供英文版本，並以英文版本為準。", questions: "如有查詢，請電郵", see: "另見", open: "展開", close: "收起" }
    : { contents: "Contents", version: "Version", effective: "Effective", print: "Print this document", englishNote: "", questions: "Questions about these policies? Email", see: "See also", open: "Open", close: "Close" };

  // Open the document named in the URL (e.g. /legal#privacy-policy or a section anchor) and scroll to it.
  useEffect(() => {
    const openFromHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      const policy = policies.find((item) => hash === item.id || hash.startsWith(`${item.id}-`));
      if (!policy) return;
      setOpenIds((current) => new Set(current).add(policy.id));
      window.setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [page]);

  const toggle = (id: string) => setOpenIds((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <main className="pt-16">
        <section className="policy-hero border-b border-white/10 bg-[radial-gradient(circle_at_28%_20%,rgba(64,224,208,0.14),transparent_0_28%),linear-gradient(135deg,#1C1D20,#27282B_60%,#1C1D20)] py-10 md:py-14">
          <div className="container max-w-4xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent">{copy.eyebrow}</p>
            <h1 className="velocity-headline !text-4xl text-white md:!text-5xl">{copy.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/70 md:text-lg md:leading-8">{copy.intro}</p>
            {ui.englishNote ? <p className="mt-4 inline-block rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-white/80">{ui.englishNote}</p> : null}
          </div>
        </section>

        <div className="container max-w-4xl py-10 md:py-14">
          <div className="space-y-3">
            {policies.map((policy, index) => {
              const open = openIds.has(policy.id);
              const sections = policySections(policy);
              const panelId = `${policy.id}-panel`;
              return (
                <article key={policy.id} id={policy.id} data-policy-doc="" data-open={open} className="policy-doc scroll-mt-24 overflow-hidden rounded-xl border border-white/10 bg-[#111215] transition-colors data-[open=true]:border-accent/40">
                  <h2 className="m-0">
                    <button type="button" onClick={() => toggle(policy.id)} aria-expanded={open} aria-controls={panelId} className="group flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-white/[0.03] sm:p-6">
                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-accent/40 text-xs font-bold text-accent">{String(index + 1).padStart(2, "0")}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-lg font-semibold leading-snug text-white md:text-xl">{policy.title.en}</span>
                        {zh && policy.title["zh-Hant"] !== policy.title.en ? <span className="mt-0.5 block text-sm text-white/65">{policy.title["zh-Hant"]}</span> : null}
                        <span className="mt-1.5 block text-xs text-white/45">{ui.version} {policy.version} · {ui.effective} {formatPolicyDate(policy.effective, language)}</span>
                      </span>
                      <span className="sr-only">{open ? ui.close : ui.open}</span>
                      <ChevronDown size={20} aria-hidden="true" className={`mt-2 shrink-0 text-accent transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                    </button>
                  </h2>
                  <div id={panelId} aria-hidden={!open} inert={!open} className={`policy-panel grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <div className="border-t border-white/10">
                        <div className="policy-toolbar flex flex-wrap items-center gap-3 px-5 pt-5 sm:px-8">
                          {policy.subtitle ? <p className="mr-auto flex items-center gap-2 text-sm text-white/55"><FileText size={15} className="text-accent" aria-hidden="true" />{policy.subtitle}</p> : null}
                          <button type="button" onClick={() => printDocument(policy.id)} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-1.5 text-sm text-white/75 transition-colors hover:border-accent hover:text-accent"><Printer size={15} aria-hidden="true" />{ui.print}</button>
                        </div>
                        {sections.length > 2 ? (
                          <details className="policy-toolbar mx-5 mt-4 rounded-md border border-white/10 bg-black/20 px-4 py-3 sm:mx-8">
                            <summary className="cursor-pointer text-sm font-semibold text-white/80">{ui.contents} <span className="font-normal text-white/40">({sections.length})</span></summary>
                            <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                              {sections.map((section) => <li key={section.id}><a href={`#${section.id}`} className="text-white/65 hover:text-accent">{section.title}</a></li>)}
                            </ol>
                          </details>
                        ) : null}
                        <div lang="en" data-no-translate className="policy-prose blog-prose px-5 pb-8 pt-6 !text-[0.98rem] sm:px-8" dangerouslySetInnerHTML={{ __html: renderPolicy(policy, language) }} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="policy-toolbar mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex flex-wrap items-center gap-2"><Mail size={15} className="text-accent" aria-hidden="true" />{ui.questions} <a href={publicContactEmailHref} className="font-semibold text-accent hover:text-white">{publicContactEmail}</a></p>
            <a href={staticSitePath(localizedPath(policyPagePaths[otherPage], language))} className="font-semibold text-white/75 hover:text-accent">{ui.see}: {pageCopy[otherPage][language].title} →</a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
