import React, { useMemo } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { cn, pickObjectsFromList } from "@/lib/utils";
import {
  getBorderRadiusValue,
  GlobalSettings,
  ResumeSection,
} from "@/types/resume";
import { ResumeTemplate } from "@/types/template";
import { useResumeStore } from "@/store/resume/useResumeStore";

import Base64 from "@/components/photo/base64";
import { FieldComponent } from "../templates/components/Filed";
import GithubContribution from "../shared/GithubContribution";

interface BaseInfoProps {
  section?: ResumeSection;
  globalSettings?: GlobalSettings;
  template?: ResumeTemplate;
  layout: "left" | "right" | "center";
}

const BaseInfo = ({
  section,
  globalSettings,
  template,
  layout,
}: BaseInfoProps) => {
  const { setActiveSection } = useResumeStore();
  const useIconMode = globalSettings?.useIconMode ?? false;
  const { name, title, photo, github, ...otherFieldMap } = useMemo(() => {
    return pickObjectsFromList(section?.content);
  }, [section.content]);

  const otherBasicSectionFields = Object.values(otherFieldMap);

  const getIcon = (iconName: string | undefined) => {
    const IconComponent = Icons[
      iconName as keyof typeof Icons
    ] as React.ElementType;
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  const isModernTemplate = React.useMemo(() => {
    return template?.layout === "modern";
  }, [template?.layout]);

  const PhotoComponent = photo.value && photo.config?.visible && (
    <Base64
      imageAttributes={{
        src: photo.value,
        alt: `${name.value}'s photo`,
        width: photo.config?.width || 100,
        height: photo.config?.height || 100,
      }}
      style={{
        borderRadius: getBorderRadiusValue(
          photo.config || {
            borderRadius: "none",
            customBorderRadius: 0,
          }
        ),
        overflow: "hidden",
      }}
    />
  );

  // 基础样式
  const baseContainerClass =
    "hover:cursor-pointer hover:outline hover:outline-2 hover:outline-primary rounded-md transition-all ease-in-out hover:shadow-md";
  const baseFieldsClass = "";
  const baseFieldItemClass =
    "flex items-center whitespace-nowrap overflow-hidden";
  const baseNameTitleClass = "flex flex-col";

  // 左对齐布局样式
  const leftLayoutStyles = {
    container: "flex items-center justify-between gap-6",
    leftContent: "flex  items-center gap-6 ",
    fields: "grid grid-cols-2 gap-x-8 gap-y-2 justify-start min-w-[55%]",
    nameTitle: "text-left",
  };

  // 右对齐布局样式
  const rightLayoutStyles = {
    container: "flex items-center justify-between gap-6 flex-row-reverse",
    leftContent: "flex justify-end items-center gap-6 ",
    fields: "grid grid-cols-2 gap-x-8 gap-y-2 justify-start min-w-[55%]",
    nameTitle: "text-right",
  };

  // 居中布局样式
  const centerLayoutStyles = {
    container: "flex flex-col items-center gap-3",
    leftContent: "flex flex-col items-center gap-4",
    fields: "w-full flex justify-start items-center flex-wrap gap-3",
    nameTitle: "text-center",
  };

  // 根据布局选择样式
  const getLayoutStyles = () => {
    switch (layout) {
      case "right":
        return rightLayoutStyles;
      case "center":
        return centerLayoutStyles;
      default:
        return leftLayoutStyles;
    }
  };

  const layoutStyles = getLayoutStyles();

  const containerClass = cn(baseContainerClass, layoutStyles.container);
  const leftContentClass = cn(layoutStyles.leftContent);
  const fieldsContainerClass = cn(baseFieldsClass, layoutStyles.fields);
  const nameTitleClass = cn(baseNameTitleClass, layoutStyles.nameTitle);

  const NameTitleComponent = (
    <div className={nameTitleClass}>
      {name.value && (
        <motion.h1
          layout="position"
          className="font-bold"
          style={{
            fontSize: `30px`,
          }}
        >
          {name.value as string}
        </motion.h1>
      )}
      {title.value && (
        <motion.h2
          layout="position"
          style={{
            fontSize: "18px",
          }}
        >
          {title.value}
        </motion.h2>
      )}
    </div>
  );

  const FieldsComponent = (
    <motion.div
      layout="position"
      className={fieldsContainerClass}
      style={{
        fontSize: `${globalSettings?.baseFontSize || 14}px`,
        maxWidth: layout === "center" ? "none" : "600px",
      }}
    >
      {otherBasicSectionFields.map((item) => (
        <motion.div
          key={item.id}
          className={cn(baseFieldItemClass, isModernTemplate && "text-[#fff]")}
          style={{
            width: isModernTemplate ? "100%" : "",
          }}
        >
          <div className="flex items-center gap-2">
            {useIconMode ? getIcon(item.icon) : <span>{item.label}:</span>}
            <FieldComponent item={item} className="text-sm" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <>
      <div className={containerClass} onClick={() => setActiveSection("basic")}>
        <div className={leftContentClass}>
          {PhotoComponent}
          {NameTitleComponent}
        </div>
        {FieldsComponent}
      </div>
      {github.value && github.visible && (
        <GithubContribution
          className="mt-2"
          githubKey={github.config?.githubKey}
          username={github.config?.githubUseName}
        />
      )}
    </>
  );
};

export default BaseInfo;
