"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Settings,
  Bell,
  Shield,
  Palette,
  FileText,
  Code,
  Database,
  Globe,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

/**
 * Tabs 组件演示页面
 * 展示各种 Tabs 使用场景和样式
 */
export default function TabsDemoPage() {
  const [activeTab, setActiveTab] = React.useState("account");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Tabs 组件演示
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            探索 Tabs 组件的各种使用场景和样式
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 基础 Tabs 演示 */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                基础 Tabs
              </CardTitle>
              <CardDescription>
                简单的标签页切换，支持默认值和自定义样式
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="account">账户</TabsTrigger>
                  <TabsTrigger value="password">密码</TabsTrigger>
                  <TabsTrigger value="settings">设置</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名</Label>
                    <Input id="name" defaultValue="张三" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">用户名</Label>
                    <Input id="username" defaultValue="@zhangsan" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="zhangsan@example.com"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="password" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current">当前密码</Label>
                    <Input id="current" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new">新密码</Label>
                    <Input id="new" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">确认密码</Label>
                    <Input id="confirm" type="password" />
                  </div>
                </TabsContent>
                <TabsContent value="settings" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">主题</Label>
                    <Select defaultValue="light">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">浅色</SelectItem>
                        <SelectItem value="dark">深色</SelectItem>
                        <SelectItem value="system">跟随系统</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">语言</Label>
                    <Select defaultValue="zh-CN">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zh-CN">简体中文</SelectItem>
                        <SelectItem value="en-US">English</SelectItem>
                        <SelectItem value="ja-JP">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* 垂直 Tabs 演示 */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-green-600" />
                垂直 Tabs
              </CardTitle>
              <CardDescription>
                垂直布局的标签页，适合侧边栏导航
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="profile"
                orientation="vertical"
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-1 h-auto">
                  <TabsTrigger value="profile" className="justify-start">
                    <User className="w-4 h-4 mr-2" />
                    个人资料
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    通知设置
                  </TabsTrigger>
                  <TabsTrigger value="security" className="justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    安全设置
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        ZS
                      </div>
                      <div>
                        <h3 className="font-semibold">张三</h3>
                        <p className="text-sm text-gray-500">前端开发工程师</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">zhangsan@example.com</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">13800138000</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">北京市朝阳区</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="notifications" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">邮件通知</h4>
                        <p className="text-sm text-gray-500">
                          接收重要更新和通知
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">推送通知</h4>
                        <p className="text-sm text-gray-500">
                          接收实时推送消息
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">短信通知</h4>
                        <p className="text-sm text-gray-500">
                          接收紧急安全通知
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="security" className="mt-0">
                  <div className="space-y-4">
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                        安全建议
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        建议启用双重认证以提高账户安全性
                      </p>
                    </div>
                    <Button variant="outline" className="w-full">
                      启用双重认证
                    </Button>
                    <Button variant="outline" className="w-full">
                      更改密码
                    </Button>
                    <Button variant="outline" className="w-full">
                      查看登录历史
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* 动态 Tabs 演示 */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-600" />
                动态 Tabs
              </CardTitle>
              <CardDescription>支持动态添加和删除标签页</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                  <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                  <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                  <TabsTrigger value="tab4">Tab 4</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                      第一个标签页
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300 mt-2">
                      这是第一个标签页的内容。你可以在这里放置任何内容。
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                    <Badge variant="secondary">Tailwind CSS</Badge>
                  </div>
                </TabsContent>
                <TabsContent value="tab2" className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-200">
                      第二个标签页
                    </h3>
                    <p className="text-green-700 dark:text-green-300 mt-2">
                      这是第二个标签页的内容。支持动态切换。
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                      <div className="text-2xl font-bold text-green-600">
                        42
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        项目数量
                      </div>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                      <div className="text-2xl font-bold text-blue-600">
                        1.2k
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        代码行数
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="tab3" className="space-y-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200">
                      第三个标签页
                    </h3>
                    <p className="text-purple-700 dark:text-purple-300 mt-2">
                      这是第三个标签页的内容。包含表单元素。
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="message">消息</Label>
                      <Textarea
                        id="message"
                        placeholder="输入你的消息..."
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">发送</Button>
                      <Button size="sm" variant="outline">
                        取消
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="tab4" className="space-y-4">
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                      第四个标签页
                    </h3>
                    <p className="text-orange-700 dark:text-orange-300 mt-2">
                      这是第四个标签页的内容。展示进度和状态。
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>开发进度</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">自动保存</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* 图标 Tabs 演示 */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-pink-600" />
                图标 Tabs
              </CardTitle>
              <CardDescription>
                带有图标的标签页，提供更好的视觉体验
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger
                    value="overview"
                    className="flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    概览
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="flex items-center gap-2"
                  >
                    <Database className="w-4 h-4" />
                    分析
                  </TabsTrigger>
                  <TabsTrigger
                    value="reports"
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    报告
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="flex items-center gap-2"
                  >
                    <Bell className="w-4 h-4" />
                    通知
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
                      <div className="text-2xl font-bold">1,234</div>
                      <div className="text-blue-100">总用户数</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
                      <div className="text-2xl font-bold">89%</div>
                      <div className="text-green-100">活跃率</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Github className="w-5 h-5 text-gray-600" />
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <Twitter className="w-5 h-5 text-sky-500" />
                  </div>
                </TabsContent>
                <TabsContent value="analytics" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">页面浏览量</span>
                      <Badge variant="secondary">+12%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">用户会话</span>
                      <Badge variant="secondary">+8%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">转化率</span>
                      <Badge variant="secondary">+15%</Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">热门页面</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>首页</span>
                        <span className="text-gray-600">2.3k</span>
                      </div>
                      <div className="flex justify-between">
                        <span>产品页</span>
                        <span className="text-gray-600">1.8k</span>
                      </div>
                      <div className="flex justify-between">
                        <span>关于我们</span>
                        <span className="text-gray-600">956</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reports" className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">月度报告</span>
                        <Button size="sm" variant="outline">
                          下载
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        2024年1月数据报告
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">季度报告</span>
                        <Button size="sm" variant="outline">
                          下载
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        2023年Q4数据报告
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">年度报告</span>
                        <Button size="sm" variant="outline">
                          下载
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        2023年年度数据报告
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="notifications" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">系统更新完成</p>
                        <p className="text-xs text-gray-600">2分钟前</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">新用户注册</p>
                        <p className="text-xs text-gray-600">5分钟前</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">服务器维护提醒</p>
                        <p className="text-xs text-gray-600">1小时前</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* 使用说明 */}
        <Card className="mt-8 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
            <CardDescription>Tabs 组件的基本用法和配置选项</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">基本用法</h4>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
                  {`import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">账户</TabsTrigger>
    <TabsTrigger value="password">密码</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    账户内容
  </TabsContent>
  <TabsContent value="password">
    密码内容
  </TabsContent>
</Tabs>`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-3">主要特性</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    支持水平和垂直布局
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    完全可访问性支持
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    键盘导航支持
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    自定义样式和主题
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    响应式设计
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
