"use client";
import { cn } from "@/lib/utils";
import { useResumeListStore, useResumeEditorStore } from "@/store/resume";
import { Reorder } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import EducationItem from "./EducationItem";
import { Education } from "@/types/resume";
import { generateUUID } from "@/utils/uuid";
import { InputName } from "../basic/input-name";

const EducationPanel = ({ id }) => {
  const t = useTranslations("workbench.educationPanel");
  const { activeResume } = useResumeListStore();
  const { updateEducation, updateEducationBatch, updateMenuSections } =
    useResumeEditorStore();
  const { education = [], menuSections = [] } = activeResume || {};
  const handleCreateProject = () => {
    const newEducation: Education = {
      id: generateUUID(),
      school: t("defaultProject.school"),
      major: t("defaultProject.major"),
      degree: t("defaultProject.degree"),
      startDate: "2015-09-01",
      endDate: "2019-06-30",
      description: "",
      visible: true,
    };
    updateEducation(newEducation);
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
        "dark:bg-neutral-900/30",
        "bg-white"
      )}
    >
      <div className="space-y-2">
        <div className="">
          <InputName
            value={menuSections.find((s) => s.id === id)?.title || ""}
            onChange={handleTitleChange}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="">
          <Reorder.Group
            axis="y"
            values={Array.isArray(education) ? education : []}
            onReorder={(newOrder) => {
              updateEducationBatch(newOrder);
            }}
            className="space-y-3"
          >
            {(Array.isArray(education) ? education : []).map((education) => (
              <EducationItem
                key={education.id}
                education={education}
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
