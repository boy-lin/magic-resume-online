/**
 * 简历状态管理兼容层
 * 为了保持向后兼容，将原有的useResumeStore重构为使用新的分片状态管理
 * 
 * @deprecated 建议使用新的分片状态管理：
 * - useResumeListStore: 简历列表管理
 * - useResumeEditorStore: 简历编辑管理  
 * - useResumeSettingsStore: 简历设置管理
 */

import { useResumeListStore } from './resume/useResumeListStore';
import { useResumeEditorStore } from './resume/useResumeEditorStore';
import { useResumeSettingsStore } from './resume/useResumeSettingsStore';

/**
 * 兼容的简历状态管理Hook
 * 保持原有API不变，内部使用新的分片状态管理
 */
export const useResumeStore = () => {
  const listStore = useResumeListStore();
  const editorStore = useResumeEditorStore();
  const settingsStore = useResumeSettingsStore();

  return {
    // 状态
    resumes: listStore.resumes,
    activeResumeId: listStore.activeResumeId,
    activeResume: listStore.activeResume,
    resumeView: settingsStore.resumeView,

    // 简历管理
    createResume: listStore.createResume,
    deleteResume: listStore.deleteResume,
    duplicateResume: listStore.duplicateResume,
    setActiveResume: listStore.setActiveResume,
    updateResume: listStore.updateResume,
    updateResumeTitle: listStore.updateResumeTitle,
    updateResumeAsync: listStore.updateResumeAsync,

    // 基础信息编辑
    updateBasicInfo: editorStore.updateBasicInfo,

    // 教育经历编辑
    updateEducation: editorStore.updateEducation,
    updateEducationBatch: editorStore.updateEducationBatch,
    deleteEducation: editorStore.deleteEducation,

    // 工作经验编辑
    updateExperience: editorStore.updateExperience,
    updateExperienceBatch: editorStore.updateExperienceBatch,
    deleteExperience: editorStore.deleteExperience,

    // 项目经验编辑
    updateProjects: editorStore.updateProjects,
    updateProjectsBatch: editorStore.updateProjectsBatch,
    deleteProject: editorStore.deleteProject,
    setDraggingProjectId: editorStore.setDraggingProjectId,

    // 技能编辑
    updateSkillContent: editorStore.updateSkillContent,

    // 自定义内容编辑
    addCustomData: editorStore.addCustomData,
    updateCustomData: editorStore.updateCustomData,
    removeCustomData: editorStore.removeCustomData,
    addCustomItem: editorStore.addCustomItem,
    updateCustomItem: editorStore.updateCustomItem,
    removeCustomItem: editorStore.removeCustomItem,

    // 菜单和章节管理
    reorderSections: editorStore.reorderSections,
    toggleSectionVisibility: editorStore.toggleSectionVisibility,
    setActiveSection: editorStore.setActiveSection,
    updateMenuSections: editorStore.updateMenuSections,

    // 设置管理
    updateGlobalSettings: settingsStore.updateGlobalSettings,
    setThemeColor: settingsStore.setThemeColor,
    setTemplate: settingsStore.setTemplate,
    getViewScale: settingsStore.getViewScale,
    setResumeView: settingsStore.setResumeView,

    // 数据获取
    getResumeList: listStore.getResumeList,
    getResumeFullById: listStore.getResumeFullById,
  };
};

export default useResumeStore; // By Cursor
