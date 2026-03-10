"use client";

import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileJson, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { localUpsertResume } from "@/store/resume/utils.local";
import { upsertResumeByIdApi } from "@/store/resume/utils.prisma";
import { useAppStore } from "@/store/useApp";
import { generateUUID } from "@/utils/uuid";
import type { ResumeData } from "@/types/resume";
import { DEFAULT_TEMPLATES } from "@/config";
import { initialResumeState } from "@/config/initialResumeData";

type CreateResumeButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "onClick"
> & {
  withMotion?: boolean;
};

export const CreateResumeButton: React.FC<CreateResumeButtonProps> = ({
  withMotion = false,
  children,
  ...buttonProps
}) => {
  const t = useTranslations();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleCreateResume = () => {
    router.push("/dashboard/templates");
  };

  const normalizeImportedResume = (data: any): ResumeData => {
    const now = new Date().toISOString();
    const id = generateUUID();
    const baseTitle =
      typeof data?.title === "string" && data.title.trim()
        ? data.title.trim()
        : "导入简历";

    return {
      id,
      title: `${baseTitle} (Imported)`,
      createdAt: now,
      updatedAt: now,
      activeSection:
        typeof data?.activeSection === "string" && data.activeSection
          ? data.activeSection
          : "basic",
      templateId:
        typeof data?.templateId === "string" && data.templateId
          ? data.templateId
          : (DEFAULT_TEMPLATES[0]?.id ?? null),
      menuSections: Array.isArray(data?.menuSections) ? data.menuSections : [],
      globalSettings: {
        ...initialResumeState.globalSettings,
        ...(data?.globalSettings && typeof data.globalSettings === "object"
          ? data.globalSettings
          : {}),
      },
      isNeedSync: Boolean(useAppStore.getState().user?.id),
      isPublic: false,
    };
  };

  const handleImportClick = () => {
    if (isImporting) return;
    fileInputRef.current?.click();
  };

  const handleImportJson = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const buffer = await file.arrayBuffer();
      const text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
      const parsed = JSON.parse(text);
      const resume = normalizeImportedResume(parsed);

      if (!resume.menuSections.length) {
        throw new Error("JSON 文件缺少 menuSections，无法创建简历");
      }

      if (useAppStore.getState().user?.id) {
        await upsertResumeByIdApi(resume);
      } else {
        await localUpsertResume(resume);
      }

      toast.success("JSON 导入成功，已创建新简历");
      router.push(`/workbench/${resume.id}`);
    } catch (error) {
      console.error("Import JSON error:", error);
      toast.error("JSON 导入失败，请检查文件格式");
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  const content = (
    <div className="inline-flex items-center gap-1 group">
      <Button {...buttonProps} onClick={handleCreateResume}>
        <Plus className="mr-2 h-4 w-4" />
        {children ?? t("dashboard.resumes.create")}
      </Button>

      <HoverCard openDelay={120} closeDelay={120}>
        <HoverCardTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="h-9 w-9 text-muted-foreground transition-colors group-hover:text-primary group-hover:bg-primary/10"
            aria-label="更多操作"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent align="end" className="w-48 p-2">
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start"
            onClick={handleImportClick}
            disabled={isImporting}
          >
            <FileJson className="mr-2 h-4 w-4" />
            {isImporting ? "导入中..." : "导入 JSON"}
          </Button>
        </HoverCardContent>
      </HoverCard>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleImportJson}
      />
    </div>
  );

  if (!withMotion) return content;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {content}
    </motion.div>
  );
};
