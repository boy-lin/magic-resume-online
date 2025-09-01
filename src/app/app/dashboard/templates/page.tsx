"use client";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Filter, Grid, List, Star, Users } from "lucide-react";
import { templateImages } from "@/app/constant/images";
import { Button } from "@/components/ui-lab/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { DEFAULT_TEMPLATES } from "@/config";
import { useRequest } from "ahooks";
import Template from "@/components/blocks/templates/template";
import { useResumeListStore } from "@/store/resume";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// 模板标签数据
const templateTags = {
  classic: ["简约", "传统", "通用"],
  modern: ["现代", "专业", "创意"],
  "left-right": ["双栏", "紧凑", "高效"],
  timeline: ["时间线", "故事性", "详细"],
};

const TemplatesPage = () => {
  const t = useTranslations("dashboard.templates");
  const router = useRouter();
  const { createResume } = useResumeListStore();
  const [previewTemplate, setPreviewTemplate] = useState<{
    id: string;
    open: boolean;
  } | null>(null);

  // 新增状态
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const createResumeAsync = async (templateId: string) => {
    const template = DEFAULT_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    const resumeId = await createResume(templateId);
    const { resumes, updateResume } = useResumeListStore.getState();
    const resume = resumes[resumeId];

    if (resume) {
      updateResume(resumeId, {
        globalSettings: {
          ...resume.globalSettings,
          themeColor: template.colorScheme.primary,
          sectionSpacing: template.spacing.sectionGap,
          paragraphSpacing: template.spacing.itemGap,
          pagePadding: template.spacing.contentPadding,
        },
        basic: {
          ...resume.basic,
          layout: template.basic.layout,
        },
      });
    }

    router.push(`/app/workbench/${resumeId}`);
  };

  const { loading, run: handleCreateResume } = useRequest(createResumeAsync, {
    manual: true,
  });

  // 筛选和搜索逻辑
  const filteredTemplates = useMemo(() => {
    return DEFAULT_TEMPLATES.filter((template) => {
      const templateKey =
        template.id === "left-right" ? "leftRight" : template.id;
      const templateName = t(`${templateKey}.name`).toLowerCase();
      const templateDesc = t(`${templateKey}.description`).toLowerCase();
      const searchLower = searchQuery.toLowerCase();

      const matchesSearch =
        searchQuery === "" ||
        templateName.includes(searchLower) ||
        templateDesc.includes(searchLower);

      const matchesCategory =
        selectedCategory === "all" || template.id === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, t]);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col space-y-8">
        {/* 页面标题和统计信息 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
            <p className="text-muted-foreground mt-1">
              选择适合你的简历模板，开始创建专业简历
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {DEFAULT_TEMPLATES.length} {t("templateCount")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>{t("freeToUse")}</span>
            </div>
          </div>
        </div>

        {/* 搜索和筛选工具栏 */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-3 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allTemplates")}</SelectItem>
                <SelectItem value="classic">{t("classicTemplates")}</SelectItem>
                <SelectItem value="modern">{t("modernTemplates")}</SelectItem>
                <SelectItem value="left-right">
                  {t("twoColumnLayout")}
                </SelectItem>
                <SelectItem value="timeline">
                  {t("timelineTemplates")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 视图模式切换 */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 搜索结果提示 */}
        {searchQuery && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {t("searchResults", { count: filteredTemplates.length })}
            </span>
            {searchQuery && (
              <Badge variant="secondary" className="text-xs">
                &ldquo;{searchQuery}&rdquo;
              </Badge>
            )}
          </div>
        )}

        {/* 模板网格 */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={cn(
            "gap-6",
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
              : "flex flex-col space-y-4"
          )}
        >
          {filteredTemplates.map((template) => {
            return (
              <Template
                key={template.id}
                template={template}
                setPreviewTemplate={setPreviewTemplate}
                viewMode={viewMode}
                tags={
                  templateTags[template.id as keyof typeof templateTags] || []
                }
              />
            );
          })}
        </motion.div>

        {/* 无搜索结果提示 */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">{t("noResults")}</h3>
              <p className="text-sm">{t("noResultsHint")}</p>
            </div>
          </div>
        )}

        <Dialog
          open={previewTemplate?.open || false}
          onOpenChange={(open) => {
            if (!open) setPreviewTemplate(null);
          }}
        >
          {previewTemplate && (
            <DialogContent className="max-w-[680px] gap-0 overflow-hidden border-0 shadow-lg rounded-xl bg-white dark:bg-gray-900">
              <DialogTitle className="text-lg font-medium">
                {t(
                  `${
                    previewTemplate.id === "left-right"
                      ? "leftRight"
                      : previewTemplate.id
                  }.name`
                )}
              </DialogTitle>
              <div className="flex flex-col flex-grow-0 h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <Image
                      src={templateImages[previewTemplate.id]}
                      alt={t(
                        `${
                          previewTemplate.id === "left-right"
                            ? "leftRight"
                            : previewTemplate.id
                        }.name`
                      )}
                      width={600}
                      height={848}
                      className="rounded-md shadow-sm"
                      priority
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="flex justify-center border-t border-gray-100 dark:border-gray-800">
                <Button
                  className="w-full"
                  onClick={() => {
                    setPreviewTemplate(null);
                    handleCreateResume(previewTemplate.id);
                  }}
                >
                  {t("useTemplate")}
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default TemplatesPage;
