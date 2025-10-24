import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Education,
  Experience,
  Project,
  CustomItem,
  ResumeSection,
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

  updateSectionBasic: (data: Record<string, any>) => void;
  updateSectionEducation: (data: Record<string, any>) => void;
  updateSectionExperience: (data: Record<string, any>) => void;
  updateSectionProjects: (data: Record<string, any>) => void;

  updateEducationBatch: (educations: Education[]) => void;
  deleteEducation: (id: string) => void;

  // 工作经验编辑
  updateExperienceBatch: (experiences: Experience[]) => void;
  deleteExperience: (id: string) => void;

  // 项目经验编辑
  updateProjectsBatch: (projects: Project[]) => void;
  deleteProject: (id: string) => void;
  setDraggingProjectId: (id: string | null) => void;

  // 技能编辑
  updateSkillContent: (skillContent: string) => void;
  updateSectionContentById: (sectionId: string, content: string) => void;

  // 自定义内容编辑
  addCustomData: (sectionId: string) => void;
  updateCustomData: (sectionId: string, items: CustomItem[]) => void;
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
  updateMenuSections: (sections: ResumeSection[]) => void;
  addMenuSection: () => void;
}

export const useResumeEditorStore = create<ResumeEditorStore>()(
  persist(
    (set, get) => ({
      activeSection: "basic",
      draggingProjectId: null,
      // 基础信息编辑
      updateSectionBasic: (vals) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();

        const resume = validateActiveResume(activeResumeId, resumes);
        if (!resume) return;

        updateResume(activeResumeId!, {
          menuSections: resume.menuSections.map((s) => {
            if (s.id !== "basic") return s;
            return { ...s, ...vals };
          }),
        });
      },
      // 教育经历编辑
      updateSectionEducation: (vals) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        updateResume(activeResumeId, {
          menuSections: currentResume.menuSections.map((s) => {
            if (s.id !== "education") return s;
            return { ...s, ...vals };
          }),
        });
      },

      updateEducationBatch: (educations) => {
        const { activeResumeId, updateResume } = useResumeListStore.getState();
        if (activeResumeId) {
          const { resumes } = useResumeListStore.getState();
          const currentResume = resumes[activeResumeId];
          if (!currentResume) return;
          updateResume(activeResumeId, {
            menuSections: currentResume.menuSections.map((s) =>
              s.id === "education" ? { ...s, content: educations } : s
            ),
          });
        }
      },

      deleteEducation: (id) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;
        const resume = resumes[activeResumeId];
        if (!resume) return;

        updateResume(activeResumeId, {
          menuSections: resume.menuSections.map((s) => {
            if (s.id !== "education") return s;
            const content = s.content as Education[];
            return { ...s, content: content.filter((e) => e.id !== id) };
          }),
        });
      },
      // 工作经验编辑
      updateSectionExperience: (vals) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        updateResume(activeResumeId, {
          menuSections: currentResume.menuSections.map((s) =>
            s.id === "experience" ? { ...s, ...vals } : s
          ),
        });
      },

      updateExperienceBatch: (experiences) => {
        const { activeResumeId, updateResume } = useResumeListStore.getState();
        if (activeResumeId) {
          const { resumes } = useResumeListStore.getState();
          const currentResume = resumes[activeResumeId];
          if (!currentResume) return;
          updateResume(activeResumeId, {
            menuSections: currentResume.menuSections.map((s) =>
              s.id === "experience" ? { ...s, content: experiences } : s
            ),
          });
        }
      },

      deleteExperience: (id) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        updateResume(activeResumeId, {
          menuSections: currentResume.menuSections.map((s) => {
            if (s.id !== "experience") return s;
            const content = s.content as Experience[];
            return { ...s, content: content.filter((e) => e.id !== id) };
          }),
        });
      },

      updateSectionProjects: (project) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        updateResume(activeResumeId, {
          menuSections: currentResume.menuSections.map((s) =>
            s.id === "projects" ? { ...s, ...project } : s
          ),
        });
      },

      updateProjectsBatch: (projects) => {
        const { activeResumeId, updateResume } = useResumeListStore.getState();
        if (activeResumeId) {
          const { resumes } = useResumeListStore.getState();
          const currentResume = resumes[activeResumeId];
          if (!currentResume) return;
          updateResume(activeResumeId, {
            menuSections: currentResume.menuSections.map((s) =>
              s.id === "projects" ? { ...s, content: projects } : s
            ),
          });
        }
      },

      deleteProject: (id) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        updateResume(activeResumeId, {
          menuSections: currentResume.menuSections.map((s) => {
            if (s.id !== "projects") return s;
            const content = s.content as Project[];
            return { ...s, content: content.filter((p) => p.id !== id) };
          }),
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
          const { resumes } = useResumeListStore.getState();
          const currentResume = resumes[activeResumeId];
          if (!currentResume) return;
          updateResume(activeResumeId, {
            menuSections: currentResume.menuSections.map((s) =>
              s.id === "skills" ? { ...s, content: skillContent } : s
            ),
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

      addMenuSection: () => {
        const { activeResumeId, updateResume, activeResume } =
          useResumeListStore.getState();
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
        draggingProjectId: state.draggingProjectId,
      }),
    }
  )
);

export default useResumeEditorStore; // By Cursor
