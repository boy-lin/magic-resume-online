/**
 * 状态管理工具函数
 * 用于错误处理和验证
 */

/**
 * 验证简历是否存在
 * @param resumeId - 简历ID
 * @param resumes - 简历列表
 * @returns 简历数据或抛出错误
 */
export const validateResume = (
  resumeId: string,
  resumes: Record<string, any>
) => {
  const resume = resumes[resumeId];
  if (!resume) {
    throw new Error(`Resume with id ${resumeId} not found`);
  }
  return resume;
};

/**
 * 验证活跃简历是否存在
 * @param activeResumeId - 活跃简历ID
 * @param resumes - 简历列表
 * @returns 活跃简历数据或null
 */
export const validateActiveResume = (
  activeResumeId: string | null,
  resumes: Record<string, any>
) => {
  if (!activeResumeId) {
    return null;
  }

  const resume = resumes[activeResumeId];
  if (!resume) {
    console.warn(`Active resume with id ${activeResumeId} not found`);
    return null;
  }

  return resume;
};

/**
 * 验证API响应数据（适用于返回 { data, error } 格式的函数）
 * @param data - API响应数据
 * @param error - API错误
 * @param context - 上下文信息
 * @returns 验证后的数据或抛出错误
 */
export const validateApiResponse = (data: any, error: any, context: string) => {
  if (error) {
    throw new Error(`${context}: ${error.message || error}`);
  }

  if (!data) {
    throw new Error(`${context}: No data received`);
  }

  return data;
};

/**
 * 验证直接返回数据的API响应（适用于直接返回数据或抛出错误的函数）
 * @param data - API响应数据
 * @param context - 上下文信息
 * @returns 验证后的数据或抛出错误
 */
export const validateDirectResponse = (data: any, context: string) => {
  if (!data) {
    throw new Error(`${context}: No data received`);
  }

  return data;
};

/**
 * 安全地访问嵌套对象属性
 * @param obj - 对象
 * @param path - 属性路径
 * @param defaultValue - 默认值
 * @returns 属性值或默认值
 */
export const safeGet = (obj: any, path: string, defaultValue: any = null) => {
  try {
    return (
      path.split(".").reduce((current, key) => current?.[key], obj) ??
      defaultValue
    );
  } catch {
    return defaultValue;
  }
};

/**
 * 日志记录工具
 */
export const logger = {
  warn: (message: string, ...args: any[]) => {
    console.warn(`[ResumeStore] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ResumeStore] ${message}`, ...args);
  },
  info: (message: string, ...args: any[]) => {
    console.info(`[ResumeStore] ${message}`, ...args);
  },
};

export default {
  validateResume,
  validateActiveResume,
  validateApiResponse,
  validateDirectResponse,
  safeGet,
  logger,
}; // By Cursor
