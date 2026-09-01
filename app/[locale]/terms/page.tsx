import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/locales";

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
