import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ResumeSection, ResumeSectionContent } from "@/types/resume";
import { ResumeData } from "@/types/resume";
import { generateUUID } from "@/utils/uuid";
import {
  getResumesByUserIdPrisma,
  getResumeByIdPrismaApi,
  upsertResumeByIdApi,
  deleteResumeByIdApi,
} from "@/store/resume/utils.prisma";
import {
  initialResumeState,
  initialResumeStateEn,
} from "@/config/initialResumeData";
import { DEFAULT_TEMPLATES } from "@/config";
import { logger } from "./utils";
import { useAppStore } from "@/store/useApp";
import {
  localDeleteResumeById,
  localGetAllResumes,
  localGetResumeById,
  localGetResumeList,
  localUpsertResume,
} from "./utils.local";

function isRemoteUser() {
  return Boolean(useAppStore.getState().user?.id);
}

async function withDataMode<T>(
  remoteFn: () => Promise<T>,
  localFn: () => Promise<T>,
): Promise<T> {
  const remote = isRemoteUser();
  const { userLoading } = useAppStore.getState();

  if (remote) {
    try {
      return await remoteFn();
    } catch (error) {
      logger.error("Remote mode failed, fallback to local mode:", error);
      return await localFn();
    }
  }

  if (userLoading !== 2) {
    try {
      return await remoteFn();
    } catch {
      return await localFn();
    }
  }

  return await localFn();
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
  syncLocalResumesToRemote: () => Promise<void>;
  updateSectionById: (sectionId: string, data: Partial<ResumeSection>) => void;
  deleteSectionById: (sectionId: string) => void;
  addCustomSection: (section: ResumeSection) => void;
  updateSectionBasic: (section: ResumeSection) => void;
  updateSectionEducation: (section: ResumeSection) => void;
  updateEducationBatch: (educations: ResumeSectionContent[]) => void;
  updateSectionExperience: (vals: Partial<ResumeSection>) => void;
  updateSectionProjects: (project: Partial<ResumeSection>) => void;
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

        await withDataMode(
          async () => upsertResumeByIdApi(newResume),
          async () => localUpsertResume(newResume),
        );

        await localUpsertResume(newResume).catch((error) =>
          logger.error("Failed to cache resume in local DB:", error),
        );

        set((state) => ({
          activeResumeId: id,
          activeResume: newResume,
        }));
        return id;
      },

      updateResume: (resumeId, data, isNeedSync) => {
        const resume = get().activeResume;
        const shouldSync = isNeedSync ?? isRemoteUser();
        const updatedAt = new Date().toISOString();

        const updatedResume: ResumeData = {
          ...resume,
          ...data,
          updatedAt,
          isNeedSync: shouldSync,
          menuSections: data.menuSections ?? resume.menuSections,
        };

        localUpsertResume(updatedResume).catch((error) =>
          logger.error("Failed to persist resume locally:", error),
        );

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
          updatedAt: new Date().toISOString(),
        };

        let synced = false;
        let res = null;

        if (isRemoteUser()) {
          try {
            res = await upsertResumeByIdApi(nextResume);
            synced = true;
          } catch (error) {
            logger.error("Failed to sync resume to remote:", error);
          }
        }

        await localUpsertResume({
          ...nextResume,
          isNeedSync: !synced && isRemoteUser(),
        }).catch((error) =>
          logger.error("Failed to persist resume locally:", error),
        );

        get().updateResume(
          activeResumeId,
          nextResume,
          !synced && isRemoteUser(),
        );

        return res;
      },

      updateResumeTitle: async (title) => {
        const { activeResumeId, activeResume } = get();
        if (activeResumeId) {
          const current = activeResume;
          if (!current) return;
          const updated = {
            ...current,
            title,
            updatedAt: new Date().toISOString(),
          };

          let synced = false;
          if (isRemoteUser()) {
            try {
              await upsertResumeByIdApi(updated);
              synced = true;
            } catch (error) {
              logger.error("Failed to sync resume title to remote:", error);
            }
          }

          await localUpsertResume({
            ...updated,
            isNeedSync: !synced && isRemoteUser(),
          }).catch((error) =>
            logger.error("Failed to persist resume title locally:", error),
          );

          get().updateResume(
            activeResumeId,
            { title },
            !synced && isRemoteUser(),
          );
        }
      },

      deleteResume: async (resume) => {
        const resumeId = resume.id;

        if (isRemoteUser()) {
          try {
            await deleteResumeByIdApi(resumeId);
          } catch (error) {
            logger.error("Failed to delete remote resume:", error);
          }
        }

        await localDeleteResumeById(resumeId).catch((error) =>
          logger.error("Failed to delete local resume:", error),
        );

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
            isNeedSync: isRemoteUser(),
          };

          const duplicatedResume: ResumeData = {
            ...duplicatedResumeBase,
            menuSections: [...(duplicatedResumeBase.menuSections || [])],
          };

          set((state) => ({
            activeResumeId: newId,
            activeResume: duplicatedResume,
          }));

          localUpsertResume(duplicatedResume).catch((error) =>
            logger.error("Failed to persist duplicated resume locally:", error),
          );

          return newId;
        } catch (error) {
          logger.error(`Failed to duplicate resume ${resumeId}:`, error);
          throw error;
        }
      },

      setActiveResume: (resumeId) => {
        const resume = get().activeResume;
        if (resume) {
          set({ activeResume: resume, activeResumeId: resumeId });
        }
      },

      getResumeList: async ({ current, pageSize }) => {
        try {
          const { data } = await withDataMode(
            async () =>
              getResumesByUserIdPrisma({
                current,
                pageSize,
              }),
            async () =>
              localGetResumeList({
                current,
                pageSize,
              }),
          );

          if (!data) return [];

          const resumesMap: Record<string, any> = {};
          data.forEach((it) => {
            resumesMap[it.id] = {
              id: it.id,
              title: it.title,
              createdAt: it.created_at,
              updatedAt: it.updated_at || it.created_at,
              templateId: it.template_id,
              isPublic: Boolean(it.is_public),
            };
          });
          return data;
        } catch (error) {
          logger.error("Failed to get resume list:", error);
          return [];
        }
      },

      getResumeFullById: async (id) => {
        const resumeData = await withDataMode(
          async () => getResumeByIdPrismaApi(id),
          async () => {
            const resume = await localGetResumeById(id);
            if (!resume) {
              throw new Error("Resume not found");
            }
            return resume;
          },
        );

        const newResume: ResumeData = {
          activeSection: "basic",
          ...resumeData,
        };

        await localUpsertResume(newResume).catch((error) =>
          logger.error("Failed to cache full resume locally:", error),
        );

        set((state) => ({
          activeResumeId: id,
          activeResume: newResume,
        }));
        return newResume;
      },

      syncLocalResumesToRemote: async () => {
        if (!isRemoteUser()) return;

        const localResumes = await localGetAllResumes().catch((error) => {
          logger.error("Failed to read local resumes for sync:", error);
          return [];
        });

        if (!localResumes?.length) return;

        await Promise.all(
          localResumes.map(async (resume) => {
            try {
              await upsertResumeByIdApi(resume);
              await localUpsertResume({
                ...resume,
                isNeedSync: false,
              });
            } catch (error) {
              logger.error(`Failed to sync local resume ${resume.id}:`, error);
            }
          }),
        );
      },

      updateSectionById: (sectionId, data) => {
        const { activeResumeId, activeResume, updateResume } = get();

        if (!activeResumeId) return;
        if (!activeResume) return;

        console.log("data", sectionId, data);
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
      updateSectionBasic: (section: ResumeSection) => {
        const { activeResume } = get();
        if (!activeResume) return;
        get().updateResume(activeResume.id, {
          menuSections: activeResume?.menuSections.map((s) =>
            s.id === "basic" ? { ...s, ...section } : s,
          ),
        });
      },
      // 教育经历编辑
      updateSectionEducation: (section: ResumeSection) => {
        const { activeResume } = get();
        if (!activeResume) return;
        get().updateResume(activeResume.id, {
          menuSections: activeResume?.menuSections.map((s) =>
            s.id === "education" ? { ...s, ...section } : s,
          ),
        });
      },

      updateEducationBatch: (educations: ResumeSectionContent[]) => {
        const { activeResume } = get();
        if (!activeResume) return;
        get().updateSectionById("education", { content: educations });
      },

      // 工作经验编辑
      updateSectionExperience: (vals) => {
        const { activeResumeId, activeResume, updateResume } = get();

        if (!activeResumeId) return;
        if (!activeResume) return;

        updateResume(activeResumeId, {
          menuSections: activeResume.menuSections.map((s) =>
            s.id === "experience" ? { ...s, ...vals } : s,
          ),
        });
      },

      updateSectionProjects: (project) => {
        const { activeResumeId, activeResume, updateResume } = get();

        if (!activeResumeId) return;
        if (!activeResume) return;

        updateResume(activeResumeId, {
          menuSections: activeResume.menuSections.map((s) =>
            s.id === "projects" ? { ...s, ...project } : s,
          ),
        });
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
