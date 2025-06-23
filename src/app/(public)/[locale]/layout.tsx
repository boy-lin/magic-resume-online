import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
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

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  setRequestLocale(locale);

  if (!locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages();

  console.log("aa LocaleLayout", locale);

  return (
    <Document locale={locale}>
      <NextIntlClientProvider messages={messages}>
        <Providers>
          <div className="relative bg-gradient-to-b from-[#f8f9fb] to-white dark:from-gray-900 dark:to-gray-800">
            <LandingHeader />
            <main className="px-4 pt-16">{children}</main>
            <Footer />
          </div>
        </Providers>
      </NextIntlClientProvider>
    </Document>
  );
}
