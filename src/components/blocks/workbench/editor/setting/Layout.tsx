import React from "react";

import { cn } from "@/lib/utils";
import LayoutSetting from "../layout/LayoutSetting";
import { useTranslations } from "next-intl";

export default function SettingLayout() {
  const t = useTranslations("workbench.sidePanel");

  return (
    <div className="space-y-4 p-2">
      <h3 className={cn("dark:text-neutral-200", "text-gray-700")}>
        {t("layout.title")}
      </h3>
      <LayoutSetting />
    </div>
  );
}
