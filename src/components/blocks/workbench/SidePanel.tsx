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
import { useResumeStore } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import { TransitionLeftToRight } from "@/components/transition/left-to-right";
import { sideSettings } from "@/constants/side";
import LetterText from "@/components/icon/letterText";
import BicepsFlexed from "@/components/icon/bicepsFlexed";

const iconMap = {
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
  const { updateMenuSections, addCustomData, activeResume } = useResumeStore();
  const menuSections = activeResume?.menuSections || [];
  console.log("SidePanel menuSections:", menuSections);

  // 确保 menuSections 是数组
  const safeMenuSections = Array.isArray(menuSections)
    ? menuSections
    : menuSections && typeof menuSections === "object"
    ? Object.values(menuSections)
    : [];
  const activeSection =
    typeof activeResume?.activeSection === "string"
      ? activeResume.activeSection
      : "";

  const t = useTranslations("workbench.sidePanel");

  const generateCustomSectionId = (menuSections: any[]) => {
    const customSections = menuSections.filter((s) =>
      s.id.startsWith("custom")
    );
    const nextNum = customSections.length + 1;
    return `custom-${nextNum}`;
  };

  // console.log("activeSection", activeSection);

  const onPointerLeave = (section) => {
    onItemPointerLeave(section);
  };

  const handleCreateSection = () => {
    const sectionId = generateCustomSectionId(safeMenuSections);
    const newSection = {
      id: sectionId,
      title: sectionId,
      enabled: true,
      order: safeMenuSections.length,
    };

    updateMenuSections([...safeMenuSections, newSection]);
    addCustomData(sectionId);
  };

  const renderIcon = (section) => {
    const Component = iconMap[section.id];
    if (Component) {
      return <Component />;
    }
    return section.icon || <SquareDashedKanban />;
  };
  console.log("activeSection:", activeSection, safeMenuSections);
  return (
    <TransitionLeftToRight
      className={cn("overflow-y-auto h-full bg-gray-100 py-2")}
    >
      <div className="space-y-2 flex flex-col items-center">
        {safeMenuSections.map((section: any) => (
          <button
            key={section.id}
            className={cn("flex flex-col gap-2 p-2 items-center w-[5em]")}
            onClick={() => toggleEditPanel(section)}
            onPointerEnter={() => onItemPointerEnter(section)}
            onPointerLeave={onPointerLeave}
            onPointerOut={() => {
              console.log("onPointerOut");
            }}
            onMouseLeave={() => {
              console.log("onMouseLeave");
            }}
            onMouseOut={() => {
              console.log("onMouseOut");
            }}
          >
            <span
              className={cn(
                "text-lg h-8 w-8 rounded-md hover:text-primary hover:bg-background hover:shadow",
                {
                  "bg-background shadow text-primary":
                    activeSection === section.id,
                }
              )}
            >
              {renderIcon(section)}
            </span>
            <span className="text-xs text-foreground break-all">
              {section.title}
            </span>
          </button>
        ))}
        <div className="border-t border-gray-200 w-4/5"></div>

        <motion.button
          onClick={handleCreateSection}
          className="flex flex-col gap-2 w-full p-2 items-center justify-center"
        >
          <span
            className={cn(
              "text-lg rounded-md hover:text-primary hover:bg-background hover:shadow"
            )}
          >
            <BadgePlus className="w-8 h-8" />
          </span>
          <div className="text-xs text-foreground">
            {t("layout.addCustomSection")}
          </div>
        </motion.button>

        <div className="border-t border-gray-200 w-4/5"></div>

        {sideSettings.map((item) => (
          <button
            key={item.id}
            className={cn(
              "w-full flex flex-col gap-2 p-2 items-center w-[5em]"
            )}
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
