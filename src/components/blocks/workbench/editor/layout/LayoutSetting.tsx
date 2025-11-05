"use client";
import { Reorder } from "framer-motion";
import LayoutItem from "./LayoutItem";
import { useResumeStore } from "@/store/resume/useResumeStore";

const LayoutSetting = () => {
  const {
    setActiveSection,
    toggleSectionVisibility,
    updateMenuSections,
    reorderSections,
    activeResume,
  } = useResumeStore();

  const { menuSections, activeSection: rawActiveSection } = activeResume;

  // 确保 activeSection 是字符串
  const activeSection =
    typeof rawActiveSection === "string" ? rawActiveSection : "";

  const [basicSection, ...draggableSections] = menuSections;

  return (
    <div className="space-y-4  rounded-lg bg-white dark:bg-neutral-900/30">
      {basicSection && (
        <LayoutItem
          item={basicSection}
          isBasic={true}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          toggleSectionVisibility={toggleSectionVisibility}
          updateMenuSections={updateMenuSections}
          menuSections={menuSections}
        />
      )}

      <Reorder.Group
        axis="y"
        values={draggableSections}
        onReorder={(newOrder) => {
          const updatedSections = [
            ...menuSections.filter((item) => item.id === "basic"),
            ...newOrder,
          ];
          reorderSections(updatedSections);
        }}
        className="space-y-2"
        layout={false}
        transition={{
          duration: 0,
        }}
      >
        {draggableSections.map((item) => (
          <LayoutItem
            key={item.id}
            item={item}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            toggleSectionVisibility={toggleSectionVisibility}
            updateMenuSections={updateMenuSections}
            menuSections={menuSections}
          />
        ))}
      </Reorder.Group>
    </div>
  );
};

export default LayoutSetting;
