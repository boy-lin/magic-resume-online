import {
  ScrollableTabs,
  ScrollableTabsTrigger,
} from "@/components/ui/scrollable-tabs";
import { useResumeListStore } from "@/store/resume/useResumeListStore";
import { useEffect, useState } from "react";
import { SquarePlus } from "lucide-react";

import EducationPanel from "../editor/education/EducationPanel";
import ProjectPanel from "../editor/project/ProjectPanel";
import ExperiencePanel from "../editor/experience/ExperiencePanel";
import { ColorSetting } from "../editor/setting/Color";
import { TypographySetting } from "../editor/setting/Typography";
import { ModeSetting } from "../editor/setting/ModeSetting";
import SwitchTemplate from "../editor/setting/SwitchTemplate";
import SettingLayout from "../editor/setting/Layout";
import BasicPanel from "../editor/basic/BasicPanel";
import { useResumeEditorStore } from "@/store/resume/useResumeEditorStore";
import CustomPanel from "../editor/custom/CustomPanel";
import { UpsertSection } from "./upsert-section";
import TextareaPanel from "./section-panel/textarea";
import { ResumeSection } from "@/types/resume";

export default function Customs() {
  const { activeResume } = useResumeListStore();
  const menuSections = activeResume?.menuSections || [];
  const [activeTab, setActiveTab] = useState<string>("");
  const { updateMenuSections } = useResumeEditorStore();
  const [open, setOpen] = useState(false);

  const handleDeleteSection = () => {
    const index = menuSections.findIndex((it) => it.id === activeTab);
    menuSections.splice(index, 1);
    updateMenuSections(menuSections);
    setActiveTab(menuSections[index - 1].id);
  };

  useEffect(() => {
    if (activeTab) return;
    if (menuSections.length > 0) {
      setActiveTab(menuSections[0].id);
    }
  }, [menuSections]);

  const renderFields = (section: ResumeSection) => {
    switch (section.id) {
      case "basic":
        return <BasicPanel section={section} />;
      case "projects":
        return <ProjectPanel section={section} />;
      case "education":
        return <EducationPanel section={section} />;
      case "experience":
        return <ExperiencePanel section={section} />;
      case "introduction":
      case "skills":
        return (
          <TextareaPanel
            id={section.id}
            section={section}
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
          <CustomPanel
            id={section.id}
            section={section}
            handleDeleteSection={handleDeleteSection}
          />
        );
    }
  };
  if (!menuSections || !activeTab) {
    return null;
  }

  const activeSection = menuSections.find((it) => it.id === activeTab) || null;

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
        <div className="flex-shrink-0 flex flex-col gap-2 items-center justify-center">
          <button
            onClick={() => setOpen(true)}
            className="flex-shrink-0 flex flex-col gap-2 items-center justify-center"
          >
            <SquarePlus className="text-2xl rounded-md hover:text-primary hover:bg-background hover:shadow w-[1em] h-[1em]" />
          </button>
        </div>
      </div>

      <div className="flex-1">{renderFields(activeSection)}</div>
    </div>
  );
}
