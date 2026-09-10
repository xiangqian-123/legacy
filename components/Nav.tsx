'use client';

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/site";

type NavLink = { label: string; slug: string };

// 14 章（slug 对应 content/guides 下的 mdx 文件名；章节名为游戏内官方英文名，全语言通用）
const CHAPTERS: NavLink[] = [
  { label: "Chapter 1 · Blood Ties", slug: "chapter-1-blood-ties" },
  { label: "Chapter 2 · Felons", slug: "chapter-2-felons" },
  { label: "Chapter 3 · Those Before Us", slug: "chapter-3-those-before-us" },
  { label: "Chapter 4 · From Hell It Rose", slug: "chapter-4-from-hell-it-rose" },
  { label: "Chapter 5 · Desolation It Wrought", slug: "chapter-5-desolation-it-wrought" },
  { label: "Chapter 6 · What Lies Beneath", slug: "chapter-6-what-lies-beneath" },
  { label: "Chapter 7 · Death It Sowed", slug: "chapter-7-death-it-sowed" },
  { label: "Chapter 8 · Resonance", slug: "chapter-8-resonance" },
  { label: "Chapter 9 · Night Has Come", slug: "chapter-9-night-has-come" },
  { label: "Chapter 10 · Parallel Paths", slug: "chapter-10-parallel-paths" },
  { label: "Chapter 11 · Patera", slug: "chapter-11-patera" },
  { label: "Chapter 12 · Fading Light", slug: "chapter-12-fading-light" },
  { label: "Chapter 13 · As One", slug: "chapter-13-as-one" },
  { label: "Chapter 14 · What Remains", slug: "chapter-14-what-remains" },
];

// 导航结构：key 对应 messages.nav 下的文案，slug/href 是路由。
type NavChild = { key: string; slug: string };
type NavItem = {
  key: string; // messages.nav 下的文案 key
  href?: string; // 直接链接（无下拉）
  children?: NavChild[]; // 下拉项
  grandTitleKey?: string; // 二级标题的文案 key（如「所有章节」）
  grand?: NavLink[]; // 二级项（章节）
};

const NAV: NavItem[] = [
  {
    key: "walkthrough",
    children: [
      { key: "fullWalkthrough", slug: "chapters" },
      { key: "beginnerGuide", slug: "beginner" },
    ],
    grandTitleKey: "allChapters",
    grand: CHAPTERS,
  },
  {
    key: "collectibles",
    children: [
      { key: "resonancePoints", slug: "resonance-points" },
      { key: "blades", slug: "blades" },
      { key: "artefacts", slug: "artefacts" },
      { key: "charms", slug: "charms" },
      { key: "theseusEchoes", slug: "theseus-echoes" },
    ],
  },
  { key: "puzzles", href: "puzzles" },
  { key: "trophies", href: "achievements" },
  { key: "skills", href: "skills" },
  {
    key: "story",
    children: [
      { key: "storyGuide", slug: "story" },
      { key: "endingExplained", slug: "ending" },
      { key: "sophia", slug: "sophia" },
    ],
  },
  {
    key: "more",
    children: [
      { key: "faq", slug: "faq" },
      { key: "gameInfo", slug: "wiki" },
      { key: "languageSupport", slug: "chinese" },
    ],
  },
];

const LANG_LABELS: Record<string, string> = {
  "zh-CN": "中文",
  "zh-TW": "繁體",
  en: "EN",
  ja: "日本語",
  ru: "РУ",
  de: "DE",
};

export default function Nav({
  locale,
  contentLocales,
  messages,
}: {
  locale: string;
  contentLocales: string[];
  messages: Record<string, unknown>;
}) {
  const [hover, setHover] = useState<string | null>(null); // 桌面 hover
  const [mobileOpen, setMobileOpen] = useState<string | null>(null); // 移动端点击

  const nav = (messages.nav ?? {}) as Record<string, unknown>;
  const t = (key: string): string => {
    const v = nav[key];
    return typeof v === "string" ? v : key;
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href={`/${locale}`} className="nav-logo">
          <span className="dot" />
          {siteConfig.siteName}
        </Link>
        <nav className="nav-links">
          {NAV.map((item) => {
            const label = t(item.key);
            // 直接链接（无下拉）
            if (item.href && !item.children) {
              return (
                <Link
                  key={item.key}
                  className="nav-link"
                  href={`/${locale}/guide/${item.href}`}
                >
                  {label}
                </Link>
              );
            }
            const isOpen = hover === item.key || mobileOpen === item.key;
            return (
              <div
                key={item.key}
                className="nav-item"
                onMouseEnter={() => setHover(item.key)}
                onMouseLeave={() => setHover(null)}
              >
                <button
                  type="button"
                  className="nav-item-btn"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setMobileOpen(mobileOpen === item.key ? null : item.key)
                  }
                >
                  {label}
                  <span className="caret" aria-hidden>
                    ▾
                  </span>
                </button>
                <div className={`nav-dropdown${isOpen ? " open" : ""}`}>
                  {item.children?.map((c) => (
                    <Link key={c.slug} href={`/${locale}/guide/${c.slug}`}>
                      {t(c.key)}
                    </Link>
                  ))}
                  {item.grand && (
                    <div className="nav-sub">
                      <span className="nav-sub-title">
                        {item.grandTitleKey ? t(item.grandTitleKey) : ""}
                      </span>
                      <div className="nav-sub-list">
                        {item.grand.map((c) => (
                          <Link key={c.slug} href={`/${locale}/guide/${c.slug}`}>
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </nav>
        <details className="lang">
          <summary>{LANG_LABELS[locale] ?? locale}</summary>
          <div className="lang-list">
            {contentLocales.map((l) => (
              <Link key={l} href={`/${l}`}>
                {LANG_LABELS[l] ?? l}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
