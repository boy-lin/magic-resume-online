import { cn } from "@/lib/utils";

import { Reorder } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import ProjectItem from "./ProjectItem";
import { ResumeSection, ResumeSectionContent } from "@/types/resume";
import { useResumeEditorStore } from "@/store/resume/useResumeEditorStore";
import { generateUUID } from "@/utils/uuid";
import { useState } from "react";
import { InputName } from "../basic/input-name";

const ProjectPanel = ({ section }: { section: ResumeSection }) => {
  const t = useTranslations("workbench.projectPanel");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { updateSectionProjects } = useResumeEditorStore();
  const updateSectionProjectsContent = (item) => {
    updateSectionProjects({
      ...section,
      content: section.content.map((c) =>
        c.id !== item.id ? c : { ...c, ...item }
      ),
    });
  };

  const addSectionProjects = (item: ResumeSectionContent) => {
    updateSectionProjects({
      ...section,
      content: [...section.content, item],
    });
  };

  const deleteProjects = (id: string) => {
    updateSectionProjects({
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
    addSectionProjects(newProject);
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
          value={section.title}
          onChange={(value) => {
            updateSectionProjects({
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
            updateSectionProjects({
              ...section,
              content: vals,
            });
          }}
          className="space-y-3"
        >
          {section.content.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              updateSectionProjectsContent={updateSectionProjectsContent}
              deleteProjects={deleteProjects}
            ></ProjectItem>
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

export default ProjectPanel;
