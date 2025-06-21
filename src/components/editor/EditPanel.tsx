"use client";
import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useResumeStore } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import BasicPanel from "./basic/BasicPanel";
import EducationPanel from "./education/EducationPanel";
import ProjectPanel from "./project/ProjectPanel";
import ExperiencePanel from "./experience/ExperiencePanel";
import CustomPanel from "./custom/CustomPanel";
import SkillPanel from "./skills/SkillPanel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ColorSetting } from "./setting/Color";
import { TypographySetting } from "./setting/Typography";
import { ModeSetting } from "./setting/ModeSetting";
import { deleteDisabledList } from "@/constants/side";
import SwitchTemplate from "./setting/SwitchTemplate";
import SettingLayout from "./setting/Layout";

export function EditPanel({
  editPanelCollapsed,
  setEditPanelShow,
}: {
  editPanelCollapsed: boolean;
  setEditPanelShow: (show: boolean) => void;
}) {
  const { updateMenuSections, setActiveSection } = useResumeStore();
  const activeSection =
    useResumeStore((state) => state.activeResume.activeSection) || "";
  const menuSections =
    useResumeStore((state) => state.activeResume.menuSections) || [];
  const renderFields = () => {
    switch (activeSection) {
      case "basic":
        return <BasicPanel />;
      case "projects":
        return <ProjectPanel />;
      case "education":
        return <EducationPanel />;
      case "experience":
        return <ExperiencePanel />;
      case "skills":
        return <SkillPanel />;
      case "theme":
        return <ColorSetting />;
      case "typography":
        return <TypographySetting />;
      case "mode":
        return <ModeSetting />;
      case "switchTemplate":
        return <SwitchTemplate />;
      case "layout":
        return <SettingLayout />;
      default:
        if (activeSection?.startsWith("custom")) {
          return <CustomPanel sectionId={activeSection} />;
        } else {
          return <BasicPanel />;
        }
    }
  };

  const menu = menuSections?.find((s) => s.id === activeSection);

  const renderTitle = () => {
    if (!menu?.title && !menu?.icon) return null;

    return (
      <motion.div
        className={cn("mb-2 p-2 rounded-lg", "bg-white dark:bg-neutral-900/50")}
      >
        <div className="flex items-center gap-2">
          {deleteDisabledList.includes(activeSection) ? (
            <div>
              <span className="text-lg font-semibold">{menu?.title}</span>
            </div>
          ) : (
            <>
              <input
                className={cn(
                  "flex-1 text-lg  font-medium border-black  bg-transparent outline-none pb-1 "
                )}
                type="text"
                value={menu?.title || "未知标题"}
                onChange={(e) => {
                  const newMenuSections = menuSections.map((s) => {
                    if (s.id === activeSection) {
                      return {
                        ...s,
                        title: e.target.value,
                      };
                    }
                    return s;
                  });
                  updateMenuSections(newMenuSections);
                }}
              />
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger>
                    <Pencil size={16} className="text-primary" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>点击文字部分即可聚焦编辑</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  updateMenuSections(
                    menuSections.filter(
                      (section) => section.id !== activeSection
                    )
                  );
                  setActiveSection(
                    menuSections[
                      menuSections.findIndex((s) => s.id === activeSection) - 1
                    ].id
                  );
                }}
                className={cn(
                  "p-1.5 rounded-md text-primary",
                  "dark:hover:bg-neutral-700 dark:text-neutral-300",
                  "hover:bg-gray-100 text-gray-600"
                )}
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div
      className={cn(
        "h-full dark:bg-neutral-900 dark:border-r dark:border-neutral-800",
        { "rounded-lg shadow-lg overflow-hidden": editPanelCollapsed }
      )}
      onPointerEnter={() => {
        console.log("edit panel onPointerEnter");
        if (!editPanelCollapsed) return;
        setEditPanelShow(true);
      }}
      onPointerLeave={() => {
        console.log("edit panel onPointerLeave");
        if (!editPanelCollapsed) return;
        setEditPanelShow(false);
      }}
    >
      <motion.div
        className={cn(
          "w-full  h-full overflow-y-auto scrollbar-hidden",
          "bg-background"
        )}
      >
        <div className="p-2">
          {renderTitle()}
          <motion.div
            className={cn("rounded-lg", "dark:bg-neutral-900/50", "bg-white")}
          >
            {renderFields()}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
