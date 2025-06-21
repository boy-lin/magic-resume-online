"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";

import { useResumeStore } from "@/store/useResumeStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui-lab/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

import classic from "@/assets/images/template-cover/classic.jpg";
import modern from "@/assets/images/template-cover/modern.jpg";
import leftRight from "@/assets/images/template-cover/left-right.jpg";
import timeline from "@/assets/images/template-cover/timeline.jpg";

import { cn } from "@/lib/utils";
import { DEFAULT_TEMPLATES } from "@/config";
import { useRequest } from "ahooks";
import Template from "@/components/blocks/templates/template";

const templateImages: Record<string, StaticImageData> = {
  classic,
  modern,
  "left-right": leftRight,
  timeline,
};

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

const TemplatesPage = () => {
  const t = useTranslations("dashboard.templates");
  const router = useRouter();
  const createResume = useResumeStore((state) => state.createResume);
  const [previewTemplate, setPreviewTemplate] = useState<{
    id: string;
    open: boolean;
  } | null>(null);

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

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {DEFAULT_TEMPLATES.map((template) => {
            return (
              <Template
                key={template.id}
                template={template}
                setPreviewTemplate={setPreviewTemplate}
              />
            );
          })}
        </motion.div>

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
