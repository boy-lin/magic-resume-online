import { memo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reorder } from "framer-motion";
import { PlusCircle } from "lucide-react";
import CustomItem from "./CustomItem";
import { useResumeListStore } from "@/store/resume/useResumeListStore";
import { useResumeEditorStore } from "@/store/resume/useResumeEditorStore";
import { CustomItem as CustomItemType } from "@/types/resume";
import { InputName } from "../basic/input-name";

const CustomPanel = memo(
  ({
    id,
    handleDeleteSection,
  }: {
    id: string;
    handleDeleteSection: () => void;
  }) => {
    const { activeResume } = useResumeListStore();
    const { updateMenuSections } = useResumeEditorStore();
    const { menuSections = [] } = activeResume || {};
    const section = menuSections.find((s) => s.id === id);
    const items = section?.content?.[0]?.value || [];

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
          "dark:bg-neutral-900/30 bg-white"
        )}
      >
        <div className="space-y-2">
          <InputName
            value={menuSections.find((s) => s.id === id)?.title || ""}
            onChange={handleTitleChange}
          />
        </div>
        <Reorder.Group
          axis="y"
          values={Array.isArray(items) ? items : []}
          onReorder={(newOrder) => {}}
          className="space-y-3"
        >
          {(Array.isArray(items) ? items : []).map((item: CustomItemType) => (
            <CustomItem key={item.id} item={item} sectionId={id} />
          ))}
        </Reorder.Group>

        <Button onClick={() => {}} className={cn("w-full")}>
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
