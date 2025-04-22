"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function LocaleLayout({ children }) {
  const router = useRouter();
  const t = useTranslations();

  return (
    <div className="self-start">
      <div className="mb-10 flex items-center justify-between relative">
        <Button
          onClick={() => router.back()}
          className="flex items-center gap-2"
          variant="secondary"
        >
          <ArrowLeft className="h-5 w-5 text-letter" />
        </Button>
        <h1 className="text-xl text-letter-head">
          {t("account.setting.title")}
        </h1>
        <div></div>
      </div>
      <main className="min-w-[620px]">{children}</main>
    </div>
  );
}
