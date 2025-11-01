import React from "react";
import BaseInfo from "../preview/BaseInfo";
import ExperienceSection from "../preview/ExperienceSection";
import EducationSection from "../preview/EducationSection";
import SimplePanel from "../preview/SimplePanel";
import CustomSection from "../preview/CustomSection";
import { ResumeData, ResumeSection } from "@/types/resume";
import { ResumeTemplate } from "@/types/template";
import ProjectSection from "../preview/ProjectSection";

interface ClassicTemplateProps {
  data: ResumeData;
  template: ResumeTemplate;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({
  data,
  template,
}) => {
  const { colorScheme } = template;
  const sortedSections = data.menuSections.sort((a, b) => a.order - b.order);

  const renderSection = (section: ResumeSection) => {
    switch (section.id) {
      case "basic":
        return (
          <BaseInfo
            section={section}
            globalSettings={data.globalSettings}
            layout={section?.config?.layout}
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
          <SimplePanel section={section} globalSettings={data.globalSettings} />
        );
      case "projects":
        return (
          <ProjectSection
            section={section}
            globalSettings={data.globalSettings}
          />
        );
      default:
        return (
          <CustomSection
            section={section}
            globalSettings={data.globalSettings}
          />
        );
    }
  };

  return (
    <div
      className="flex flex-col w-full min-h-screen"
      style={{
        backgroundColor: colorScheme.background,
        color: colorScheme.text,
      }}
    >
      {sortedSections.map((section) => (
        <div key={section.id}>{renderSection(section)}</div>
      ))}
    </div>
  );
};

export default ClassicTemplate;
