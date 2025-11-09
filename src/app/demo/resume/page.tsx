"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { throttle } from "lodash";
import { useRequest } from "ahooks";
import SkeletonCard from "@/components/ui-lab/skeleton-card";
import DownloadBtn from "@/components/blocks/workbench/editor/share/download-btn";
import PrintBtn from "@/components/blocks/workbench/editor/share/print-btn";
import ImageBtn from "@/components/blocks/workbench/editor/share/image-btn";
import { DEFAULT_TEMPLATES } from "@/config";
import ResumeTemplateComponent from "@/components/templates";
import PageBreakLines from "@/components/preview/PageBreakLines";
import ShowError from "@/components/error/show";
import useResumeStore from "@/store/resume/useResumeStore";

interface PreviewPanelProps {}

const PreviewPanel = ({}: PreviewPanelProps) => {
  const { getResumeFullByIdMock } = useResumeStore();
  const {
    loading,
    error,
    data: resumeData,
  } = useRequest(async () => {
    const res = await getResumeFullByIdMock();
    return res;
  });

  const template = useMemo(() => {
    return DEFAULT_TEMPLATES[4];
  }, []);

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

  console.log("resumeData", resumeData);

  if (loading || !resumeData) return <SkeletonCard />;

  if (error) return <ShowError error={error} />;

  return (
    <div className="">
      <div className="fixed ml-2 left-1/2 translate-x-[105mm]">
        <div className="sticky top-8 flex flex-col gap-2 transform translate-x-[50%]">
          <PrintBtn
            className="hover:bg-primary hover:text-primary-foreground"
            activeResume={resumeData}
          />
          <ImageBtn
            className="hover:bg-primary hover:text-primary-foreground"
            activeResume={resumeData}
          />
          <DownloadBtn
            className="hover:bg-primary hover:text-primary-foreground"
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

export default PreviewPanel;
