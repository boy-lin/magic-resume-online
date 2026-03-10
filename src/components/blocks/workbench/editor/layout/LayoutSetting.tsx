"use client";
import { Reorder } from "framer-motion";
import LayoutItem from "./LayoutItem";
import { useResumeStore } from "@/store/resume/useResumeStore";
import { shallow } from "zustand/shallow";

const LayoutSetting = () => {
  const {
    setActiveSection,
    toggleSectionVisibility,
    updateMenuSections,
    reorderSections,
    menuSections,
    activeSection,
  } = useResumeStore(
    (state) => ({
      setActiveSection: state.setActiveSection,
      toggleSectionVisibility: state.toggleSectionVisibility,
      updateMenuSections: state.updateMenuSections,
      reorderSections: state.reorderSections,
      menuSections: state.activeResume?.menuSections || [],
      activeSection: state.activeSection,
    }),
    shallow,
  );
  const activeResume = useResumeStore((state) => state.activeResume);
  if (!activeResume) return null;

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
