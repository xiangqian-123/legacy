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
    title: s(lp.termsTitle, "Terms of Service"),
    description: s(lp.termsDescription, "Terms of service of this fan-made community wiki."),
    alternates: { canonical: `${siteConfig.siteUrl}/${params.locale}/terms` },
    robots: { index: false, follow: true },
  };
}

export default function TermsPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  return (
    <article className="guide">
      <header className="guide-header">
        <h1>Terms of Service</h1>
      </header>
      <div className="prose">
        <p>
          This fan-made community wiki is provided for informational purposes
          only. Guides and data are community-maintained and may contain
          inaccuracies.
        </p>
        <p>
          {"Resonance: A Plague Tale Legacy"} and all related trademarks are the property of{" "}
          {"Asobo Studio and Focus Entertainment"}.
          This site is not affiliated with or endorsed by {"Asobo Studio or Focus Entertainment"}.
        </p>
      </div>
    </article>
  );
}
