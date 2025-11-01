"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GlobalSettings,
  ResumeSection,
  ResumeSectionContent,
} from "@/types/resume";
import SectionTitle from "./SectionTitle";
import { useResumeEditorStore } from "@/store/resume/useResumeEditorStore";
import { FieldComponent } from "../templates/components/Filed";
import { cn } from "@/lib/utils";

interface ExperienceSectionProps {
  section?: ResumeSection;
  globalSettings?: GlobalSettings;
  showTitle?: boolean;
}

interface ExperienceItemProps {
  experience: ResumeSectionContent;
  globalSettings?: GlobalSettings;
}

const ExperienceItem = React.forwardRef<HTMLDivElement, ExperienceItemProps>(
  ({ experience, globalSettings }, ref) => {
    const centerSubtitle = globalSettings?.centerSubtitle;
    const gridColumns = centerSubtitle ? 3 : 2;
    const [company, position, date, description] = experience.fields || [];
    return (
      <motion.div
        layout="position"
        style={{
          marginTop: `${globalSettings?.paragraphSpacing}px`,
        }}
      >
        <motion.div
          layout="position"
          className={`grid grid-cols-${
            globalSettings?.centerSubtitle ? "3" : "2"
          } gap-2 items-center justify-items-start [&>*:last-child]:justify-self-end`}
        >
          <div
            className="font-bold"
            style={{
              fontSize: `${globalSettings?.subheaderSize || 16}px`,
            }}
          >
            <span>{company.value}</span>
          </div>

          {globalSettings?.centerSubtitle && (
            <motion.div layout="position" className="text-subtitleFont">
              {position.value}
            </motion.div>
          )}

          <span className="text-subtitleFont shrink-0" suppressHydrationWarning>
            {date.value}
          </span>
        </motion.div>

        {!globalSettings?.centerSubtitle && (
          <motion.div layout="position" className="text-subtitleFont mt-1">
            {date.value}
          </motion.div>
        )}

        {description.value && (
          <motion.div
            layout="position"
            className="mt-2"
            style={{
              fontSize: `${globalSettings?.baseFontSize || 14}px`,
              lineHeight: globalSettings?.lineHeight || 1.6,
            }}
            dangerouslySetInnerHTML={{ __html: description.value }}
          />
        )}
      </motion.div>
    );
  }
);

ExperienceItem.displayName = "ExperienceItem";

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  section,
  globalSettings,
  showTitle = true,
}) => {
  const { setActiveSection } = useResumeEditorStore();

  const visibleExperiences = section?.content?.filter((item) => item.visible);

  return (
    <motion.div
      className="hover:cursor-pointer hover:outline hover:outline-2 hover:outline-primary rounded-md transition-all duration-300 ease-in-out hover:shadow-md"
      style={{
        marginTop: `${globalSettings?.sectionSpacing || 24}px`,
      }}
      onClick={() => {
        setActiveSection("experience");
      }}
    >
      {showTitle && (
        <SectionTitle type="experience" globalSettings={globalSettings} />
      )}
      <div>
        {visibleExperiences?.map((item) => (
          <ExperienceItem
            key={item.id}
            experience={item}
            globalSettings={globalSettings}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ExperienceSection;
