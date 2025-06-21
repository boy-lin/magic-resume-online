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

  // console.log("workbench LocaleLayout", locale);
  return (
    <Document locale={locale} bodyClassName="overflow-y-hidden">
      <NextIntlClientProvider messages={messages}>
        <Providers>{children}</Providers>
      </NextIntlClientProvider>
    </Document>
  );
}
