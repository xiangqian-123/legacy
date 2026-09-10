'use client';

import Link from "next/link";
import { useState } from "react";
import { locales } from "@/lib/locales";
import { siteConfig } from "@/lib/site";

type NavLink = { label: string; slug: string };

// 14 章（slug 对应 content/guides 下的 mdx 文件名）
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

type NavItem = {
  label: string;
  href?: string; // 直接链接（无下拉）
  children?: NavLink[]; // 下拉项
  grandTitle?: string; // 二级标题（如「所有章节」）
  grand?: NavLink[]; // 二级项
};

const NAV: NavItem[] = [
  {
    label: "攻略",
    children: [
      { label: "完整流程攻略", slug: "chapters" },
      { label: "新手攻略", slug: "beginner" },
    ],
    grandTitle: "所有章节",
    grand: CHAPTERS,
  },
  {
    label: "全收集",
    children: [
      { label: "共鸣点数 Resonance Points", slug: "resonance-points" },
      { label: "刀剑 Blades", slug: "blades" },
      { label: "遗物 Artefacts", slug: "artefacts" },
      { label: "护符 Charms", slug: "charms" },
      { label: "忒修斯回响 Theseus Echoes", slug: "theseus-echoes" },
    ],
  },
  { label: "谜题", href: "puzzles" },
  { label: "奖杯成就", href: "achievements" },
  { label: "技能", href: "skills" },
  {
    label: "剧情",
    children: [
      { label: "剧情解析", slug: "story" },
      { label: "结局解释", slug: "ending" },
      { label: "Sophia", slug: "sophia" },
    ],
  },
  {
    label: "更多",
    children: [
      { label: "常见问题", slug: "faq" },
      { label: "游戏信息", slug: "wiki" },
      { label: "语言支持", slug: "chinese" },
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

export default function Nav({ locale }: { locale: string }) {
  const [hover, setHover] = useState<string | null>(null); // 桌面 hover
  const [mobileOpen, setMobileOpen] = useState<string | null>(null); // 移动端点击

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href={`/${locale}`} className="nav-logo">
          <span className="dot" />
          {siteConfig.siteName}
        </Link>
        <nav className="nav-links">
          {NAV.map((item) => {
            // 直接链接（无下拉）
            if (item.href && !item.children) {
              return (
                <Link
                  key={item.label}
                  className="nav-link"
                  href={`/${locale}/guide/${item.href}`}
                >
                  {item.label}
                </Link>
              );
            }
            const isOpen = hover === item.label || mobileOpen === item.label;
            return (
              <div
                key={item.label}
                className="nav-item"
                onMouseEnter={() => setHover(item.label)}
                onMouseLeave={() => setHover(null)}
              >
                <button
                  type="button"
                  className="nav-item-btn"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setMobileOpen(mobileOpen === item.label ? null : item.label)
                  }
                >
                  {item.label}
                  <span className="caret" aria-hidden>
                    ▾
                  </span>
                </button>
                <div className={`nav-dropdown${isOpen ? " open" : ""}`}>
                  {item.children?.map((c) => (
                    <Link key={c.slug} href={`/${locale}/guide/${c.slug}`}>
                      {c.label}
                    </Link>
                  ))}
                  {item.grand && (
                    <div className="nav-sub">
                      <span className="nav-sub-title">{item.grandTitle}</span>
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
            {locales.map((l) => (
              <Link key={l} href={`/${l}`}>
                {LANG_LABELS[l]}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
