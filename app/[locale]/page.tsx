import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/locales";
import { getMessages } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import { getContentLocales, getPostsByLocale } from "@/lib/posts";
import { GAME_DATA, COLLECTIBLE_TOTAL } from "@/lib/game-data";
import Search from "@/components/Search";
import VideoThumb from "@/components/VideoThumb";
import type { Metadata } from "next";

// 官方发售预告片（Gamescom 2026 ONL 首映，2026-08-25 由 Focus Entertainment 发布）。
const TRAILER_ID = "ULLFxFm6vvk";
const TRAILER_UPLOAD_DATE = "2026-08-25";

// 首页主视觉（仅用于社交分享 og:image）。
const HERO_IMG = "/images/guides/hero.jpg";

// 14 章（slug + 游戏内官方英文名；本地化译名/tag 从 messages 读）
const CHAPTERS = [
  { slug: "chapter-1-blood-ties", en: "Blood Ties" },
  { slug: "chapter-2-felons", en: "Felons" },
  { slug: "chapter-3-those-before-us", en: "Those Before Us" },
  { slug: "chapter-4-from-hell-it-rose", en: "From Hell It Rose" },
  { slug: "chapter-5-desolation-it-wrought", en: "Desolation It Wrought" },
  { slug: "chapter-6-what-lies-beneath", en: "What Lies Beneath" },
  { slug: "chapter-7-death-it-sowed", en: "Death It Sowed" },
  { slug: "chapter-8-resonance", en: "Resonance" },
  { slug: "chapter-9-night-has-come", en: "Night Has Come" },
  { slug: "chapter-10-parallel-paths", en: "Parallel Paths" },
  { slug: "chapter-11-patera", en: "Patera" },
  { slug: "chapter-12-fading-light", en: "Fading Light" },
  { slug: "chapter-13-as-one", en: "As One" },
  { slug: "chapter-14-what-remains", en: "What Remains" },
];

// 全收集 5 类（顺序：共鸣点数第一；name 为游戏术语通用，note 本地化）
const COLLECTIBLES = [
  { slug: "resonance-points", name: "Resonance Points", count: GAME_DATA.resonancePointsTotal },
  { slug: "blades", name: "Blades", count: GAME_DATA.blades },
  { slug: "artefacts", name: "Artefacts", count: GAME_DATA.artefacts },
  { slug: "charms", name: "Charms", count: GAME_DATA.charms },
  { slug: "theseus-echoes", name: "Theseus Echoes", count: GAME_DATA.theseusEchoes },
];

type Dict = Record<string, unknown>;
const str = (o: unknown, fb = ""): string => (typeof o === "string" ? o : fb);
const obj = (o: unknown): Dict => (o && typeof o === "object" ? (o as Dict) : {});
const list = (o: Dict, key: string): Dict[] => {
  const v = o[key];
  return Array.isArray(v) ? (v as Dict[]) : [];
};

const OG_LOCALE: Record<string, string> = {
  "zh-CN": "zh_CN",
  "zh-TW": "zh_TW",
  en: "en_US",
  ja: "ja_JP",
  ru: "ru_RU",
  de: "de_DE",
};

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const locale = params.locale;
  const url = `${siteConfig.siteUrl}/${locale}`;
  const m = getMessages(locale);
  const meta = obj(m.meta);
  const title = str(meta.title, siteConfig.defaultTitle);
  const description = str(meta.description, siteConfig.defaultDescription);
  const translated = getContentLocales();
  const languages: Record<string, string> = Object.fromEntries(
    translated.map((l) => [l, `${siteConfig.siteUrl}/${l}`])
  );
  languages["x-default"] = `${siteConfig.siteUrl}/zh-CN`;

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    robots: translated.includes(locale)
      ? undefined
      : { index: false, follow: true },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.siteName,
      title,
      description,
      locale: OG_LOCALE[locale] ?? "zh_CN",
      images: [{ url: `${siteConfig.siteUrl}${HERO_IMG}`, alt: siteConfig.gameName }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteConfig.siteUrl}${HERO_IMG}`],
    },
  };
}

export default function HomePage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale;

  const m = getMessages(locale);
  const hero = obj(m.hero);
  const search = obj(m.search);
  const tasks = obj(m.tasks);
  const warning = obj(m.warning);
  const chaptersSection = obj(m.chaptersSection);
  const chaptersMsg = obj(m.chapters);
  const collectiblesSection = obj(m.collectiblesSection);
  const collectiblesMsg = obj(m.collectibles);
  const puzzlesSection = obj(m.puzzlesSection);
  const puzzlesList = list(m, "puzzles");
  const trophiesSection = obj(m.trophiesSection);
  const skillsSection = obj(m.skillsSection);
  const storySection = obj(m.storySection);
  const beginnerSection = obj(m.beginnerSection);
  const about = obj(m.about);
  const trailer = obj(m.trailer);

  const task = (k: string) => obj(tasks[k]);

  const warningBody = str(warning.body)
    .replace("{total}", String(GAME_DATA.resonancePointsTotal))
    .replace("{required}", String(GAME_DATA.resonancePointsRequired));

  const posts = getPostsByLocale(locale);
  const searchItems = posts.map((p) => ({
    title: p.frontmatter.title,
    slug: p.slug,
    eyebrow: p.frontmatter.eyebrow,
  }));
  const homeUrl = `${siteConfig.siteUrl}/${locale}`;

  // 结构化数据：WebSite + VideoObject + ItemList
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.siteName,
    url: homeUrl,
    description: siteConfig.defaultDescription,
    inLanguage: locale,
  };
  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${siteConfig.gameName} — Official Launch Trailer`,
    description: `${siteConfig.gameName} official launch trailer`,
    thumbnailUrl: [`https://i.ytimg.com/vi/${TRAILER_ID}/maxresdefault.jpg`],
    uploadDate: TRAILER_UPLOAD_DATE,
    embedUrl: `https://www.youtube.com/embed/${TRAILER_ID}`,
    publisher: { "@type": "Organization", name: "Focus Entertainment" },
  };
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: siteConfig.gameName,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      {/* 02 Hero */}
      <section className="hero hero-center">
        <div className="container">
          <h1>{str(hero.title)}</h1>
          <p className="hero-tagline">{str(hero.tagline)}</p>
          <div className="hero-chips">
            <span className="chip">{GAME_DATA.chapters} Chapters</span>
            <span className="chip">{COLLECTIBLE_TOTAL} Collectibles</span>
            <span className="chip">{GAME_DATA.resonancePointsTotal} Resonance Points</span>
            <span className="chip">37 Trophies</span>
          </div>
          <div className="hero-actions">
            <Link className="btn btn-primary" href={`/${locale}/guide/chapters`}>
              {str(hero.ctaWalkthrough)}
            </Link>
            <Link className="btn btn-ghost" href={`/${locale}/guide/collectibles`}>
              {str(hero.ctaCollectibles)}
            </Link>
          </div>
          <Link className="hero-link" href={`/${locale}/guide/puzzles`}>
            {str(hero.ctaPuzzles)}
          </Link>
          <Search
            locale={locale}
            items={searchItems}
            placeholder={str(search.placeholder)}
            emptyText={str(search.empty)}
            ariaLabel={str(search.ariaLabel)}
          />
        </div>
      </section>

      {/* 03 你现在要找什么？ */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">{str(tasks.title)}</h2>
          <div className="task-grid">
            <Link className="task-card" href={`/${locale}/guide/chapters`}>
              <h3>{str(task("walkthrough").title)}</h3>
              <p className="task-desc">{str(task("walkthrough").desc)}</p>
              <p className="task-sub">{str(task("walkthrough").sub)}</p>
              <span className="task-cta">{str(task("walkthrough").cta)}</span>
            </Link>
            <Link className="task-card" href={`/${locale}/guide/collectibles`}>
              <h3>{str(task("collectibles").title)}</h3>
              <p className="task-desc">{str(task("collectibles").desc)}</p>
              <p className="task-sub">{str(task("collectibles").sub)}</p>
              <span className="task-cta">{str(task("collectibles").cta)}</span>
            </Link>
            <Link className="task-card" href={`/${locale}/guide/puzzles`}>
              <h3>{str(task("puzzles").title)}</h3>
              <p className="task-desc">{str(task("puzzles").desc)}</p>
              <p className="task-sub">{str(task("puzzles").sub)}</p>
              <span className="task-cta">{str(task("puzzles").cta)}</span>
            </Link>
            <Link className="task-card" href={`/${locale}/guide/achievements`}>
              <h3>{str(task("trophies").title)}</h3>
              <p className="task-desc">{str(task("trophies").desc)}</p>
              <p className="task-sub">{str(task("trophies").sub)}</p>
              <span className="task-cta">{str(task("trophies").cta)}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 04 Resonance Points 警告 */}
      <section className="section section-warning">
        <div className="container">
          <div className="warning">
            <h3>{str(warning.title)}</h3>
            <p>{warningBody}</p>
            <Link className="btn btn-primary" href={`/${locale}/guide/resonance-points`}>
              {str(warning.cta)}
            </Link>
          </div>
        </div>
      </section>

      {/* 05 14章完整攻略 */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">{str(chaptersSection.title)}</h2>
          <p className="lead">{str(chaptersSection.lead)}</p>
          <div className="chapter-grid">
            {CHAPTERS.map((c, i) => {
              const ch = obj(chaptersMsg[c.slug]);
              const tag = str(ch.tag);
              const localName = str(ch.localName);
              return (
                <Link key={c.slug} className="chapter-card" href={`/${locale}/guide/${c.slug}`}>
                  <span className="chapter-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="chapter-name">{c.en}</span>
                  {localName && <span className="chapter-zh">{localName}</span>}
                  {tag && <span className="chapter-tag">{tag}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 06 全收集数据库 */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">{str(collectiblesSection.title)}</h2>
          <div className="collect-grid">
            {COLLECTIBLES.map((c) => {
              const note = str(obj(collectiblesMsg[c.slug]).note);
              return (
                <Link key={c.slug} className="collect-card" href={`/${locale}/guide/${c.slug}`}>
                  <span className="collect-count">{c.count}</span>
                  <span className="collect-name">{c.name}</span>
                  <span className="collect-note">{note}</span>
                  <span className="task-cta">{str(collectiblesSection.cta)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 07 热门谜题 */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">{str(puzzlesSection.title)}</h2>
          <div className="puzzle-grid">
            {puzzlesList.map((p) => (
              <Link key={str(p.name)} className="puzzle-card" href={`/${locale}/guide/puzzles`}>
                <span className="puzzle-ch">{str(p.ch)}</span>
                <span className="puzzle-name">{str(p.name)}</span>
                <span className="puzzle-desc">{str(p.desc)}</span>
                <span className="task-cta">{str(puzzlesSection.cta)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 08 奖杯与成就 */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">{str(trophiesSection.title)}</h2>
          <div className="mini-grid">
            {list(trophiesSection, "items").map((it) => (
              <Link key={str(it.title)} className="mini-card" href={`/${locale}/guide/achievements`}>
                <h3>{str(it.title)}</h3>
                <p>{str(it.desc)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 09 技能与 Build */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">{str(skillsSection.title)}</h2>
          <div className="mini-grid">
            {list(skillsSection, "items").map((it) => (
              <Link key={str(it.title)} className="mini-card" href={`/${locale}/guide/skills`}>
                <h3>{str(it.title)}</h3>
                <p>{str(it.desc)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 10 剧情与结局 */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">{str(storySection.title)}</h2>
          <p className="lead-warn">{str(storySection.spoiler)}</p>
          <div className="mini-grid">
            <Link className="mini-card" href={`/${locale}/guide/ending`}>
              <h3>{str(obj(list(storySection, "items")[0]).title)}</h3>
              <p>{str(obj(list(storySection, "items")[0]).desc)}</p>
            </Link>
            <Link className="mini-card" href={`/${locale}/guide/sophia`}>
              <h3>{str(obj(list(storySection, "items")[1]).title)}</h3>
              <p>{str(obj(list(storySection, "items")[1]).desc)}</p>
            </Link>
            <Link className="mini-card" href={`/${locale}/guide/story`}>
              <h3>{str(obj(list(storySection, "items")[2]).title)}</h3>
              <p>{str(obj(list(storySection, "items")[2]).desc)}</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 11 新手 / FAQ */}
      <section className="section section-alt">
        <div className="container">
          <div className="mini-grid">
            <Link className="mini-card" href={`/${locale}/guide/beginner`}>
              <h3>{str(obj(list(beginnerSection, "items")[0]).title)}</h3>
              <p>{str(obj(list(beginnerSection, "items")[0]).desc)}</p>
            </Link>
            <Link className="mini-card" href={`/${locale}/guide/faq`}>
              <h3>{str(obj(list(beginnerSection, "items")[1]).title)}</h3>
              <p>{str(obj(list(beginnerSection, "items")[1]).desc)}</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 12 关于游戏 Quick Facts */}
      <section className="section">
        <div className="container about-grid">
          <div className="about-copy">
            <h2>{str(about.title)}</h2>
            <p className="lead">{str(about.lead)}</p>
          </div>
          <div className="about-copy">
            <table className="fact-table">
              <tbody>
                <tr><th>Developer</th><td>{GAME_DATA.developer}</td></tr>
                <tr><th>Publisher</th><td>{GAME_DATA.publisher}</td></tr>
                <tr><th>Release</th><td>{GAME_DATA.releaseDate}</td></tr>
                <tr><th>Platforms</th><td>{GAME_DATA.platforms}</td></tr>
                <tr><th>Genre</th><td>Action-Adventure</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 13 官方预告片 / 链接 */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">{str(trailer.title)}</h2>
          <VideoThumb
            videoId={TRAILER_ID}
            title="Resonance: A Plague Tale Legacy Official Launch Trailer"
          />
          <div className="official-links">
            <a href="https://store.steampowered.com/app/2713000/" target="_blank" rel="noopener noreferrer">Steam</a>
            <a href="https://www.focus-entmt.com/en/games/resonance-a-plague-tale-legacy" target="_blank" rel="noopener noreferrer">Official Site</a>
          </div>
        </div>
      </section>
    </>
  );
}
