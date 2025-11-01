import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ResumeSection, ResumeSectionContent } from "@/types/resume";
import { useResumeListStore } from "./useResumeListStore";
import { generateUUID } from "@/utils/uuid";

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

  updateEducationBatch: (educations: ResumeSectionContent[]) => void;

  // 项目经验编辑
  setDraggingProjectId: (id: string | null) => void;

  updateSectionById: (sectionId: string, vals: Partial<ResumeSection>) => void;

  // 菜单和章节管理
  reorderSections: (newOrder: ResumeSection[]) => void;
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

      updateSectionById: (sectionId, data) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();

        if (!activeResumeId) return;
        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        console.log("data", sectionId, data);
        updateResume(activeResumeId, {
          ...currentResume,
          menuSections: currentResume.menuSections.map((s) =>
            s.id === sectionId ? { ...s, ...data } : s
          ),
        });
      },
      deleteSectionById: (sectionId: string) => {
        const { activeResumeId, resumes, updateResume } =
          useResumeListStore.getState();
        if (!activeResumeId) return;

        const currentResume = resumes[sectionId];
        if (!currentResume) return;
        updateResume(activeResumeId, {
          menuSections: currentResume.menuSections.filter(
            (s) => s.id !== sectionId
          ),
        });
      },
      addCustomSection: (section: ResumeSection) => {
        const { activeResumeId, resumes } = useResumeListStore.getState();
        const currentResume = resumes[activeResumeId];
        if (!currentResume) return;

        get().updateMenuSections([...currentResume.menuSections, section]);
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
