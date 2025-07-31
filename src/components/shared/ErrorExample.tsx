"use client";
import React, { useState } from "react";
import ErrorBoundary from "./ErrorBoundary";
import ErrorDisplay from "./ErrorDisplay";
import { Button } from "@/components/ui/button";

// 一个会抛出错误的组件
const BuggyComponent: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("这是一个模拟的错误！");
  }

  return (
    <div className="p-4 border rounded">
      <h3>正常组件</h3>
      <Button onClick={() => setShouldThrow(true)}>触发错误</Button>
    </div>
  );
};

// 使用 ErrorBoundary 的示例
export const ErrorBoundaryExample: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2>ErrorBoundary 示例</h2>
      <ErrorBoundary
        onError={(error, errorInfo) => {
          console.log("捕获到错误:", error, errorInfo);
        }}
      >
        <BuggyComponent />
      </ErrorBoundary>
    </div>
  );
};

// 使用 ErrorDisplay 的示例
export const ErrorDisplayExample: React.FC = () => {
  const [error, setError] = useState<Error | null>(null);
  const [showError, setShowError] = useState(false);

  const triggerError = () => {
    setError(new Error("这是一个自定义错误消息"));
    setShowError(true);
  };

  const handleRetry = () => {
    setError(null);
    setShowError(false);
  };

  const handleClose = () => {
    setShowError(false);
  };

  if (showError) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={handleRetry}
        onClose={handleClose}
        title="自定义错误标题"
        message="这是一个自定义错误消息"
        showRetry={true}
        showClose={true}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2>ErrorDisplay 示例</h2>
      <Button onClick={triggerError}>显示错误</Button>
    </div>
  );
};

// 组合使用示例
export const CombinedErrorExample: React.FC = () => {
  return (
    <div className="space-y-8">
      <ErrorBoundaryExample />
      <ErrorDisplayExample />
    </div>
  );
};
