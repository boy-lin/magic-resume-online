import { memo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reorder } from "framer-motion";
import { PlusCircle } from "lucide-react";
import CustomItem from "./CustomItem";
import { customSectionContentDefault } from "@/config";

import { useResumeStore } from "@/store/resume/useResumeStore";
import { ResumeSection, ResumeSectionContent } from "@/types/resume";

import { InputName } from "../basic/input-name";
import { generateUUID } from "@/utils/uuid";

const CustomPanel = memo(
  ({
    id,
    section,
    handleDeleteSection,
  }: {
    id: string;
    section: ResumeSection;
    handleDeleteSection: () => void;
  }) => {
    const { updateSectionById } = useResumeStore();
    const items = section?.content || [];

    const handleTitleChange = (title) => {
      updateSectionById(id, { title });
    };

    const addCustomItem = (id: string) => {
      updateSectionById(id, {
        content: [
          ...section.content,
          {
            ...customSectionContentDefault,
            id: generateUUID(),
          },
        ],
      });
    };

    const updateCustomItem = (item: ResumeSectionContent) => {
      updateSectionById(id, {
        content: section.content.map((c) =>
          c.id !== item.id ? c : { ...c, ...item }
        ),
      });
    };

    const removeCustomItem = (id: string) => {
      updateSectionById(id, {
        content: section.content.filter((c) => c.id !== id),
      });
    };

    return (
      <div
        className={cn(
          "space-y-4 p-2 rounded-lg",
          "dark:bg-neutral-900/30 bg-white"
        )}
      >
        <div className="space-y-2">
          <InputName value={section.title} onChange={handleTitleChange} />
        </div>
        <Reorder.Group
          axis="y"
          values={Array.isArray(items) ? items : []}
          onReorder={(newOrder) => {}}
          className="space-y-3"
        >
          {items.map((item: ResumeSectionContent) => (
            <CustomItem
              key={item.id}
              item={item}
              removeCustomItem={removeCustomItem}
              updateCustomItem={updateCustomItem}
            />
          ))}
        </Reorder.Group>

        <Button
          onClick={() => {
            addCustomItem(id);
          }}
          className={cn("w-full")}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          添加
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <p>删除这个模块</p>
            <p className="text-xs text-muted-foreground">
              一旦删除，将无法恢复
            </p>
          </div>
          <Button
            variant="outline"
            className="text-red-500 hover:bg-red-500 hover:text-white"
            onClick={handleDeleteSection}
          >
            删除这个模块
          </Button>
        </div>
      </div>
    );
  }
);

CustomPanel.displayName = "CustomPanel";

export default CustomPanel;
