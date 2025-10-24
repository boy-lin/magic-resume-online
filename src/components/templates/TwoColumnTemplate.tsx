import React, { useMemo } from "react";
import {
  Experience,
  Education,
  Project,
  ResumeData,
  MenuSectionId,
  ResumeSection,
} from "@/types/resume";
import { ResumeTemplate } from "@/types/template";
import Base64Image from "@/components/photo/base64";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { useLocale, useTranslations } from "next-intl";
import * as Icons from "lucide-react";
import { getFlexDirection } from "./utils";

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
  const leftSection = otherSections.slice(
    0,
    Math.floor(otherSections.length / 2)
  );
  const rightSection = otherSections.slice(
    Math.floor(otherSections.length / 2)
  );
  const [name, title, photo, github, ...otherSection1Fields] = section1.content;

  const useIconMode = globalSettings?.useIconMode ?? false;
  const getIcon = (iconName: string | undefined) => {
    const IconComponent = Icons[
      iconName as keyof typeof Icons
    ] as React.ElementType;
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  const renderFiled = (item) => {
    if (item.type === "text") {
      return (
        <div className="text-sm" style={{ color: colorScheme.secondary }}>
          {item.value}
        </div>
      );
    } else if (item.type === "textarea") {
      return (
        <div
          className="text-sm"
          style={{ color: colorScheme.secondary }}
          dangerouslySetInnerHTML={{ __html: item.value }}
        />
      );
    } else if (item.type === "email") {
      return (
        <a href={`mailto:${item.value}`} className="underline">
          {item.value}
        </a>
      );
    } else if (item.type === "link") {
      return (
        <a href={item.value} className="underline">
          {item.value}
        </a>
      );
    }

    return item?.value || "";
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
        <div>{list.map((it) => renderFiled(it))}</div>
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
        <div className="space-y-6">
          {list.map((exp) => {
            return (
              <>
                {renderFiled(exp)}
                {exp.fields.map((exp) => renderFiled(exp))}
              </>
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
              <div key={edu.id}>
                {renderFiled(edu)}
                {edu.fields.map((edu) => renderFiled(edu))}
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
        <div>{list.map((it) => renderFiled(it))}</div>
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
                {renderFiled(pj)}
                {pj.fields.map((pj) => renderFiled(pj))}
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
        className={cn("p-8")}
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
              "flex h-full justify-around",
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
              className="text-white px-4 py-2 inline-block"
              style={{ backgroundColor: colorScheme.primary }}
            >
              <span className="text-sm font-medium tracking-wider">
                {title.value}
              </span>
            </div>
          </div>
          {/* 联系方式 */}
          <motion.div
            className="grid grid-cols-2 gap-x-8 gap-y-2 justify-start"
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
                  "flex items-center whitespace-nowrap overflow-hidden text-baseFont"
                )}
                style={{
                  width: "100%",
                }}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {section1.config?.useIconMode ? (
                    getIcon(item.icon)
                  ) : (
                    <span>{item.label}:</span>
                  )}
                  <span className="truncate" suppressHydrationWarning>
                    {renderFiled(item)}
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
