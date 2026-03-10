import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ResumeSection, ResumeSectionContent } from "@/types/resume";
import { ResumeData } from "@/types/resume";
import { generateUUID } from "@/utils/uuid";
import {
  getResumeByIdPrismaApi,
  upsertResumeByIdApi,
  deleteResumeByIdApi,
} from "@/store/resume/utils.prisma";
import {
  initialResumeState,
  initialResumeStateEn,
} from "@/config/initialResumeData";
import { DEFAULT_TEMPLATES } from "@/config";
import { useAppStore } from "@/store/useApp";
import {
  localDeleteResumeById,
  localGetResumeById,
  localUpsertResume,
} from "./utils.local";

function isRemoteUser() {
  return Boolean(useAppStore.getState().user?.id);
}

function cloneDeep<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function getCurrentLocale(): string {
  if (typeof document === "undefined") return "zh";
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1] || "zh"
  );
}

function normalizeActiveSection(sectionId?: string): string {
  return typeof sectionId === "string" && sectionId ? sectionId : "basic";
}

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
    isNeedSync?: boolean,
  ) => void;
  updateResumeAsync: (resume: ResumeData | null) => Promise<ResumeData | null>;
  updateResumeTitle: (title: string) => Promise<void>;
  deleteResume: (resume: ResumeData) => Promise<void>;
  duplicateResume: (resumeId: string) => Promise<string>;
  getResumeFullById: (id: string) => Promise<ResumeData>;
  getResumeFullByIdMock: () => Promise<ResumeData>;
  updateSectionById: (sectionId: string, data: Partial<ResumeSection>) => void;
  deleteSectionById: (sectionId: string) => void;
  addCustomSection: (section: ResumeSection) => void;
  updateEducationBatch: (educations: ResumeSectionContent[]) => void;
  reorderSections: (newOrder: ResumeSection[]) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  setActiveSection: (sectionId: string) => void;
  updateMenuSections: (sections: ResumeSection[]) => void;
  addMenuSection: () => void;
  updateSectionBasic: (section: Partial<ResumeSection>) => void;
  updateSectionEducation: (section: Partial<ResumeSection>) => void;
  updateSectionExperience: (section: Partial<ResumeSection>) => void;
  updateSectionProjects: (section: Partial<ResumeSection>) => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      activeSection: "basic",

      activeResumeId: null,
      activeResume: null,

      createResume: async (templateId) => {
        const locale = getCurrentLocale();

        const initialResumeData =
          locale === "en" ? initialResumeStateEn : initialResumeState;

        const id = generateUUID();

        const template = templateId
          ? DEFAULT_TEMPLATES.find((t) => t.id === templateId)
          : DEFAULT_TEMPLATES[0];
        if (!template) {
          throw new Error("Template not found");
        }

        const newResume: ResumeData = {
          id,
          ...initialResumeData,
          activeSection: "basic",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          templateId: template.id,
          isNeedSync: isRemoteUser(),
          title: `${locale === "en" ? "New Resume" : "新建简历"} ${id.slice(
            0,
            6,
          )}`,
          globalSettings: {
            ...initialResumeData.globalSettings,
            themeColor: template.colorScheme.primary,
            sectionSpacing: template.spacing.sectionGap,
            paragraphSpacing: template.spacing.itemGap,
            pagePadding: template.spacing.contentPadding,
          },
          menuSections: cloneDeep(template.menuSections),
        };

        if (isRemoteUser()) {
          await upsertResumeByIdApi(newResume);
        } else {
          await localUpsertResume(newResume);
        }

        set((state) => ({
          activeSection: normalizeActiveSection(newResume.activeSection),
          activeResumeId: id,
          activeResume: newResume,
        }));
        return id;
      },

      updateResume: (resumeId, data, isNeedSync = true) => {
        const resume = get().activeResume;
        if (!resume) return;
        const updatedAt = new Date().toISOString();

        const updatedResume: ResumeData = {
          ...resume,
          ...data,
          activeSection: normalizeActiveSection(
            data.activeSection ?? resume.activeSection,
          ),
          updatedAt,
          isNeedSync,
          menuSections: data.menuSections ?? resume.menuSections,
        };

        set((state) => ({
          activeSection:
            state.activeResumeId === resumeId
              ? normalizeActiveSection(updatedResume.activeSection)
              : state.activeSection,
          activeResume:
            state.activeResumeId === resumeId
              ? updatedResume
              : state.activeResume,
        }));
      },

      updateResumeAsync: async (resume) => {
        const { activeResumeId } = get();
        if (!activeResumeId || !resume) return null;

        const nextResume = {
          ...resume,
          isNeedSync: false,
          updatedAt: new Date().toISOString(),
        };

        if (isRemoteUser()) {
          await upsertResumeByIdApi(nextResume);
        } else {
          await localUpsertResume(nextResume);
        }

        get().updateResume(activeResumeId, nextResume, false);

        return nextResume;
      },

      updateResumeTitle: async (title) => {
        const { activeResumeId, activeResume } = get();
        if (activeResumeId) {
          const current = activeResume;
          if (!current) return;

          get().updateResume(activeResumeId, { title });
        }
      },

      deleteResume: async (resume) => {
        const resumeId = resume.id;

        if (isRemoteUser()) {
          await deleteResumeByIdApi(resumeId);
        } else {
          await localDeleteResumeById(resumeId);
        }

        set({
          activeSection: "basic",
          activeResumeId: null,
          activeResume: null,
        });
      },

      duplicateResume: async (resumeId) => {
        const newId = generateUUID();
        const originalResume = get().activeResume;
        if (!originalResume || originalResume.id !== resumeId) {
          throw new Error("Resume to duplicate not found");
        }

        const locale = getCurrentLocale();

        const duplicatedResumeBase = {
          ...originalResume,
          id: newId,
          title: `${originalResume.title} (${
            locale === "en" ? "Copy" : "复制"
          })`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isNeedSync: true,
        };

        const duplicatedResume: ResumeData = {
          ...duplicatedResumeBase,
          globalSettings: { ...(duplicatedResumeBase.globalSettings || {}) },
          menuSections: cloneDeep(duplicatedResumeBase.menuSections || []),
        };

        if (isRemoteUser()) {
          await upsertResumeByIdApi(duplicatedResume);
        } else {
          await localUpsertResume(duplicatedResume);
        }

        set({
          activeSection: normalizeActiveSection(duplicatedResume.activeSection),
          activeResumeId: newId,
          activeResume: duplicatedResume,
        });

        return newId;
      },

      getResumeFullByIdMock: async () => {
        const resumeData = await fetch("/api/mock/resume").then((res) =>
          res.json(),
        );
        const newResume: ResumeData = {
          activeSection: "basic",
          ...resumeData,
        };

        // set((state) => ({
        //   activeResumeId: resumeData.id,
        //   activeResume: newResume,
        // }));

        return newResume;
      },

      getResumeFullById: async (id) => {
        let resumeData = null;
        if (isRemoteUser()) {
          resumeData = await getResumeByIdPrismaApi(id);
        } else {
          resumeData = await localGetResumeById(id);
        }
        if (!resumeData) {
          throw new Error("Resume not found");
        }
        if (!isRemoteUser()) {
          resumeData.isPublic = true;
        }
        const newResume: ResumeData = {
          activeSection: "basic",
          ...resumeData,
        };
        set({
          activeSection: normalizeActiveSection(newResume.activeSection),
          activeResumeId: id,
          activeResume: newResume,
        });
        return newResume;
      },

      updateSectionById: (sectionId, data) => {
        const { activeResumeId, activeResume, updateResume } = get();

        if (!activeResumeId) return;
        if (!activeResume) return;

        updateResume(activeResumeId, {
          menuSections: activeResume?.menuSections.map((s) =>
            s.id === sectionId ? { ...s, ...data } : s,
          ),
        });
      },
      deleteSectionById: (sectionId: string) => {
        const { activeResumeId, activeResume, updateResume } = get();
        if (!activeResumeId) return;

        if (!activeResume) return;
        updateResume(activeResumeId, {
          menuSections: activeResume?.menuSections.filter(
            (s) => s.id !== sectionId,
          ),
        });
      },
      addCustomSection: (section: ResumeSection) => {
        const { activeResume } = get();
        if (!activeResume) return;
        get().updateResume(activeResume.id, {
          menuSections: [...activeResume.menuSections, section],
        });
      },
      // 基础信息编辑
      updateSectionBasic: (vals) => {
        get().updateSectionById("basic", vals);
      },
      // 教育经历编辑
      updateSectionEducation: (vals) => {
        get().updateSectionById("education", vals);
      },

      updateEducationBatch: (educations: ResumeSectionContent[]) => {
        const { activeResume } = get();
        if (!activeResume) return;
        get().updateSectionById("education", { content: educations });
      },

      // 工作经验编辑
      updateSectionExperience: (vals) => {
        get().updateSectionById("experience", vals);
      },

      updateSectionProjects: (vals) => {
        get().updateSectionById("projects", vals);
      },

      reorderSections: (newOrder) => {
        const { activeResumeId, activeResume, updateResume } = get();

        if (!activeResumeId) return;
        if (!activeResume) return;

        const basicInfoSection = activeResume.menuSections.find(
          (section) => section.id === "basic",
        );
        const reorderedSections = [
          ...(basicInfoSection ? [basicInfoSection] : []),
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
            : section,
        );

        updateResume(activeResumeId, {
          menuSections: updatedSections,
        });
      },

      setActiveSection: (sectionId) => {
        set((state) => ({
          activeSection: normalizeActiveSection(sectionId),
          activeResume: state.activeResume
            ? {
                ...state.activeResume,
                activeSection: normalizeActiveSection(sectionId),
              }
            : state.activeResume,
        }));
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
        if (!activeResume) return;
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
      name: "resume-list-store", // 持久化存储名称
    },
  ),
);

export default useResumeStore;
