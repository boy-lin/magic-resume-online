"use client";
import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useResumeListStore, useResumeEditorStore } from "@/store/resume";
import { cn } from "@/lib/utils";
import BasicPanel from "./editor/basic/BasicPanel";
import EducationPanel from "./editor/education/EducationPanel";
import ProjectPanel from "./editor/project/ProjectPanel";
import ExperiencePanel from "./editor/experience/ExperiencePanel";
import CustomList from "./customs";
import SkillPanel from "./editor/skills/SkillPanel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { ColorSetting } from "./editor/setting/Color";
import { TypographySetting } from "./editor/setting/Typography";
import { ModeSetting } from "./editor/setting/ModeSetting";
import { deleteDisabledList } from "@/constants/side";
import SwitchTemplate from "./editor/setting/SwitchTemplate";
import SettingLayout from "./editor/setting/Layout";

export function EditPanel({
  editPanelCollapsed,
  setEditPanelShow,
}: {
  editPanelCollapsed: boolean;
  setEditPanelShow: (show: boolean) => void;
}) {
  const { updateMenuSections } = useResumeEditorStore();
  const { setActiveSection } = useResumeEditorStore();
  const { activeResume } = useResumeListStore();
  const activeSection =
    typeof activeResume?.activeSection === "string"
      ? activeResume.activeSection
      : "";
  const menuSections = activeResume?.menuSections;

  const renderFields = () => {
    switch (activeSection) {
      case "basic":
        return <CustomList />;
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
        return <div>activeSection is not found</div>;
    }
  };

  const menu = menuSections.find((s) => s.id === activeSection);

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
          "bg-background py-2 px-3"
        )}
      >
        {renderFields()}
      </motion.div>
    </div>
  );
}
