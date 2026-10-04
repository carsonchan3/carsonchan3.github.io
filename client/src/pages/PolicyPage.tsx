import { FileText, Mail, Printer } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";
import { publicContactEmail, publicContactEmailHref } from "@/lib/contactDetails";
import { formatPolicyDate, policiesForPage, policyPagePaths, policySections, renderPolicy, type PolicyPageKey } from "@/lib/policyContent";
import { localizedPath } from "@/lib/seo";
import { staticSitePath } from "@/lib/staticPreview";

const pageCopy = {
  legal: {
    en: { eyebrow: "Legal", title: "Legal", intro: "How Velocity Lab Innovation handles personal data, the terms for using this website and requesting quotations, and the regulatory guidance that applies to flying our drone equipment in Hong Kong." },
    "zh-Hant": { eyebrow: "法律", title: "法律條款", intro: "速研創新如何處理個人資料、使用本網站及索取報價的條款，以及在香港操作我們無人機器材時適用的規管指引。" },
  },
  sales: {
    en: { eyebrow: "Sales and Policy", title: "Sales and Policy", intro: "The terms behind every order, workshop and programme: returns, refunds, warranty and repairs, participant safety, and our institutional referral credits." },
    "zh-Hant": { eyebrow: "銷售及政策", title: "銷售及政策", intro: "每張訂單、工作坊及計劃背後的條款：退貨、退款、保養及維修、參加者安全，以及機構轉介積分。" },
  },
} as const;

export default function PolicyPage({ page }: { page: PolicyPageKey }) {
  const { language } = useWebsiteLanguage();
  const zh = language === "zh-Hant";
  const copy = pageCopy[page][language];
  const policies = policiesForPage(page);
  const otherPage: PolicyPageKey = page === "legal" ? "sales" : "legal";
  const latest = policies.map((policy) => policy.effective).sort().at(-1) ?? "";
  const ui = zh
    ? { documents: "本頁文件", contents: "目錄", version: "版本", effective: "生效日期", issuedBy: "發出機構", jurisdiction: "司法管轄區", hk: "香港特別行政區", updated: "最後更新", questions: "有疑問？", questionsBody: "如對以下政策有任何查詢，請電郵聯絡我們。", print: "列印此頁", englishNote: "以下政策文件只提供英文版本，並以英文版本為準。", see: "另見", back: "返回頂部" }
    : { documents: "Documents on this page", contents: "Contents", version: "Version", effective: "Effective", issuedBy: "Issued by", jurisdiction: "Jurisdiction", hk: "Hong Kong SAR", updated: "Last updated", questions: "Questions?", questionsBody: "Contact us about any of the policies on this page.", print: "Print this page", englishNote: "", see: "See also", back: "Back to top" };

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <main className="pt-16">
        <section className="border-b border-white/10 bg-[radial-gradient(circle_at_28%_20%,rgba(64,224,208,0.14),transparent_0_28%),linear-gradient(135deg,#1C1D20,#27282B_60%,#1C1D20)] py-10 md:py-14 print:bg-none print:py-4">
          <div className="container max-w-5xl">
            <div className="mb-3 h-1 w-12 bg-accent print:hidden" />
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent">{copy.eyebrow}</p>
            <h1 className="velocity-headline !text-4xl text-white md:!text-5xl">{copy.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/70 md:text-lg md:leading-8">{copy.intro}</p>
            {latest ? <p className="mt-4 text-sm text-white/50">{ui.updated}: {formatPolicyDate(latest, language)}</p> : null}
            {ui.englishNote ? <p className="mt-4 inline-block rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-white/80">{ui.englishNote}</p> : null}
          </div>
        </section>

        <div className="container max-w-6xl py-10 md:py-14 lg:grid lg:grid-cols-[17rem_1fr] lg:gap-10">
          <aside className="mb-10 lg:mb-0 print:hidden">
            <div className="space-y-5 lg:sticky lg:top-24">
              <nav aria-label={ui.documents} className="rounded-lg border border-white/10 bg-[#111215] p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent">{ui.documents}</p>
                <ol className="space-y-3">
                  {policies.map((policy, index) => (
                    <li key={policy.id}><a href={`#${policy.id}`} className="flex gap-3 text-sm leading-5 text-white/75 transition-colors hover:text-accent"><span className="font-bold text-accent">{String(index + 1).padStart(2, "0")}</span><span>{policy.title[language]}</span></a></li>
                  ))}
                </ol>
              </nav>
              <div className="rounded-lg border border-white/10 bg-[#111215] p-5 text-sm">
                <p className="mb-1 font-semibold text-white">{ui.questions}</p>
                <p className="mb-3 leading-6 text-white/60">{ui.questionsBody}</p>
                <a href={publicContactEmailHref} className="inline-flex items-center gap-2 font-semibold text-accent hover:text-white"><Mail size={15} aria-hidden="true" />{publicContactEmail}</a>
                <button type="button" onClick={() => window.print()} className="mt-4 flex items-center gap-2 text-white/60 transition-colors hover:text-white"><Printer size={15} aria-hidden="true" />{ui.print}</button>
              </div>
              <a href={staticSitePath(localizedPath(policyPagePaths[otherPage], language))} className="block rounded-lg border border-accent/30 bg-accent/10 p-5 text-sm transition-colors hover:border-accent">
                <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-accent">{ui.see}</span>
                <span className="mt-1 block font-semibold text-white">{pageCopy[otherPage][language].title}</span>
              </a>
            </div>
          </aside>

          <div className="min-w-0 space-y-10">
            {policies.map((policy, index) => {
              const sections = policySections(policy);
              return (
                <article key={policy.id} id={policy.id} className="scroll-mt-24 rounded-xl border border-white/10 bg-[#111215] print:break-before-page print:border-0 print:bg-transparent">
                  <header className="border-b border-white/10 p-6 sm:p-8">
                    <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent"><FileText size={15} aria-hidden="true" />{String(index + 1).padStart(2, "0")}</p>
                    <h2 className="text-2xl font-bold leading-tight tracking-[-0.02em] text-white md:text-3xl">{policy.title.en}</h2>
                    {zh && policy.title["zh-Hant"] !== policy.title.en ? <p className="mt-1 text-lg text-white/70">{policy.title["zh-Hant"]}</p> : null}
                    {policy.subtitle ? <p className="mt-2 text-white/60">{policy.subtitle}</p> : null}
                    <dl className="mt-5 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      <div><dt className="text-xs uppercase tracking-[0.12em] text-white/45">{ui.version}</dt><dd className="text-white/85">{policy.version}</dd></div>
                      <div><dt className="text-xs uppercase tracking-[0.12em] text-white/45">{ui.effective}</dt><dd className="text-white/85">{formatPolicyDate(policy.effective, language)}</dd></div>
                      <div><dt className="text-xs uppercase tracking-[0.12em] text-white/45">{ui.issuedBy}</dt><dd className="text-white/85">Velocity Lab Innovation</dd></div>
                      <div><dt className="text-xs uppercase tracking-[0.12em] text-white/45">{ui.jurisdiction}</dt><dd className="text-white/85">{ui.hk}</dd></div>
                    </dl>
                    {sections.length > 2 ? (
                      <details className="group mt-5 rounded-md border border-white/10 bg-black/20 px-4 py-3 print:hidden">
                        <summary className="cursor-pointer list-none text-sm font-semibold text-white/80 [&::-webkit-details-marker]:hidden">{ui.contents} <span className="text-white/40">({sections.length})</span></summary>
                        <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                          {sections.map((section) => <li key={section.id}><a href={`#${section.id}`} className="text-white/65 hover:text-accent">{section.title}</a></li>)}
                        </ol>
                      </details>
                    ) : null}
                  </header>
                  <div lang="en" data-no-translate className="policy-prose blog-prose p-6 !text-[0.98rem] sm:p-8" dangerouslySetInnerHTML={{ __html: renderPolicy(policy, language) }} />
                  <div className="border-t border-white/10 px-6 py-4 text-right text-sm sm:px-8 print:hidden"><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-white/50 hover:text-accent">{ui.back} ↑</a></div>
                </article>
              );
            })}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
