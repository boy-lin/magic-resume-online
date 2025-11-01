import { useCallback, useState } from "react";
import {
  motion,
  useDragControls,
  Reorder,
  AnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GripVertical, Eye, EyeOff, ChevronDown, Trash2 } from "lucide-react";
import Field from "../Field";
import ThemeModal from "@/components/shared/ThemeModal";
import { ResumeSectionContent, FieldType } from "@/types/resume";

const CustomItemEditor = ({
  item,
  updateCustomItem,
}: {
  item: ResumeSectionContent;
  updateCustomItem: (item: ResumeSectionContent) => void;
}) => {
  const updateFiled = (it: FieldType) => {
    updateCustomItem({
      ...item,
      fields: item.fields?.map((f) => (f.id === it.id ? { ...f, ...it } : f)),
    });
  };
  console.log("item.fields", item.fields);
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4">
        {item.fields?.map((field) => (
          <Field
            key={field.id}
            label={field.label}
            value={field.value}
            type={field.type}
            onChange={(value) => updateFiled({ ...field, value })}
          />
        ))}
      </div>
    </div>
  );
};

const CustomItem = ({
  item,
  updateCustomItem,
  removeCustomItem,
}: {
  item: ResumeSectionContent;
  removeCustomItem: (id: string) => void;
  updateCustomItem: (item: ResumeSectionContent) => void;
}) => {
  const dragControls = useDragControls();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const handleVisibilityToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isUpdating) return;

      setIsUpdating(true);
      setTimeout(() => {
        updateCustomItem({ ...item, visible: !item.visible });
        setIsUpdating(false);
      }, 10);
    },
    [item, updateCustomItem, isUpdating]
  );

  return (
    <Reorder.Item
      id={item.id}
      value={item}
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
          if (expandedId === item.id) return;
          dragControls.start(event);
        }}
        className={cn(
          "w-12 flex items-center justify-center border-r shrink-0 touch-none",
          "dark:border-neutral-800 border-gray-100",
          expandedId === item.id
            ? "cursor-not-allowed"
            : "cursor-grab hover:bg-gray-50 dark:hover:bg-neutral-800/50"
        )}
      >
        <GripVertical
          className={cn(
            "w-4 h-4",
            "dark:text-neutral-400 text-gray-400",
            expandedId === item.id && "opacity-50"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "px-4 py-4 flex items-center justify-between cursor-pointer select-none",
            expandedId === item.id && "dark:bg-neutral-800/50 bg-gray-50"
          )}
          onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
        >
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-medium truncate text-gray-700",
                "dark:text-neutral-200"
              )}
            >
              {item.value}
            </h3>
            {item.subtitle && (
              <p
                className={cn(
                  "text-sm truncate",
                  "dark:text-neutral-400 text-gray-500"
                )}
              >
                {item.subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              disabled={isUpdating}
              onClick={handleVisibilityToggle}
            >
              {item.visible ? (
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
              title={item.value}
              onClose={() => setDeleteDialogOpen(false)}
              onConfirm={() => {
                removeCustomItem(item.id);
                setExpandedId(null);
                setDeleteDialogOpen(false);
              }}
            />

            <motion.div
              initial={false}
              animate={{
                rotate: expandedId === item.id ? 180 : 0,
              }}
            >
              <ChevronDown
                className={cn("w-5 h-5", "dark:text-neutral-400 text-gray-500")}
              />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {expandedId === item.id && (
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
              >
                <div
                  className={cn(
                    "h-px w-full",
                    "dark:bg-neutral-800 bg-gray-100"
                  )}
                />
                <CustomItemEditor
                  item={item}
                  updateCustomItem={updateCustomItem}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reorder.Item>
  );
};

export default CustomItem;
