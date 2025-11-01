"use client";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { GlobalSettings, ResumeSection } from "@/types/resume";
import { useResumeEditorStore } from "@/store/resume/useResumeEditorStore";

interface SkillSectionProps {
  section?: ResumeSection;
  globalSettings?: GlobalSettings;
  showTitle?: boolean;
}

const SkillSection = ({
  section,
  globalSettings,
  showTitle = true,
}: SkillSectionProps) => {
  const skill = section?.content?.[0]?.value;

  return (
    <motion.div
      className="hover:cursor-pointer hover:outline hover:outline-2 hover:outline-primary rounded-md transition-all duration-300 ease-in-out hover:shadow-md"
      style={{
        marginTop: `${globalSettings?.sectionSpacing || 24}px`,
      }}
    >
      {showTitle && (
        <SectionTitle type={section.id} globalSettings={globalSettings} />
      )}
      <motion.div
        style={{
          marginTop: `${globalSettings?.paragraphSpacing}px`,
        }}
      >
        <motion.div
          layout="position"
          style={{
            fontSize: `${globalSettings?.baseFontSize || 14}px`,
            lineHeight: globalSettings?.lineHeight || 1.6,
          }}
          dangerouslySetInnerHTML={{ __html: skill }}
        />
      </motion.div>
    </motion.div>
  );
};

export default SkillSection;
