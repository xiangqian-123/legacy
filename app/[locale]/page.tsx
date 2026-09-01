import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/locales";
import { getMessages } from "@/lib/i18n";

type Card = { title: string; desc: string; slug: string; img?: string };
type Fact = { label: string; value: string };

// 卡片配图（对应各页面的 hero 图），让卡片与白底形成反差。
// 换成新游戏的截图路径（放 public/images/guides/ 下）。
const CARD_IMAGES: Record<string, string> = {
  beginner: "/images/guides/beginner.jpg",
  sophia: "/images/guides/sophia.jpg",
  charms: "/images/guides/charms.jpg",
  skills: "/images/guides/skills.jpg",
};

// 首页主视觉海报图（用官方截图，避免与内容页重复）。
const HERO_IMG = "/images/guides/hero.jpg";
// "What is GameName" 区块左侧配图。
const ABOUT_IMG = "/images/guides/about.jpg";

// 官方发售预告片（Gamescom 2026 Opening Night Live 首映）。
const TRAILER_ID = "ULLFxFm6vvk";

function t(messages: Record<string, unknown>, path: string, fb = ""): string {
  const v = path
    .split(".")
    .reduce<unknown>(
      (cur, k) =>
        cur && typeof cur === "object"
          ? (cur as Record<string, unknown>)[k]
          : undefined,
      messages
    );
  return typeof v === "string" ? v : fb;
}

function arr(messages: Record<string, unknown>, path: string): string[] {
  const v = path
    .split(".")
    .reduce<unknown>(
      (cur, k) =>
        cur && typeof cur === "object"
          ? (cur as Record<string, unknown>)[k]
          : undefined,
      messages
    );
  return Array.isArray(v) ? (v as string[]) : [];
}

export default function HomePage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const m = getMessages(params.locale);
  const locale = params.locale;

  const stats = arr(m, "hero.stats");
  const cards =
    ((m.startHere as { cards?: Card[] } | undefined)?.cards) ?? [];
  const facts =
    ((m.about as { facts?: Fact[] } | undefined)?.facts) ?? [];
  const paragraphs = arr(m, "about.paragraphs");

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">{t(m, "hero.eyebrow", "Fan-Made Community Wiki")}</span>
            <h1>{t(m, "hero.title", "GameName")}</h1>
            <p className="desc">{t(m, "hero.description")}</p>
            <div className="hero-stats">
              {stats.map((s, i) => (
                <span className="stat" key={i}>
                  {s}
                </span>
              ))}
            </div>
            <div className="hero-actions">
              <Link className="btn btn-primary" href={`/${locale}/guide/beginner`}>
                {t(m, "hero.ctaPrimary", "Start Beginner Guide")}
              </Link>
              <Link className="btn btn-ghost" href={`/${locale}/guide/reviews`}>
                {t(m, "hero.ctaSecondary", "Read Reviews")}
              </Link>
              <a
                className="btn btn-ghost"
                href={`https://www.youtube.com/watch?v=${TRAILER_ID}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(m, "hero.ctaThird", "Watch Launch Trailer")}
              </a>
            </div>
          </div>
          <div className="hero-art">
            <img src={HERO_IMG} alt="Resonance: A Plague Tale Legacy 游戏主视觉" />
          </div>
        </div>
      </section>

      {/* Start Here 卡片 */}
      <section className="section">
        <div className="container">
          <h2>{t(m, "startHere.title", "Start Here")}</h2>
          <p className="lead">{t(m, "startHere.lead")}</p>
          <div className="cards">
            {cards.map((c, i) => (
              <Link
                key={c.slug}
                className="card"
                href={`/${locale}/guide/${c.slug}`}
              >
                <div
                  className="card-img"
                  style={{
                    backgroundImage: `url(${CARD_IMAGES[c.slug] ?? c.img ?? ""})`,
                  }}
                />
                <div className="card-body">
                  <h3>
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    {c.title}
                  </h3>
                  <p>{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What is GameName */}
      <section className="section section-alt">
        <div className="container about-grid">
          <div className="about-art">
            <img src={ABOUT_IMG} alt="Resonance: A Plague Tale Legacy 中的角色" />
          </div>
          <div className="about-copy">
            <h2>{t(m, "about.title", "What is GameName")}</h2>
            {paragraphs.map((p, i) => (
              <p className="lead" key={i}>
                {p}
              </p>
            ))}
            <table className="fact-table">
              <tbody>
                {facts.map((f) => (
                  <tr key={f.label}>
                    <th>{f.label}</th>
                    <td>{f.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Official Trailer */}
      <section className="section">
        <div className="container">
          <h2>{t(m, "trailer.title", "Official Trailer")}</h2>
          <p className="lead">{t(m, "trailer.lead")}</p>
          <div className="video">
            <iframe
              src={`https://www.youtube.com/embed/${TRAILER_ID}`}
              title="Resonance: A Plague Tale Legacy Official Launch Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta">
        <div className="container">
          <h2>{t(m, "cta.title", "Ready to Master GameName?")}</h2>
          <p>{t(m, "cta.description")}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href={`/${locale}/guide/beginner`}>
              {t(m, "cta.primary", "Read the Beginner Guide")}
            </Link>
            <a
              className="btn btn-ghost"
              href="https://store.steampowered.com/app/2713000/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(m, "cta.secondary", "Play on Steam")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
