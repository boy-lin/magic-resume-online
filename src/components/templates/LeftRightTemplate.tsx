import BaseInfo from "../preview/BaseInfo";
import ExperienceSection from "../preview/ExperienceSection";
import EducationSection from "../preview/EducationSection";
import SkillSection from "../preview/SkillPanel";
import ProjectSection from "../preview/ProjectSection";
import CustomSection from "../preview/CustomSection";
import {
  BasicInfo,
  Education,
  Experience,
  MenuSection,
  Project,
  ResumeData,
} from "@/types/resume";
import { ResumeTemplate } from "@/types/template";
import GithubContribution from "../shared/GithubContribution";

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

  const renderSection = (section: MenuSection) => {
    switch (section.id) {
      case "basic":
        const basic = section.content as BasicInfo;
        return (
          <>
            <BaseInfo
              basic={basic}
              globalSettings={data.globalSettings}
              template={template}
            ></BaseInfo>
            {basic.githubContributionsVisible && (
              <GithubContribution
                className="mt-2"
                githubKey={basic.githubKey}
                username={basic.githubUseName}
              />
            )}
          </>
        );
      case "experience":
        const experience = section.content as Experience[];
        return (
          <ExperienceSection
            experiences={experience}
            globalSettings={data.globalSettings}
          />
        );
      case "education":
        const education = section.content as Education[];
        return (
          <EducationSection
            education={education}
            globalSettings={data.globalSettings}
          />
        );
      case "skills":
        const skill = section.content as string;
        return (
          <SkillSection skill={skill} globalSettings={data.globalSettings} />
        );
      case "projects":
        const projects = section.content as Project[];
        return (
          <ProjectSection
            projects={projects}
            globalSettings={data.globalSettings}
          />
        );
      default:
        if (section.id in data.customData) {
          const sectionTitle =
            data.menuSections.find((s) => s.id === section.id)?.title ||
            section.id;
          return (
            <CustomSection
              title={sectionTitle}
              key={section.id}
              sectionId={section.id}
              items={data.customData[section.id]}
              globalSettings={data.globalSettings}
            />
          );
        }
        return null;
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
