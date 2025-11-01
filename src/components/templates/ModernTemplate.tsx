import React from "react";
import BaseInfo from "../preview/BaseInfo";
import ExperienceSection from "../preview/ExperienceSection";
import EducationSection from "../preview/EducationSection";
import SkillSection from "../preview/SimplePanel";
import ProjectSection from "../preview/ProjectSection";
import CustomSection from "../preview/CustomSection";
import { ResumeData, ResumeSection } from "@/types/resume";
import { ResumeTemplate } from "@/types/template";

interface ModernTemplateProps {
  data: ResumeData;
  template: ResumeTemplate;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data, template }) => {
  const { colorScheme } = template;
  const sortedSections = data.menuSections.sort((a, b) => a.order - b.order);

  const renderSection = (section: ResumeSection) => {
    switch (section.id) {
      case "basic":
        return (
          <BaseInfo
            section={section}
            globalSettings={data.globalSettings}
            layout="center"
          />
        );
      case "experience":
        return (
          <ExperienceSection
            section={section}
            globalSettings={data.globalSettings}
          />
        );
      case "education":
        return (
          <EducationSection
            section={section}
            globalSettings={data.globalSettings}
          />
        );
      case "introduction":
      case "skills":
        return (
          <SkillSection
            section={section}
            globalSettings={data.globalSettings}
          />
        );
      case "projects":
        return (
          <ProjectSection
            section={section}
            globalSettings={data.globalSettings}
          />
        );
      default:
        console.log("CustomSection", section);
        return (
          <CustomSection
            section={section}
            globalSettings={data.globalSettings}
          />
        );
    }
  };

  const [basicSection, ...otherSections] = sortedSections;

  return (
    <div className="grid grid-cols-3 w-full">
      <div
        className="col-span-1 p-4"
        style={{
          backgroundColor: data.globalSettings.themeColor,
          color: "#ffffff",
          paddingTop: data.globalSettings.sectionSpacing,
        }}
      >
        {basicSection && renderSection(basicSection)}
      </div>

      <div
        className="col-span-2 p-4 pt-0"
        style={{
          backgroundColor: colorScheme.background,
          color: colorScheme.text,
        }}
      >
        {otherSections.map((section) => renderSection(section))}
      </div>
    </div>
  );
};

export default ModernTemplate;
