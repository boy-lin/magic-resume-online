import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Providers } from "@/app/providers";
import bgPng from "@/assets/images/docs@tinypng.png";
import bgAvif from "@/assets/images/docs@30.avif";
import { getLocale } from "next-intl/server";
import { getMessages } from "next-intl/server";

type Props = {
  children: ReactNode;
};

export default async function LocaleLayout({ children }: Props) {
  const locale = await getLocale();

  const messages = await getMessages();
  return (
    <html lang="en">
      <body>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <div className="bg-paper">
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
              <div className="min-h-dvh flex items-center justify-center p-6 lg:p-8">
                {children}
              </div>
            </div>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
