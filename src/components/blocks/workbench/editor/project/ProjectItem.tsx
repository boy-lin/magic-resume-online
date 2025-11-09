"use client";
import { Button } from "@/components/ui/button";
import { cn, pickObjectsFromList } from "@/lib/utils";
import { useResumeStore } from "@/store/resume/useResumeStore";

import {
  AnimatePresence,
  motion,
  Reorder,
  useDragControls,
} from "framer-motion";
import { ChevronDown, Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import Field from "../Field";
import ThemeModal from "@/components/shared/ThemeModal";
import { useTranslations } from "next-intl";
import { ResumeSectionContent } from "@/types/resume";
import { FieldType } from "@/types/resume";

interface ProjectEditorProps {
  fields: FieldType[];
  onSave: (field: FieldType) => void;
  onDelete: () => void;
  onCancel: () => void;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ fields, onSave }) => {
  const t = useTranslations("workbench.projectItem");
  const { position, role, link, date, description } =
    pickObjectsFromList(fields);

  return (
    <div className="space-y-5">
      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-4">
          <Field
            label={t("labels.name")}
            value={position.value}
            onChange={(value) => onSave({ ...position, value })}
            placeholder={t("placeholders.name")}
          />
          <Field
            label={t("labels.role")}
            value={role.value}
            onChange={(value) => onSave({ ...role, value })}
            placeholder={t("placeholders.role")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label={t("labels.link")}
            value={link.value || ""}
            onChange={(value) => onSave({ ...link, value })}
            placeholder={t("placeholders.link")}
          />
          <Field
            label={t("labels.date")}
            value={date.value}
            onChange={(value) => onSave({ ...date, value })}
            placeholder={t("placeholders.date")}
          />
        </div>
        <Field
          label={t("labels.description")}
          value={description.value}
          onChange={(value) => onSave({ ...description, value })}
          type="editor"
          placeholder={t("placeholders.description")}
        />
      </div>
    </div>
  );
};

const ProjectItem = ({
  project,
  expandedId,
  setExpandedId,
  deleteProjects,
  updateSectionProjectsContent,
}: {
  project: ResumeSectionContent;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  deleteProjects;
  updateSectionProjectsContent: (item: ResumeSectionContent) => void;
}) => {
  const dragControls = useDragControls();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleVisibilityToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateSectionProjectsContent({
      ...project,
      visible: !project.visible,
    });
  };
  const projectName = project.fields[0].value;
  return (
    <Reorder.Item
      id={project.id}
      value={project}
      dragListener={false}
      dragControls={dragControls}
      className={cn(
        "rounded-lg border overflow-hidden flex group",
        "bg-white hover:border-primary",
        "dark:bg-neutral-900/30",
        "border-gray-100 dark:border-neutral-800",
        "dark:hover:border-primary"
      )}
    >
      <div
        onPointerDown={(event) => {
          if (expandedId === project.id) return;
          dragControls.start(event);
        }}
        className={cn(
          "w-12 flex items-center justify-center border-r shrink-0 touch-none",
          "border-gray-100 dark:border-neutral-800",
          expandedId === project.id
            ? "cursor-not-allowed"
            : "cursor-grab hover:bg-gray-50 dark:hover:bg-neutral-800/50"
        )}
      >
        <GripVertical
          className={cn(
            "w-4 h-4",
            "text-gray-400 dark:text-neutral-400",
            expandedId === project.id && "opacity-50",
            "transform transition-transform group-hover:scale-110"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "px-4 py-4 flex items-center justify-between",
            expandedId === project.id && "bg-gray-50 dark:bg-neutral-800/50",
            "cursor-pointer select-none"
          )}
          onClick={(e) => {
            if (expandedId === project.id) {
              setExpandedId(null);
            } else {
              setExpandedId(project.id);
            }
          }}
        >
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-medium truncate",
                "text-gray-700 dark:text-neutral-200"
              )}
            >
              {projectName}
            </h3>
          </div>
          <div className="flex items-center gap-2 ml-4 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-sm",
                project.visible
                  ? "hover:bg-gray-100 text-gray-500 dark:hover:bg-neutral-800 dark:text-neutral-400"
                  : "hover:bg-gray-100 text-gray-400 dark:hover:bg-neutral-800 dark:text-neutral-600"
              )}
              onClick={handleVisibilityToggle}
            >
              {project.visible ? (
                <Eye className="w-4 h-4 text-primary" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-sm",
                "dark:hover:bg-red-900/50 dark:text-red-400 hover:bg-red-50 text-red-600"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <ThemeModal
              isOpen={deleteDialogOpen}
              title={projectName}
              onClose={() => setDeleteDialogOpen(false)}
              onConfirm={() => {
                deleteProjects(project.id);
                setExpandedId(null);
                setDeleteDialogOpen(false);
              }}
            />

            <motion.div
              initial={false}
              animate={{
                rotate: expandedId === project.id ? 180 : 0,
              }}
            >
              <ChevronDown
                className={cn(
                  "w-5 h-5",
                  "dark:text-neutral-400",
                  "text-gray-500"
                )}
              />
            </motion.div>
          </div>
        </div>
        <AnimatePresence>
          {expandedId === project.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div
                className={cn(
                  "px-4 pb-4 space-y-4",
                  "dark:border-neutral-800 border-gray-100"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={cn(
                    "h-px w-full",
                    "dark:bg-neutral-800 bg-gray-100"
                  )}
                />
                <ProjectEditor
                  fields={project.fields}
                  onSave={(field) => {
                    updateSectionProjectsContent({
                      ...project,
                      fields: project.fields?.map((it) => {
                        if (it.id !== field.id) return it;
                        return { ...it, ...field };
                      }),
                    });
                  }}
                  onDelete={() => {
                    deleteProjects(project.id);
                    setExpandedId(null);
                  }}
                  onCancel={() => setExpandedId(null)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reorder.Item>
  );
};

export default ProjectItem;
