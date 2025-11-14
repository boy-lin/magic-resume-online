"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { throttle } from "lodash";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRequest } from "ahooks";
import SkeletonCard from "@/components/ui-lab/skeleton-card";
import DownloadBtn from "@/components/blocks/workbench/editor/share/download-btn";
import PrintBtn from "@/components/blocks/workbench/editor/share/print-btn";
import ImageBtn from "@/components/blocks/workbench/editor/share/image-btn";
import { DEFAULT_TEMPLATES } from "@/config";
import ResumeTemplateComponent from "@/components/templates";
import PageBreakLines from "@/components/preview/PageBreakLines";
import { Button } from "@/components/ui-lab/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import ShowError from "@/components/error/show";
import useResumeStore from "@/store/resume/useResumeStore";

interface SharePanelProps {}

const SharePanel = ({}: SharePanelProps) => {
  const params = useParams();
  const { getResumeFullById } = useResumeStore();
  const [password, setPassword] = useState("");
  const originalViewport = useRef<string | null>(null);

  // Keep desktop layout on mobile by dynamically adjusting initial-scale
  useEffect(() => {
    const baseWidth = 1200;
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="viewport"]'
    );
    if (!meta) return;

    if (originalViewport.current === null) {
      originalViewport.current = meta.getAttribute("content");
    }

    const updateViewport = () => {
      const deviceWidth = window.screen.availWidth || baseWidth;
      const scale = Math.max(
        0.2,
        Math.min(1, Number((deviceWidth / baseWidth).toFixed(4)))
      );
      const content = [
        `width=${baseWidth}`,
        `initial-scale=${scale}`,
        "user-scalable=1",
        "viewport-fit=cover",
      ].join(", ");
      meta.setAttribute("content", content);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => {
      window.removeEventListener("resize", updateViewport);
      if (originalViewport.current) {
        meta.setAttribute("content", originalViewport.current);
      }
    };
  }, []);

  const {
    loading,
    error,
    data: resumeData,
  } = useRequest(async () => {
    const res = await getResumeFullById(params.id as string);
    return res;
  });

  const template = useMemo(() => {
    return (
      DEFAULT_TEMPLATES.find((t) => t.id === resumeData?.templateId) ||
      DEFAULT_TEMPLATES[0]
    );
  }, [resumeData?.templateId]);

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
    if (resumeData) {
      const timer = setTimeout(updateContentHeight, 300);
      return () => clearTimeout(timer);
    }
  }, [resumeData]);

  const { pageHeightPx, pageBreakCount } = useMemo(() => {
    const MM_TO_PX = 3.78;
    const A4_HEIGHT_MM = 297;

    let pagePaddingMM = 0;
    if (resumeData?.globalSettings?.pagePadding) {
      pagePaddingMM = resumeData.globalSettings.pagePadding / MM_TO_PX;
    }

    const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - pagePaddingMM;
    const pageHeightPx = CONTENT_HEIGHT_MM * MM_TO_PX;

    if (contentHeight <= 0) {
      return { pageHeightPx, pageBreakCount: 0 };
    }

    const pageCount = Math.max(1, Math.ceil(contentHeight / pageHeightPx));
    const pageBreakCount = Math.max(0, pageCount - 1);
    return { pageHeightPx, pageBreakCount };
  }, [contentHeight, resumeData?.globalSettings?.pagePadding]);

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

  if (loading || !resumeData) return <SkeletonCard />;

  if (error) return <ShowError error={error} />;

  if (!resumeData || !resumeData.isPublic) {
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
    resumeData.isPublic &&
    resumeData.publicPassword &&
    password !== resumeData.publicPassword
  ) {
    return (
      <div className="w-full h-full p-4">
        <div className="flex flex-col space-y-3 justify-center items-center">
          <Card className="w-full max-w-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle>查看密码</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
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
    <div className="">
      <div className="fixed ml-2 left-1/2 translate-x-[105mm]">
        <div className="sticky top-8 flex flex-col gap-2 transform translate-x-[50%]">
          <PrintBtn
            className="hover:bg-primary hover:text-primary-foreground hidden md:flex"
            activeResume={resumeData}
          />
          <ImageBtn
            className="hover:bg-primary hover:text-primary-foreground"
            activeResume={resumeData}
          />
          <DownloadBtn
            className="hover:bg-primary hover:text-primary-foreground hidden md:flex"
            activeResume={resumeData}
          />
        </div>
      </div>
      <div
        className="bg-white shadow-lg relative rounded-lg"
        style={{
          padding: `${resumeData.globalSettings?.pagePadding}px`,
        }}
      >
        <div
          ref={resumeContentRef}
          id="resume-preview"
          className="w-[210mm] min-w-[210mm] min-h-[297mm]"
        >
          <ResumeTemplateComponent data={resumeData} template={template} />
          {/* 分页线 */}
          <PageBreakLines
            contentHeight={contentHeight}
            pageHeightPx={pageHeightPx}
            pageBreakCount={pageBreakCount}
          />
        </div>
      </div>
    </div>
  );
};

export default SharePanel;
