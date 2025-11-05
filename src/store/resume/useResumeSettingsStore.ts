import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GlobalSettings } from "@/types/resume";
import { useResumeStore } from "./useResumeStore";
import { DEFAULT_TEMPLATES } from "@/config";

/**
 * 简历设置状态管理
 * 负责主题、模板、全局设置等
 */
interface ResumeSettingsStore {
  // 视图状态
  resumeView: {
    zoomX: number;
  };

  // 全局设置
  updateGlobalSettings: (settings: Partial<GlobalSettings>) => void;

  // 主题设置
  setThemeColor: (color: string) => void;

  // 模板设置
  setTemplate: (templateId: string, isNeedSync?: boolean) => void;

  // 视图设置
  getViewScale: () => [number];
  setResumeView: (view: { zoomX: number }) => void;
}

export const useResumeSettingsStore = create<ResumeSettingsStore>()(
  persist(
    (set, get) => ({
      resumeView: {
        zoomX: 1,
      },

      updateGlobalSettings: (settings) => {
        const { activeResumeId, updateResume, activeResume } =
          useResumeStore.getState();

        if (!activeResumeId) return;
        if (!activeResume) return;

        const updatedSettings = {
          ...activeResume.globalSettings,
          ...settings,
        };

        updateResume(activeResumeId, {
          globalSettings: updatedSettings,
        });
      },

      setThemeColor: (color) => {
        const { activeResumeId, updateResume } = useResumeStore.getState();
        if (!activeResumeId) return;

        const currentResume = useResumeStore.getState().activeResume;
        if (!currentResume) return;

        const updatedSettings = {
          ...currentResume.globalSettings,
          themeColor: color,
        };

        updateResume(activeResumeId, {
          globalSettings: updatedSettings,
        });
      },

      setTemplate: (templateId, isNeedSync = true) => {
        const { activeResumeId, activeResume, updateResume } =
          useResumeStore.getState();
        if (!activeResumeId) return;

        const template = DEFAULT_TEMPLATES.find((t) => t.id === templateId);
        if (!template) return;

        if (!activeResume) return;

        const updatedResume = {
          ...activeResume,
          templateId,
          globalSettings: {
            ...activeResume.globalSettings,
            themeColor: template.colorScheme.primary,
            sectionSpacing: template.spacing.sectionGap,
            paragraphSpacing: template.spacing.itemGap,
            pagePadding: template.spacing.contentPadding,
          },
        };

        updateResume(activeResumeId, updatedResume, isNeedSync);
      },

      getViewScale: () => {
        const { resumeView } = get();
        const zoomX = resumeView.zoomX;
        return [zoomX * 100];
      },

      setResumeView: (view) => {
        set((state) => ({
          resumeView: {
            ...state.resumeView,
            ...view,
          },
        }));
      },
    }),
    {
      name: "resume-settings-store",
      partialize: (state) => ({
        resumeView: state.resumeView,
      }),
    }
  )
);

export default useResumeSettingsStore; // By Cursor
