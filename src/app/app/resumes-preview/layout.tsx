import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import Document from "@/components/Document";
import { Providers } from "@/app/providers";
import bgPng from "@/assets/images/docs@tinypng.png";
import bgAvif from "@/assets/images/docs@30.avif";

type Props = {
  children: ReactNode;
  params: {
    locale: string;
  };
};

// export async function generateMetadata({
//   params: { locale },
// }: Props): Promise<Metadata> {
//   const t = await getTranslations({ locale, namespace: "common" });
//   return {
//     title: t("title") + " - " + t("dashboard"),
//   };
// }

export default async function LocaleLayout({ children }: Props) {
  const locale = await getLocale();

  const messages = await getMessages();

  console.log("resume preview LocaleLayout", locale);
  return (
    <Document locale={locale} bodyClassName="">
      <NextIntlClientProvider messages={messages}>
        <Providers>
          <div className="relative bg-gradient-to-b from-[#f8f9fb] to-white dark:from-gray-900 dark:to-gray-800">
            <div className="absolute z-0 top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none">
              <div className="w-[108rem] flex-none flex justify-end">
                <picture>
                  <source srcSet={bgAvif.src} type="image/avif" />
                  <img
                    src={bgPng.src}
                    alt=""
                    className="w-[71.75rem] flex-none max-w-none dark:hidden"
                    decoding="async"
                  />
                </picture>
              </div>
            </div>
            <main className="m-auto max-w-[1200px] px-4 py-8 flex justify-center">
              {children}
            </main>
          </div>
        </Providers>
      </NextIntlClientProvider>
    </Document>
  );
}
