"use client";
import { motion } from "framer-motion";
import {
  User,
  Projector,
  Palette,
  SquareDashedKanban,
  Zap,
  Plus,
  Briefcase,
  Book,
  PanelsLeftBottom,
  LayoutPanelLeft,
  BadgePlus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useResumeListStore, useResumeEditorStore } from "@/store/resume";
import { cn } from "@/lib/utils";
import { TransitionLeftToRight } from "@/components/transition/left-to-right";
import { sideSettings } from "@/constants/side";
import LetterText from "@/components/icon/letterText";
import BicepsFlexed from "@/components/icon/bicepsFlexed";

export const iconMap = {
  basic: User,
  education: Book,
  experience: Briefcase,
  projects: Projector,
  skills: BicepsFlexed,
  custom: Plus,
  switchTemplate: PanelsLeftBottom,
  layout: LayoutPanelLeft,
  theme: Palette,
  typography: LetterText,
  mode: Zap,
};

export function SidePanel({
  toggleEditPanel,
  onItemPointerEnter,
  onItemPointerLeave,
}: {
  toggleEditPanel: (section: any) => void;
  onItemPointerEnter: (section: any) => void;
  onItemPointerLeave: (section: any) => void;
}) {
  const { activeResume } = useResumeListStore();
  console.log("activeResume", activeResume);
  const templateId = activeResume?.templateId;

  const activeSection = activeResume?.activeSection || "";

  const t = useTranslations("workbench.sidePanel");

  // console.log("activeSection", activeSection);

  const onPointerLeave = (section) => {
    onItemPointerLeave(section);
  };

  const renderIcon = (section) => {
    const Component = iconMap[section.id];
    if (Component) {
      return <Component />;
    }
    return section.icon || <SquareDashedKanban />;
  };
  const customSection = {
    id: "basic",
    title: "简历",
    enabled: true,
    order: 0,
  };

  return (
    <TransitionLeftToRight
      className={cn("overflow-y-auto h-full bg-gray-100 py-2")}
    >
      <div className="space-y-2 flex flex-col items-center">
        <button
          className={cn("flex flex-col gap-2 p-2 items-center w-[5em]")}
          onClick={() => toggleEditPanel(customSection)}
          onPointerEnter={() => onItemPointerEnter(customSection)}
          onPointerLeave={onPointerLeave}
        >
          <span
            className={cn(
              "text-lg h-8 w-8 rounded-md hover:text-primary hover:bg-background hover:shadow",
              {
                "bg-background shadow text-primary":
                  activeSection === customSection.id,
              }
            )}
          >
            <User />
          </span>
          <span className="text-xs text-foreground break-all">
            {customSection.title}
          </span>
        </button>
        <div className="border-t border-gray-200 w-4/5"></div>

        <div className="border-t border-gray-200 w-4/5"></div>

        {sideSettings
          .filter((item) => !item.notSupportList?.includes(templateId))
          .map((item, index) => (
            <button
              key={item.id}
              className={cn("flex flex-col gap-2 p-2 items-center w-[5em]")}
              onClick={() => toggleEditPanel({ id: item.id })}
              onPointerEnter={() => onItemPointerEnter({ id: item.id })}
              onPointerLeave={onPointerLeave}
            >
              <span
                className={cn(
                  "text-lg h-8 w-8 rounded-md hover:text-primary hover:bg-background hover:shadow",
                  {
                    "bg-background shadow text-primary":
                      activeSection === item.id,
                  }
                )}
              >
                {renderIcon(item)}
              </span>
              <span className="text-xs text-foreground">
                {item.title || t(item.lang)}
              </span>
            </button>
          ))}
      </div>
    </TransitionLeftToRight>
  );
}
