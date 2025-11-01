import React from "react";
import BaseInfo from "../preview/BaseInfo";
import ExperienceSection from "../preview/ExperienceSection";
import EducationSection from "../preview/EducationSection";
import SimplePanel from "../preview/SimplePanel";
import CustomSection from "../preview/CustomSection";
import { ResumeData, ResumeSection } from "@/types/resume";
import { ResumeTemplate } from "@/types/template";
import ProjectSection from "../preview/ProjectSection";
interface TimelineTemplateProps {
  data: ResumeData;
  template: ResumeTemplate;
}

const TimelineTemplate: React.FC<TimelineTemplateProps> = ({
  data,
  template,
}) => {
  const { colorScheme } = template;
  const enabledSections = data.menuSections.filter(
    (section) => section.enabled
  );
  const sortedSections = [...enabledSections].sort((a, b) => a.order - b.order);

  const renderTimelineItem = (content: React.ReactNode, title: string) => (
    <div className="relative pl-6">
      <div
        className="absolute left-0 top-2 h-full w-0.5"
        style={{ backgroundColor: "#e5e7eb" }}
      />
      <div
        className="absolute left-[-6px] top-2 w-3 h-3 rounded-full"
        style={{ backgroundColor: colorScheme.primary }}
      />
      <div
        className="text-xl font-bold mb-4"
        style={{
          color: data.globalSettings.themeColor,
          fontSize: `${data.globalSettings.headerSize || 20}px`,
        }}
      >
        {title}
      </div>
      <div>{content}</div>
    </div>
  );

  const renderSection = (section: ResumeSection) => {
    switch (section.id) {
      case "basic":
        return (
          <>
            <BaseInfo
              section={section}
              globalSettings={data.globalSettings}
              layout={section?.config?.layout}
            />
          </>
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
      className="flex flex-col w-full min-h-screen pl-[6px] "
      style={{
        backgroundColor: colorScheme.background,
        color: colorScheme.text,
      }}
    >
      {sortedSections.map((section) => (
        <div key={section.id} className="mb-4">
          {renderSection(section)}
        </div>
      ))}
    </div>
  );
};

export default TimelineTemplate;
