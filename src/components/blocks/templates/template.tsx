import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";

import { useResumeStore } from "@/store/useResumeStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui-lab/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

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
export default function Template({ template, setPreviewTemplate }) {
  const t = useTranslations("dashboard.templates");
  const router = useRouter();
  const createResume = useResumeStore((state) => state.createResume);

  const createResumeAsync = async (templateId: string) => {
    const template = DEFAULT_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    const resumeId = await createResume(templateId);
    const { resumes, updateResume } = useResumeStore.getState();
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

  const templateKey = template.id === "left-right" ? "leftRight" : template.id;

  return (
    <motion.div key={template.id} variants={item}>
      <Card
        className={cn(
          "group cursor-pointer overflow-hidden transition-all hover:shadow-md max-w-[300px] mx-auto",
          "border border-gray-200 hover:border-primary/40 dark:border-gray-800 rounded-xl"
        )}
      >
        <CardContent className="p-0">
          <div className="relative aspect-[210/297] w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
            <div className="absolute top-0 right-0 z-10">
              <div className="flex items-center px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-l border-b border-gray-200 dark:border-gray-700 rounded-bl-md">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                  {t(`${templateKey}.name`)}
                </span>
              </div>
            </div>

            <div className="h-full w-full p-3 transition-all duration-300 group-hover:scale-[1.01]">
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

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">
              <p className="text-sm text-gray-100 leading-snug">
                {t(`${templateKey}.description`)}
              </p>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-gray-950 flex space-x-2 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              className="flex-1 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewTemplate({ id: template.id, open: true });
              }}
            >
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
              {t("useTemplate")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
