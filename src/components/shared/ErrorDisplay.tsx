"use client";
import React from "react";
import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorDisplayProps {
  error?: Error | string | null;
  onRetry?: () => void;
  onClose?: () => void;
  title?: string;
  message?: string;
  showRetry?: boolean;
  showClose?: boolean;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onClose,
  title = "出错了",
  message,
  showRetry = true,
  showClose = false,
  className,
}) => {
  const errorMessage =
    message ||
    (typeof error === "string" ? error : error?.message) ||
    "发生了一个未知错误";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[200px] p-6 text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg",
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
            {errorMessage}
          </p>
          {process.env.NODE_ENV === "development" &&
            error &&
            typeof error === "object" &&
            error.stack && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  查看错误详情
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                  {error.stack}
                </pre>
              </details>
            )}
        </div>
        <div className="flex gap-2">
          {showRetry && onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>重试</span>
            </Button>
          )}
          {showClose && onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              className="flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>关闭</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
