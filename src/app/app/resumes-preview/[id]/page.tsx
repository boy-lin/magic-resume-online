"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { throttle } from "lodash";
import { DEFAULT_TEMPLATES } from "@/config";
import { cn } from "@/lib/utils";
import ResumeTemplateComponent from "@/components/templates";
import PageBreakLine from "@/components/preview/PageBreakLine";
import { getResumesById } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";

interface PreviewPanelProps {}

const PreviewPanel = ({}: PreviewPanelProps) => {
  const [activeResume, setActiveResume] = useState(null);
  const params = useParams();

  useEffect(() => {
    const getResumeById = async (id) => {
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
      };
      setActiveResume(newResume);
    };

    if (!params.id) return;

    getResumeById(params.id);
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

  if (!activeResume) return <div>空数据</div>;

  return (
    <div
      className={cn(
        "w-[210mm] min-w-[210mm] min-h-[297mm]",
        "bg-white",
        "shadow-lg",
        "relative mx-auto"
      )}
    >
      <div
        ref={resumeContentRef}
        id="resume-preview"
        style={{
          padding: `${activeResume.globalSettings?.pagePadding}px`,
        }}
        className="relative"
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
    </div>
  );
};

export default PreviewPanel;
