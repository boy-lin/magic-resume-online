"use client";
import React from "react";
import { GripVertical, Trash2, Eye, EyeOff } from "lucide-react";
import { Reorder } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import PhotoUpload from "@/components/shared/PhotoSelector";
import IconSelector from "../IconSelector";
import AlignSelector from "./AlignSelector";
import Field from "../Field";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/resume/useResumeStore";
import {
  ResumeSectionContent,
  FieldType as ResumeFieldType,
  ResumeSection,
} from "@/types/resume";
import { TransitionOpacity } from "@/components/transition/opacity";
import { InputName } from "./input-name";

const itemAnimations = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  duration: 0,
};

const BasicPanel: React.FC<{ section: ResumeSection }> = ({ section }) => {
  const { updateSectionBasic } = useResumeStore();
  const [name, title, photo, github, ...otherFields] = section.content;
  const t = useTranslations("workbench.basicPanel");

  const updateSectionBasicContent = (item: ResumeSectionContent) => {
    updateSectionBasic({
      content: section.content.map((c) =>
        c.id !== item.id ? c : { ...c, ...item }
      ),
    });
  };

  const renderBasicField = (field: ResumeFieldType) => {
    const selectedIcon = section.config?.useIconMode ? field.icon : field.label;
    return (
      <Reorder.Item
        value={field}
        id={field.id}
        key={field.id}
        className="group touch-none list-none"
        dragListener={field.id !== "name" && field.id !== "title"}
        {...itemAnimations}
      >
        <div
          className={cn(
            "flex items-center gap-2 p-2",
            "bg-white dark:bg-neutral-900",
            "rounded-lg ",
            !field.visible && "opacity-75"
          )}
        >
          {field.id !== "name" && field.id !== "title" && (
            <div className="shrink-0">
              <GripVertical
                className={cn(
                  "w-5 h-5 cursor-grab active:cursor-grabbing",
                  "text-neutral-400 dark:text-neutral-600",
                  "hover:text-neutral-600 dark:hover:text-neutral-400",
                  "transition-colors duration-200"
                )}
              />
            </div>
          )}

          <div className="flex flex-1 min-w-0 items-center">
            {field.id !== "name" && field.id !== "title" && (
              <IconSelector
                value={selectedIcon}
                onChange={(value) => {
                  updateSectionBasicContent({
                    ...field,
                    icon: value,
                  });
                }}
              />
            )}
            <div className=" w-[80px] ml-[4px] text-sm font-medium text-neutral-700 dark:text-neutral-200">
              {t(`basicFields.${field.id}`)}
            </div>
            <div className="flex-1">
              <Field
                label=""
                value={field.value}
                onChange={(value) =>
                  updateSectionBasicContent({
                    ...field,
                    value,
                  })
                }
                placeholder={`请输入${field.label}`}
                type={field.type}
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "shrink-0 h-8 px-2",
                "text-neutral-500 dark:text-neutral-400",
                "hover:text-neutral-700 dark:hover:text-neutral-200"
              )}
              onClick={() => {
                updateSectionBasicContent({
                  ...field,
                  visible: !field.visible,
                });
              }}
            >
              {field.visible ? (
                <Eye className="w-4 h-4 text-primary" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </Button>

            {field.id !== "name" && field.id !== "title" && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "shrink-0 h-8 px-2",
                  "text-neutral-500 dark:text-neutral-400",
                  "hover:text-red-600 dark:hover:text-red-400"
                )}
                onClick={() => {
                  updateSectionBasicContent({
                    ...field,
                    visible: false,
                  });
                }}
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            )}
          </div>
        </div>
      </Reorder.Item>
    );
  };

  return (
    <div className="space-y-4 p-2">
      <div className="space-y-2">
        <div className="text-center text-2xl">
          <InputName
            value={section.title}
            onChange={(title) =>
              updateSectionBasic({
                title,
              })
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <h2 className="text-lg font-medium">{t("layout")}</h2>
          <div className=" ">
            <AlignSelector
              value={section.config?.layout || "left"}
              onChange={(value) => {
                updateSectionBasic({
                  config: {
                    ...section.config,
                    layout: value,
                  },
                });
              }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-medium">{t("title")}</h2>
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 border border-neutral-100 dark:border-neutral-700">
            <PhotoUpload
              photo={photo}
              updatePhoto={(value) => {
                updateSectionBasicContent(value);
              }}
            />
          </div>
        </div>
      </div>

      <TransitionOpacity className="space-y-2">
        <h3 className="font-medium text-neutral-900 dark:text-neutral-200 px-1">
          {t("basicField")}
        </h3>
        <div>
          <div className="flex items-center gap-2 p-2">
            <div className=" w-[80px] ml-[4px] text-sm font-medium text-neutral-700 dark:text-neutral-200">
              {t(`basicFields.${name.id}`)}
            </div>
            <Field
              className="flex-1"
              label=""
              value={name.value}
              onChange={(value) =>
                updateSectionBasicContent({
                  ...name,
                  value,
                })
              }
              placeholder={`请输入${name.label}`}
              type={name.type}
            />
          </div>
          <div className="flex items-center gap-2 p-2">
            <div className=" w-[80px] ml-[4px] text-sm font-medium text-neutral-700 dark:text-neutral-200">
              {t(`basicFields.${title.id}`)}
            </div>
            <Field
              className="flex-1"
              label=""
              value={title.value}
              onChange={(value) =>
                updateSectionBasicContent({
                  ...title,
                  value,
                })
              }
              placeholder={`请输入${title.label}`}
              type={title.type}
            />
          </div>

          <Reorder.Group
            axis="y"
            as="div"
            values={otherFields}
            onReorder={(fields) =>
              updateSectionBasic({
                content: [name, title, photo, github, ...fields],
              })
            }
            className="space-y-2"
          >
            {otherFields.map((field) => renderBasicField(field))}
          </Reorder.Group>
        </div>
      </TransitionOpacity>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-neutral-900 dark:text-neutral-200 px-1">
            {t("githubContributions")}
          </h3>

          <Switch
            checked={github?.config?.githubContributionsVisible}
            onCheckedChange={(checked) =>
              updateSectionBasicContent({
                ...github,
                config: {
                  ...github.config,
                  githubContributionsVisible: checked,
                },
              })
            }
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center ml-3 space-x-2">
            <div className=" w-[110px]">Access Token</div>
            <Input
              placeholder="请输入github access token"
              className="flex-1"
              value={github.config?.githubKey}
              onChange={(e) =>
                updateSectionBasicContent({
                  ...github,
                  config: {
                    ...github.config,
                    githubKey: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="flex items-center ml-3 mt-4 space-x-2">
            <div className="w-[110px]">UseName</div>
            <Input
              className="flex-1"
              placeholder="请输入github username"
              value={github.config?.githubUseName}
              onChange={(e) =>
                updateSectionBasicContent({
                  ...github,
                  config: {
                    ...github.config,
                    githubUseName: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicPanel;
