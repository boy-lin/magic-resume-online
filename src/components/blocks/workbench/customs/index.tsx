import {
  ScrollableTabs,
  ScrollableTabsTrigger,
} from "@/components/ui/scrollable-tabs";
import { useResumeListStore } from "@/store/resume";
import { useEffect, useState } from "react";
import { iconMap } from "../SidePanel";
import { SquarePlus, SquareDashedKanban } from "lucide-react";

import EducationPanel from "../editor/education/EducationPanel";
import ProjectPanel from "../editor/project/ProjectPanel";
import ExperiencePanel from "../editor/experience/ExperiencePanel";
import SkillPanel from "../editor/skills/SkillPanel";
import { ColorSetting } from "../editor/setting/Color";
import { TypographySetting } from "../editor/setting/Typography";
import { ModeSetting } from "../editor/setting/ModeSetting";
import SwitchTemplate from "../editor/setting/SwitchTemplate";
import SettingLayout from "../editor/setting/Layout";
import BasicPanel from "../editor/basic/BasicPanel";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useResumeEditorStore } from "@/store/resume";
import CustomPanel from "../editor/custom/CustomPanel";
import { UpsertSection } from "./upsert-section";
import TextareaPanel from "./section-panel/textarea";

export default function Customs() {
  const { activeResume } = useResumeListStore();
  const menuSections = activeResume?.menuSections || [];
  const [activeTab, setActiveTab] = useState("");
  const { updateMenuSections, updateSectionContentById } =
    useResumeEditorStore();
  const [open, setOpen] = useState(false);

  const handleDeleteSection = () => {
    const index = menuSections.findIndex((s) => s.id === activeTab);
    menuSections.splice(index, 1);
    updateMenuSections(menuSections);
    setActiveTab(menuSections[index - 1].id);
  };

  useEffect(() => {
    if (activeTab) return;
    console.log("menuSections", activeTab, menuSections);
    if (menuSections.length > 0) {
      setActiveTab(menuSections[0].id);
    }
  }, [menuSections]);

  const renderFields = (id) => {
    const currentSection = menuSections.find((s) => s.id === id);
    switch (id) {
      case "basic":
        return <BasicPanel id={id} />;
      case "projects":
        return <ProjectPanel id={id} />;
      case "education":
        return <EducationPanel id={id} />;
      case "experience":
        return <ExperiencePanel id={id} />;
      case "skills":
        return (
          <TextareaPanel
            id={id}
            content={currentSection?.content || ""}
            onChange={(value) => {
              updateSectionContentById(id, value);
            }}
            menuSections={menuSections}
            placeholder="描述你的技能、专长等..."
          />
        );
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
        return (
          // <TextareaPanel
          //   id={id}
          //   content={currentSection?.content || ""}
          //   menuSections={menuSections}
          //   placeholder=""
          //   onChange={(value) => {
          //     updateSectionContentById(id, value);
          //   }}
          // />
          <CustomPanel id={id} handleDeleteSection={handleDeleteSection} />
        );
    }
  };
  if (!menuSections) {
    return null;
  }

  return (
    <div className="h-full">
      <UpsertSection
        open={open}
        onOpenChange={setOpen}
        onSuccess={(section) => {
          setActiveTab(section.id);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />

      <div className="flex items-center justify-between px-2">
        <ScrollableTabs className="flex-1 min-w-0 mr-2">
          {menuSections.map((tab) => {
            return (
              <ScrollableTabsTrigger
                key={tab.id}
                value={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1"
              >
                {tab.title}
              </ScrollableTabsTrigger>
            );
          })}
        </ScrollableTabs>
        <motion.button
          onClick={() => setOpen(true)}
          className="flex-shrink-0 flex flex-col gap-2 items-center justify-center"
        >
          <span
            className={cn(
              "text-lg rounded-md hover:text-primary hover:bg-background hover:shadow"
            )}
          >
            <SquarePlus className="w-8 h-8" />
          </span>
        </motion.button>
      </div>

      <div className="flex-1">{renderFields(activeTab)}</div>
    </div>
  );
}
