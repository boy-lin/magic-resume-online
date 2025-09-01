"use client";
import { cn } from "@/lib/utils";
import { Reorder } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import ExperienceItem from "./ExperienceItem";
import { Experience } from "@/types/resume";
import { useResumeListStore, useResumeEditorStore } from "@/store/resume";
import { generateUUID } from "@/utils/uuid";
import { useState } from "react";
import { InputName } from "../basic/input-name";

const ExperiencePanel = ({ id }: { id: string }) => {
  const t = useTranslations("workbench.experiencePanel");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { activeResume } = useResumeListStore();
  const { updateExperience, updateExperienceBatch, updateMenuSections } =
    useResumeEditorStore();
  const { experience = [], menuSections = [] } = activeResume || {};
  const handleCreateProject = () => {
    const newProject: Experience = {
      id: generateUUID(),
      company: t("defaultProject.company"),
      position: t("defaultProject.position"),
      date: t("defaultProject.date"),
      details: t("defaultProject.details"),
      visible: true,
    };
    updateExperience(newProject);
  };

  const handleTitleChange = (title: string) => {
    updateMenuSections(
      menuSections.map((s) => {
        if (s.id === id) {
          return { ...s, title };
        }
        return s;
      })
    );
  };

  return (
    <div
      className={cn(
        "space-y-4 p-2 rounded-lg",
        "bg-white dark:bg-neutral-900/30"
      )}
    >
      <div className="space-y-2">
        <InputName
          value={menuSections.find((s) => s.id === id)?.title || ""}
          onChange={handleTitleChange}
        />
      </div>
      <div className="space-y-2">
        <Reorder.Group
          axis="y"
          values={Array.isArray(experience) ? experience : []}
          onReorder={(newOrder) => {
            updateExperienceBatch(newOrder);
          }}
          className="space-y-3"
        >
          {(Array.isArray(experience) ? experience : []).map((item) => (
            <ExperienceItem
              key={item.id}
              experience={item}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
            />
          ))}

          <Button onClick={handleCreateProject} className="w-full">
            <PlusCircle className="w-4 h-4 mr-2" />
            {t("addButton")}
          </Button>
        </Reorder.Group>
      </div>
    </div>
  );
};

export default ExperiencePanel;
