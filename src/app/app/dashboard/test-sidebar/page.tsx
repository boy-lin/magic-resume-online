"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGlobalSidebar } from "@/hooks/useSidebar";
import { useTranslations } from "next-intl";

const TestSidebarPage: React.FC = () => {
  const t = useTranslations("dashboard");
  const sidebarState = useGlobalSidebar();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">侧边栏测试页面</h1>
        <p className="text-muted-foreground mt-1">
          测试侧边栏切换功能，点击顶部Header中的侧边栏切换按钮
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>侧边栏状态</CardTitle>
            <CardDescription>当前侧边栏的显示状态</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">状态:</span>
              <Badge variant={sidebarState?.open ? "default" : "secondary"}>
                {sidebarState?.open ? "展开" : "收起"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">设备类型:</span>
              <Badge variant="outline">
                {sidebarState?.isMobile
                  ? "移动端"
                  : sidebarState?.isTablet
                  ? "平板"
                  : "桌面端"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">响应式:</span>
              <div className="flex gap-1">
                <Badge
                  variant={sidebarState?.isMobile ? "default" : "secondary"}
                  className="text-xs"
                >
                  移动端
                </Badge>
                <Badge
                  variant={sidebarState?.isTablet ? "default" : "secondary"}
                  className="text-xs"
                >
                  平板
                </Badge>
                <Badge
                  variant={sidebarState?.isDesktop ? "default" : "secondary"}
                  className="text-xs"
                >
                  桌面端
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>操作说明</CardTitle>
            <CardDescription>如何切换侧边栏</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">方法一：点击按钮</h4>
              <p className="text-sm text-muted-foreground">
                在顶部Header中找到侧边栏切换按钮（位于Logo右侧），点击即可切换侧边栏状态。
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">方法二：键盘快捷键</h4>
              <p className="text-sm text-muted-foreground">
                使用{" "}
                <kbd className="px-2 py-1 bg-muted rounded text-xs">
                  Ctrl/Cmd + B
                </kbd>{" "}
                快捷键切换侧边栏。
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">方法三：ESC键</h4>
              <p className="text-sm text-muted-foreground">
                当侧边栏展开时，按{" "}
                <kbd className="px-2 py-1 bg-muted rounded text-xs">ESC</kbd>{" "}
                键可以收起侧边栏。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>功能特性</CardTitle>
          <CardDescription>侧边栏切换功能的特性</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">响应式设计</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 移动端：自动收起，支持滑出式侧边栏</li>
                <li>• 平板端：图标模式，可展开收起</li>
                <li>• 桌面端：完整侧边栏，支持折叠</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">状态持久化</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 自动保存侧边栏状态到本地存储</li>
                <li>• 页面刷新后保持上次的状态</li>
                <li>• 支持全局状态管理</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">键盘支持</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ctrl/Cmd + B：切换侧边栏</li>
                <li>• ESC：收起侧边栏</li>
                <li>• 方向键：导航菜单项</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">用户体验</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 平滑的动画过渡效果</li>
                <li>• 直观的图标指示状态</li>
                <li>• 友好的提示信息</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestSidebarPage; // Cursor
