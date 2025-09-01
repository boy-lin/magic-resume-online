import React from "react";
import { ResumeData } from "@/types/resume";
import { ResumeTemplate } from "@/types/template";
import Base64Image from "@/components/photo/base64";
import BaseInfo from "../preview/BaseInfo";
import GithubContribution from "../shared/GithubContribution";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { useLocale, useTranslations } from "next-intl";
import * as Icons from "lucide-react";
import { getAlignItems, getFlexDirection } from "./utils";

interface TwoColumnTemplateProps {
  data: ResumeData;
  template: ResumeTemplate;
}

const TwoColumnTemplate: React.FC<TwoColumnTemplateProps> = ({
  data,
  template,
}) => {
  const {
    basic,
    experience,
    education,
    skillContent,
    projects,
    globalSettings,
  } = data;
  const t = useTranslations("workbench.basicPanel");
  const { name, photo, title, email, phone, location, githubKey } = basic;
  const { colorScheme } = template;
  console.log("data", data);
  console.log("template", template);

  const enabledSections = data.menuSections.filter(
    (section) => section.enabled
  );
  const useIconMode = globalSettings?.useIconMode ?? false;
  const locale = useLocale();
  const getIcon = (iconName: string | undefined) => {
    const IconComponent = Icons[
      iconName as keyof typeof Icons
    ] as React.ElementType;
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };
  const getOrderedFields = React.useMemo(() => {
    if (!basic.fieldOrder) {
      return [
        {
          key: "email",
          value: basic.email,
          icon: basic.icons?.email || "Mail",
          label: "电子邮箱",
          visible: true,
          custom: false,
        },
      ].filter((item) => Boolean(item.value && item.visible));
    }

    return basic.fieldOrder
      .filter(
        (field) =>
          field.visible !== false &&
          field.key !== "name" &&
          field.key !== "title"
      )
      .map((field) => ({
        key: field.key,
        value:
          field.key === "birthDate" && basic[field.key]
            ? new Date(basic[field.key] as string).toLocaleDateString(locale)
            : (basic[field.key] as string),
        icon: basic.icons?.[field.key] || "User",
        label: field.label,
        visible: field.visible,
        custom: field.custom,
      }))
      .filter((item) => Boolean(item.value));
  }, [basic]);

  const allFields = [
    ...getOrderedFields,
    ...(basic.customFields
      ?.filter((field) => field.visible !== false)
      .map((field) => ({
        key: field.id,
        value: field.value,
        icon: field.icon,
        label: field.label,
        visible: true,
        custom: true,
      })) || []),
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* 简历主体 */}
      <div
        className="grid grid-cols-5 min-h-[297mm] border-2"
        style={{
          borderColor: colorScheme.secondary,
          backgroundColor: colorScheme.background,
        }}
      >
        <div
          className="col-span-5 p-4 gap-4 flex justify-between border-b items-center"
          style={{
            backgroundColor: colorScheme.background,
            borderColor: colorScheme.secondary,
            flexDirection: getFlexDirection(basic?.layout),
          }}
        >
          {/* 姓名和职位 */}
          <div
            className={cn(
              "flex h-full justify-around",
              basic?.layout === "center" ? "flex-row gap-8" : "flex-col",
              basic?.layout === "center" ? "order-2" : "order-1"
            )}
          >
            <h1
              className="text-3xl font-bold"
              style={{ color: colorScheme.text }}
            >
              {name}
            </h1>
            <div
              className="text-white px-4 py-2 inline-block"
              style={{ backgroundColor: colorScheme.primary }}
            >
              <span className="text-sm font-medium tracking-wider">
                {title}
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
              order: basic?.layout === "center" ? 3 : 1,
            }}
          >
            {allFields.map((item) => (
              <motion.div
                key={item.key}
                className={cn(
                  "flex items-center whitespace-nowrap overflow-hidden text-baseFont"
                )}
                style={{
                  width: "100%",
                }}
              >
                {useIconMode ? (
                  <div className="flex items-center gap-1">
                    {getIcon(item.icon)}
                    {item.key === "email" ? (
                      <a href={`mailto:${item.value}`} className="underline">
                        {item.value}
                      </a>
                    ) : (
                      <span>{item.value}</span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 overflow-hidden">
                    {!item.custom && (
                      <span>{t(`basicPanel.basicFields.${item.key}`)}:</span>
                    )}
                    {item.custom && <span>{item.label}:</span>}
                    <span className="truncate" suppressHydrationWarning>
                      {item.value}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
          {/* 头像 */}
          <div
            className="flex justify-end"
            style={{
              order: basic?.layout === "center" ? 1 : 1,
            }}
          >
            <div
              className="w-24 h-24 rounded-full border-2 overflow-hidden flex items-center justify-center"
              style={{
                borderColor: colorScheme.primary,
                backgroundColor: colorScheme.secondary,
              }}
            >
              <Base64Image
                imageAttributes={{
                  src: photo,
                }}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
        {/* 左侧栏 - 个人信息 */}
        <div
          className="col-span-2 p-8 border-r"
          style={{
            backgroundColor: colorScheme.background,
            borderColor: colorScheme.secondary,
          }}
        >
          {/* 个人简介 */}
          <div className="mb-8">
            <h2
              className="text-lg font-bold pb-2 mb-4 border-b"
              style={{
                color: colorScheme.text,
                borderColor: colorScheme.primary,
              }}
            >
              PROFILE
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: colorScheme.secondary }}
            >
              {basic.employementStatus && `${basic.employementStatus} - `}
              {basic.birthDate && `出生于 ${basic.birthDate} - `}
              具备丰富的{experience?.length || 0}
              年工作经验，专注于前端开发技术。
              具备扎实的计算机基础，熟悉现代前端技术栈，有良好的代码规范和团队协作能力。
              热爱技术，持续学习新技术，追求代码质量和用户体验的完美结合。
            </p>
          </div>

          {/* 工作经验 */}
          <div>
            <h2
              className="text-lg font-bold pb-2 mb-4 border-b"
              style={{
                color: colorScheme.text,
                borderColor: colorScheme.primary,
              }}
            >
              EXPERIENCE
            </h2>
            <div className="space-y-6">
              {experience?.map((exp) => (
                <div key={exp.id}>
                  <h3
                    className="font-bold text-sm mb-1"
                    style={{ color: colorScheme.text }}
                  >
                    {exp.position}
                  </h3>
                  <p
                    className="text-sm mb-1"
                    style={{ color: colorScheme.secondary }}
                  >
                    {exp.company}
                  </p>
                  <p
                    className="text-sm mb-2"
                    style={{ color: colorScheme.secondary }}
                  >
                    {exp.date}
                  </p>
                  <div
                    className="text-sm space-y-1"
                    style={{ color: colorScheme.secondary }}
                    dangerouslySetInnerHTML={{ __html: exp.details }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧栏 - 教育、技能和联系方式 */}
        <div
          className="col-span-3 flex flex-col"
          style={{ backgroundColor: colorScheme.background }}
        >
          <div className="flex-1 p-8">
            {/* 教育经历 */}
            <div className="mb-8">
              <h2
                className="text-lg font-bold pb-2 mb-4 border-b"
                style={{
                  color: colorScheme.text,
                  borderColor: colorScheme.primary,
                }}
              >
                EDUCATION
              </h2>
              <div className="space-y-4">
                {education?.map((edu) => (
                  <div key={edu.id}>
                    <h3
                      className="font-bold text-sm mb-1"
                      style={{ color: colorScheme.text }}
                    >
                      {edu.degree}
                    </h3>
                    <p
                      className="text-sm mb-1"
                      style={{ color: colorScheme.secondary }}
                    >
                      {edu.school}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: colorScheme.secondary }}
                    >
                      {edu.startDate} - {edu.endDate}
                    </p>
                    {edu.description && (
                      <div
                        className="text-sm mt-2"
                        style={{ color: colorScheme.secondary }}
                        dangerouslySetInnerHTML={{ __html: edu.description }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 技能 */}
            <div className="mb-8">
              <h2
                className="text-lg font-bold pb-2 mb-4 border-b"
                style={{
                  color: colorScheme.text,
                  borderColor: colorScheme.primary,
                }}
              >
                SKILLS
              </h2>
              <div
                className="text-sm"
                style={{ color: colorScheme.secondary }}
                dangerouslySetInnerHTML={{ __html: skillContent }}
              />
            </div>

            {/* 项目经历 */}
            {projects && projects.length > 0 && (
              <div className="mb-8">
                <h2
                  className="text-lg font-bold pb-2 mb-4 border-b"
                  style={{
                    color: colorScheme.text,
                    borderColor: colorScheme.primary,
                  }}
                >
                  PROJECTS
                </h2>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id}>
                      <h3
                        className="font-bold text-sm mb-1"
                        style={{ color: colorScheme.text }}
                      >
                        {project.name}
                      </h3>
                      <p
                        className="text-sm mb-1"
                        style={{ color: colorScheme.secondary }}
                      >
                        {project.role}
                      </p>
                      <p
                        className="text-sm mb-2"
                        style={{ color: colorScheme.secondary }}
                      >
                        {project.date}
                      </p>
                      <div
                        className="text-sm"
                        style={{ color: colorScheme.secondary }}
                        dangerouslySetInnerHTML={{
                          __html: project.description,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoColumnTemplate;
