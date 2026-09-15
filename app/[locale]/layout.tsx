import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isValidLocale, locales } from "@/lib/locales";
import { getMessages } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import { getContentLocales } from "@/lib/posts";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 站点级默认 metadata（原 app/layout.tsx 的职责）。
// 按 locale 取 messages.meta，避免英文页面继承中文默认 Title/Description。
export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const meta = (getMessages(params.locale).meta ?? {}) as Record<string, unknown>;
  const s = (v: unknown, fb: string): string => (typeof v === "string" ? v : fb);
  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: {
      default: s(meta.title, siteConfig.defaultTitle),
      template: `%s | ${siteConfig.siteName}`,
    },
    description: s(meta.description, siteConfig.defaultDescription),
    openGraph: {
      type: "website",
      siteName: siteConfig.siteName,
      url: siteConfig.siteUrl,
      title: s(meta.title, siteConfig.defaultTitle),
      description: s(meta.description, siteConfig.defaultDescription),
    },
    twitter: {
      card: "summary_large_image",
      title: s(meta.title, siteConfig.defaultTitle),
      description: s(meta.description, siteConfig.defaultDescription),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// 路由级根布局：html lang 按 locale 动态输出（/en → en，/zh-CN → zh-CN …）。
export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) notFound();
  const messages = getMessages(params.locale);

  return (
    <html lang={params.locale}>
      <body>
        <GoogleAnalytics gaId={siteConfig.gaId} />
        <Nav
          locale={params.locale}
          contentLocales={getContentLocales()}
          messages={messages}
        />
        <main>{children}</main>
        <Footer
          locale={params.locale}
          messages={messages}
          siteUrl={siteConfig.siteUrl}
        />
      </body>
    </html>
  );
}
