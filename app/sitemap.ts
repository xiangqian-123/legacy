import type { MetadataRoute } from "next";
import { getSlugs, getContentLocales, getPostMtime } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getSlugs();
  // 只收录真正有译文的语言。en/de/ja/ru 目前是 UI 翻译壳页（正文为中文），
  // 放进 sitemap 等于让 Google 抓 4 份重复内容。等补上译文后会自动纳入。
  const locales = getContentLocales();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${siteConfig.siteUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });
    for (const slug of slugs) {
      entries.push({
        url: `${siteConfig.siteUrl}/${locale}/guide/${slug}`,
        lastModified: getPostMtime(locale, slug),
        changeFrequency: "weekly",
        priority: slug === "wiki" ? 0.9 : 0.8,
      });
    }
  }
  return entries;
}
