import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import { Eye, Play, Star, Users } from "lucide-react";

import { useResumeStore } from "@/store/useResumeStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui-lab/button";
import { Badge } from "@/components/ui/badge";

import classic from "@/assets/images/template-cover/classic.jpg";
import modern from "@/assets/images/template-cover/modern.jpg";
import leftRight from "@/assets/images/template-cover/left-right.jpg";
import timeline from "@/assets/images/template-cover/timeline.jpg";

import { cn } from "@/lib/utils";
import { DEFAULT_TEMPLATES } from "@/config";
import { useRequest } from "ahooks";

const templateImages: Record<string, StaticImageData> = {
  classic,
  modern,
  "left-right": leftRight,
  timeline,
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface TemplateProps {
  template: any;
  setPreviewTemplate: (template: { id: string; open: boolean }) => void;
  viewMode?: "grid" | "list";
  tags?: string[];
}

export default function Template({
  template,
  setPreviewTemplate,
  viewMode = "grid",
  tags = [],
}: TemplateProps) {
  const t = useTranslations("dashboard.templates");
  const router = useRouter();
  const { createResume } = useResumeStore();

  const createResumeAsync = async (templateId: string) => {
    const template = DEFAULT_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    const resumeId = await createResume(templateId);
    // 注意：这里需要从 store 中获取当前状态，但 useResumeStore 不支持 getState
    // 暂时跳过这部分逻辑，或者需要重构状态管理
    // const { resumes, updateResume } = useResumeStore.getState();
    // const resume = resumes[resumeId];

    // if (resume) {
    //   updateResume(resumeId, {
    //     globalSettings: {
    //       ...resume.globalSettings,
    //       themeColor: template.colorScheme.primary,
    //       sectionSpacing: template.spacing.sectionGap,
    //       paragraphSpacing: template.spacing.itemGap,
    //       pagePadding: template.spacing.contentPadding,
    //     },
    //     basic: {
    //       ...resume.basic,
    //       layout: template.basic.layout,
    //   });
    // }

    router.push(`/app/workbench/${resumeId}`);
  };

  const { loading, run: handleCreateResume } = useRequest(createResumeAsync, {
    manual: true,
  });

  const templateKey = template.id === "left-right" ? "leftRight" : template.id;

  if (viewMode === "list") {
    return (
      <motion.div key={template.id} variants={item}>
        <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg border border-gray-200 hover:border-primary/40 dark:border-gray-800 rounded-xl">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              {/* 模板预览图 */}
              <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden bg-gray-50 dark:bg-gray-900">
                <div className="h-full w-full p-3 transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="relative h-full w-full overflow-hidden rounded-lg shadow-sm">
                    <Image
                      src={templateImages[template.id]}
                      alt={t(`${templateKey}.name`)}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 200px"
                      priority
                    />
                  </div>
                </div>

                {/* 悬停遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* 快速操作按钮 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 text-gray-900 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplate({ id: template.id, open: true });
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      预览
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary/90 hover:bg-primary"
                      loading={loading}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateResume(template.id);
                      }}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      使用
                    </Button>
                  </div>
                </div>
              </div>

              {/* 模板信息 */}
              <div className="flex-1 p-4 sm:p-6">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {t(`${templateKey}.name`)}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>4.8</span>
                        <span className="mx-1">•</span>
                        <Users className="h-4 w-4" />
                        <span>1.2k</span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {t(`${templateKey}.description`)}
                    </p>

                    {/* 标签 */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 底部操作按钮 */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplate({ id: template.id, open: true });
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      预览模板
                    </Button>
                    <Button
                      className="flex-1"
                      loading={loading}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateResume(template.id);
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      使用模板
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // 网格视图（原有设计优化）
  return (
    <motion.div key={template.id} variants={item}>
      <Card
        className={cn(
          "group cursor-pointer overflow-hidden transition-all hover:shadow-lg max-w-[320px] mx-auto",
          "border border-gray-200 hover:border-primary/40 dark:border-gray-800 rounded-xl"
        )}
      >
        <CardContent className="p-0">
          <div className="relative aspect-[210/297] w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* 模板名称标签 */}
            <div className="absolute top-0 right-0 z-10">
              <div className="flex items-center px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-l border-b border-gray-200 dark:border-gray-700 rounded-bl-md">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                  {t(`${templateKey}.name`)}
                </span>
              </div>
            </div>

            {/* 模板预览图 */}
            <div className="h-full w-full p-3 transition-all duration-300 group-hover:scale-[1.02]">
              <div className="relative h-full w-full overflow-hidden rounded-lg shadow-sm">
                <Image
                  src={templateImages[template.id]}
                  alt={t(`${templateKey}.name`)}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            </div>

            {/* 悬停遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* 悬停时显示描述 */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">
              <p className="text-sm text-gray-100 leading-snug mb-3">
                {t(`${templateKey}.description`)}
              </p>

              {/* 标签 */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.slice(0, 3).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-white/20 text-white border-white/30"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 底部操作按钮 */}
          <div className="p-3 bg-white dark:bg-gray-950 flex space-x-2 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              className="flex-1 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewTemplate({ id: template.id, open: true });
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              {t("preview")}
            </Button>
            <Button
              className="flex-1 text-sm font-medium shadow-sm"
              loading={loading}
              onClick={(e) => {
                e.stopPropagation();
                handleCreateResume(template.id);
              }}
            >
              <Play className="h-4 w-4 mr-1" />
              {t("useTemplate")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
