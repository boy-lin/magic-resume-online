import BaseInfo from "../preview/BaseInfo";
import ExperienceSection from "../preview/ExperienceSection";
import EducationSection from "../preview/EducationSection";
import SimplePanel from "../preview/SimplePanel";
import ProjectSection from "../preview/ProjectSection";
import CustomSection from "../preview/CustomSection";
import { ResumeSection, ResumeData } from "@/types/resume";
import { ResumeTemplate } from "@/types/template";

interface LeftRightTemplateProps {
  data: ResumeData;
  template: ResumeTemplate;
}

const LeftRightTemplate: React.FC<LeftRightTemplateProps> = ({
  data,
  template,
}) => {
  const { colorScheme } = template;
  const enabledSections = data.menuSections.filter(
    (section) => section.enabled
  );
  const sortedSections = [...enabledSections].sort((a, b) => a.order - b.order);

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
      className="flex flex-col w-full"
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

export default LeftRightTemplate;
