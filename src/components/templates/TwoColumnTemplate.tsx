import React, { useMemo } from "react";
import * as Icons from "lucide-react";
import { ResumeData, MenuSectionId, ResumeSection } from "@/types/resume";
import { ResumeTemplate } from "@/types/template";
import Base64Image from "@/components/photo/base64";
import { motion } from "framer-motion";
import { cn, formatDate, pickObjectsFromList } from "@/lib/utils";

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
  const { colorScheme } = template;
  const { basic, ...otherSectionMap } = useMemo(() => {
    return pickObjectsFromList(data.menuSections);
  }, [data.menuSections]);

  const { name, title, photo, github, ...otherFieldsMap } = useMemo(() => {
    return pickObjectsFromList(basic?.content);
  }, [basic.content]);
  const otherBasicSectionFields = Object.values(otherFieldsMap);

  const [leftSection, rightSection] = useMemo(() => {
    const otherSections = Object.values(otherSectionMap);
    return [
      otherSections.slice(0, Math.floor(otherSections.length / 2)),
      otherSections.slice(Math.floor(otherSections.length / 2)),
    ];
  }, [otherSectionMap]);

  const getIcon = (iconName: string | undefined) => {
    const IconComponent = Icons[
      iconName as keyof typeof Icons
    ] as React.ElementType;
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  const cardTitleStyle = {
    color: colorScheme.text,
    borderColor: colorScheme.primary,
  };

  const cardItemTitleStyle = {
    fontSize: `${globalSettings?.subheaderSize || 16}px`,
  };

  const renderIntroduction = (section: ResumeSection) => {
    const list = section.content;
    return (
      <>
        <h2
          className="text-lg font-bold pb-2 mb-4 border-b"
          style={cardTitleStyle}
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
          style={cardTitleStyle}
        >
          {section.title}
        </h2>
        <div className="space-y-4">
          {list.map((exp) => {
            const { company, position, date, ...otherFieldMap } =
              pickObjectsFromList(exp.fields);
            return (
              <div
                key={exp.id}
                className={cn(
                  "flex flex-col space-y-1",
                  exp.visible ? "" : "hidden"
                )}
              >
                <div className="" style={cardItemTitleStyle}>
                  {company.value}
                </div>
                <div className="flex justify-between text-subtitleFont text-sm">
                  <div>{position.value}</div>
                  <FieldComponent item={date} />
                </div>
                {Object.values(otherFieldMap).map((exp) => (
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
          style={cardTitleStyle}
        >
          {section.title}
        </h2>
        <div className="space-y-4">
          {list.map((edu) => {
            const {
              school,
              major,
              degree,
              startDate,
              endDate,
              ...otherFieldMap
            } = pickObjectsFromList(edu.fields);
            return (
              <div key={edu.id} className="flex flex-col space-y-1">
                <div className="flex justify-between">
                  <div style={cardItemTitleStyle}>{school?.value}</div>
                  <div className="text-subtitleFont text-sm">
                    {major?.value}
                  </div>
                  <div className="text-sm">
                    {formatDate(new Date(startDate?.value))} -{" "}
                    {formatDate(new Date(endDate?.value))}
                  </div>
                </div>
                {Object.values(otherFieldMap).map((item) => (
                  <FieldComponent item={item} className="text-sm" />
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
          style={cardTitleStyle}
        >
          {section.title}
        </h2>
        <div className="space-y-2 text-sm">
          {list.map((it) => (
            <FieldComponent item={it} />
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
          style={cardTitleStyle}
        >
          {section.title}
        </h2>
        <div className="space-y-4">
          {list.map((pj) => {
            const { name, role, date, link, ...otherFieldMap } =
              pickObjectsFromList(pj.fields);
            return (
              <div key={pj.id} className="flex flex-col space-y-1">
                <div className="flex justify-between">
                  <div style={cardItemTitleStyle}>
                    {link?.value ? (
                      <a
                        className="underline"
                        href={link?.value}
                        target="_blank"
                      >
                        {name?.value}
                      </a>
                    ) : (
                      name?.value
                    )}
                  </div>
                  <div className="text-subtitleFont text-sm">{role?.value}</div>
                  <div className="text-sm">{date?.value}</div>
                </div>
                <div className="space-y-2 text-sm">
                  {Object.values(otherFieldMap).map((item) => (
                    <FieldComponent item={item} />
                  ))}
                </div>
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
            flexDirection: getFlexDirection(basic.config?.layout),
          }}
        >
          {/* 姓名和职位 */}
          <div
            className={cn(
              "flex h-full justify-around gap-2",
              basic.config?.layout === "center" ? "flex-row gap-8" : "flex-col",
              basic.config?.layout === "center" ? "order-2" : "order-1"
            )}
          >
            <h1
              className="text-3xl font-bold"
              style={{ color: colorScheme.text }}
            >
              {name?.value}
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
              order: basic.config?.layout === "center" ? 3 : 1,
            }}
          >
            {otherBasicSectionFields.map((item) => (
              <motion.div
                key={item.id}
                className={cn(
                  "flex items-center whitespace-nowrap overflow-hidden"
                )}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {basic.config?.useIconMode ? (
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
              order: basic.config?.layout === "center" ? 1 : 1,
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
