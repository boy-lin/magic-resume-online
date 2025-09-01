import { cn } from "@/lib/utils";
import { useResumeListStore, useResumeEditorStore } from "@/store/resume";
import { Reorder } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import ProjectItem from "./ProjectItem";
import { Project } from "@/types/resume";
import { generateUUID } from "@/utils/uuid";
import { useState } from "react";
import { InputName } from "../basic/input-name";

const ProjectPanel = ({ id }: { id: string }) => {
  const t = useTranslations("workbench.projectPanel");
  const { activeResume } = useResumeListStore();
  const { updateProjects, updateProjectsBatch, updateMenuSections } =
    useResumeEditorStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { projects = [], menuSections = [] } = activeResume || {};
  const handleCreateProject = () => {
    const newProject: Project = {
      id: generateUUID(),
      name: t("defaultProject.name"),
      role: t("defaultProject.role"),
      date: t("defaultProject.date"),
      description: t("defaultProject.description"),
      visible: true,
    };
    updateProjects(newProject);
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
          values={Array.isArray(projects) ? projects : []}
          onReorder={(newOrder) => {
            updateProjectsBatch(newOrder);
          }}
          className="space-y-3"
        >
          {(Array.isArray(projects) ? projects : []).map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
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
