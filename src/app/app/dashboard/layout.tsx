import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import Document from "@/components/Document";
import { Providers } from "@/app/providers";

import SidebarLeft from "./sidebar-left";

type Props = {
  children: ReactNode;
  params: {
    locale: string;
  };
};

export default async function LocaleLayout({ children }: Props) {
  const locale = await getLocale();
  const messages = await getMessages();
  // console.log("dashboard LocaleLayout", locale);
  return (
    <Document locale={locale}>
      <NextIntlClientProvider messages={messages}>
        <Providers>
          <SidebarLeft>{children}</SidebarLeft>
        </Providers>
      </NextIntlClientProvider>
    </Document>
  );
}
