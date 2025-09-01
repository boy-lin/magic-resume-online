"use client";
import { useResumeListStore, useResumeEditorStore } from "@/store/resume";
import { cn } from "@/lib/utils";
import Field from "../Field";
import { InputName } from "../basic/input-name";

const SkillPanel = ({ id }: { id: string }) => {
  const { activeResume } = useResumeListStore();
  const { updateSkillContent, updateMenuSections } = useResumeEditorStore();
  const { skillContent, menuSections = [] } = activeResume || {};
  const handleChange = (value: string) => {
    updateSkillContent(value);
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
    <div className={cn("rounded-lg p-2", "bg-white", "dark:bg-neutral-900/30")}>
      <div className="space-y-2">
        <InputName
          value={menuSections.find((s) => s.id === id)?.title || ""}
          onChange={handleTitleChange}
        />
      </div>
      <div className="space-y-2">
        <Field
          value={skillContent}
          onChange={handleChange}
          type="editor"
          placeholder="描述你的技能、专长等..."
        />
      </div>
    </div>
  );
};

export default SkillPanel;
