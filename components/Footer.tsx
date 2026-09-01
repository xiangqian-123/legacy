import Link from "next/link";

function s(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

export default function Footer({
  locale,
  messages,
  siteUrl,
}: {
  locale: string;
  messages: Record<string, unknown>;
  siteUrl: string;
}) {
  const footer = (messages.footer ?? {}) as Record<string, unknown>;
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h4>{s(footer.aboutTitle, "GameName Wiki")}</h4>
          <p>{s(footer.about)}</p>
        </div>
        <div>
          <h4>{s(footer.playGame, "Play")}</h4>
          <a
            href="https://store.steampowered.com/app/2713000/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {s(footer.playGame)}
          </a>
          <a
            href="https://www.focus-entmt.com/en/games/resonance-a-plague-tale-legacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            {s(footer.officialSite, "Official Site")}
          </a>
        </div>
        <div>
          <h4>{s(footer.community, "Community")}</h4>
          <a href="https://www.reddit.com/r/APlagueTale/" target="_blank" rel="noopener noreferrer">
            {s(footer.communityTool, "Community")}
          </a>
          <a
            href="https://www.youtube.com/watch?v=ULLFxFm6vvk"
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube
          </a>
        </div>
        <div>
          <h4>{s(footer.legal, "Legal")}</h4>
          <Link href={`/${locale}/privacy`}>{s(footer.privacyPolicy, "Privacy Policy")}</Link>
          <Link href={`/${locale}/terms`}>{s(footer.termsOfService, "Terms of Service")}</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} {s(footer.aboutTitle, "GameName Wiki")} · {s(footer.disclaimer)}
      </div>
    </footer>
  );
}
