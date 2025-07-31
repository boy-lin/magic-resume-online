/**
 * 状态管理测试文件
 * 用于验证错误处理是否正常工作
 */

import {
  validateApiResponse,
  validateDirectResponse,
  validateResume,
  validateActiveResume,
  logger,
} from "./utils";

// 测试 validateApiResponse
export const testValidateApiResponse = () => {
  console.log("Testing validateApiResponse...");

  // 测试正常情况
  try {
    const data = { id: "1", name: "test" };
    const result = validateApiResponse(data, null, "Test");
    console.log("✅ Normal case passed:", result);
  } catch (error) {
    console.log("❌ Normal case failed:", error);
  }

  // 测试错误情况
  try {
    validateApiResponse(null, new Error("API Error"), "Test");
    console.log("❌ Error case should have failed");
  } catch (error) {
    console.log("✅ Error case passed:", error.message);
  }

  // 测试空数据情况
  try {
    validateApiResponse(null, null, "Test");
    console.log("❌ Null data case should have failed");
  } catch (error) {
    console.log("✅ Null data case passed:", error.message);
  }
};

// 测试 validateDirectResponse
export const testValidateDirectResponse = () => {
  console.log("Testing validateDirectResponse...");

  // 测试正常情况
  try {
    const data = { id: "1", name: "test" };
    const result = validateDirectResponse(data, "Test");
    console.log("✅ Normal case passed:", result);
  } catch (error) {
    console.log("❌ Normal case failed:", error);
  }

  // 测试空数据情况
  try {
    validateDirectResponse(null, "Test");
    console.log("❌ Null data case should have failed");
  } catch (error) {
    console.log("✅ Null data case passed:", error.message);
  }
};

// 测试 validateResume
export const testValidateResume = () => {
  console.log("Testing validateResume...");

  const resumes = {
    "1": { id: "1", name: "test" },
    "2": { id: "2", name: "test2" },
  };

  // 测试正常情况
  try {
    const result = validateResume("1", resumes);
    console.log("✅ Normal case passed:", result);
  } catch (error) {
    console.log("❌ Normal case failed:", error);
  }

  // 测试不存在的情况
  try {
    validateResume("3", resumes);
    console.log("❌ Non-existent case should have failed");
  } catch (error) {
    console.log("✅ Non-existent case passed:", error.message);
  }
};

// 测试 validateActiveResume
export const testValidateActiveResume = () => {
  console.log("Testing validateActiveResume...");

  const resumes = {
    "1": { id: "1", name: "test" },
    "2": { id: "2", name: "test2" },
  };

  // 测试正常情况
  try {
    const result = validateActiveResume("1", resumes);
    console.log("✅ Normal case passed:", result);
  } catch (error) {
    console.log("❌ Normal case failed:", error);
  }

  // 测试空ID情况
  try {
    const result = validateActiveResume(null, resumes);
    console.log("✅ Null ID case passed:", result);
  } catch (error) {
    console.log("❌ Null ID case failed:", error);
  }

  // 测试不存在的情况
  try {
    const result = validateActiveResume("3", resumes);
    console.log("✅ Non-existent case passed:", result);
  } catch (error) {
    console.log("❌ Non-existent case failed:", error);
  }
};

// 运行所有测试
export const runAllTests = () => {
  console.log("🧪 Running state management tests...");
  testValidateApiResponse();
  testValidateDirectResponse();
  testValidateResume();
  testValidateActiveResume();
  console.log("✅ All tests completed");
};

// 在开发环境中运行测试
if (process.env.NODE_ENV === "development") {
  // 只在开发环境中运行
  // runAllTests();
}

export default {
  testValidateApiResponse,
  testValidateDirectResponse,
  testValidateResume,
  testValidateActiveResume,
  runAllTests,
}; // By Cursor
