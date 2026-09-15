import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isValidLocale } from "@/lib/locales";
import { getMessages } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

// noindex,follow + locale 正确的 title/description（不再继承中文默认值）。
export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const lp = (getMessages(params.locale).legalPages ?? {}) as Record<string, unknown>;
  const s = (v: unknown, fb: string): string => (typeof v === "string" ? v : fb);
  return {
    title: s(lp.privacyTitle, "Privacy Policy"),
    description: s(lp.privacyDescription, "Privacy policy of this fan-made community wiki."),
    alternates: { canonical: `${siteConfig.siteUrl}/${params.locale}/privacy` },
    robots: { index: false, follow: true },
  };
}

export default function PrivacyPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  return (
    <article className="guide">
      <header className="guide-header">
        <h1>Privacy Policy</h1>
      </header>
      <div className="prose">
        <p>
          This is a fan-made community wiki. We do not collect personal data
          beyond standard, anonymized analytics used to understand site traffic.
        </p>
        <p>
          {"Resonance: A Plague Tale Legacy"} and all related trademarks are the property of{" "}
          {"Asobo Studio and Focus Entertainment"}.
          This site is not affiliated with {"Asobo Studio or Focus Entertainment"}.
        </p>
      </div>
    </article>
  );
}
