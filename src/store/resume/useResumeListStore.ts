import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ResumeData } from "@/types/resume";
import { generateUUID } from "@/utils/uuid";
import {
  upsertResumeById,
  getResumesByUserId,
  deleteResumeById,
  getResumeById,
} from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/client";
import { getFileHandle, verifyPermission } from "@/utils/fileSystem";
import {
  initialResumeState,
  initialResumeStateEn,
} from "@/config/initialResumeData";
import { DEFAULT_TEMPLATES } from "@/config";
import { validateApiResponse, validateResume, logger } from "./utils";

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
}

export const useResumeListStore = create(
  persist<ResumeListStore>(
    (set, get) => ({
      resumes: {},
      activeResumeId: null,
      activeResume: null,

      createResume: async (templateId = null) => {
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
          ...initialResumeData,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          templateId: template?.id,
          title: `${locale === "en" ? "New Resume" : "新建简历"} ${id.slice(
            0,
            6
          )}`,
        };

        await upsertResumeById(createClient(), newResume);
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

      updateResume: (resumeId, data, isNeedSync = true) => {
        try {
          const resume = validateResume(resumeId, get().resumes);

          const updatedResume = {
            ...resume,
            ...data,
            isNeedSync,
          };

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
        } catch (error) {
          logger.warn(`Failed to update resume ${resumeId}:`, error);
        }
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

          const duplicatedResume = {
            ...originalResume,
            id: newId,
            title: `${originalResume.title} (${
              locale === "en" ? "Copy" : "复制"
            })`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            resumes: {
              ...state.resumes,
              [newId]: duplicatedResume,
            },
            activeResumeId: newId,
            activeResume: duplicatedResume,
          }));

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
          const client = createClient();
          const { data, error } = await getResumesByUserId(client, {
            current,
            pageSize,
          });

          if (error) throw error;
          if (!data) return [];

          const resumesMap = {};
          data.forEach((it) => {
            resumesMap[it.id] = {
              id: it.id,
              title: it.title,
              createdAt: it.created_at,
              templateId: it.template_id,
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
        try {
          const client = createClient();
          const resumeData = await getResumeById(client, id);

          const newResume = {
            activeSection: "basic",
            draggingProjectId: null,
            ...resumeData,
          };

          set((state) => ({
            resumes: {
              ...state.resumes,
              [resumeData.id]: newResume,
            },
            activeResumeId: id,
            activeResume: newResume,
          }));

          return resumeData;
        } catch (error) {
          logger.error(`Failed to get resume by id ${id}:`, error);
          throw error;
        }
      },
    }),
    {
      name: "resume-list-store", // 持久化存储名称
      partialize: (state) => ({
        resumes: state.resumes,
        activeResumeId: state.activeResumeId,
        activeResume: state.activeResume,
      }),
    }
  )
);

export default useResumeListStore; // By Cursor
