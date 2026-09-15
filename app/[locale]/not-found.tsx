'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import enMsg from "@/i18n/messages/en.json";
import zhCNMsg from "@/i18n/messages/zh-CN.json";

// Next 14 的 not-found.tsx 不接收 params，locale 只能从路径解析。
// 文案直接引用 messages JSON（与 getMessages 同一事实源）；
// 回退链与 lib/locales.ts 的 UI_FALLBACK 一致：未知/其余语言 → en。
const MESSAGES: Record<string, typeof enMsg> = { en: enMsg, "zh-CN": zhCNMsg };

export default function NotFound() {
  const pathname = usePathname() ?? "";
  const locale = pathname.split("/")[1] ?? "";
  const nf = (MESSAGES[locale] ?? enMsg).notFound ?? {};
  const s = (v: unknown, fb: string): string => (typeof v === "string" ? v : fb);

  return (
    <main className="notfound">
      <span className="notfound-code">404</span>
      <h1>{s(nf.title, "Page not found")}</h1>
      <p>{s(nf.body, "The page you're looking for may have moved, or the link is misspelled.")}</p>
      <Link className="btn btn-primary" href={`/${locale || "zh-CN"}`}>
        {s(nf.cta, "Back to home")}
      </Link>
    </main>
  );
}
