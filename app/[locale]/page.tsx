import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/locales";
import { siteConfig } from "@/lib/site";
import { getContentLocales, getPostsByLocale } from "@/lib/posts";
import { GAME_DATA, COLLECTIBLE_TOTAL } from "@/lib/game-data";
import Search from "@/components/Search";
import type { Metadata } from "next";

// 官方发售预告片（Gamescom 2026 ONL 首映，2026-08-25 由 Focus Entertainment 发布）。
const TRAILER_ID = "ULLFxFm6vvk";
const TRAILER_UPLOAD_DATE = "2026-08-25";

// 首页主视觉（仅用于社交分享 og:image）。
const HERO_IMG = "/images/guides/hero.jpg";

// 14 章（数据已按 PowerPyx 逐章核实）
const CHAPTERS = [
  { slug: "chapter-1-blood-ties", en: "Blood Ties", zh: "血缘", tag: "剧情章节" },
  { slug: "chapter-2-felons", en: "Felons", zh: "罪徒", tag: "收集较多" },
  { slug: "chapter-3-those-before-us", en: "Those Before Us", zh: "先民", tag: "收集较多" },
  { slug: "chapter-4-from-hell-it-rose", en: "From Hell It Rose", zh: "出自地狱", tag: "谜题较多" },
  { slug: "chapter-5-desolation-it-wrought", en: "Desolation It Wrought", zh: "荒芜", tag: "谜题较多" },
  { slug: "chapter-6-what-lies-beneath", en: "What Lies Beneath", zh: "深藏之物", tag: "收集较多" },
  { slug: "chapter-7-death-it-sowed", en: "Death It Sowed", zh: "死亡播种", tag: "谜题较多" },
  { slug: "chapter-8-resonance", en: "Resonance", zh: "共鸣", tag: "无收集" },
  { slug: "chapter-9-night-has-come", en: "Night Has Come", zh: "黑夜降临", tag: "收集较多" },
  { slug: "chapter-10-parallel-paths", en: "Parallel Paths", zh: "平行之路", tag: "谜题较多" },
  { slug: "chapter-11-patera", en: "Patera", zh: "帕特拉", tag: "谜题较多" },
  { slug: "chapter-12-fading-light", en: "Fading Light", zh: "消逝之光", tag: "剧情章节" },
  { slug: "chapter-13-as-one", en: "As One", zh: "合而为一", tag: "Boss" },
  { slug: "chapter-14-what-remains", en: "What Remains", zh: "余存", tag: "无收集" },
];

// 全收集 5 类（顺序：共鸣点数第一）
const COLLECTIBLES = [
  { slug: "resonance-points", name: "Resonance Points", count: GAME_DATA.resonancePointsTotal, note: "一周目重点" },
  { slug: "blades", name: "Blades", count: GAME_DATA.blades, note: "全部英雄墓刀剑" },
  { slug: "artefacts", name: "Artefacts", count: GAME_DATA.artefacts, note: "过去与现在的遗物" },
  { slug: "charms", name: "Charms", count: GAME_DATA.charms, note: "全部护符" },
  { slug: "theseus-echoes", name: "Theseus Echoes", count: GAME_DATA.theseusEchoes, note: "忒修斯回响" },
];

// 热门谜题（内容已存在于 puzzles 页）
const PUZZLES = [
  { ch: "Chapter 4", name: "三符号谜题", desc: "照基座看墙上符号，旋转对齐" },
  { ch: "Chapter 4", name: "公牛镜谜题", desc: "镜子两两对齐符号" },
  { ch: "Chapter 5", name: "雕像门谜题", desc: "三色光对齐雕像宝石" },
  { ch: "Chapter 7", name: "黑神庙颅骨门", desc: "按绿点提示顺序按颅骨" },
  { ch: "Chapter 10", name: "门谜题（三基座）", desc: "反射光到门，对齐 6 符号" },
  { ch: "Chapter 11", name: "光束谜题", desc: "杠杆接光融化灰尘" },
];

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const locale = params.locale;
  const url = `${siteConfig.siteUrl}/${locale}`;
  const description = siteConfig.defaultDescription;
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
  const locale = params.locale;

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
    description: `${siteConfig.gameName} 官方发售预告片`,
    thumbnailUrl: [`https://i.ytimg.com/vi/${TRAILER_ID}/maxresdefault.jpg`],
    uploadDate: TRAILER_UPLOAD_DATE,
    embedUrl: `https://www.youtube.com/embed/${TRAILER_ID}`,
    publisher: { "@type": "Organization", name: "Focus Entertainment" },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      {/* 02 Hero */}
      <section className="hero hero-center">
        <div className="container">
          <h1>Resonance: A Plague Tale Legacy 攻略 Wiki</h1>
          <p className="hero-tagline">
            14章完整流程、谜题答案、275项收集、共鸣点数、刀剑、护符、奖杯与技能攻略。
          </p>
          <div className="hero-chips">
            <span className="chip">{GAME_DATA.chapters} Chapters</span>
            <span className="chip">{COLLECTIBLE_TOTAL} Collectibles</span>
            <span className="chip">{GAME_DATA.resonancePointsTotal} Resonance Points</span>
            <span className="chip">37 Trophies</span>
          </div>
          <div className="hero-actions">
            <Link className="btn btn-primary" href={`/${locale}/guide/chapters`}>
              开始完整攻略
            </Link>
            <Link className="btn btn-ghost" href={`/${locale}/guide/collectibles`}>
              查看全收集
            </Link>
          </div>
          <Link className="hero-link" href={`/${locale}/guide/puzzles`}>
            卡关了？直接找谜题答案 →
          </Link>
          <Search locale={locale} items={searchItems} />
        </div>
      </section>

      {/* 03 你现在要找什么？ */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">你现在要找什么？</h2>
          <div className="task-grid">
            <Link className="task-card" href={`/${locale}/guide/chapters`}>
              <h3>完整流程攻略</h3>
              <p className="task-desc">14 个章节逐章攻略</p>
              <p className="task-sub">主线 · 卡关 · Boss · 谜题 · 收集</p>
              <span className="task-cta">查看 14 章攻略 →</span>
            </Link>
            <Link className="task-card" href={`/${locale}/guide/collectibles`}>
              <h3>全收集</h3>
              <p className="task-desc">275 项收集内容</p>
              <p className="task-sub">共鸣点 · 刀剑 · 遗物 · 护符 · 忒修斯回响</p>
              <span className="task-cta">查看全收集 →</span>
            </Link>
            <Link className="task-card" href={`/${locale}/guide/puzzles`}>
              <h3>谜题答案</h3>
              <p className="task-desc">卡住直接找答案</p>
              <p className="task-sub">光线 · 球体 · 符文 · 英雄墓</p>
              <span className="task-cta">解决谜题 →</span>
            </Link>
            <Link className="task-card" href={`/${locale}/guide/achievements`}>
              <h3>奖杯与成就</h3>
              <p className="task-desc">白金路线与易漏项目</p>
              <p className="task-sub">收集 · 战斗 · 章节奖杯</p>
              <span className="task-cta">查看奖杯攻略 →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 04 Resonance Points 警告 */}
      <section className="section section-warning">
        <div className="container">
          <div className="warning">
            <h3>⚠ 一周目最容易漏掉：Resonance Points</h3>
            <p>
              全游戏共有 {GAME_DATA.resonancePointsTotal} 个 Resonance Points，
              解锁全部技能相关目标需要至少 {GAME_DATA.resonancePointsRequired} 点。
              不要把它当成普通收集物留到章节选择再补。
            </p>
            <Link className="btn btn-primary" href={`/${locale}/guide/resonance-points`}>
              查看 Resonance Points 安全收集路线 →
            </Link>
          </div>
        </div>
      </section>

      {/* 05 14章完整攻略 */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">14章完整流程攻略</h2>
          <p className="lead">按主线顺序查看流程、谜题、收集物和关键战斗。</p>
          <div className="chapter-grid">
            {CHAPTERS.map((c, i) => (
              <Link key={c.slug} className="chapter-card" href={`/${locale}/guide/${c.slug}`}>
                <span className="chapter-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="chapter-name">{c.en}</span>
                <span className="chapter-zh">{c.zh}</span>
                <span className="chapter-tag">{c.tag}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 06 全收集数据库 */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">全收集攻略</h2>
          <div className="collect-grid">
            {COLLECTIBLES.map((c) => (
              <Link key={c.slug} className="collect-card" href={`/${locale}/guide/${c.slug}`}>
                <span className="collect-count">{c.count}</span>
                <span className="collect-name">{c.name}</span>
                <span className="collect-note">{c.note}</span>
                <span className="task-cta">查看位置 →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 07 热门谜题 */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">谜题答案</h2>
          <div className="puzzle-grid">
            {PUZZLES.map((p) => (
              <Link key={p.name} className="puzzle-card" href={`/${locale}/guide/puzzles`}>
                <span className="puzzle-ch">{p.ch}</span>
                <span className="puzzle-name">{p.name}</span>
                <span className="puzzle-desc">{p.desc}</span>
                <span className="task-cta">查看答案 →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 08 奖杯与成就 */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">奖杯与成就</h2>
          <div className="mini-grid">
            <Link className="mini-card" href={`/${locale}/guide/achievements`}>
              <h3>全奖杯攻略</h3>
              <p>36 成就 + 白金路线</p>
            </Link>
            <Link className="mini-card" href={`/${locale}/guide/achievements`}>
              <h3>易错过奖杯</h3>
              <p>Sea You Later / 木偶剧等</p>
            </Link>
            <Link className="mini-card" href={`/${locale}/guide/achievements`}>
              <h3>收集类奖杯</h3>
              <p>Hoarder / Plunderer</p>
            </Link>
            <Link className="mini-card" href={`/${locale}/guide/achievements`}>
              <h3>战斗类奖杯</h3>
              <p>Untouchable 等 12 个</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 09 技能与 Build */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">技能与 Build</h2>
          <div className="mini-grid">
            <Link className="mini-card" href={`/${locale}/guide/skills`}>
              <h3>最佳技能</h3>
              <p>Aegean Deflect / Hero&apos;s Step</p>
            </Link>
            <Link className="mini-card" href={`/${locale}/guide/skills`}>
              <h3>最佳 Build</h3>
              <p>招架流 / 闪避流 / 专注流</p>
            </Link>
            <Link className="mini-card" href={`/${locale}/guide/skills`}>
              <h3>Resonance Points 怎么花</h3>
              <p>165 点点满 6 分支</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 10 剧情与结局 */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">剧情与结局</h2>
          <p className="lead-warn">⚠ 以下内容包含剧透</p>
          <div className="mini-grid">
            <Link className="mini-card" href={`/${locale}/guide/ending`}>
              <h3>结局解释</h3>
              <p>生物、Macula 与留白</p>
            </Link>
            <Link className="mini-card" href={`/${locale}/guide/sophia`}>
              <h3>Sophia</h3>
              <p>主角起源与动机</p>
            </Link>
            <Link className="mini-card" href={`/${locale}/guide/story`}>
              <h3>剧情解析</h3>
              <p>完整故事时间线</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 11 新手 / FAQ */}
      <section className="section section-alt">
        <div className="container">
          <div className="mini-grid">
            <Link className="mini-card" href={`/${locale}/guide/beginner`}>
              <h3>新手攻略</h3>
              <p>战斗、解谜与收集避坑</p>
            </Link>
            <Link className="mini-card" href={`/${locale}/guide/faq`}>
              <h3>常见问题</h3>
              <p>15 个高频问题一次答完</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 12 关于游戏 Quick Facts */}
      <section className="section">
        <div className="container about-grid">
          <div className="about-copy">
            <h2>关于 Resonance: A Plague Tale Legacy</h2>
            <p className="lead">
              瘟疫传说系列前传，设定在《安魂曲》15 年前。年轻劫掠者 Sophia
              闯入米诺陶洛斯岛，在米诺斯时代的回响中揭开 Macula 的起源。战斗、解谜、全收集，一站搞定。
            </p>
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
          <h2 className="section-title">官方预告片</h2>
          <div className="video">
            <iframe
              src={`https://www.youtube.com/embed/${TRAILER_ID}`}
              title="Resonance: A Plague Tale Legacy Official Launch Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className="official-links">
            <a href="https://store.steampowered.com/app/2713000/" target="_blank" rel="noopener noreferrer">Steam</a>
            <a href="https://www.focus-entmt.com/en/games/resonance-a-plague-tale-legacy" target="_blank" rel="noopener noreferrer">Official Site</a>
          </div>
        </div>
      </section>
    </>
  );
}
