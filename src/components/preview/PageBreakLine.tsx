import React from "react";
import { useResumeListStore } from "@/store/resume";

const PageBreakLine = React.memo(({ pageNumber }: { pageNumber: number }) => {
  const { activeResume } = useResumeListStore();
  const { globalSettings } = activeResume || {};
  if (!globalSettings?.pagePadding) return null;

  const A4_HEIGHT_MM = 297;
  const MM_TO_PX = 3.78;

  const pagePaddingMM = globalSettings.pagePadding / MM_TO_PX;

  const CONTENT_HEIGHT_MM = A4_HEIGHT_MM + pagePaddingMM * 2;
  const pageHeight = CONTENT_HEIGHT_MM * MM_TO_PX;
  // console.log("pageHeight", pageHeight, pageNumber);
  return (
    <div
      className="absolute left-0 right-0 pointer-events-none page-break-line"
      style={{
        top: `${pageHeight * pageNumber}px`,
        breakAfter: "page",
        breakBefore: "page",
      }}
    >
      <div className="relative w-full">
        <div className="absolute w-full border-t-2 border-dashed border-red-400" />
        <div className="absolute right-0 -top-6 text-xs text-red-500">
          第{pageNumber}页结束
        </div>
      </div>
    </div>
  );
});
PageBreakLine.displayName = "PageBreakLine";
export default PageBreakLine;
