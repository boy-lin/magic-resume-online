import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GlobalSettings } from "@/types/resume";
import { useResumeListStore } from "./useResumeListStore";
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
        const { activeResumeId, updateResume } = useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume =
          useResumeListStore.getState().resumes[activeResumeId];
        if (!currentResume) return;

        const updatedSettings = {
          ...currentResume.globalSettings,
          ...settings,
        };

        updateResume(activeResumeId, {
          globalSettings: updatedSettings,
        });
      },

      setThemeColor: (color) => {
        const { activeResumeId, updateResume } = useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume =
          useResumeListStore.getState().resumes[activeResumeId];
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
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const template = DEFAULT_TEMPLATES.find((t) => t.id === templateId);
        if (!template) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        const updatedResume = {
          ...currentResume,
          templateId,
          globalSettings: {
            ...currentResume.globalSettings,
            themeColor: template.colorScheme.primary,
            sectionSpacing: template.spacing.sectionGap,
            paragraphSpacing: template.spacing.itemGap,
            pagePadding: template.spacing.contentPadding,
          },
          basic: {
            ...currentResume.basic,
            layout: template.basic.layout,
          },
          isNeedSync: isNeedSync,
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
