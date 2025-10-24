import React from "react";
import { useResumeListStore } from "@/store/resume/useResumeListStore";
import { useResumeEditorStore } from "@/store/resume/useResumeEditorStore";

import { cn } from "@/lib/utils";
import LayoutSetting from "../layout/LayoutSetting";
import { useTranslations } from "next-intl";

export default function SettingLayout() {
  const { activeResume } = useResumeListStore();
  const {
    updateMenuSections,
    setActiveSection,
    reorderSections,
    toggleSectionVisibility,
  } = useResumeEditorStore();

  const t = useTranslations("workbench.sidePanel");

  if (!activeResume) return;

  const { activeSection: rawActiveSection = "", menuSections } =
    activeResume || {};

  // 确保 activeSection 是字符串
  const activeSection =
    typeof rawActiveSection === "string" ? rawActiveSection : "";

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
