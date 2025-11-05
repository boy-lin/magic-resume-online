import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ResumeSection, ResumeSectionContent } from "@/types/resume";
import { ResumeData } from "@/types/resume";
import { generateUUID } from "@/utils/uuid";
import {
  upsertResumeById,
  deleteResumeById,
  getResumeById,
} from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/client";
import {
  initialResumeState,
  initialResumeStateEn,
} from "@/config/initialResumeData";
import { DEFAULT_TEMPLATES } from "@/config";
import { logger } from "./utils";

/**
 * 简历编辑器状态管理
 * 负责简历内容的编辑和更新
 */
interface ResumeStore {
  // 编辑器状态
  activeSection: string;
  activeResumeId: string | null;
  activeResume: ResumeData | null;

  createResume: (templateId: string) => Promise<string>;
  updateResume: (
    resumeId: string,
    data: Partial<ResumeData>,
    isNeedSync?: boolean
  ) => void;
  updateResumeAsync: (resume: ResumeData) => Promise<any>;
  updateResumeTitle: (title: string) => Promise<void>;
  deleteResume: (resume: ResumeData) => Promise<void>;
  duplicateResume: (resumeId: string) => string;
  getResumeFullById: (id: string) => Promise<any>;

  updateSectionById: (sectionId: string, data: Partial<ResumeSection>) => void;

  // 菜单和章节管理
  reorderSections: (newOrder: ResumeSection[]) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  setActiveSection: (sectionId: string) => void;
  updateMenuSections: (sections: ResumeSection[]) => void;
  addMenuSection: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      activeSection: "basic",

      activeResumeId: null,
      activeResume: null,

      createResume: async (templateId) => {
        const locale =
          typeof document !== "undefined"
            ? document.cookie
                .split("; ")
                .find((row) => row.startsWith("NEXT_LOCALE="))
                ?.split("=")[1] || "zh"
            : "zh";

        const initialResumeData =
          locale === "en" ? initialResumeStateEn : initialResumeState;

        const id = generateUUID();

        const template = templateId
          ? DEFAULT_TEMPLATES.find((t) => t.id === templateId)
          : DEFAULT_TEMPLATES[0];

        const newResume: ResumeData = {
          id,
          ...initialResumeData,
          activeSection: "basic",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          templateId: template?.id,
          title: `${locale === "en" ? "New Resume" : "新建简历"} ${id.slice(
            0,
            6
          )}`,
          globalSettings: {
            ...initialResumeData.globalSettings,
            themeColor: template.colorScheme.primary,
            sectionSpacing: template.spacing.sectionGap,
            paragraphSpacing: template.spacing.itemGap,
            pagePadding: template.spacing.contentPadding,
          },
          menuSections: template.menuSections,
        };
        await upsertResumeById(createClient(), newResume);

        set((state) => ({
          activeResumeId: id,
          activeResume: newResume,
        }));
        return id;
      },

      updateResume: (resumeId, data, isNeedSync = true) => {
        const resume = get().activeResume;
        const updatedResume: ResumeData = {
          ...resume,
          ...data,
          isNeedSync,
          menuSections: data.menuSections ?? resume.menuSections,
        };

        set((state) => ({
          activeResume:
            state.activeResumeId === resumeId
              ? updatedResume
              : state.activeResume,
        }));
      },

      updateResumeAsync: async (resume) => {
        const { activeResumeId } = get();
        let res;
        if (activeResumeId) {
          res = await upsertResumeById(createClient(), resume);
          get().updateResume(activeResumeId, resume, false);
        }
        return res;
      },

      updateResumeTitle: async (title) => {
        const { activeResumeId } = get();
        if (activeResumeId) {
          const params = { id: activeResumeId, title };
          await upsertResumeById(createClient(), params);
          get().updateResume(activeResumeId, params, false);
        }
      },

      deleteResume: async (resume) => {
        const resumeId = resume.id;
        await deleteResumeById(createClient(), resumeId);
        set((state) => {
          return {
            activeResumeId: null,
            activeResume: null,
          };
        });
      },

      duplicateResume: (resumeId) => {
        try {
          const newId = generateUUID();
          const originalResume = get().activeResume;

          const locale =
            typeof document !== "undefined"
              ? document.cookie
                  .split("; ")
                  .find((row) => row.startsWith("NEXT_LOCALE="))
                  ?.split("=")[1] || "zh"
              : "zh";

          const duplicatedResumeBase = {
            ...originalResume,
            id: newId,
            title: `${originalResume.title} (${
              locale === "en" ? "Copy" : "复制"
            })`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const duplicatedResume: ResumeData = {
            ...duplicatedResumeBase,
            menuSections: [...(duplicatedResumeBase.menuSections || [])],
          };

          set((state) => ({
            activeResumeId: newId,
            activeResume: duplicatedResume,
          }));

          return newId;
        } catch (error) {
          logger.error(`Failed to duplicate resume ${resumeId}:`, error);
          throw error;
        }
      },

      getResumeFullById: async (id) => {
        const client = createClient();
        const resumeData = await getResumeById(client, id);
        // const resumeData = require("../../../mock/index").resumeData;
        const newResume: ResumeData = {
          activeSection: "basic",
          ...resumeData,
        };
        set((state) => ({
          activeResumeId: id,
          activeResume: newResume,
        }));
        return resumeData;
      },

      updateSectionById: (sectionId, data) => {
        const { activeResumeId, activeResume, updateResume } = get();

        if (!activeResumeId) return;
        if (!activeResume) return;

        console.log("data", sectionId, data);
        updateResume(activeResumeId, {
          ...activeResume,
          menuSections: activeResume?.menuSections.map((s) =>
            s.id === sectionId ? { ...s, ...data } : s
          ),
        });
      },
      deleteSectionById: (sectionId: string) => {
        const { activeResumeId, activeResume, updateResume } = get();
        if (!activeResumeId) return;

        if (!activeResume) return;
        updateResume(activeResumeId, {
          menuSections: activeResume?.menuSections.filter(
            (s) => s.id !== sectionId
          ),
        });
      },
      addCustomSection: (section: ResumeSection) => {
        const { activeResume } = get();
        if (!activeResume) return;
        get().updateMenuSections([...activeResume.menuSections, section]);
      },
      // 基础信息编辑
      updateSectionBasic: (section: ResumeSection) => {
        get().updateSectionById("basic", section);
      },
      // 教育经历编辑
      updateSectionEducation: (section: ResumeSection) => {
        get().updateSectionById("education", section);
      },

      updateEducationBatch: (educations: ResumeSectionContent[]) => {
        get().updateSectionById("education", { content: educations });
      },

      // 工作经验编辑
      updateSectionExperience: (vals) => {
        const { activeResumeId, activeResume, updateResume } = get();

        if (!activeResumeId) return;
        if (!activeResume) return;

        updateResume(activeResumeId, {
          menuSections: activeResume.menuSections.map((s) =>
            s.id === "experience" ? { ...s, ...vals } : s
          ),
        });
      },

      updateSectionProjects: (project) => {
        const { activeResumeId, activeResume, updateResume } = get();

        if (!activeResumeId) return;
        if (!activeResume) return;

        updateResume(activeResumeId, {
          menuSections: activeResume.menuSections.map((s) =>
            s.id === "projects" ? { ...s, ...project } : s
          ),
        });
      },

      reorderSections: (newOrder) => {
        const { activeResumeId, activeResume, updateResume } = get();

        if (!activeResumeId) return;
        if (!activeResume) return;

        const basicInfoSection = activeResume.menuSections.find(
          (section) => section.id === "basic"
        );
        const reorderedSections = [
          basicInfoSection,
          ...newOrder.filter((section) => section.id !== "basic"),
        ].map((section, index) => ({
          ...section,
          order: index,
        }));

        updateResume(activeResumeId, {
          menuSections: reorderedSections,
        });
      },

      toggleSectionVisibility: (sectionId) => {
        const { activeResumeId, activeResume, updateResume } = get();
        if (!activeResumeId) return;

        if (!activeResume) return;

        const updatedSections = activeResume.menuSections.map((section) =>
          section.id === sectionId
            ? { ...section, enabled: !section.enabled }
            : section
        );

        updateResume(activeResumeId, {
          menuSections: updatedSections,
        });
      },

      setActiveSection: (sectionId) => {
        const { activeResumeId, updateResume } = get();
        if (activeResumeId) {
          updateResume(activeResumeId, {
            activeSection: sectionId,
          });
        }
      },

      updateMenuSections: (sections) => {
        const { activeResumeId, updateResume } = get();

        if (activeResumeId) {
          updateResume(activeResumeId, {
            menuSections: sections,
          });
        }
      },

      addMenuSection: () => {
        const { activeResumeId, updateResume, activeResume } = get();
        const newSection = {
          id: generateUUID(),
          title: "未命名",
          icon: "➕",
          enabled: true,
          order: activeResume.menuSections.length,
        };

        if (activeResumeId) {
          updateResume(activeResumeId, {
            menuSections: [...(activeResume.menuSections || []), newSection],
          });
        }
      },
    }),
    {
      name: "resume-editor-store",
      partialize: (state) => ({
        activeSection: state.activeSection,
      }),
    }
  )
);

export default useResumeStore;
