import React from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import LayoutSetting from "../layout/LayoutSetting";
import { useTranslations } from "next-intl";

export default function SettingLayout() {
  const {
    activeResume,
    updateMenuSections,
    setActiveSection,
    reorderSections,
    toggleSectionVisibility,
  } = useResumeStore();

  const t = useTranslations("workbench.sidePanel");

  if (!activeResume) return;

  const { activeSection = "", menuSections = [] } = activeResume || {};

  return (
    <div className="space-y-4 p-2">
      <h3 className={cn("dark:text-neutral-200", "text-gray-700")}>
        {t("layout.title")}
      </h3>
      <LayoutSetting
        menuSections={menuSections}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        toggleSectionVisibility={toggleSectionVisibility}
        updateMenuSections={updateMenuSections}
        reorderSections={reorderSections}
      />
    </div>
  );
}
