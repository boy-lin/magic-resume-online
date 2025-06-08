"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Download, Printer } from "lucide-react";
import { throttle } from "lodash";
import { DEFAULT_TEMPLATES } from "@/config";
import { cn } from "@/lib/utils";
import ResumeTemplateComponent from "@/components/templates";
import PageBreakLine from "@/components/preview/PageBreakLine";
import { getResumesById } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui-lab/button";
import { usePdfExport, useHtmlPrint } from "@/hooks/pdf-export";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRequest } from "ahooks";
import SkeletonCard from "@/components/ui-lab/skeleton-card";

interface PreviewPanelProps {}

const PreviewPanel = ({}: PreviewPanelProps) => {
  const params = useParams();

  const [activeResume, setActiveResume] = useState(null);
  const [password, setPassword] = useState("");
  const { globalSettings = {}, title } = activeResume || {};
  const { isExporting, handleExport } = usePdfExport(activeResume);
  const { printFrameRef, handlePrint } = useHtmlPrint(globalSettings);
  const { run, runAsync, loading } = useRequest(
    async (id) => {
      const { data: val } = await getResumesById(createClient(), id);
      const newResume = {
        activeSection: "basic",
        draggingProjectId: null,
        id: val.id,
        title: val.title,
        createdAt: val.created_at,
        updatedAt: val.updated_at,
        basic: JSON.parse(val.basic),
        templateId: val.template_id,
        customData: JSON.parse(val.custom_data),
        education: JSON.parse(val.education),
        experience: JSON.parse(val.experience),
        globalSettings: JSON.parse(val.global_settings),
        menuSections: JSON.parse(val.menu_sections),
        projects: JSON.parse(val.projects),
        skillContent: JSON.parse(val.skill_content),
        isPublic: val.is_public,
        publicPassword: val.public_password,
      };
      setActiveResume(newResume);
    },
    { manual: true }
  );

  useEffect(() => {
    if (!params.id) return;
    // getResumeById(params.id);
    runAsync(params.id);
  }, [params.id]);

  const template = useMemo(() => {
    return (
      DEFAULT_TEMPLATES.find((t) => t.id === activeResume?.templateId) ||
      DEFAULT_TEMPLATES[0]
    );
  }, [activeResume?.templateId]);

  const resumeContentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const updateContentHeight = () => {
    if (resumeContentRef.current) {
      const height = resumeContentRef.current.clientHeight;
      if (height > 0) {
        if (height !== contentHeight) {
          setContentHeight(height);
        }
      }
    }
  };

  useEffect(() => {
    const debouncedUpdate = throttle(() => {
      requestAnimationFrame(() => {
        updateContentHeight();
      });
    }, 100);

    const observer = new MutationObserver(debouncedUpdate);

    if (resumeContentRef.current) {
      observer.observe(resumeContentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      updateContentHeight();
    }

    const resizeObserver = new ResizeObserver(debouncedUpdate);

    if (resumeContentRef.current) {
      resizeObserver.observe(resumeContentRef.current);
    }

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeResume) {
      const timer = setTimeout(updateContentHeight, 300);
      return () => clearTimeout(timer);
    }
  }, [activeResume]);

  const { pageHeightPx, pageBreakCount } = useMemo(() => {
    const MM_TO_PX = 3.78;
    const A4_HEIGHT_MM = 297;

    let pagePaddingMM = 0;
    if (activeResume?.globalSettings?.pagePadding) {
      pagePaddingMM = activeResume.globalSettings.pagePadding / MM_TO_PX;
    }

    const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - pagePaddingMM;
    const pageHeightPx = CONTENT_HEIGHT_MM * MM_TO_PX;

    if (contentHeight <= 0) {
      return { pageHeightPx, pageBreakCount: 0 };
    }

    const pageCount = Math.max(1, Math.ceil(contentHeight / pageHeightPx));
    const pageBreakCount = Math.max(0, pageCount - 1);

    return { pageHeightPx, pageBreakCount };
  }, [contentHeight, activeResume?.globalSettings?.pagePadding]);

  const formSchema = React.useMemo(
    () =>
      z.object({
        password: z.string().min(5, { message: "密码错误" }),
      }),
    []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("values", values);
    setPassword(values.password);
  }

  if (loading) return <SkeletonCard />;

  if (!activeResume || !activeResume.isPublic) {
    return (
      <div className="w-full h-full p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col space-y-3 justify-center items-center">
            <div className="text-2xl font-bold">无法查看</div>
            <div className="text-sm text-gray-500">该简历未公开或已删除</div>
          </div>
        </div>
      </div>
    );
  }

  if (
    activeResume.isPublic &&
    activeResume.publicPassword &&
    password !== activeResume.publicPassword
  ) {
    return (
      <div className="w-full h-full p-4">
        <div className="flex flex-col space-y-3 justify-center items-center">
          <Card className="w-full max-w-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle>请输入密码</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>密码</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="请输入密码"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Button type="submit" className="w-full">
                    查看简历
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white", "shadow-lg", "relative mx-auto")}>
      <div
        ref={resumeContentRef}
        id="resume-preview"
        style={{
          padding: `${activeResume.globalSettings?.pagePadding}px`,
        }}
        className="box-content w-[210mm] min-w-[210mm] min-h-[297mm] relative"
      >
        <ResumeTemplateComponent data={activeResume} template={template} />
        {contentHeight > 0 && (
          <>
            <div key={`page-breaks-container-${contentHeight}`}>
              {Array.from({ length: Math.min(pageBreakCount, 20) }, (_, i) => {
                const pageNumber = i + 1;

                const pageLinePosition = pageHeightPx * pageNumber;

                if (pageLinePosition <= contentHeight) {
                  return (
                    <PageBreakLine
                      key={`page-break-${pageNumber}`}
                      pageNumber={pageNumber}
                    />
                  );
                }
                return null;
              }).filter(Boolean)}
            </div>
          </>
        )}
      </div>

      <div className="hidden md:block fixed top-1/2 right-3 transform -translate-y-1/2">
        <TooltipProvider delayDuration={0}>
          <Dock>
            <div className="flex flex-col gap-2">
              <DockIcon>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="w-full h-full p-4"
                      loading={isExporting}
                      onClick={handleExport}
                    >
                      <Download role="icon" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" sideOffset={10}>
                    <p>导出PDF简历</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
              <DockIcon>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full h-full p-4"
                      onClick={handlePrint}
                    >
                      <Printer className="w-full h-full p-4" role="icon" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" sideOffset={10}>
                    <p>浏览器打印简历</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            </div>
          </Dock>
        </TooltipProvider>
      </div>
      <iframe
        ref={printFrameRef}
        style={{
          position: "absolute",
          width: "210mm",
          height: "297mm",
          visibility: "hidden",
          zIndex: -1,
        }}
        title="Print Frame"
      />
    </div>
  );
};

export default PreviewPanel;
