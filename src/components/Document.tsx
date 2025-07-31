import { ReactNode } from "react";
import Head from "next/head";

type Props = {
  children: ReactNode;
  locale: string;
  bodyClassName?: string;
};

export default function Document({ children, locale, bodyClassName }: Props) {
  return (
    <html lang={locale} suppressHydrationWarning>
      {/* <Head>
        <link rel="icon" href="/favicon.ico?v=2" />
      </Head> */}
      <body className={bodyClassName}>{children}</body>
    </html>
  );
}
