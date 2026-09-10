'use client';

import Link from "next/link";
import { useMemo, useState } from "react";

export type SearchItem = { title: string; slug: string; eyebrow: string };

// 搜索优先级（第6步）：puzzle > walkthrough > collectible > trophy > skill > story
// eyebrow 是本地化的（中/英），这里同时匹配中英关键词。
function categoryOf(eyebrow: string): number {
  if (/谜题|puzzle/i.test(eyebrow)) return 1;
  if (/章节|攻略|流程|新手|walkthrough|chapter|guide|beginner/i.test(eyebrow)) return 2;
  if (/收集|刀剑|护符|文物|共鸣|回声|点数|collectible|blade|charm|artefact|resonance|echo/i.test(eyebrow)) return 3;
  if (/成就|奖杯|achievement|trophy/i.test(eyebrow)) return 4;
  if (/技能|加点|build|skill/i.test(eyebrow)) return 5;
  if (/剧情|结局|角色|故事|story|ending|character/i.test(eyebrow)) return 6;
  return 7;
}

export default function Search({
  locale,
  items,
  placeholder,
  emptyText,
  ariaLabel,
}: {
  locale: string;
  items: SearchItem[];
  placeholder: string;
  emptyText: string;
  ariaLabel: string;
}) {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return items
      .map((it) => {
        const hay = `${it.title} ${it.eyebrow} ${it.slug}`.toLowerCase();
        const score = hay.includes(query)
          ? hay.indexOf(query) === 0
            ? 0 // 标题开头命中，最相关
            : 1
          : 99;
        return { ...it, score, cat: categoryOf(it.eyebrow) };
      })
      .filter((r) => r.score < 99)
      .sort((a, b) => a.cat - b.cat || a.score - b.score)
      .slice(0, 8);
  }, [q, items]);

  return (
    <div className="search">
      <input
        type="search"
        className="search-input"
        placeholder={placeholder}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        aria-label={ariaLabel}
      />
      {focused && results.length > 0 && (
        <div className="search-results">
          {results.map((r) => (
            <Link
              key={r.slug}
              href={`/${locale}/guide/${r.slug}`}
              className="search-result"
            >
              <span className="search-result-title">{r.title}</span>
              <span className="search-result-eyebrow">{r.eyebrow}</span>
            </Link>
          ))}
        </div>
      )}
      {focused && q.trim() && results.length === 0 && (
        <div className="search-results">
          <div className="search-empty">{emptyText}</div>
        </div>
      )}
    </div>
  );
}
