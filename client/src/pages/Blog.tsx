import { ArrowRight, CalendarDays } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";
import { blogCoverImage, blogDateLabel, blogPosts, localizedBlogPath } from "@/lib/blog";
import { staticSitePath } from "@/lib/staticPreview";

export default function Blog() {
  const { language } = useWebsiteLanguage();
  const editorialUrl = "https://github.com/carsonchan3/carsonchan3.github.io/new/main/content/blog";
  const copy = language === "zh-Hant" ? {
    eyebrow: "VLI Journal",
    title: "洞察與實務指南",
    description: "分享無人機運動裁判、賽事營運、設備配置及技術驗證的實用內容。",
    read: "閱讀文章",
    publish: "在 GitHub 發布文章",
    empty: "文章即將發布。",
  } : {
    eyebrow: "VLI Journal",
    title: "Insights for better-run drone sports",
    description: "Practical guidance on drone-sports officiating, event operations, equipment configuration, and technical proof.",
    read: "Read article",
    publish: "Publish via GitHub",
    empty: "New articles are coming soon.",
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader active="blog" />
      <main className="pt-16">
        <section className="velocity-section border-b border-white/10 bg-[var(--ink)]">
          <div className="container grid gap-8 lg:grid-cols-[0.28fr_1fr] lg:items-end">
            <p className="vli-section-label">{copy.eyebrow}</p>
            <div className="max-w-3xl">
              <h1 className="velocity-headline mb-5 text-white">{copy.title}</h1>
              <p className="velocity-body max-w-2xl">{copy.description}</p>
              <a href={editorialUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent underline decoration-accent/50 underline-offset-4 transition-colors hover:text-white">{copy.publish}<ArrowRight size={15} /></a>
            </div>
          </div>
        </section>
        <section className="velocity-section bg-black">
          <div className="container">
            {blogPosts.length ? (
              <div className="grid gap-6 md:grid-cols-2">
                {blogPosts.map((post) => (
                  <article key={post.slug} className="group overflow-hidden border border-white/12 bg-white/[0.03] transition-colors hover:border-accent/70">
                    <a href={staticSitePath(localizedBlogPath(post.slug, language))} className="block">
                      <div className="aspect-[16/9] overflow-hidden bg-[#101921]">
                        <img src={blogCoverImage(post)} alt="" className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-95" loading="lazy" />
                      </div>
                      <div className="p-6 sm:p-8">
                        <div className="mb-5 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-accent">
                          <span>{post.category[language]}</span>
                          <span className="text-white/30">/</span>
                          <span className="inline-flex items-center gap-1.5 text-white/55 normal-case tracking-normal"><CalendarDays size={13} />{blogDateLabel(post.publishedAt, language)}</span>
                        </div>
                        <h2 className="mb-4 text-2xl font-semibold leading-tight text-white sm:text-3xl">{post.title[language]}</h2>
                        <p className="mb-7 max-w-2xl leading-7 text-white/65">{post.description[language]}</p>
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">{copy.read}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></span>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            ) : <p className="text-white/65">{copy.empty}</p>}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
