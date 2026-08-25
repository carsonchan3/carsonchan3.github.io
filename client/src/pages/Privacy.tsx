import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { publicContactEmail, publicContactEmailHref } from "@/lib/contactDetails";
import { useWebsiteLanguage, type WebsiteLanguage } from "@/contexts/LanguageContext";

type PrivacySection = { title: string; body: string };
type PrivacyPageContent = { eyebrow: string; title: string; introduction: string; updated: string; sections: PrivacySection[] };

export const privacyContent: Record<WebsiteLanguage, PrivacyPageContent> = {
  en: {
    eyebrow: "Privacy overview",
    title: "Clear context for your enquiry.",
    introduction: "This notice explains, in plain language, how Velocity Lab Innovation handles information shared through this website. It should be reviewed against the organisation’s actual operating practices and applicable legal requirements before being relied on as a formal privacy policy.",
    updated: "Last updated: 25 August 2026",
    sections: [
      { title: "Information you share", body: "When you send an enquiry, you may provide your name, email address, organisation, area of interest, and project details. The website may also process limited technical information needed to operate forms, protect them from abuse, and understand website use." },
      { title: "Why it is used", body: "Enquiry details are used to review your request, respond to you, discuss an appropriate next step, and maintain the operational context for that conversation." },
      { title: "Website services", body: "The website uses technical services to host public pages, support spam protection, deliver enquiries, and measure website activity where configured. Those services may process information needed to provide their function." },
      { title: "Your questions", body: "If you want to ask about information connected with an enquiry, contact Velocity Lab Innovation using the email address below. Please do not include sensitive information unless it is necessary for the request you are making." },
    ],
  },
  "zh-Hant": {
    eyebrow: "私隱概覽",
    title: "清晰了解您的查詢資料。",
    introduction: "本聲明以簡明方式說明速研創新如何處理您透過本網站提供的資料。在作為正式私隱政策依據前，應按機構的實際營運方式及適用法律要求進行檢視。",
    updated: "最後更新：2026 年 8 月 25 日",
    sections: [
      { title: "您提供的資料", body: "當您提交查詢時，您可能會提供姓名、電郵地址、機構、關注範疇及項目詳情。本網站亦可能處理營運表單、防止濫用及了解網站使用情況所需的有限技術資料。" },
      { title: "使用目的", body: "查詢資料用於檢視您的要求、回覆您、討論合適的下一步，以及保存該次溝通所需的營運背景。" },
      { title: "網站服務", body: "本網站使用技術服務以託管公開頁面、支援防止濫用、傳遞查詢，以及在已設定的情況下量度網站活動。該等服務可能處理其運作所需的資料。" },
      { title: "您的查詢", body: "如您想查詢與某次查詢相關的資料，請使用以下電郵地址聯絡速研創新。除非您的要求確有需要，否則請勿提供敏感資料。" },
    ],
  },
};

export default function Privacy() {
  const { language } = useWebsiteLanguage();
  const copy = privacyContent[language];

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <main data-reveal-page className="pt-16">
        <section className="border-b border-white/10 bg-[radial-gradient(circle_at_18%_10%,rgba(64,224,208,0.16),transparent_28%),linear-gradient(135deg,#191A1C,#2A2C30_58%,#191A1C)] py-20 md:py-28">
          <div className="container">
            <div data-reveal className="reveal-up max-w-3xl">
              <div className="mb-5 h-1 w-12 bg-accent" />
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">{copy.eyebrow}</p>
              <h1 className="velocity-headline mb-6 text-white">{copy.title}</h1>
              <p className="max-w-2xl text-lg leading-8 text-white/70">{copy.introduction}</p>
            </div>
          </div>
        </section>

        <section className="velocity-section bg-black">
          <div className="container max-w-4xl">
            <p className="mb-10 text-sm text-white/50">{copy.updated}</p>
            <div className="space-y-5">
              {copy.sections.map((section, index) => (
                <article key={section.title} data-reveal className="reveal-up border border-white/10 bg-white/[0.03] p-6 sm:p-8" style={{ transitionDelay: `${index * 70}ms` }}>
                  <h2 className="velocity-subheading mb-3 text-white">{section.title}</h2>
                  <p className="leading-7 text-white/70">{section.body}</p>
                </article>
              ))}
            </div>
            <div data-reveal className="reveal-up mt-10 border-l-2 border-accent bg-accent/10 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">{language === "zh-Hant" ? "聯絡方式" : "Contact"}</p>
              <a href={publicContactEmailHref} className="mt-2 inline-block text-lg font-semibold text-white transition-colors hover:text-accent">{publicContactEmail}</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
