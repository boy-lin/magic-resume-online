"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ScrollableTabs,
  ScrollableTabsTrigger,
} from "@/components/ui/scrollable-tabs";
import { Badge } from "@/components/ui/badge";
import {
  Image,
  Video,
  Music,
  FileText,
  Palette,
  Shapes,
  Frame,
  Star,
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Globe,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Twitch,
  Slack,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
} from "lucide-react";

/**
 * 可滚动 Tabs 组件演示页面
 * 展示类似图片中的可滚动标签页功能
 */
export default function ScrollableTabsDemoPage() {
  const [activeTab, setActiveTab] = useState("全部");

  // 媒体类型标签
  const mediaTabs = [
    { value: "全部", label: "全部", icon: Star },
    { value: "形状", label: "形状", icon: Shapes },
    { value: "插画", label: "插画", icon: Palette },
    { value: "图片", label: "图片", icon: Image },
    { value: "相框", label: "相框", icon: Frame },
    { value: "视频", label: "视频", icon: Video },
    { value: "音频", label: "音频", icon: Music },
    { value: "文档", label: "文档", icon: FileText },
    { value: "设置", label: "设置", icon: Settings },
    { value: "用户", label: "用户", icon: User },
    { value: "通知", label: "通知", icon: Bell },
    { value: "安全", label: "安全", icon: Shield },
    { value: "数据", label: "数据", icon: Database },
    { value: "全球", label: "全球", icon: Globe },
    { value: "邮件", label: "邮件", icon: Mail },
    { value: "电话", label: "电话", icon: Phone },
    { value: "位置", label: "位置", icon: MapPin },
    { value: "GitHub", label: "GitHub", icon: Github },
    { value: "LinkedIn", label: "LinkedIn", icon: Linkedin },
    { value: "Twitter", label: "Twitter", icon: Twitter },
    { value: "Instagram", label: "Instagram", icon: Instagram },
    { value: "YouTube", label: "YouTube", icon: Youtube },
    { value: "Twitch", label: "Twitch", icon: Twitch },
    { value: "Slack", label: "Slack", icon: Slack },
    { value: "日历", label: "日历", icon: Calendar },
    { value: "时钟", label: "时钟", icon: Clock },
    { value: "成功", label: "成功", icon: CheckCircle },
    { value: "警告", label: "警告", icon: AlertCircle },
    { value: "信息", label: "信息", icon: Info },
    { value: "帮助", label: "帮助", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            可滚动 Tabs 组件演示
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            类似图片中的可滚动标签页，支持滚动按钮和渐变遮盖效果
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 基础可滚动 Tabs */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5 text-blue-600" />
                基础可滚动 Tabs
              </CardTitle>
              <CardDescription>
                当标签数量超过容器宽度时，自动显示滚动按钮和渐变遮盖
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollableTabs className="w-full">
                {mediaTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <ScrollableTabsTrigger
                      key={tab.value}
                      value={tab.value}
                      active={activeTab === tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </ScrollableTabsTrigger>
                  );
                })}
              </ScrollableTabs>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold mb-2">当前选中: {activeTab}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  这个示例展示了基础的可滚动 Tabs 功能
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 自定义样式可滚动 Tabs */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-green-600" />
                自定义样式 Tabs
              </CardTitle>
              <CardDescription>自定义滚动按钮和渐变效果的样式</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollableTabs
                className="w-full"
                scrollButtonClassName="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                gradientClassName="from-purple-50 to-transparent dark:from-purple-900/20"
              >
                {mediaTabs.slice(0, 15).map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <ScrollableTabsTrigger
                      key={tab.value}
                      value={tab.value}
                      active={activeTab === tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </ScrollableTabsTrigger>
                  );
                })}
              </ScrollableTabs>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <h3 className="font-semibold mb-2">当前选中: {activeTab}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  这个示例展示了自定义样式的滚动按钮和渐变效果
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 无滚动按钮版本 */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shapes className="w-5 h-5 text-orange-600" />
                仅渐变遮盖
              </CardTitle>
              <CardDescription>
                只显示渐变遮盖效果，不显示滚动按钮
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollableTabs
                className="w-full"
                showScrollButtons={false}
                gradientClassName="from-orange-50 to-transparent dark:from-orange-900/20"
              >
                {mediaTabs.slice(0, 20).map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <ScrollableTabsTrigger
                      key={tab.value}
                      value={tab.value}
                      active={activeTab === tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </ScrollableTabsTrigger>
                  );
                })}
              </ScrollableTabs>

              <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <h3 className="font-semibold mb-2">仅渐变效果</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  这个版本只显示渐变遮盖效果，用户可以通过鼠标滚轮或触控板来滚动
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 功能特性说明 */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                功能特性
              </CardTitle>
              <CardDescription>
                ScrollableTabs 组件的主要功能和特性
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-600">
                      ✅ 自动检测
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        自动检测内容宽度
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        动态显示/隐藏滚动按钮
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        响应式设计支持
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-600">🎨 视觉效果</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        渐变遮盖效果
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        平滑滚动动画
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        自定义样式支持
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 使用说明 */}
        <Card className="mt-8 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
            <CardDescription>
              ScrollableTabs 组件的基本用法和配置选项
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">基本用法</h4>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
                  {`import { ScrollableTabs, ScrollableTabsTrigger } from "@/components/ui/scrollable-tabs"

<ScrollableTabs>
  <ScrollableTabsTrigger value="tab1" active={true}>
    标签1
  </ScrollableTabsTrigger>
  <ScrollableTabsTrigger value="tab2" active={false}>
    标签2
  </ScrollableTabsTrigger>
  {/* 更多标签... */}
</ScrollableTabs>`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-3">高级配置</h4>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
                  {`<ScrollableTabs
  showScrollButtons={true}
  scrollButtonClassName="custom-button-style"
  gradientClassName="custom-gradient-style"
>
  {/* 标签内容 */}
</ScrollableTabs>`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
