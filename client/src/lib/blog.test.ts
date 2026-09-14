import { describe, expect, it } from "vitest";
import { blogBody, blogPath, blogPostUrl, blogPosts, getBlogPost, localizedBlogPath, renderBlogMarkdown } from "./blog";

describe("Markdown blog publishing model", () => {
  it("contains bilingual metadata and bodies for every article", () => {
    expect(blogPosts.length).toBeGreaterThan(0);
    for (const post of blogPosts) {
      expect(post.slug).toMatch(/^[a-z0-9-]+$/);
      expect(post.title.en.length).toBeGreaterThan(20);
      expect(post.title["zh-Hant"]).toMatch(/[\u3400-\u9fff]/);
      expect(blogBody(post, "en").length).toBeGreaterThan(120);
      expect(blogBody(post, "zh-Hant")).toMatch(/[\u3400-\u9fff]/);
    }
  });

  it("generates stable localized paths and canonical URLs", () => {
    const post = getBlogPost("reviewable-drone-sports-decisions");
    expect(post).not.toBeNull();
    expect(blogPath(post!.slug)).toBe("/blog/reviewable-drone-sports-decisions");
    expect(localizedBlogPath(post!.slug, "en")).toBe("/blog/reviewable-drone-sports-decisions");
    expect(localizedBlogPath(post!.slug, "zh-Hant")).toBe("/zh-hant/blog/reviewable-drone-sports-decisions");
    expect(blogPostUrl(post!, "en")).toBe("https://velocity-lab.com/blog/reviewable-drone-sports-decisions/");
  });

  it("renders headings and emphasis from Markdown for crawlable article HTML", () => {
    const html = renderBlogMarkdown("## Heading\n\nA **reviewable** decision.");
    expect(html).toContain("<h2>Heading</h2>");
    expect(html).toContain("<strong>reviewable</strong>");
  });
});
