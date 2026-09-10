import { notFound } from "next/navigation";
import { isValidLocale, locales } from "@/lib/locales";
import { getMessages } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import { getContentLocales } from "@/lib/posts";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
    <>
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
    </>
  );
}
