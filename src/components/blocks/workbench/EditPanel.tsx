"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import BasicList from "./customs";
import { ColorSetting } from "./editor/setting/Color";
import { TypographySetting } from "./editor/setting/Typography";
import { ModeSetting } from "./editor/setting/ModeSetting";
import SwitchTemplate from "./editor/setting/SwitchTemplate";
import SettingLayout from "./editor/setting/Layout";

export function EditPanel({
  editPanelCollapsed,
  setEditPanelShow,
  activeSection,
}: {
  editPanelCollapsed: boolean;
  setEditPanelShow: (show: boolean) => void;
  activeSection: string;
}) {
  const renderFields = () => {
    switch (activeSection) {
      case "basic":
        return <BasicList />;
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

  return (
    <div
      className={cn(
        "h-full dark:bg-neutral-900 dark:border-r dark:border-neutral-800",
        { "rounded-lg shadow-lg overflow-hidden": editPanelCollapsed }
      )}
      onPointerEnter={() => {
        if (!editPanelCollapsed) return;
        setEditPanelShow(true);
      }}
      onPointerLeave={() => {
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
