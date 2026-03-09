import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ResumeData } from "@/types/resume";
import { generateUUID } from "@/utils/uuid";
import {
  getResumesByUserIdPrisma,
  getResumeByIdPrismaApi,
  upsertResumeByIdApi,
  deleteResumeByIdApi,
} from "@/store/resume/utils.prisma";
import { getFileHandle, verifyPermission } from "@/utils/fileSystem";
import {
  initialResumeState,
  initialResumeStateEn,
} from "@/config/initialResumeData";
import { DEFAULT_TEMPLATES } from "@/config";
import { validateResume, logger } from "./utils";
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
  localFn: () => Promise<T>
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
 * 简历列表状态管理
 * 负责简历的增删改查和列表管理
 */
interface ResumeListStore {
  // 状态
  resumes: Record<string, ResumeData>;
  activeResumeId: string | null;
  activeResume: ResumeData | null;

  // 简历管理
  createResume: (templateId: string | null) => Promise<string>;
  deleteResume: (resume: ResumeData) => Promise<void>;
  duplicateResume: (resumeId: string) => string;
  setActiveResume: (resumeId: string) => void;

  // 简历更新
  updateResume: (
    resumeId: string,
    data: Partial<ResumeData>,
    isNeedSync?: boolean
  ) => void;
  updateResumeTitle: (title: string) => Promise<void>;
  updateResumeAsync: (resume: ResumeData) => Promise<any>;

  // 数据获取
  getResumeList: ({
    current,
    pageSize,
  }: {
    current: number;
    pageSize: number;
  }) => Promise<any>;
  getResumeFullById: (id: string) => Promise<any>;
  syncLocalResumesToRemote: () => Promise<void>;
}

export const useResumeListStore = create(
  persist<ResumeListStore>(
    (set, get) => ({
      resumes: {},
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
          draggingProjectId: null,
          createdAt: now,
          updatedAt: now,
          templateId: template?.id,
          isNeedSync: isRemoteUser(),
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

        await withDataMode(
          async () => upsertResumeByIdApi(newResume),
          async () => localUpsertResume(newResume)
        );

        await localUpsertResume(newResume).catch((error) =>
          logger.error("Failed to cache resume in local DB:", error)
        );

        set((state) => ({
          resumes: {
            ...state.resumes,
            [id]: newResume,
          },
          activeResumeId: id,
          activeResume: newResume,
        }));
        return id;
      },

      updateResume: (resumeId, data, isNeedSync) => {
        const resume = validateResume(resumeId, get().resumes);
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
          logger.error("Failed to persist resume locally:", error)
        );

        set((state) => ({
          resumes: {
            ...state.resumes,
            [resumeId]: updatedResume,
          },
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
          logger.error("Failed to persist resume locally:", error)
        );

        get().updateResume(activeResumeId, nextResume, !synced && isRemoteUser());

        return res;
      },

      updateResumeTitle: async (title) => {
        const { activeResumeId, resumes } = get();
        if (activeResumeId) {
          const current = resumes[activeResumeId];
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
            logger.error("Failed to persist resume title locally:", error)
          );

          get().updateResume(activeResumeId, { title }, !synced && isRemoteUser());
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
          logger.error("Failed to delete local resume:", error)
        );

        set((state) => {
          const { [resumeId]: _, activeResume, ...rest } = state.resumes;
          return {
            resumes: rest,
            activeResumeId: null,
            activeResume: null,
          };
        });

        try {
          const handle = await getFileHandle("syncDirectory");
          if (!handle) return;
          const hasPermission = await verifyPermission(handle);
          if (!hasPermission) return;
          const dirHandle = handle as FileSystemDirectoryHandle;
          await dirHandle.removeEntry(`${resume.title}.json`);
        } catch (error) {
          console.error("Error deleting resume file:", error);
        }
      },

      duplicateResume: (resumeId) => {
        try {
          const newId = generateUUID();
          const originalResume = validateResume(resumeId, get().resumes);

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
            resumes: {
              ...state.resumes,
              [newId]: duplicatedResume,
            },
            activeResumeId: newId,
            activeResume: duplicatedResume,
          }));

          localUpsertResume(duplicatedResume).catch((error) =>
            logger.error("Failed to persist duplicated resume locally:", error)
          );

          return newId;
        } catch (error) {
          logger.error(`Failed to duplicate resume ${resumeId}:`, error);
          throw error;
        }
      },

      setActiveResume: (resumeId) => {
        const resume = get().resumes[resumeId];
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
              })
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

          set((state) => ({
            resumes: {
              ...state.resumes,
              ...resumesMap,
            },
          }));

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
          }
        );

        const newResume: ResumeData = {
          activeSection: "basic",
          draggingProjectId: null,
          ...resumeData,
        };

        await localUpsertResume(newResume).catch((error) =>
          logger.error("Failed to cache full resume locally:", error)
        );

        set((state) => ({
          resumes: {
            ...state.resumes,
            [newResume.id]: newResume,
          },
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
          })
        );
      },
    }),
    {
      name: "resume-list-store", // 持久化存储名称
    }
  )
);

export default useResumeListStore; // By Cursor
