import React from "react";
import PageBreakLine from "./PageBreakLine";

interface PageBreakLinesProps {
  contentHeight: number;
  pageHeightPx: number;
  pageBreakCount: number;
}

/**
 * 分页线组件
 * 根据内容高度和页面高度计算并绘制分页线
 *
 * @param contentHeight - 内容总高度
 * @param pageHeightPx - 单页高度（像素）
 * @param pageBreakCount - 分页数量
 * @returns 分页线组件
 */
const PageBreakLines: React.FC<PageBreakLinesProps> = ({
  contentHeight,
  pageHeightPx,
  pageBreakCount,
}) => {
  // 如果没有内容高度或分页数量为0，则不渲染
  if (contentHeight <= 0 || pageBreakCount <= 0) {
    return null;
  }

  return (
    <div key={`page-breaks-container-${contentHeight}`}>
      {Array.from({ length: Math.min(pageBreakCount, 20) }, (_, i) => {
        const pageNumber = i + 1;
        const pageLinePosition = pageHeightPx * pageNumber;

        // 只有当分页线位置在内容高度范围内时才渲染
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
  );
};

export default PageBreakLines; // By Cursor
