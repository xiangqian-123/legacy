import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getPost, getSlugs, getContentLocales } from "@/lib/posts";
import { locales } from "@/lib/locales";
import { getMessages, pick } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import { IMAGE_DIMS } from "@/lib/imageDims";
import { CHAPTERS } from "@/lib/chapters";
import { getRelated } from "@/lib/related";
import Toc from "@/components/Toc";
import { LeaderboardAd, CpmContainerAd } from "@/components/AdSlots";
import type { Metadata } from "next";

// 内容最后核验日期（第43步：每页 H1 下显示）。数据源：PowerPyx Launch build 交叉验证。
const LAST_VERIFIED = "2026-09-10";
const GAME_BUILD = "Launch";

// 父级 Hub 映射：根据 slug 返回 Breadcrumb 的父级（首页 > 父级 > 当前页）。
// label 走 messages.guide.bc*（locale 化，不再硬编码中文）。
function breadcrumbParent(slug: string): { key: string; href: string } | null {
  if (/^chapter-\d+/.test(slug))
    return { key: "guide.bcChapters", href: "chapters" };
  if (
    ["rusty-sword", "falchion", "kopis", "greek-sword", "sica", "khopesh", "broken-spear", "xiphos"].includes(slug)
  )
    return { key: "guide.bcBlades", href: "blades" };
  if (["charms", "artefacts", "theseus-echoes", "resonance-points", "collectibles"].includes(slug))
    return { key: "guide.bcCollectibles", href: "collectibles" };
  if (["story", "ending", "sophia", "prequel", "series", "characters"].includes(slug))
    return { key: "guide.bcStory", href: "story" };
  return null;
}

// locale → Open Graph 语言代码
const OG_LOCALE: Record<string, string> = {
  "zh-CN": "zh_CN",
  "zh-TW": "zh_TW",
  en: "en_US",
  ja: "ja_JP",
  ru: "ru_RU",
  de: "de_DE",
};

export function generateStaticParams() {
  const slugs = getSlugs();
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const post = getPost(params.locale, params.slug);
  if (!post) {
    return { title: siteConfig.defaultTitle };
  }
  const fm = post.frontmatter;
  const url = `${siteConfig.siteUrl}/${params.locale}/guide/${post.slug}`;
  const ogLocale = OG_LOCALE[params.locale] ?? "zh_CN";
  // 只标注真正有译文的语言（+ x-default），避免中文正文被标成 en/de/ja/ru。
  const translated = getContentLocales(post.slug);
  const languages: Record<string, string> = Object.fromEntries(
    translated.map((l) => [l, `${siteConfig.siteUrl}/${l}/guide/${post.slug}`])
  );
  languages["x-default"] = `${siteConfig.siteUrl}/zh-CN/guide/${post.slug}`;
  // 无译文的语言只是 UI 翻译壳页（正文为中文），加 noindex 避免重复内容。
  const isTranslated = translated.includes(params.locale);

  return {
    title: fm.title,
    description: fm.description,
    alternates: { canonical: url, languages },
    robots: isTranslated ? undefined : { index: false, follow: true },
    openGraph: {
      type: "article",
      url,
      title: fm.title,
      description: fm.description,
      siteName: siteConfig.siteName,
      locale: ogLocale,
      images: fm.heroImage
        ? [
            {
              url: `${siteConfig.siteUrl}${fm.heroImage}`,
              alt: fm.heroAlt || fm.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fm.title,
      description: fm.description,
      images: fm.heroImage
        ? [`${siteConfig.siteUrl}${fm.heroImage}`]
        : undefined,
    },
  };
}

// 检查 hero 配图是否已存在于 public 目录（未准备时优雅降级）。
function heroImageExists(src: string): boolean {
  if (!src.startsWith("/")) return false;
  const file = path.join(process.cwd(), "public", src);
  return fs.existsSync(file);
}

// 从 FAQ 页 MDX 内容提取 Q/A，用于 FAQPage 结构化数据。
// 正文以 "**Q: 问题**" 换行 "A: 答案" 书写；frontmatter 设 faq: true 即启用。
function extractFaq(content: string): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = [];
  const re = /\*\*Q[：:]\s*([^*]+)\*\*\s*\n(?:A[：:]\s*)?([\s\S]+?)(?=\n\*\*Q[：:]|\n##\s|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) {
    const q = m[1].trim();
    const a = m[2].trim().replace(/\n{2,}/g, "\n");
    if (q && a) faqs.push({ q, a });
  }
  return faqs;
}

// 提取 H2 标题，用于本页目录（TOC）。
function extractHeadings(content: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = [];
  const re = /^##\s+(.+)$/gm;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(content))) {
    headings.push({ id: `sec-${++i}`, text: m[1].trim() });
  }
  return headings;
}

export default function GuidePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const post = getPost(params.locale, params.slug);
  if (!post) notFound();

  const fm = post.frontmatter;
  const hasHero = fm.heroImage ? heroImageExists(fm.heroImage) : false;
  const url = `${siteConfig.siteUrl}/${params.locale}/guide/${post.slug}`;

  // 模板 UI 文案（locale 化）。
  const messages = getMessages(params.locale);
  const t = (key: string, fb = ""): string => pick(messages, key, fb);

  // 上下文相关内链（第二轮内链实验，范围见 lib/related.ts）。
  const related = getRelated(post.slug);

  // Breadcrumb 父级 + 章节上一章/下一章
  const parent = breadcrumbParent(post.slug);
  const chapterIdx = CHAPTERS.findIndex((c) => c.slug === post.slug);
  const prevChapter = chapterIdx > 0 ? CHAPTERS[chapterIdx - 1] : null;
  const nextChapter =
    chapterIdx >= 0 && chapterIdx < CHAPTERS.length - 1 ? CHAPTERS[chapterIdx + 1] : null;

  // 本页目录（TOC）+ 给 H2 加锚点 id
  const headings = extractHeadings(post.content);
  let h2Counter = 0;
  const components = {
    h2: (props: Record<string, unknown>) => {
      h2Counter += 1;
      // eslint-disable-next-line react/prop-types
      return <h2 id={`sec-${h2Counter}`} {...props} />;
    },
  };

  // BreadcrumbList 结构化数据
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: siteConfig.siteName,
        item: `${siteConfig.siteUrl}/${params.locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: fm.title,
        item: url,
      },
    ],
  };

  // FAQPage 结构化数据（/faq 页或 frontmatter faq: true 的页面）
  const faqs = params.slug === "faq" || fm.faq === true ? extractFaq(post.content) : [];
  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <div className="guide-layout">
        <article className="guide">
        <nav className="breadcrumb" aria-label={t("guide.breadcrumbAria")}>
          <Link href={`/${params.locale}`}>{t("guide.bcHome")}</Link>
          {parent && (
            <>
              <span className="bc-sep">›</span>
              <Link href={`/${params.locale}/guide/${parent.href}`}>{t(parent.key)}</Link>
            </>
          )}
          <span className="bc-sep">›</span>
          <span className="bc-current">{fm.eyebrow || fm.title}</span>
        </nav>
        <header className="guide-header">
          <span className="eyebrow">{fm.eyebrow}</span>
          <h1>{fm.title}</h1>
          <p className="guide-verified">{t("guide.lastVerified")}: {LAST_VERIFIED} · {t("guide.gameVersion")}: {GAME_BUILD}</p>
          {hasHero && (
            <img
              className="guide-hero"
              src={fm.heroImage}
              alt={fm.heroAlt || fm.title}
              width={IMAGE_DIMS[fm.heroImage]?.[0]}
              height={IMAGE_DIMS[fm.heroImage]?.[1]}
              decoding="async"
            />
          )}
        </header>
        <LeaderboardAd />
        <div className="prose">
          <MDXRemote
            source={post.content}
            components={components as Record<string, React.ComponentType<Record<string, unknown>>>}
            options={{
              // remark-gfm@4 需配合 next-mdx-remote@6（内部 @mdx-js/mdx@3，unified@11 生态）。
              // 断言 any 以防传递依赖类型路径不一致（运行时无影响）。
              mdxOptions: { remarkPlugins: [remarkGfm as any] },
            }}
          />
        </div>
        <CpmContainerAd />
        {(prevChapter || nextChapter) && (
          <nav className="chapter-nav">
            {prevChapter ? (
              <Link className="chapter-nav-item" href={`/${params.locale}/guide/${prevChapter.slug}`}>
                <span className="cn-label">{t("guide.prevChapter")}</span>
                <span className="cn-name">{prevChapter.en}</span>
              </Link>
            ) : (
              <span />
            )}
            {nextChapter ? (
              <Link className="chapter-nav-item cn-next" href={`/${params.locale}/guide/${nextChapter.slug}`}>
                <span className="cn-label">{t("guide.nextChapter")}</span>
                <span className="cn-name">{nextChapter.en}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
        {related.length > 0 && (
          <nav className="related" aria-label={t("guide.relatedTitle")}>
            <h2 className="related-title">{t("guide.relatedTitle")}</h2>
            <ul className="related-list">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/${params.locale}/guide/${r.slug}`}>{r.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        </article>
        <Toc
          headings={headings}
          title={t("guide.tocTitle")}
          summary={t("guide.tocSummary")}
        />
      </div>
    </>
  );
}
