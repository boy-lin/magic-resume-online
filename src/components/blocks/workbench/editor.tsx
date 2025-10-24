import { useState, useEffect, memo, useRef } from "react";
import { Eye, Edit2, PanelLeft, Minimize2 } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PreviewDock from "@/components/preview/PreviewDock";
import { useResumeListStore } from "@/store/resume/useResumeListStore";
import { useResumeEditorStore } from "@/store/resume/useResumeEditorStore";
import { useResumeSettingsStore } from "@/store/resume/useResumeSettingsStore";

import { viewZoomRange } from "@/constants/view";

const LAYOUT_CONFIG = {
  DEFAULT: [20, 32, 48],
  SIDE_COLLAPSED: [50, 50],
  EDIT_FOCUSED: [20, 80],
  PREVIEW_FOCUSED: [20, 80],
};

const DragHandle = ({ show = true }) => {
  if (!show) return null;

  return (
    <ResizableHandle className="relative w-1.5 group">
      <div
        className={cn(
          "absolute inset-y-0 left-1/2 w-1 -translate-x-1/2",
          "group-hover:bg-primary/20 group-data-[dragging=true]:bg-primary",
          "dark:bg-neutral-700/50 bg-gray-200"
        )}
      />
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-4 h-8 rounded-full opacity-0 group-hover:opacity-100",
          "flex items-center justify-center",
          "dark:bg-neutral-800 bg-gray-200"
        )}
      >
        <div className="w-0.5 h-4 bg-gray-400 rounded-full" />
      </div>
    </ResizableHandle>
  );
};

const LayoutControls = memo(
  ({
    sidePanelCollapsed,
    editPanelCollapsed,
    previewPanelCollapsed,
    toggleSidePanel,
    toggleEditPanel,
    togglePreviewPanel,
  }: {
    sidePanelCollapsed: boolean;
    editPanelCollapsed: boolean;
    previewPanelCollapsed: boolean;
    toggleSidePanel: () => void;
    toggleEditPanel: () => void;
    togglePreviewPanel: () => void;
  }) => (
    <div
      className={cn(
        "absolute bottom-6 left-1/2 -translate-x-1/2",
        "flex items-center gap-2 z-10 p-2 rounded-full",
        "dark:bg-neutral-900/80 dark:border dark:border-neutral-800 bg-white/80 border border-gray-200",
        "backdrop-blur-sm shadow-lg"
      )}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={sidePanelCollapsed ? "secondary" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={toggleSidePanel}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              {sidePanelCollapsed ? "展开侧边栏" : "收起侧边栏"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className={cn("h-5 w-px mx-1", "dark:bg-neutral-800 bg-gray-200")} />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={editPanelCollapsed ? "secondary" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={toggleEditPanel}
            >
              {editPanelCollapsed ? (
                <Edit2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              {editPanelCollapsed ? "展开编辑面板" : "收起编辑面板"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={previewPanelCollapsed ? "secondary" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={togglePreviewPanel}
            >
              {previewPanelCollapsed ? (
                <Eye className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              {previewPanelCollapsed ? "展开预览面板" : "收起预览面板"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
);

LayoutControls.displayName = "LayoutControls";

export default function Editor() {
  const [editPanelCollapsed, setEditPanelCollapsed] = useState(false);
  const [previewPanelCollapsed, setPreviewPanelCollapsed] = useState(false);
  const [panelSizes, setPanelSizes] = useState<number[]>(LAYOUT_CONFIG.DEFAULT);
  const viewerRef = useRef<any>(null);
  const [editPanelShow, setEditPanelShow] = useState(true);
  const { setActiveSection } = useResumeEditorStore();
  const { setResumeView } = useResumeSettingsStore();
  const { activeResume } = useResumeListStore();
  const activeSection =
    typeof activeResume?.activeSection === "string"
      ? activeResume.activeSection
      : "";

  const toggleEditPanel = (section: any) => {
    setActiveSection(section.id);
    let isEditPanelCollapsed = editPanelCollapsed;
    if (activeSection === section.id) {
      setEditPanelCollapsed(!editPanelCollapsed);
      isEditPanelCollapsed = !isEditPanelCollapsed;
    }

    if (isEditPanelCollapsed) {
      setEditPanelShow(false);
    } else {
      setEditPanelShow(true);
    }
  };

  const updateLayout = (sizes: number[]) => {
    console.log("updateLayout", sizes);
    setPanelSizes(sizes);
  };

  useEffect(() => {
    let newSizes = [];
    // 编辑区尺寸
    if (editPanelCollapsed) {
      newSizes.push(0);
    } else {
      newSizes.push(100);
    }
    // 预览区尺寸
    if (editPanelCollapsed) {
      newSizes.push(100);
    } else {
      newSizes.push(0);
    }
    // 确保总和为 100
    const total = newSizes.reduce((a, b) => a + b, 0);
    if (total < 100) {
      const lastNonZeroIndex = newSizes
        .map((size, index) => ({ size, index }))
        .filter(({ size }) => size > 0)
        .pop()?.index;
      if (lastNonZeroIndex !== undefined) {
        newSizes[lastNonZeroIndex] += 100 - total;
      }
    }
    updateLayout([...newSizes]);
  }, [editPanelCollapsed, previewPanelCollapsed]);

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.scrollCenter();
    }
  }, [viewerRef.current]);

  return (
    <main
      className={cn(
        "w-full min-h-screen  overflow-hidden",
        "bg-white text-gray-900",
        "dark:bg-neutral-900 dark:text-neutral-200"
      )}
    >
      <EditorHeader />
      {/* 桌面端布局 */}
      <div className="flex h-[calc(100vh-64px)] w-full">
        {/* 侧边栏面板 */}
        <div className="h-full flex-grow-0">
          <SidePanel
            toggleEditPanel={toggleEditPanel}
            onItemPointerEnter={(section) => {
              if (!editPanelCollapsed) return;
              setEditPanelShow(true);
              setActiveSection(section.id);
            }}
            onItemPointerLeave={(section) => {
              if (!editPanelCollapsed) return;
              // setEditPanelShow(false);
              // setActiveSection(section.id);
            }}
          />
        </div>

        <ResizablePanelGroup
          direction="horizontal"
          className={cn(
            "h-full",
            "w-auto",
            "border-0 border-gray-20",
            "dark:border-neutral-800 dark:bg-neutral-900/50"
          )}
        >
          {/* 编辑面板 */}
          <ResizablePanel
            id="edit-panel"
            order={1}
            defaultSize={panelSizes?.[0]}
            className={cn(
              "w-[500px] max-w-[600px] min-w-[400px] h-full",
              {
                "fixed left-[80px] p-2 h-auto top-16 bottom-0 z-10":
                  editPanelCollapsed,
              },
              { hidden: !editPanelShow }
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
            defaultSize={panelSizes?.[1]}
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
      <div className="md:hidden h-[calc(100vh-64px)] w-full md:min-w-[1600px]">
        <div className="h-full overflow-y-auto bg-gray-100">
          <PreviewPanel />
        </div>
      </div>
    </main>
  );
}
