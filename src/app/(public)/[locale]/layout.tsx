import { ReactNode } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import Document from "@/components/Document";
import { locales } from "@/i18n/config";
import { Providers } from "@/app/providers";
import LandingHeader from "@/components/home/LandingHeader";
import Footer from "@/components/home/Footer";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "common" });
  const baseUrl = "https://magicv.art";

  return {
    title: t("title") + " - " + t("subtitle"),
    description: t("description"),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale,
      alternateLocale: locale === "en" ? ["zh"] : ["en"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  setRequestLocale(locale);

  console.log("LocaleLayout", locale);

  if (!locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages();
  return (
    <Document locale={locale}>
      <NextIntlClientProvider messages={messages}>
        <Providers>
          <div className="relative bg-gradient-to-b from-[#f8f9fb] to-white dark:from-gray-900 dark:to-gray-800">
            {/* {children} */}
            <LandingHeader showLanguage={true} />
            <main className="m-auto max-w-[1200px] px-4 pt-16">{children}</main>
            <Footer />
          </div>
        </Providers>
      </NextIntlClientProvider>
    </Document>
  );
}
