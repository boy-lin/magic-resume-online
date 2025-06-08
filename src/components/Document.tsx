import { Inter } from "next/font/google";
import { ReactNode } from "react";
import Head from "next/head";

const inter = Inter({
  subsets: ["latin"],
});

type Props = {
  children: ReactNode;
  locale: string;
  bodyClassName?: string;
};

export default function Document({ children, locale, bodyClassName }: Props) {
  return (
    <html className={inter.className} lang={locale} suppressHydrationWarning>
      {/* <Head>
        <link rel="icon" href="/favicon.ico?v=2" />
      </Head> */}
      <body className={bodyClassName}>{children}</body>
    </html>
  );
}
