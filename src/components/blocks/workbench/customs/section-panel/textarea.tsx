"use client";
import { useResumeEditorStore } from "@/store/resume/useResumeEditorStore";

import { cn } from "@/lib/utils";
import Field from "../../editor/Field";
import { InputName } from "../../editor/basic/input-name";
import { useResumeListStore } from "@/store/resume/useResumeListStore";
import { ResumeSection } from "@/types/resume";

const TextareaPanel = ({
  id,
  section,
  placeholder,
}: {
  id: string;
  section: ResumeSection;
  placeholder: string;
}) => {
  const { updateMenuSections } = useResumeEditorStore();
  const { activeResume } = useResumeListStore();
  const { menuSections = [] } = activeResume || {};

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
    <div className={cn("rounded-lg p-2", "bg-white", "dark:bg-neutral-900/30")}>
      <div className="space-y-2 text-center text-2xl">
        <InputName value={section.title} onChange={handleTitleChange} />
      </div>
      <div className="space-y-2">
        <Field
          type="editor"
          value={section.content?.[0]?.value || ""}
          onChange={(value) => {
            updateMenuSections(
              menuSections.map((s) => {
                if (s.id === id) {
                  return { ...s, content: [{ ...s.content?.[0], value }] };
                }
                return s;
              })
            );
          }}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default TextareaPanel;
