"use client";
import { cn } from "@/lib/utils";
import { Reorder } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import ExperienceItem from "./ExperienceItem";
import { ResumeSection, ResumeSectionContent } from "@/types/resume";
import { useResumeEditorStore } from "@/store/resume/useResumeEditorStore";

import { generateUUID } from "@/utils/uuid";
import { useState } from "react";
import { InputName } from "../basic/input-name";

const ExperiencePanel = ({
  id,
  section,
}: {
  id: string;
  section: ResumeSection;
}) => {
  const t = useTranslations("workbench.experiencePanel");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { updateSectionExperience } = useResumeEditorStore();
  const updateSectionExperienceContent = (item) => {
    updateSectionExperience({
      ...section,
      content: section.content.map((c) =>
        c.id !== item.id ? c : { ...c, ...item }
      ),
    });
  };

  const addSectionExperience = (item: ResumeSectionContent) => {
    updateSectionExperience({
      ...section,
      content: [...section.content, item],
    });
  };

  const deleteExperience = () => {
    updateSectionExperience({
      ...section,
      content: section.content.filter((c) => c.id !== id),
    });
  };
  const handleCreateProject = () => {
    const newProject: ResumeSectionContent = {
      id: generateUUID(),
      type: "project",
      value: "xxxx",
      fields: [
        {
          id: "position",
          type: "text",
          value: "前端负责人",
        },
        {
          id: "date",
          type: "text",
          value: "2022/6 - 2023/12",
        },
        {
          id: "description",
          type: "textarea",
          value: ``,
        },
      ],
    };
    addSectionExperience(newProject);
  };

  return (
    <div
      className={cn(
        "space-y-4 p-2 rounded-lg",
        "bg-white dark:bg-neutral-900/30"
      )}
    >
      <div className="space-y-2 text-center text-2xl">
        <InputName
          value={section?.title || ""}
          onChange={(value) => {
            updateSectionExperience({
              ...section,
              title: value,
            });
          }}
        />
      </div>
      <div className="space-y-2">
        <Reorder.Group
          axis="y"
          values={section.content}
          onReorder={(vals) => {
            updateSectionExperience({
              ...section,
              content: vals,
            });
          }}
          className="space-y-3"
        >
          {section.content.map((item) => (
            <ExperienceItem
              key={item.id}
              experience={item}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              deleteExperience={deleteExperience}
              updateSectionExperience={updateSectionExperience}
              updateSectionExperienceContent={updateSectionExperienceContent}
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
