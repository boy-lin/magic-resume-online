import React from "react";
import GithubContribution from "@/components/shared/GithubContribution";
import BaseInfo from "../preview/BaseInfo";
import ExperienceSection from "../preview/ExperienceSection";
import EducationSection from "../preview/EducationSection";
import SkillSection from "../preview/SkillPanel";
import CustomSection from "../preview/CustomSection";
import { CustomItem, ResumeData, ResumeSection } from "@/types/resume";
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
  const enabledSections = data.menuSections.filter(
    (section) => section.enabled
  );
  const sortedSections = [...enabledSections].sort(
    (a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0)
  );

  const getFieldValue = (
    section: ResumeSection | undefined,
    fieldId: string
  ): string => {
    const field = section?.content?.find((item) => item.id === fieldId);
    return (field?.value as string) || "";
  };

  const mapBasicSection = (section: ResumeSection) => {
    const content = section.content || [];
    const photoField = content.find((item) => item.id === "photo");
    const githubField = content.find((item) => item.id === "github");
    const layout = section.config?.layout || "left";

    const fields = content.filter(
      (item) =>
        item.id !== "name" &&
        item.id !== "title" &&
        item.id !== "photo" &&
        item.id !== "github" &&
        item.visible !== false
    );

    return {
      name: getFieldValue(section, "name"),
      title: getFieldValue(section, "title"),
      photo: (photoField?.value as string) || "",
      photoConfig: photoField?.config,
      layout,
      fieldOrder: fields.map((item) => ({
        key: item.id,
        label: item.label || item.id,
        visible: item.visible !== false,
        custom: false,
      })),
      icons: Object.fromEntries(fields.map((item) => [item.id, item.icon])),
      customFields: [],
      githubContributionsVisible: Boolean(
        githubField?.config?.githubContributionsVisible
      ),
      githubKey: githubField?.config?.githubKey || "",
      githubUseName: githubField?.config?.githubUseName || "",
      ...Object.fromEntries(fields.map((item) => [item.id, item.value || ""])),
    };
  };

  const mapExperienceSection = (section: ResumeSection) =>
    (section.content || []).map((item) => ({
      id: item.id,
      company: item.value || "",
      position:
        item.fields?.find((field) => field.id === "position")?.value || "",
      date: item.fields?.find((field) => field.id === "date")?.value || "",
      details:
        item.fields?.find((field) => field.id === "description")?.value || "",
      visible: item.visible !== false,
    }));

  const mapEducationSection = (section: ResumeSection) =>
    (section.content || []).map((item) => ({
      id: item.id,
      school: item.value || "",
      major: item.fields?.find((field) => field.id === "major")?.value || "",
      degree: item.fields?.find((field) => field.id === "degree")?.value || "",
      startDate:
        item.fields?.find(
          (field) => field.id === "startDate" || field.id === "start-date"
        )?.value || "",
      endDate:
        item.fields?.find(
          (field) => field.id === "endDate" || field.id === "end-date"
        )?.value || "",
      description:
        item.fields?.find((field) => field.id === "description")?.value || "",
      gpa: item.fields?.find((field) => field.id === "gpa")?.value || "",
      visible: item.visible !== false,
    }));

  const mapSkillSection = (section: ResumeSection) =>
    section.content?.find((item) => item.id === "description")?.value ||
    section.content?.[0]?.value ||
    "";

  const mapProjectSection = (section: ResumeSection) =>
    (section.content || []).map((item) => ({
      id: item.id,
      name: item.value || "",
      role: item.fields?.find((field) => field.id === "role")?.value || "",
      date: item.fields?.find((field) => field.id === "date")?.value || "",
      description:
        item.fields?.find((field) => field.id === "description")?.value || "",
      link: item.fields?.find((field) => field.id === "link")?.value || "",
      visible: item.visible !== false,
    }));

  const mapCustomSection = (section: ResumeSection): CustomItem[] =>
    (section.content || []).map((item) => ({
      id: item.id,
      title: item.value || "",
      subtitle:
        item.fields?.find((field) => field.id === "subtitle")?.value || "",
      dateRange:
        item.fields?.find((field) => field.id === "dateRange")?.value || "",
      description:
        item.fields?.find((field) => field.id === "description")?.value || "",
      visible: item.visible !== false,
    }));

  const renderSection = (section: ResumeSection) => {
    switch (section.id) {
      case "basic": {
        const basic = mapBasicSection(section);
        return (
          <>
            <BaseInfo basic={basic as any} globalSettings={data.globalSettings} />

            {basic.githubContributionsVisible && (
              <GithubContribution
                className="mt-2"
                githubKey={basic.githubKey}
                username={basic.githubUseName}
              />
            )}
          </>
        );
      }
      case "experience":
        return (
          <ExperienceSection
            experiences={mapExperienceSection(section)}
            globalSettings={data.globalSettings}
          />
        );
      case "education":
        return (
          <EducationSection
            education={mapEducationSection(section)}
            globalSettings={data.globalSettings}
          />
        );
      case "skills":
        return (
          <SkillSection
            skill={mapSkillSection(section)}
            globalSettings={data.globalSettings}
          />
        );
      case "projects":
        return (
          <ProjectSection
            projects={mapProjectSection(section)}
            globalSettings={data.globalSettings}
          />
        );
      default:
        if (section.content?.length) {
          const sectionTitle =
            data.menuSections.find((s) => s.id === section.id)?.title ||
            section.id;
          return (
            <CustomSection
              title={sectionTitle}
              key={section.id}
              sectionId={section.id}
              items={mapCustomSection(section)}
              globalSettings={data.globalSettings}
            />
          );
        }
        return null;
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
