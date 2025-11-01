"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

const STORAGE_KEY = "pwa_install_prompt_dismissed";
const EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000; // 1个月（30天）

/**
 * 检查是否应该显示安装提示
 */
function shouldShowPrompt(): boolean {
  // 检查是否已经安装
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(display-mode: standalone)").matches
  ) {
    return false;
  }

  // 检查localStorage中是否有关闭记录
  if (typeof window === "undefined") {
    return true;
  }

  const dismissedTime = localStorage.getItem(STORAGE_KEY);
  if (!dismissedTime) {
    return true; // 没有关闭记录，可以显示
  }

  const dismissedTimestamp = parseInt(dismissedTime, 10);
  const now = Date.now();
  const timeSinceDismissed = now - dismissedTimestamp;

  // 如果超过1个月，清除记录并显示
  if (timeSinceDismissed > EXPIRE_TIME) {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  }

  // 1个月内关闭过，不显示
  return false;
}

/**
 * 记录关闭时间
 */
function recordDismissal(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  }
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // 检查是否应该显示
    if (!shouldShowPrompt()) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // 再次检查是否应该显示（防止在监听器设置后用户关闭了）
      if (shouldShowPrompt()) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  useEffect(() => {
    if (!showInstallPrompt) return;

    const timer = setTimeout(() => {
      setShowInstallPrompt(false);
      recordDismissal(); // 自动关闭时也记录
    }, 10000); // 10秒后自动关闭

    return () => {
      clearTimeout(timer);
    };
  }, [showInstallPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    setShowInstallPrompt(false);
    recordDismissal(); // 点击安装后也记录，不再弹出

    setDeferredPrompt(null);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background border rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <Download className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-sm">安装应用</h3>
          <p className="text-sm text-muted-foreground mt-1">
            将 Magic Resume 添加到主屏幕，获得更好的体验
          </p>
        </div>
        <button
          onClick={() => {
            setShowInstallPrompt(false);
            recordDismissal(); // 记录关闭时间
          }}
          className="text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <Button onClick={handleInstall} className="w-full mt-3" size="sm">
        立即安装
      </Button>
    </div>
  );
}
