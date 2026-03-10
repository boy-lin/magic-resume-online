import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import LayoutHeader from "@/components/dashboard/LayoutHeader";
import SidebarLeft from "@/components/dashboard/SidebarLeft";

import Document from "@/components/Document";
import { Providers } from "@/app/providers";

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
          <div className="flex flex-col h-screen bg-background">
            {/* 顶部Header */}
            <LayoutHeader />

            {/* 主要内容区域 */}
            <main className="flex-1 flex overflow-hidden">
              {/* 侧边栏 */}
              <SidebarLeft />

              {/* 主内容区域 */}
              <div className="flex-1 overflow-auto">
                <div className="p-4 min-h-full">{children}</div>
              </div>
            </main>
          </div>
        </Providers>
      </NextIntlClientProvider>
    </Document>
  );
}
