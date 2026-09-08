import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/locales";
import { getMessages } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import { getContentLocales, getPostsByLocale } from "@/lib/posts";
import { IMAGE_DIMS } from "@/lib/imageDims";
import type { Metadata } from "next";

// 官方发售预告片（Gamescom 2026 ONL 首映，2026-08-25 由 Focus Entertainment 发布）。
const TRAILER_ID = "ULLFxFm6vvk";
const TRAILER_UPLOAD_DATE = "2026-08-25";

type Card = { title: string; desc: string; slug: string; img?: string };
type Fact = { label: string; value: string };

// 卡片配图（对应各页面的 hero 图），让卡片与白底形成反差。
// 换成新游戏的截图路径（放 public/images/guides/ 下）。
const CARD_IMAGES: Record<string, string> = {
  beginner: "/images/guides/beginner.jpg",
  sophia: "/images/guides/sophia.jpg",
  charms: "/images/guides/charms.jpg",
  skills: "/images/guides/skills.jpg",
};

// 首页主视觉海报图（用官方截图，避免与内容页重复）。
const HERO_IMG = "/images/guides/hero.jpg";
// "What is GameName" 区块左侧配图。
const ABOUT_IMG = "/images/guides/about.jpg";

function t(messages: Record<string, unknown>, path: string, fb = ""): string {
  const v = path
    .split(".")
    .reduce<unknown>(
      (cur, k) =>
        cur && typeof cur === "object"
          ? (cur as Record<string, unknown>)[k]
          : undefined,
      messages
    );
  return typeof v === "string" ? v : fb;
}

function arr(messages: Record<string, unknown>, path: string): string[] {
  const v = path
    .split(".")
    .reduce<unknown>(
      (cur, k) =>
        cur && typeof cur === "object"
          ? (cur as Record<string, unknown>)[k]
          : undefined,
      messages
    );
  return Array.isArray(v) ? (v as string[]) : [];
}

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const locale = params.locale;
  const m = getMessages(locale);
  const url = `${siteConfig.siteUrl}/${locale}`;
  const description = t(m, "hero.description") || siteConfig.defaultDescription;
  // 只标注真正有译文的语言（+ x-default）；其余语言为 UI 翻译壳页，正文仍是中文。
  const translated = getContentLocales();
  const languages: Record<string, string> = Object.fromEntries(
    translated.map((l) => [l, `${siteConfig.siteUrl}/${l}`])
  );
  languages["x-default"] = `${siteConfig.siteUrl}/zh-CN`;

  return {
    title: siteConfig.defaultTitle,
    description,
    alternates: { canonical: url, languages },
    robots: translated.includes(locale)
      ? undefined
      : { index: false, follow: true },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.siteName,
      title: siteConfig.defaultTitle,
      description,
      locale: locale === "zh-TW" ? "zh_TW" : "zh_CN",
      images: [{ url: `${siteConfig.siteUrl}${HERO_IMG}`, alt: siteConfig.gameName }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.defaultTitle,
      description,
      images: [`${siteConfig.siteUrl}${HERO_IMG}`],
    },
  };
}

export default function HomePage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const m = getMessages(params.locale);
  const locale = params.locale;

  const stats = arr(m, "hero.stats");
  const cards =
    ((m.startHere as { cards?: Card[] } | undefined)?.cards) ?? [];
  const facts =
    ((m.about as { facts?: Fact[] } | undefined)?.facts) ?? [];
  const paragraphs = arr(m, "about.paragraphs");

  const posts = getPostsByLocale(locale);
  const homeUrl = `${siteConfig.siteUrl}/${locale}`;
  const description = t(m, "hero.description") || siteConfig.defaultDescription;

  // 结构化数据：WebSite（站点身份）+ VideoObject（官方预告片）+ ItemList（攻略目录）
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.siteName,
    url: homeUrl,
    description,
    inLanguage: locale,
  };
  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${siteConfig.gameName} — Official Launch Trailer`,
    description: t(m, "trailer.lead") || `${siteConfig.gameName} 官方发售预告片`,
    thumbnailUrl: [
      `https://i.ytimg.com/vi/${TRAILER_ID}/maxresdefault.jpg`,
    ],
    uploadDate: TRAILER_UPLOAD_DATE,
    embedUrl: `https://www.youtube.com/embed/${TRAILER_ID}`,
    publisher: {
      "@type": "Organization",
      name: "Focus Entertainment",
    },
  };
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteConfig.gameName} 攻略目录`,
    numberOfItems: posts.length,
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.frontmatter.title,
      url: `${siteConfig.siteUrl}/${locale}/guide/${p.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">{t(m, "hero.eyebrow", "Fan-Made Community Wiki")}</span>
            <h1>{t(m, "hero.title", "GameName")}</h1>
            <p className="desc">{t(m, "hero.description")}</p>
            <div className="hero-stats">
              {stats.map((s, i) => (
                <span className="stat" key={i}>
                  {s}
                </span>
              ))}
            </div>
            <div className="hero-actions">
              <Link className="btn btn-primary" href={`/${locale}/guide/beginner`}>
                {t(m, "hero.ctaPrimary", "Start Beginner Guide")}
              </Link>
              <Link className="btn btn-ghost" href={`/${locale}/guide/reviews`}>
                {t(m, "hero.ctaSecondary", "Read Reviews")}
              </Link>
              <a
                className="btn btn-ghost"
                href={`https://www.youtube.com/watch?v=${TRAILER_ID}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(m, "hero.ctaThird", "Watch Launch Trailer")}
              </a>
            </div>
          </div>
          <div className="hero-art">
            <img
              src={HERO_IMG}
              alt="Resonance: A Plague Tale Legacy 游戏主视觉"
              width={IMAGE_DIMS[HERO_IMG]?.[0]}
              height={IMAGE_DIMS[HERO_IMG]?.[1]}
            />
          </div>
        </div>
      </section>

      {/* Start Here 卡片 */}
      <section className="section">
        <div className="container">
          <h2>{t(m, "startHere.title", "Start Here")}</h2>
          <p className="lead">{t(m, "startHere.lead")}</p>
          <div className="cards">
            {cards.map((c, i) => (
              <Link
                key={c.slug}
                className="card"
                href={`/${locale}/guide/${c.slug}`}
              >
                <div
                  className="card-img"
                  style={{
                    backgroundImage: `url(${CARD_IMAGES[c.slug] ?? c.img ?? ""})`,
                  }}
                />
                <div className="card-body">
                  <h3>
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    {c.title}
                  </h3>
                  <p>{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What is GameName */}
      <section className="section section-alt">
        <div className="container about-grid">
          <div className="about-art">
            <img
              src={ABOUT_IMG}
              alt="Resonance: A Plague Tale Legacy 中的角色"
              width={IMAGE_DIMS[ABOUT_IMG]?.[0]}
              height={IMAGE_DIMS[ABOUT_IMG]?.[1]}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="about-copy">
            <h2>{t(m, "about.title", "What is GameName")}</h2>
            {paragraphs.map((p, i) => (
              <p className="lead" key={i}>
                {p}
              </p>
            ))}
            <table className="fact-table">
              <tbody>
                {facts.map((f) => (
                  <tr key={f.label}>
                    <th>{f.label}</th>
                    <td>{f.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Official Trailer */}
      <section className="section">
        <div className="container">
          <h2>{t(m, "trailer.title", "Official Trailer")}</h2>
          <p className="lead">{t(m, "trailer.lead")}</p>
          <div className="video">
            <iframe
              src={`https://www.youtube.com/embed/${TRAILER_ID}`}
              title="Resonance: A Plague Tale Legacy Official Launch Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta">
        <div className="container">
          <h2>{t(m, "cta.title", "Ready to Master GameName?")}</h2>
          <p>{t(m, "cta.description")}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href={`/${locale}/guide/beginner`}>
              {t(m, "cta.primary", "Read the Beginner Guide")}
            </Link>
            <a
              className="btn btn-ghost"
              href="https://store.steampowered.com/app/2713000/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(m, "cta.secondary", "Play on Steam")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
