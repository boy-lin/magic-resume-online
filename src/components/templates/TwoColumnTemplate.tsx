import React, { useMemo } from "react";
import { ResumeData, MenuSectionId, ResumeSection } from "@/types/resume";
import { ResumeTemplate } from "@/types/template";
import Base64Image from "@/components/photo/base64";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import * as Icons from "lucide-react";
import { getFlexDirection } from "./utils";
import { FieldComponent } from "./components/Filed";

interface TwoColumnTemplateProps {
  data: ResumeData;
  template: ResumeTemplate;
}

const TwoColumnTemplate: React.FC<TwoColumnTemplateProps> = ({
  data,
  template,
}) => {
  const { globalSettings } = data;
  const t = useTranslations("workbench.basicPanel");
  const { colorScheme } = template;

  const [section1, ...otherSections] = data.menuSections;
  const [name, title, photo, github, ...otherSection1Fields] = section1.content;

  const leftSection = otherSections.slice(
    0,
    Math.floor(otherSections.length / 2)
  );
  const rightSection = otherSections.slice(
    Math.floor(otherSections.length / 2)
  );
  const useIconMode = globalSettings?.useIconMode ?? false;
  const getIcon = (iconName: string | undefined) => {
    const IconComponent = Icons[
      iconName as keyof typeof Icons
    ] as React.ElementType;
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  const renderIntroduction = (section: ResumeSection) => {
    const list = section.content;
    return (
      <>
        <h2
          className="text-lg font-bold pb-2 mb-4 border-b"
          style={{
            color: colorScheme.text,
            borderColor: colorScheme.primary,
          }}
        >
          {section.title}
        </h2>
        <div>
          {list.map((it) => (
            <FieldComponent item={it} className="text-sm" />
          ))}
        </div>
      </>
    );
  };

  const renderExperience = (section: ResumeSection) => {
    const list = section.content;
    return (
      <>
        <h2
          className="text-lg font-bold pb-2 mb-4 border-b"
          style={{
            color: colorScheme.text,
            borderColor: colorScheme.primary,
          }}
        >
          {section.title}
        </h2>
        <div className="space-y-4">
          {list.map((exp) => {
            return (
              <div
                key={exp.id}
                className={cn(
                  "flex flex-wrap justify-between space-y-2",
                  exp.visible ? "flex" : "hidden"
                )}
              >
                <div className="w-full">{exp.value}</div>
                {exp.fields.map((exp) => (
                  <FieldComponent item={exp} className="text-sm" />
                ))}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderEducation = (section: ResumeSection) => {
    const list = section.content;
    return (
      <>
        <h2
          className="text-lg font-bold pb-2 mb-4 border-b"
          style={{
            color: colorScheme.text,
            borderColor: colorScheme.primary,
          }}
        >
          {section.title}
        </h2>
        <div className="space-y-4">
          {list.map((edu) => {
            return (
              <div
                key={edu.id}
                className="flex flex-wrap justify-between space-y-2"
              >
                <div className="w-full">{edu.value}</div>
                {edu.fields.map((edu) => (
                  <FieldComponent item={edu} className="text-sm" />
                ))}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderSkills = (section: ResumeSection) => {
    const list = section.content;
    return (
      <>
        <h2
          className="text-lg font-bold pb-2 mb-4 border-b"
          style={{
            color: colorScheme.text,
            borderColor: colorScheme.primary,
          }}
        >
          {section.title}
        </h2>
        <div>
          {list.map((it) => (
            <FieldComponent item={it} className="text-sm" />
          ))}
        </div>
      </>
    );
  };

  const renderProjects = (section: ResumeSection) => {
    const list = section.content;
    return (
      <>
        <h2
          className="text-lg font-bold pb-2 mb-4 border-b"
          style={{
            color: colorScheme.text,
            borderColor: colorScheme.primary,
          }}
        >
          {section.title}
        </h2>
        <div className="space-y-4">
          {list.map((pj) => {
            return (
              <div key={pj.id}>
                <FieldComponent item={pj} className="text-sm" />
                {pj.fields.map((pj) => (
                  <FieldComponent item={pj} className="text-sm" />
                ))}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderSection = (section, index) => {
    let content = null;
    switch (section.id) {
      case MenuSectionId.introduction:
        content = renderIntroduction(section);
        break;
      case MenuSectionId.experience:
        content = renderExperience(section);
        break;
      case MenuSectionId.education:
        content = renderEducation(section);
        break;
      case MenuSectionId.skills:
        content = renderSkills(section);
        break;
      case MenuSectionId.projects:
        content = renderProjects(section);
        break;
      default:
        content = null;
    }
    if (!content) return null;
    return (
      <div
        key={section.id}
        className={cn("p-4")}
        style={{
          borderColor: colorScheme.primary,
        }}
      >
        {content}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* 简历主体 */}
      <div
        className="min-h-[297mm] border-2"
        style={{
          borderColor: colorScheme.secondary,
          backgroundColor: colorScheme.background,
        }}
      >
        {/* 个人信息 */}
        <div
          className="p-4 gap-4 flex justify-between border-b items-center"
          style={{
            backgroundColor: colorScheme.background,
            borderColor: colorScheme.secondary,
            flexDirection: getFlexDirection(section1.config?.layout),
          }}
        >
          {/* 姓名和职位 */}
          <div
            className={cn(
              "flex h-full justify-around gap-2",
              section1.config?.layout === "center"
                ? "flex-row gap-8"
                : "flex-col",
              section1.config?.layout === "center" ? "order-2" : "order-1"
            )}
          >
            <h1
              className="text-3xl font-bold"
              style={{ color: colorScheme.text }}
            >
              {name.value}
            </h1>
            <div
              className="text-white px-4 py-2 inline-block whitespace-nowrap"
              style={{ backgroundColor: colorScheme.primary }}
            >
              <span className="text-sm font-medium tracking-wider">
                {title.value}
              </span>
            </div>
          </div>
          {/* 联系方式 */}
          <motion.div
            className="flex flex-wrap gap-x-8 gap-y-2 justify-start pl-2"
            style={{
              fontSize: `${globalSettings?.baseFontSize || 14}px`,
              color: colorScheme.text,
              maxWidth: "600px",
              order: section1.config?.layout === "center" ? 3 : 1,
            }}
          >
            {otherSection1Fields.map((item) => (
              <motion.div
                key={item.id}
                className={cn(
                  "flex items-center whitespace-nowrap overflow-hidden"
                )}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {section1.config?.useIconMode ? (
                    getIcon(item.icon)
                  ) : (
                    <span>{item.label}:</span>
                  )}
                  <span className="truncate">
                    <FieldComponent item={item} className="text-sm" />
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
          {/* 头像 */}
          <div
            className="justify-end"
            style={{
              order: section1.config?.layout === "center" ? 1 : 1,
              display: photo.config?.visible ? "flex" : "none",
            }}
          >
            <div
              className="flex w-24 h-24 rounded-full border-2 overflow-hidden items-center justify-center"
              style={{
                borderColor: colorScheme.primary,
                backgroundColor: colorScheme.secondary,
              }}
            >
              <Base64Image
                imageAttributes={{
                  src: photo.value,
                }}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
        {/* 主要内容 */}
        <div
          className="flex"
          style={{
            backgroundColor: colorScheme.background,
            borderColor: colorScheme.secondary,
          }}
        >
          <div className="basis-1/3">{leftSection.map(renderSection)}</div>
          <div
            className="basis-2/3 border-l"
            style={{
              borderColor: colorScheme.primary,
            }}
          >
            {rightSection.map(renderSection)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoColumnTemplate;
