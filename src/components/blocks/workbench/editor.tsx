import { useState, useEffect, useRef, useCallback } from "react";

import InfiniteViewer from "react-infinite-viewer";
import { EditorHeader } from "@/components/blocks/workbench/editor/header";
import { SidePanel } from "./SidePanel";
import { EditPanel } from "@/components/blocks/workbench/EditPanel";
import PreviewPanel from "@/components/preview";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import PreviewDock from "@/components/preview/PreviewDock";
import { useResumeStore } from "@/store/resume/useResumeStore";
import { useResumeSettingsStore } from "@/store/resume/useResumeSettingsStore";
import { shallow } from "zustand/shallow";

import { viewZoomRange } from "@/constants/view";

const DragHandle = ({ show = true }) => {
  if (!show) return null;

  return (
    <ResizableHandle className="relative w-1.5 group">
      <div
        className={cn(
          "absolute inset-y-0 left-1/2 w-1 -translate-x-1/2",
          "group-hover:bg-primary/20 group-data-[dragging=true]:bg-primary",
          "dark:bg-neutral-700/50 bg-gray-200",
        )}
      />
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-4 h-8 rounded-full opacity-0 group-hover:opacity-100",
          "flex items-center justify-center",
          "dark:bg-neutral-800 bg-gray-200",
        )}
      >
        <div className="w-0.5 h-4 bg-gray-400 rounded-full" />
      </div>
    </ResizableHandle>
  );
};

export default function Editor() {
  const [editPanelCollapsed, setEditPanelCollapsed] = useState(false);
  const viewerRef = useRef<any>(null);
  const lastZoomXRef = useRef<number>(1);
  const [editPanelShow, setEditPanelShow] = useState(true);
  const { setActiveSection, activeSection } = useResumeStore(
    (state) => ({
      setActiveSection: state.setActiveSection,
      activeSection: state.activeSection,
    }),
    shallow,
  );
  const setResumeView = useResumeSettingsStore((state) => state.setResumeView);

  const toggleEditPanel = useCallback((section: { id: string }) => {
    setActiveSection(section.id);

    // 同一分组二次点击切换折叠状态，不同分组始终展开编辑面板
    if (activeSection === section.id) {
      setEditPanelCollapsed((prev) => {
        const next = !prev;
        setEditPanelShow(!next);
        return next;
      });
      return;
    }

    setEditPanelCollapsed(false);
    setEditPanelShow(true);
  }, [activeSection, setActiveSection]);

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.scrollCenter();
    }
  }, []);

  return (
    <main
      className={cn(
        "w-full min-h-screen  overflow-hidden",
        "bg-white text-gray-900",
        "dark:bg-neutral-900 dark:text-neutral-200",
      )}
    >
      <EditorHeader />
      {/* 桌面端布局 */}
      <div className="hidden md:flex h-[calc(100vh-64px)] w-full">
        {/* 侧边栏面板 */}
        <div className="h-full flex-grow-0">
          <SidePanel
            toggleEditPanel={toggleEditPanel}
            onItemPointerEnter={(section) => {
              if (!editPanelCollapsed) return;
              setEditPanelShow(true);
              setActiveSection(section.id);
            }}
            onItemPointerLeave={() => {
              if (!editPanelCollapsed) return;
              setEditPanelShow(false);
            }}
          />
        </div>

        <ResizablePanelGroup
          key={editPanelCollapsed ? "collapsed" : "expanded"}
          direction="horizontal"
          className={cn(
            "h-full",
            "w-auto",
            "border-0 border-gray-20",
            "dark:border-neutral-800 dark:bg-neutral-900/50",
          )}
        >
          {/* 编辑面板 */}
          <ResizablePanel
            id="edit-panel"
            order={1}
            defaultSize={editPanelCollapsed ? 0 : 40}
            className={cn(
              "w-[500px] max-w-[600px] min-w-[400px] h-full",
              {
                "fixed left-[80px] p-2 h-auto top-16 bottom-0 z-10":
                  editPanelCollapsed,
              },
              { hidden: !editPanelShow },
            )}
          >
            <EditPanel
              activeSection={activeSection}
              setEditPanelShow={setEditPanelShow}
              editPanelCollapsed={editPanelCollapsed}
            />
          </ResizablePanel>
          {!editPanelCollapsed && <DragHandle />}

          {/* 预览面板 */}
          <ResizablePanel
            order={2}
            defaultSize={editPanelCollapsed ? 100 : 60}
            minSize={48}
            className="bg-gray-100 relative border-0"
          >
            <InfiniteViewer
              ref={viewerRef}
              className="h-full"
              useAutoZoom
              useMouseDrag
              displayHorizontalScroll
              displayVerticalScroll
              useOverflowScroll
              zoomRange={viewZoomRange}
              zoomStep={0.1}
              zoomOnMouseWheel
              zoomOnPinch
              zoomOnScroll
              onScroll={(e) => {
                if (Math.abs(lastZoomXRef.current - e.zoomX) < 0.001) return;
                lastZoomXRef.current = e.zoomX;
                setResumeView({
                  zoomX: e.zoomX,
                });
              }}
            >
              <PreviewPanel />
            </InfiniteViewer>
            <PreviewDock viewerRef={viewerRef} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* 移动端布局 */}
      <div className="block md:hidden h-[calc(100vh-64px)] w-full">
        <div className="h-full overflow-y-auto bg-gray-100">
          <PreviewPanel />
        </div>
      </div>
    </main>
  );
}
