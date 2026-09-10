import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getPost, getSlugs, getContentLocales } from "@/lib/posts";
import { locales } from "@/lib/locales";
import { siteConfig } from "@/lib/site";
import { IMAGE_DIMS } from "@/lib/imageDims";
import { CHAPTERS } from "@/lib/chapters";
import type { Metadata } from "next";

// 内容最后核验日期（第43步：每页 H1 下显示）。数据源：PowerPyx Launch build 交叉验证。
const LAST_VERIFIED = "2026-09-10";
const GAME_BUILD = "Launch";

// 父级 Hub 映射：根据 slug 返回 Breadcrumb 的父级（首页 > 父级 > 当前页）。
function breadcrumbParent(slug: string): { label: string; href: string } | null {
  if (/^chapter-\d+/.test(slug))
    return { label: "章节攻略", href: "chapters" };
  if (
    ["rusty-sword", "falchion", "kopis", "greek-sword", "sica", "khopesh", "broken-spear", "xiphos"].includes(slug)
  )
    return { label: "全收集 · 刀剑", href: "blades" };
  if (["charms", "artefacts", "theseus-echoes", "resonance-points", "collectibles"].includes(slug))
    return { label: "全收集", href: "collectibles" };
  if (["story", "ending", "sophia", "prequel", "series", "characters"].includes(slug))
    return { label: "剧情", href: "story" };
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
function extractFaq(content: string): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = [];
  const re = /\*\*Q[：:]\s*([^*]+)\*\*\s*\n(?:A[：:]\s*)?([\s\S]+?)(?=\n\*\*Q[：:]|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) {
    const q = m[1].trim();
    const a = m[2].trim().replace(/\n{2,}/g, "\n");
    if (q && a) faqs.push({ q, a });
  }
  return faqs;
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

  // Breadcrumb 父级 + 章节上一章/下一章
  const parent = breadcrumbParent(post.slug);
  const chapterIdx = CHAPTERS.findIndex((c) => c.slug === post.slug);
  const prevChapter = chapterIdx > 0 ? CHAPTERS[chapterIdx - 1] : null;
  const nextChapter =
    chapterIdx >= 0 && chapterIdx < CHAPTERS.length - 1 ? CHAPTERS[chapterIdx + 1] : null;

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

  // FAQPage 结构化数据（仅 FAQ 页）
  const faqs = params.slug === "faq" ? extractFaq(post.content) : [];
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
      <article className="guide">
        <nav className="breadcrumb" aria-label="面包屑">
          <Link href={`/${params.locale}`}>首页</Link>
          {parent && (
            <>
              <span className="bc-sep">›</span>
              <Link href={`/${params.locale}/guide/${parent.href}`}>{parent.label}</Link>
            </>
          )}
          <span className="bc-sep">›</span>
          <span className="bc-current">{fm.eyebrow || fm.title}</span>
        </nav>
        <header className="guide-header">
          <span className="eyebrow">{fm.eyebrow}</span>
          <h1>{fm.title}</h1>
          <p className="guide-verified">最后核验：{LAST_VERIFIED} · 游戏版本：{GAME_BUILD}</p>
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
        <div className="prose">
          <MDXRemote
            source={post.content}
            options={{
              // remark-gfm@4 需配合 next-mdx-remote@6（内部 @mdx-js/mdx@3，unified@11 生态）。
              // 断言 any 以防传递依赖类型路径不一致（运行时无影响）。
              mdxOptions: { remarkPlugins: [remarkGfm as any] },
            }}
          />
        </div>
        {(prevChapter || nextChapter) && (
          <nav className="chapter-nav">
            {prevChapter ? (
              <Link className="chapter-nav-item" href={`/${params.locale}/guide/${prevChapter.slug}`}>
                <span className="cn-label">上一章</span>
                <span className="cn-name">{prevChapter.en}</span>
              </Link>
            ) : (
              <span />
            )}
            {nextChapter ? (
              <Link className="chapter-nav-item cn-next" href={`/${params.locale}/guide/${nextChapter.slug}`}>
                <span className="cn-label">下一章</span>
                <span className="cn-name">{nextChapter.en}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </article>
    </>
  );
}
