import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getFileHandle, verifyPermission } from "@/utils/fileSystem";
import {
  BasicInfo,
  Education,
  Experience,
  GlobalSettings,
  Project,
  CustomItem,
  ResumeData,
  MenuSection,
} from "../types/resume";
import { DEFAULT_TEMPLATES } from "@/config";
import {
  initialResumeState,
  initialResumeStateEn,
} from "@/config/initialResumeData";
import { generateUUID } from "@/utils/uuid";
import {
  upsertResumeById,
  getResumesByUserId,
  deleteResumeById,
  getResumesById,
} from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/client";
interface ResumeStore {
  resumes: Record<string, ResumeData>;
  activeResumeId: string | null;
  activeResume: ResumeData | null;

  createResume: (templateId: string | null) => Promise<any>;
  deleteResume: (resume: ResumeData) => void;
  duplicateResume: (resumeId: string) => string;
  updateResume: (
    resumeId: string,
    data: Partial<ResumeData>,
    isNeedSync?: boolean
  ) => void;
  setActiveResume: (resumeId: string) => void;

  updateResumeTitle: (title: string) => void;
  updateResumeAsync: (resume: ResumeData) => Promise<any>;
  updateBasicInfo: (data: Partial<BasicInfo>) => void;
  updateEducation: (data: Education) => void;
  updateEducationBatch: (educations: Education[]) => void;
  deleteEducation: (id: string) => void;
  updateExperience: (data: Experience) => void;
  updateExperienceBatch: (experiences: Experience[]) => void;
  deleteExperience: (id: string) => void;
  updateProjects: (project: Project) => void;
  updateProjectsBatch: (projects: Project[]) => void;
  deleteProject: (id: string) => void;
  setDraggingProjectId: (id: string | null) => void;
  updateSkillContent: (skillContent: string) => void;
  reorderSections: (newOrder: ResumeData["menuSections"]) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  setActiveSection: (sectionId: string) => void;
  updateMenuSections: (sections: ResumeData["menuSections"]) => void;
  addCustomData: (sectionId: string) => void;
  updateCustomData: (sectionId: string, items: CustomItem[]) => void;
  removeCustomData: (sectionId: string) => void;
  addCustomItem: (sectionId: string) => void;
  updateCustomItem: (
    sectionId: string,
    itemId: string,
    updates: Partial<CustomItem>
  ) => void;
  removeCustomItem: (sectionId: string, itemId: string) => void;
  updateGlobalSettings: (settings: Partial<GlobalSettings>) => void;
  setThemeColor: (color: string) => void;
  setTemplate: (templateId: string) => void;

  getResumeList: () => Promise<any>;
}

// 同步简历到文件系统
const syncResumeToFile = async (
  resumeData: ResumeData,
  prevResume?: ResumeData
) => {
  try {
    const handle = await getFileHandle("syncDirectory");
    if (!handle) {
      console.warn("No directory handle found");
      return;
    }

    const hasPermission = await verifyPermission(handle);
    if (!hasPermission) {
      console.warn("No permission to write to directory");
      return;
    }

    const dirHandle = handle as FileSystemDirectoryHandle;

    if (
      prevResume &&
      prevResume.id === resumeData.id &&
      prevResume.title !== resumeData.title
    ) {
      try {
        await dirHandle.removeEntry(`${prevResume.title}.json`);
      } catch (error) {
        console.warn("Error deleting old file:", error);
      }
    }

    const fileName = `${resumeData.title}.json`;
    const fileHandle = await dirHandle.getFileHandle(fileName, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(resumeData, null, 2));
    await writable.close();
  } catch (error) {
    console.error("Error syncing resume to file:", error);
  }
};

export const useResumeStore = create(
  persist<ResumeStore>(
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
        // syncResumeToFile(newResume);
      },

      updateResume: (resumeId, data, isNeedSync = true) => {
        const resume = get().resumes[resumeId];

        if (!resume) return;

        const updatedResume = {
          ...resume,
          ...data,
          isNeedSync,
        };

        syncResumeToFile(updatedResume, resume);
        set((state) => {
          return {
            resumes: {
              ...state.resumes,
              [resumeId]: updatedResume,
            },
            activeResume:
              state.activeResumeId === resumeId
                ? updatedResume
                : state.activeResume,
          };
        });
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
        const newId = generateUUID();
        const originalResume = get().resumes[resumeId];

        // 获取当前语言环境
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
      },

      setActiveResume: (resumeId) => {
        const resume = get().resumes[resumeId];
        if (resume) {
          set({ activeResume: resume, activeResumeId: resumeId });
        }
      },

      updateBasicInfo: (data) => {
        set((state) => {
          if (!state.activeResume) return state;

          const updatedResume = {
            ...state.activeResume,
            basic: {
              ...state.activeResume.basic,
              ...data,
            },
            isNeedSync: true,
          };

          const newState = {
            resumes: {
              ...state.resumes,
              [state.activeResume.id]: updatedResume,
            },
            activeResume: updatedResume,
          };

          // syncResumeToFile(updatedResume, state.activeResume);

          return newState;
        });
      },

      updateEducation: (education) => {
        const { activeResumeId, resumes } = get();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        const newEducation = currentResume.education.some(
          (e) => e.id === education.id
        )
          ? currentResume.education.map((e) =>
              e.id === education.id ? education : e
            )
          : [...currentResume.education, education];
        get().updateResume(activeResumeId, {
          education: newEducation,
        });
      },

      updateEducationBatch: (educations) => {
        const { activeResumeId } = get();
        if (activeResumeId) {
          get().updateResume(activeResumeId, {
            education: educations,
          });
        }
      },

      deleteEducation: (id) => {
        const { activeResumeId } = get();
        if (activeResumeId) {
          const resume = get().resumes[activeResumeId];
          const updatedEducation = resume.education.filter((e) => e.id !== id);
          get().updateResume(activeResumeId, {
            education: updatedEducation,
          });
        }
      },

      updateExperience: (experience) => {
        const { activeResumeId, resumes } = get();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        const newExperience = currentResume.experience.find(
          (e) => e.id === experience.id
        )
          ? currentResume.experience.map((e) =>
              e.id === experience.id ? experience : e
            )
          : [...currentResume.experience, experience];

        get().updateResume(activeResumeId, {
          experience: newExperience,
        });
      },

      updateExperienceBatch: (experiences: Experience[]) => {
        const { activeResumeId } = get();
        if (activeResumeId) {
          const updateData = { experience: experiences };
          get().updateResume(activeResumeId, updateData);
        }
      },
      deleteExperience: (id) => {
        const { activeResumeId, resumes } = get();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        const updatedExperience = currentResume.experience.filter(
          (e) => e.id !== id
        );

        get().updateResume(activeResumeId, {
          experience: updatedExperience,
        });
      },

      updateProjects: (project) => {
        const { activeResumeId, resumes } = get();
        if (!activeResumeId) return;
        const currentResume = resumes[activeResumeId];
        const newProjects = currentResume.projects.some(
          (p) => p.id === project.id
        )
          ? currentResume.projects.map((p) =>
              p.id === project.id ? project : p
            )
          : [...currentResume.projects, project];

        get().updateResume(activeResumeId, {
          projects: newProjects,
        });
      },

      updateProjectsBatch: (projects: Project[]) => {
        const { activeResumeId } = get();
        if (activeResumeId) {
          const updateData = { projects };
          get().updateResume(activeResumeId, updateData);
        }
      },

      deleteProject: (id) => {
        const { activeResumeId } = get();
        if (!activeResumeId) return;
        const currentResume = get().resumes[activeResumeId];
        const updatedProjects = currentResume.projects.filter(
          (p) => p.id !== id
        );
        get().updateResume(activeResumeId, {
          projects: updatedProjects,
        });
      },

      setDraggingProjectId: (id: string | null) => {
        const { activeResumeId } = get();
        if (activeResumeId) {
          get().updateResume(
            activeResumeId,
            {
              draggingProjectId: id,
            },
            false
          );
        }
      },

      updateSkillContent: (skillContent) => {
        const { activeResumeId } = get();
        if (activeResumeId) {
          get().updateResume(activeResumeId, {
            skillContent,
          });
        }
      },

      reorderSections: (newOrder) => {
        const { activeResumeId, resumes } = get();
        if (activeResumeId) {
          const currentResume = resumes[activeResumeId];
          const basicInfoSection = currentResume.menuSections.find(
            (section) => section.id === "basic"
          );
          const reorderedSections = [
            basicInfoSection,
            ...newOrder.filter((section) => section.id !== "basic"),
          ].map((section, index) => ({
            ...section,
            order: index,
          }));
          get().updateResume(activeResumeId, {
            menuSections: reorderedSections as MenuSection[],
          });
        }
      },

      toggleSectionVisibility: (sectionId) => {
        const { activeResumeId, resumes } = get();
        if (activeResumeId) {
          const currentResume = resumes[activeResumeId];
          const updatedSections = currentResume.menuSections.map((section) =>
            section.id === sectionId
              ? { ...section, enabled: !section.enabled }
              : section
          );
          get().updateResume(activeResumeId, {
            menuSections: updatedSections,
          });
        }
      },

      setActiveSection: (sectionId) => {
        const { activeResumeId } = get();
        if (activeResumeId) {
          get().updateResume(
            activeResumeId,
            {
              activeSection: sectionId,
            },
            false
          );
        }
      },

      updateMenuSections: (sections) => {
        const { activeResumeId } = get();
        if (activeResumeId) {
          get().updateResume(activeResumeId, {
            menuSections: sections,
          });
        }
      },

      addCustomData: (sectionId) => {
        const { activeResumeId } = get();
        if (activeResumeId) {
          const currentResume = get().resumes[activeResumeId];
          const updatedCustomData = {
            ...currentResume.customData,
            [sectionId]: [
              {
                id: generateUUID(),
                title: "未命名模块",
                subtitle: "",
                dateRange: "",
                description: "",
                visible: true,
              },
            ],
          };
          get().updateResume(activeResumeId, {
            customData: updatedCustomData,
          });
        }
      },

      updateCustomData: (sectionId, items) => {
        const { activeResumeId } = get();
        if (activeResumeId) {
          const currentResume = get().resumes[activeResumeId];
          const updatedCustomData = {
            ...currentResume.customData,
            [sectionId]: items,
          };
          get().updateResume(activeResumeId, {
            customData: updatedCustomData,
          });
        }
      },

      removeCustomData: (sectionId) => {
        const { activeResumeId } = get();
        if (activeResumeId) {
          const currentResume = get().resumes[activeResumeId];
          const { [sectionId]: _, ...rest } = currentResume.customData;
          get().updateResume(activeResumeId, {
            customData: rest,
          });
        }
      },

      addCustomItem: (sectionId) => {
        const { activeResumeId } = get();
        if (activeResumeId) {
          const currentResume = get().resumes[activeResumeId];
          const updatedCustomData = {
            ...currentResume.customData,
            [sectionId]: [
              ...(currentResume.customData[sectionId] || []),
              {
                id: generateUUID(),
                title: "未命名模块",
                subtitle: "",
                dateRange: "",
                description: "",
                visible: true,
              },
            ],
          };
          get().updateResume(activeResumeId, {
            customData: updatedCustomData,
          });
        }
      },

      updateCustomItem: (sectionId, itemId, updates) => {
        const { activeResumeId } = get();
        if (activeResumeId) {
          const currentResume = get().resumes[activeResumeId];
          const updatedCustomData = {
            ...currentResume.customData,
            [sectionId]: currentResume.customData[sectionId].map((item) =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
          };
          get().updateResume(activeResumeId, {
            customData: updatedCustomData,
          });
        }
      },

      removeCustomItem: (sectionId, itemId) => {
        const { activeResumeId } = get();
        if (activeResumeId) {
          const currentResume = get().resumes[activeResumeId];
          const updatedCustomData = {
            ...currentResume.customData,
            [sectionId]: currentResume.customData[sectionId].filter(
              (item) => item.id !== itemId
            ),
          };
          get().updateResume(activeResumeId, {
            customData: updatedCustomData,
          });
        }
      },

      updateGlobalSettings: (settings: Partial<GlobalSettings>) => {
        const { activeResumeId, updateResume, activeResume } = get();
        if (activeResumeId) {
          updateResume(activeResumeId, {
            globalSettings: {
              ...activeResume?.globalSettings,
              ...settings,
            },
          });
        }
      },

      setThemeColor: (color) => {
        const { activeResumeId, updateResume } = get();
        if (activeResumeId) {
          updateResume(activeResumeId, {
            globalSettings: {
              ...get().activeResume?.globalSettings,
              themeColor: color,
            },
          });
        }
      },

      setTemplate: (templateId, isNeedSync = false) => {
        const { activeResumeId, resumes } = get();
        if (!activeResumeId) return;

        const template = DEFAULT_TEMPLATES.find((t) => t.id === templateId);
        if (!template) return;

        const updatedResume = {
          ...resumes[activeResumeId],
          templateId,
          globalSettings: {
            ...resumes[activeResumeId].globalSettings,
            themeColor: template.colorScheme.primary,
            sectionSpacing: template.spacing.sectionGap,
            paragraphSpacing: template.spacing.itemGap,
            pagePadding: template.spacing.contentPadding,
          },
          basic: {
            ...resumes[activeResumeId].basic,
            layout: template.basic.layout,
          },
          isNeedSync,
        };

        set({
          resumes: {
            ...resumes,
            [activeResumeId]: updatedResume,
          },
          activeResume: updatedResume,
        });
      },
      getResumeList: async () => {
        const { data } = await getResumesByUserId(createClient());
        const resumesMap = {};
        data.forEach((val) => {
          resumesMap[val.id] = {
            activeSection: "basic",
            draggingProjectId: null,
            id: val.id,
            title: val.title,
            createdAt: val.created_at,
            updatedAt: val.updated_at,
            basic: JSON.parse(val.basic),
            templateId: val.template_id,
            customData: JSON.parse(val.custom_data),
            education: JSON.parse(val.education),
            experience: JSON.parse(val.experience),
            globalSettings: JSON.parse(val.global_settings),
            menuSections: JSON.parse(val.menu_sections),
            projects: JSON.parse(val.projects),
            skillContent: JSON.parse(val.skill_content),
            isPublic: val.is_public,
            publicPassword: val.public_password,
          };
        });
        set((state) => ({
          resumes: {
            ...state.resumes,
            ...resumesMap,
          },
        }));
      },
      getResumeById: async (id) => {
        const { data: val } = await getResumesById(createClient(), id);
        const newResume = {
          activeSection: "basic",
          draggingProjectId: null,
          id: val.id,
          title: val.title,
          createdAt: val.created_at,
          updatedAt: val.updated_at,
          basic: JSON.parse(val.basic),
          templateId: val.template_id,
          customData: JSON.parse(val.custom_data),
          education: JSON.parse(val.education),
          experience: JSON.parse(val.experience),
          globalSettings: JSON.parse(val.global_settings),
          menuSections: JSON.parse(val.menu_sections),
          projects: JSON.parse(val.projects),
          skillContent: JSON.parse(val.skill_content),
        };
        set((state) => ({
          resumes: {
            ...state.resumes,
            [val.id]: newResume,
          },
          activeResumeId: id,
          activeResume: newResume,
        }));
      },
    }),
    {
      name: "resume-storage",
    }
  )
);
