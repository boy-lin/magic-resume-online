import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BasicInfo,
  Education,
  Experience,
  Project,
  CustomItem,
  MenuSection,
} from "@/types/resume";
import { useResumeListStore } from "./useResumeListStore";
import { generateUUID } from "@/utils/uuid";
import { validateActiveResume, logger } from "./utils";

/**
 * 简历编辑器状态管理
 * 负责简历内容的编辑和更新
 */
interface ResumeEditorStore {
  // 编辑器状态
  activeSection: string;
  draggingProjectId: string | null;

  // 基础信息编辑
  updateBasicInfo: (data: Partial<BasicInfo>) => void;

  // 教育经历编辑
  updateEducation: (data: Education) => void;
  updateEducationBatch: (educations: Education[]) => void;
  deleteEducation: (id: string) => void;

  // 工作经验编辑
  updateExperience: (data: Experience) => void;
  updateExperienceBatch: (experiences: Experience[]) => void;
  deleteExperience: (id: string) => void;

  // 项目经验编辑
  updateProjects: (project: Project) => void;
  updateProjectsBatch: (projects: Project[]) => void;
  deleteProject: (id: string) => void;
  setDraggingProjectId: (id: string | null) => void;

  // 技能编辑
  updateSkillContent: (skillContent: string) => void;
  updateSectionContentById: (sectionId: string, content: string) => void;

  // 自定义内容编辑
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

  // 菜单和章节管理
  reorderSections: (newOrder: MenuSection[]) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  setActiveSection: (sectionId: string) => void;
  updateMenuSections: (sections: MenuSection[]) => void;
}

export const useResumeEditorStore = create<ResumeEditorStore>()(
  persist(
    (set, get) => ({
      activeSection: "basic",
      draggingProjectId: null,

      updateBasicInfo: (data) => {
        try {
          const { activeResumeId, resumes, updateResume } =
            useResumeListStore.getState();
          const currentResume = validateActiveResume(activeResumeId, resumes);
          if (!currentResume) return;

          const updatedBasic = {
            ...currentResume.basic,
            ...data,
          };

          updateResume(activeResumeId!, {
            basic: updatedBasic,
          });
        } catch (error) {
          logger.warn("Failed to update basic info:", error);
        }
      },

      updateEducation: (education) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        const newEducation = currentResume.education.some(
          (e) => e.id === education.id
        )
          ? currentResume.education.map((e) =>
              e.id === education.id ? education : e
            )
          : [...currentResume.education, education];

        updateResume(activeResumeId, {
          education: newEducation,
        });
      },

      updateEducationBatch: (educations) => {
        const { activeResumeId, updateResume } = useResumeListStore.getState();
        if (activeResumeId) {
          updateResume(activeResumeId, {
            education: educations,
          });
        }
      },

      deleteEducation: (id) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const resume = resumes[activeResumeId];
        if (!resume) return;

        const updatedEducation = resume.education.filter((e) => e.id !== id);
        updateResume(activeResumeId, {
          education: updatedEducation,
        });
      },

      updateExperience: (experience) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        const newExperience = currentResume.experience.find(
          (e) => e.id === experience.id
        )
          ? currentResume.experience.map((e) =>
              e.id === experience.id ? experience : e
            )
          : [...currentResume.experience, experience];

        updateResume(activeResumeId, {
          experience: newExperience,
        });
      },

      updateExperienceBatch: (experiences) => {
        const { activeResumeId, updateResume } = useResumeListStore.getState();
        if (activeResumeId) {
          updateResume(activeResumeId, {
            experience: experiences,
          });
        }
      },

      deleteExperience: (id) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        const updatedExperience = currentResume.experience.filter(
          (e) => e.id !== id
        );

        updateResume(activeResumeId, {
          experience: updatedExperience,
        });
      },

      updateProjects: (project) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        const newProjects = currentResume.projects.some(
          (p) => p.id === project.id
        )
          ? currentResume.projects.map((p) =>
              p.id === project.id ? project : p
            )
          : [...currentResume.projects, project];

        updateResume(activeResumeId, {
          projects: newProjects,
        });
      },

      updateProjectsBatch: (projects) => {
        const { activeResumeId, updateResume } = useResumeListStore.getState();
        if (activeResumeId) {
          updateResume(activeResumeId, {
            projects,
          });
        }
      },

      deleteProject: (id) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        const updatedProjects = currentResume.projects.filter(
          (p) => p.id !== id
        );
        updateResume(activeResumeId, {
          projects: updatedProjects,
        });
      },

      setDraggingProjectId: (id) => {
        const { activeResumeId, updateResume } = useResumeListStore.getState();
        if (activeResumeId) {
          updateResume(
            activeResumeId,
            {
              draggingProjectId: id,
            },
            false
          );
        }
      },

      updateSkillContent: (skillContent) => {
        const { activeResumeId, updateResume } = useResumeListStore.getState();
        if (activeResumeId) {
          updateResume(activeResumeId, {
            skillContent,
          });
        }
      },

      updateSectionContentById: (sectionId, content) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        const sections = currentResume.menuSections.map((section) =>
          section.id === sectionId ? { ...section, content } : section
        );

        updateResume(activeResumeId, {
          menuSections: sections,
        });
      },

      addCustomData: (sectionId) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        const newCustomData = {
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

        updateResume(activeResumeId, {
          customData: newCustomData,
        });
      },

      updateCustomData: (sectionId, items) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        const newCustomData = {
          ...currentResume.customData,
          [sectionId]: items,
        };

        updateResume(activeResumeId, {
          customData: newCustomData,
        });
      },

      removeCustomData: (sectionId) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        const { [sectionId]: _, ...newCustomData } = currentResume.customData;

        updateResume(activeResumeId, {
          customData: newCustomData,
        });
      },

      addCustomItem: (sectionId) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

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

        updateResume(activeResumeId, {
          customData: updatedCustomData,
        });
      },

      updateCustomItem: (sectionId, itemId, updates) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        const updatedCustomData = {
          ...currentResume.customData,
          [sectionId]: currentResume.customData[sectionId].map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        };

        updateResume(activeResumeId, {
          customData: updatedCustomData,
        });
      },

      removeCustomItem: (sectionId, itemId) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        const updatedCustomData = {
          ...currentResume.customData,
          [sectionId]: currentResume.customData[sectionId].filter(
            (item) => item.id !== itemId
          ),
        };

        updateResume(activeResumeId, {
          customData: updatedCustomData,
        });
      },

      reorderSections: (newOrder) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

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

        updateResume(activeResumeId, {
          menuSections: reorderedSections,
        });
      },

      toggleSectionVisibility: (sectionId) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        const updatedSections = currentResume.menuSections.map((section) =>
          section.id === sectionId
            ? { ...section, enabled: !section.enabled }
            : section
        );

        updateResume(activeResumeId, {
          menuSections: updatedSections,
        });
      },

      setActiveSection: (sectionId) => {
        const { activeResumeId, updateResume } = useResumeListStore.getState();
        if (activeResumeId) {
          updateResume(activeResumeId, {
            activeSection: sectionId,
          });
        }
      },

      updateMenuSections: (sections) => {
        const { activeResumeId, updateResume } = useResumeListStore.getState();
        if (activeResumeId) {
          updateResume(activeResumeId, {
            menuSections: sections,
          });
        }
      },
    }),
    {
      name: "resume-editor-store",
      partialize: (state) => ({
        activeSection: state.activeSection,
        draggingProjectId: state.draggingProjectId,
      }),
    }
  )
);

export default useResumeEditorStore; // By Cursor
