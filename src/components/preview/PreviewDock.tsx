"use client";
import React, { useCallback } from "react";
import {
  Edit2,
  PanelRightClose,
  PanelRightOpen,
  SpellCheck2,
  Home,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Dock, DockIcon } from "@/components/magicui/dock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useGrammarCheck } from "@/hooks/useGrammarCheck";
import { useAIConfigStore } from "@/store/useAIConfigStore";
import { AI_MODEL_CONFIGS } from "@/config/ai";
import { useResumeListStore } from "@/store/resume/useResumeListStore";
import { useResumeSettingsStore } from "@/store/resume/useResumeSettingsStore";

import { Slider } from "@/components/ui/slider";
import { useDebounceFn, useThrottleFn } from "ahooks";

export type IconProps = React.HTMLAttributes<SVGElement>;

interface PreviewDockProps {}

const PreviewDock = ({ viewerRef }) => {
  const router = useRouter();
  const t = useTranslations("previewDock");
  const { checkGrammar, isChecking } = useGrammarCheck();
  const {
    selectedModel,
    doubaoApiKey,
    doubaoModelId,
    deepseekApiKey,
    deepseekModelId,
  } = useAIConfigStore();

  const handleGrammarCheck = useCallback(async () => {
    const previewDom = document.querySelector("#resume-preview") as HTMLElement;
    if (!previewDom) {
      console.error("preview resume not found");
      return;
    }
    const config = AI_MODEL_CONFIGS[selectedModel];
    const isConfigured =
      selectedModel === "doubao"
        ? doubaoApiKey && doubaoModelId
        : config.requiresModelId
        ? deepseekApiKey && deepseekModelId
        : deepseekApiKey;

    if (!isConfigured) {
      const res = toast.error(t("grammarCheck.configurePrompt"));
      toast.error(
        "error"
        // <>
        //   <span>{t("grammarCheck.configurePrompt")}</span>
        //   <Button
        //     className="p-0 h-auto text-white"
        //     onClick={() => router.push("/app/dashboard/ai")}
        //   >
        //     {t("grammarCheck.configureButton")}
        //   </Button>
        // </>
      );
      return;
    }

    try {
      const text = previewDom.innerText;
      console.log("text", text);
      await checkGrammar(text);
    } catch (error) {
      toast.error(t("grammarCheck.errorToast"));
    }
  }, [
    selectedModel,
    doubaoApiKey,
    doubaoModelId,
    deepseekApiKey,
    deepseekModelId,
    t,
  ]);

  const { duplicateResume, activeResumeId } = useResumeListStore();
  const { setResumeView, resumeView } = useResumeSettingsStore();
  const viewScale = resumeView?.zoomX ? [resumeView.zoomX * 100] : [100];

  const handleCopyResume = useCallback(() => {
    if (!activeResumeId) return;
    try {
      const newId = duplicateResume(activeResumeId);
      toast.success(t("copyResume.success"));
      router.push(`/app/workbench/${newId}`);
    } catch (error) {
      toast.error(t("copyResume.error"));
    }
  }, [activeResumeId, duplicateResume, router, t]);

  const { run: handleZoomChange } = useThrottleFn(
    (val) => {
      if (viewerRef.current) {
        viewerRef.current.setZoom(val[0] / 100);
      }
    },
    { wait: 100 }
  );

  return (
    <div className="hidden md:block absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 ">
      <TooltipProvider delayDuration={0}>
        <Dock>
          <div className="flex gap-2">
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex cursor-pointer h-7 w-7 items-center justify-center rounded-lg",
                      "hover:bg-gray-100/50 dark:hover:bg-neutral-800/50",
                      "transition-all duration-200",
                      isChecking && "animate-pulse"
                    )}
                    onClick={handleGrammarCheck}
                  >
                    <SpellCheck2
                      className={cn("h-4 w-4", isChecking && "animate-spin")}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={10}>
                  <p>
                    {isChecking
                      ? t("grammarCheck.checking")
                      : t("grammarCheck.idle")}
                  </p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex cursor-pointer h-7 w-7 items-center justify-center rounded-lg",
                      "hover:bg-gray-100/50 dark:hover:bg-neutral-800/50"
                    )}
                    onClick={handleCopyResume}
                  >
                    <Copy className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={10}>
                  <p>{t("copyResume.tooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>

            <div className="w-full h-[1px] bg-gray-200" />
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex cursor-pointer h-7 w-7 items-center justify-center rounded-lg",
                      "hover:bg-gray-100/50 dark:hover:bg-neutral-800/50"
                    )}
                    onClick={() => router.push("/app/dashboard")}
                  >
                    <Home className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={10}>
                  <p>{t("backToDashboard")}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
            <div className="w-full h-[1px] bg-gray-200" />
            <div className="flex items-center">
              <Slider
                value={viewScale}
                max={200}
                min={50}
                step={1}
                onValueChange={handleZoomChange}
                className="w-[100px] h-2"
              />
            </div>
          </div>
        </Dock>
      </TooltipProvider>
    </div>
  );
};

export default PreviewDock;
