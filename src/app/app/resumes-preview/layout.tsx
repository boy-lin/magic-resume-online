import { ReactNode } from "react";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import Document from "@/components/Document";
import { Providers } from "@/app/providers";

type Props = {
  children: ReactNode;
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    title: t("title") + " - " + t("dashboard"),
  };
}

export default async function LocaleLayout({ children }: Props) {
  const locale = await getLocale();

  const messages = await getMessages();

  return (
    <Document locale={locale} bodyClassName="">
      <NextIntlClientProvider messages={messages}>
        <Providers>
          <div className="relative bg-gradient-to-b from-[#f8f9fb] to-white dark:from-gray-900 dark:to-gray-800">
            <main className="m-auto max-w-[1200px] px-4 py-8">{children}</main>
          </div>
        </Providers>
      </NextIntlClientProvider>
    </Document>
  );
}
