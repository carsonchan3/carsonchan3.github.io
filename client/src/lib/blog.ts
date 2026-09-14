import { marked } from "marked";
import type { WebsiteLanguage } from "@/contexts/LanguageContext";
import { absoluteUrl, managedMediaUrl } from "@/lib/seo";
import { blogPosts } from "./blog.generated";

export { blogPosts };

export type BlogLanguageText = { en: string; "zh-Hant": string };
export type BlogPost = {
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  coverImage: string;
  title: BlogLanguageText;
  description: BlogLanguageText;
  category: BlogLanguageText;
  body: BlogLanguageText;
};

export const blogIndexPath = "/blog" as const;
export const blogPath = (slug: string) => `/blog/${slug}`;
export const localizedBlogPath = (slug: string, language: WebsiteLanguage) => language === "zh-Hant" ? `/zh-hant/blog/${slug}` : blogPath(slug);
export const getBlogPost = (slug: string) => blogPosts.find((post) => post.slug === slug) ?? null;
export const blogPostUrl = (post: BlogPost, language: WebsiteLanguage) => absoluteUrl(blogPath(post.slug), language);
export const renderBlogMarkdown = (markdown: string) => marked.parse(markdown.replace(/^# .+\n+/, ""), { gfm: true, breaks: false }) as string;
export const blogDateLabel = (date: string, language: WebsiteLanguage) => new Intl.DateTimeFormat(language === "zh-Hant" ? "zh-Hant-HK" : "en-GB", { year: "numeric", month: "long", day: "numeric" }).format(new Date(`${date}T00:00:00Z`));
export const blogBody = (post: BlogPost, language: WebsiteLanguage) => post.body[language];
export const blogCoverImage = (post: BlogPost) => post.coverImage.startsWith("http") ? post.coverImage : managedMediaUrl(post.coverImage);

export function blogArticleStructuredData(post: BlogPost, language: WebsiteLanguage) {
  const title = post.title[language];
  const description = post.description[language];
  const url = blogPostUrl(post, language);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: title,
      description,
      datePublished: post.publishedAt,
      ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
      author: { "@type": "Organization", name: post.author, url: "https://velocity-lab.com/" },
      publisher: { "@type": "Organization", name: "Velocity Lab Innovation", url: "https://velocity-lab.com/" },
      image: blogCoverImage(post),
      mainEntityOfPage: url,
      inLanguage: language,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: language === "zh-Hant" ? "主頁" : "Home", item: absoluteUrl("/", language) },
        { "@type": "ListItem", position: 2, name: language === "zh-Hant" ? "文章" : "Blog", item: absoluteUrl(blogIndexPath, language) },
        { "@type": "ListItem", position: 3, name: title, item: url },
      ],
    },
  ];
}
