import type { MetadataRoute } from "next";
import { getSlugs, getContentLocales, getPostMtime } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

// 某 URL 的 hreflang 组：只标注真正有译文的语言 + x-default。
// 与 guide 页 generateMetadata 的 alternates.languages 保持一致。
function alternatesFor(path: string, slug?: string): MetadataRoute.Sitemap[number]["alternates"] {
  const translated = getContentLocales(slug);
  const languages: Record<string, string> = Object.fromEntries(
    translated.map((l) => [
      l,
      `${siteConfig.siteUrl}/${l}${path}`,
    ])
  );
  languages["x-default"] = `${siteConfig.siteUrl}/en${path}`;
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getSlugs();
  // 只收录真正有译文的语言（当前仅 en）。
  const locales = getContentLocales();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${siteConfig.siteUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: alternatesFor(""),
    });
    for (const slug of slugs) {
      entries.push({
        url: `${siteConfig.siteUrl}/${locale}/guide/${slug}`,
        lastModified: getPostMtime(locale, slug),
        changeFrequency: "weekly",
        priority: slug === "wiki" ? 0.9 : 0.8,
        alternates: alternatesFor(`/guide/${slug}`, slug),
      });
    }
  }
  return entries;
}
