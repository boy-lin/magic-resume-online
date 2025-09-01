"use client";
import { useResumeListStore, useResumeEditorStore } from "@/store/resume";
import { cn } from "@/lib/utils";
import Field from "../../editor/Field";
import { InputName } from "../../editor/basic/input-name";
import { MenuSection } from "@/types/resume";

const TextareaPanel = ({
  id,
  content,
  onChange,
  placeholder,
  menuSections,
}: {
  id: string;
  content: string;
  onChange: (value: string) => void;
  placeholder: string;
  menuSections: MenuSection[];
}) => {
  const { updateMenuSections } = useResumeEditorStore();
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
          type="editor"
          value={content}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default TextareaPanel;
