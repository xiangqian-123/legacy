import Link from "next/link";
import { locales } from "@/lib/locales";
import { siteConfig } from "@/lib/site";

// 导航链接：换成新游戏的核心栏目（slug 对应 content/guides 下的 mdx 文件名）。
const NAV_LINKS = [
  { slug: "beginner", key: "nav.beginner" },
  { slug: "sophia", key: "nav.sophia" },
  { slug: "charms", key: "nav.charms" },
  { slug: "skills", key: "nav.skills" },
  { slug: "story", key: "nav.story" },
  { slug: "faq", key: "nav.faq" },
];

const LANG_LABELS: Record<string, string> = {
  "zh-CN": "中文",
  "zh-TW": "繁體",
  en: "EN",
  ja: "日本語",
  ru: "РУ",
  de: "DE",
};

function t(messages: Record<string, unknown>, key: string, fallback: string) {
  const parts = key.split(".");
  let cur: unknown = messages;
  for (const p of parts) {
    if (cur && typeof cur === "object") cur = (cur as Record<string, unknown>)[p];
    else return fallback;
  }
  return typeof cur === "string" ? cur : fallback;
}

export default function Nav({
  locale,
  messages,
}: {
  locale: string;
  messages: Record<string, unknown>;
}) {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href={`/${locale}`} className="nav-logo">
          <span className="dot" />
          {siteConfig.siteName}
        </Link>
        <nav className="nav-links">
          {NAV_LINKS.map((l) => (
            <Link key={l.slug} href={`/${locale}/guide/${l.slug}`}>
              {t(messages, l.key, l.slug)}
            </Link>
          ))}
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
        </nav>
      </div>
    </header>
  );
}
