import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { useRoute } from "wouter";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";
import NotFound from "@/pages/NotFound";
import { blogBody, blogCoverImage, blogDateLabel, blogPostUrl, getBlogPost } from "@/lib/blog";
import { staticSitePath } from "@/lib/staticPreview";
import { localizedPath } from "@/lib/seo";
import { renderBlogMarkdown } from "@/lib/blog";

export default function BlogPost() {
  const { language } = useWebsiteLanguage();
  const [, params] = useRoute("/blog/:slug");
  const post = getBlogPost(params?.slug ?? "");
  if (!post) return <NotFound />;
  const title = post.title[language];
  const bodyHtml = renderBlogMarkdown(blogBody(post, language));
  const copy = language === "zh-Hant" ? {
    back: "返回文章",
    journal: "VLI Journal",
    ctaTitle: "正在規劃下一場賽事？",
    ctaBody: "向我們提供您的場地、規則及時間表資料，一起定義實際可行的下一步。",
    cta: "聯絡團隊",
  } : {
    back: "Back to the journal",
    journal: "VLI Journal",
    ctaTitle: "Planning the next event?",
    ctaBody: "Share your venue, ruleset, and schedule with the team so we can define a practical next step.",
    cta: "Talk to the team",
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader active="blog" />
      <main className="pt-16">
        <article>
          <header className="velocity-section border-b border-white/10 bg-[var(--ink)]">
            <div className="container max-w-5xl">
              <a href={staticSitePath(localizedPath("/blog", language))} className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-white"><ArrowLeft size={16} />{copy.back}</a>
              <p className="vli-section-label mb-6">{copy.journal} / {post.category[language]}</p>
              <h1 className="velocity-headline max-w-4xl text-white">{title}</h1>
              <div className="mt-7 flex flex-wrap items-center gap-4 text-sm text-white/60">
                <span className="inline-flex items-center gap-2"><CalendarDays size={15} />{blogDateLabel(post.publishedAt, language)}</span>
                <span className="text-white/25">·</span>
                <span>{post.author}</span>
              </div>
            </div>
          </header>
          <div className="container max-w-5xl py-10 sm:py-16">
            <div className="mb-12 aspect-[16/7] overflow-hidden border border-white/10 bg-[#101921]">
              <img src={blogCoverImage(post)} alt="" className="h-full w-full object-cover" fetchPriority="high" />
            </div>
            <div className="blog-prose max-w-3xl" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          </div>
        </article>
        <section className="velocity-section border-y border-white/10 bg-[var(--ink)]">
          <div className="container grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div><h2 className="velocity-headline mb-4 text-white">{copy.ctaTitle}</h2><p className="velocity-body max-w-2xl">{copy.ctaBody}</p></div>
            <a href={staticSitePath(localizedPath("/contact", language))} className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-black transition-colors hover:bg-[#7ff2e6]">{copy.cta}<ArrowRight size={17} /></a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
