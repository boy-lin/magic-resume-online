"use client";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/resume/useResumeStore";

import { Reorder } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import EducationItem from "./EducationItem";
import { ResumeSection } from "@/types/resume";
import { generateUUID } from "@/utils/uuid";
import { InputName } from "../basic/input-name";
import { educationContentDefault } from "@/config";

const EducationPanel = ({ section }: { section: ResumeSection }) => {
  const t = useTranslations("workbench.educationPanel");
  const { updateSectionEducation } = useResumeStore();

  const updateSectionEducationContent = (item) => {
    updateSectionEducation({
      ...section,
      content: section.content.map((c) =>
        c.id !== item.id ? c : { ...c, ...item }
      ),
    });
  };

  const addSectionEducation = (item) => {
    updateSectionEducation({
      ...section,
      content: [...section.content, item],
    });
  };

  const deleteSectionEducation = (id: string) => {
    updateSectionEducation({
      ...section,
      content: section.content.filter((c) => c.id !== id),
    });
  };

  const handleCreateProject = () => {
    addSectionEducation({
      ...educationContentDefault,
      id: generateUUID(),
    });
  };

  return (
    <div
      className={cn(
        "space-y-4 p-2 rounded-lg",
        "dark:bg-neutral-900/30",
        "bg-white"
      )}
    >
      <div className="space-y-2">
        <div className="text-center text-2xl">
          <InputName
            value={section?.title || ""}
            onChange={(title) => {
              updateSectionEducation({
                ...section,
                title: title,
              });
            }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="">
          <Reorder.Group
            axis="y"
            values={section.content}
            onReorder={(vals) => {
              updateSectionEducation({
                ...section,
                content: vals,
              });
            }}
            className="space-y-3"
          >
            {section.content.map((item) => (
              <EducationItem
                key={item.id}
                education={item}
                deleteSectionEducation={deleteSectionEducation}
                updateSectionEducation={updateSectionEducation}
                updateSectionEducationContent={updateSectionEducationContent}
              ></EducationItem>
            ))}

            <Button onClick={handleCreateProject} className="w-full">
              <PlusCircle className="w-4 h-4 mr-2" />
              {t("addButton")}
            </Button>
          </Reorder.Group>
        </div>
      </div>
    </div>
  );
};

export default EducationPanel;
