/**
 * 简历状态管理统一入口
 * 导出所有分片的状态管理，提供统一的使用接口
 */

// 导出各个分片的状态管理
export { useResumeListStore } from './useResumeListStore';
export { useResumeEditorStore } from './useResumeEditorStore';
export { useResumeSettingsStore } from './useResumeSettingsStore';

// 统一的状态管理Hook，提供便捷的访问方式
import { useResumeListStore } from './useResumeListStore';
import { useResumeEditorStore } from './useResumeEditorStore';
import { useResumeSettingsStore } from './useResumeSettingsStore';

/**
 * 统一的状态管理Hook
 * 提供对所有简历相关状态的访问
 */
export const useResumeStore = () => {
  const listStore = useResumeListStore();
  const editorStore = useResumeEditorStore();
  const settingsStore = useResumeSettingsStore();

  return {
    // 列表相关
    ...listStore,
    
    // 编辑器相关
    ...editorStore,
    
    // 设置相关
    ...settingsStore,
  };
};

// 默认导出统一的状态管理
export default useResumeStore; // By Cursor 