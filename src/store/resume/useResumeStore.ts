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
  updateResumeAsync: (resume: ResumeData) => Promise<any>;
  updateResumeTitle: (title: string) => Promise<void>;
  deleteResume: (resume: ResumeData) => Promise<void>;
  duplicateResume: (resumeId: string) => string;
  getResumeFullById: (id: string) => Promise<any>;
  getResumeFullByIdMock: () => Promise<any>;
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
        const user = useAppStore.getState().user;
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

        const now = new Date().toISOString();
        const newResume: ResumeData = {
          id,
          ...initialResumeData,
          activeSection: "basic",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          templateId: template?.id,
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
          menuSections: template.menuSections,
        };

        if (isRemoteUser()) {
          await upsertResumeByIdApi(newResume);
        } else {
          await localUpsertResume(newResume);
        }

        set((state) => ({
          activeResumeId: id,
          activeResume: newResume,
        }));
        return id;
      },

      updateResume: (resumeId, data, isNeedSync = true) => {
        const resume = get().activeResume;
        const updatedAt = new Date().toISOString();

        const updatedResume: ResumeData = {
          ...resume,
          ...data,
          updatedAt,
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
        if (!activeResumeId) return;

        const nextResume = {
          ...resume,
          isNeedSync: false,
          updatedAt: new Date().toISOString(),
        };

        let res = null;

        if (isRemoteUser()) {
          res = await upsertResumeByIdApi(nextResume);
        } else {
          res = await localUpsertResume(nextResume);
        }

        get().updateResume(activeResumeId, nextResume, false);

        return res;
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
          activeResumeId: null,
          activeResume: null,
        });
      },

      duplicateResume: (resumeId) => {
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
          isNeedSync: true,
        };

        const duplicatedResume: ResumeData = {
          ...duplicatedResumeBase,
          menuSections: [...(duplicatedResumeBase.menuSections || [])],
        };

        set({
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
          resumeData.isPublic = true;
        }
        if (!resumeData) {
          throw new Error("Resume not found");
        }
        const newResume: ResumeData = {
          activeSection: "basic",
          ...resumeData,
        };
        set({
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
          ...activeResume,
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
            : section,
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
      name: "resume-list-store", // 持久化存储名称
    },
  ),
);

export default useResumeStore;
