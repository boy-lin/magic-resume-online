"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Settings,
  LogOut,
  User,
  ChevronRight,
  Menu,
  Palette,
  Sun,
  Moon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Logo from "@/components/shared/Logo";
import { useAppStore } from "@/store/useApp";
import { useTranslations } from "next-intl";
import { avatarUrlDefault } from "@/config";
import { handleRequest } from "@/utils/auth-helpers/client";
import { SignOut } from "@/utils/auth-helpers/server";
import { clearLocalStorage } from "@/utils/storage";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useGlobalSidebar } from "@/hooks/useSidebar";

/**
 * Dashboard页面顶部Header组件
 * 包含logo、用户头像、通知等通用模块
 * @returns JSX.Element
 */
const LayoutHeader: React.FC = () => {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme, systemTheme } = useTheme();
  const user = useAppStore((state) => state.user) || {};

  const fullName = user?.user_metadata?.full_name || "";
  const fName = fullName.substr(0, 2).toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url || avatarUrlDefault;

  const handleLogout = async () => {
    try {
      await handleRequest(null, SignOut, router);
      clearLocalStorage();
      toast.success("已成功退出登录");
    } catch (error) {
      toast.error("退出登录失败");
    }
  };

  const handleProfile = () => {
    router.push("/account/info");
  };

  const handleSettings = () => {
    router.push("/account/info/setting");
  };

  // 获取当前页面标题
  const getCurrentPageTitle = () => {
    if (pathname.includes("/resumes")) return t("sidebar.resumes");
    if (pathname.includes("/templates")) return t("sidebar.templates");
    if (pathname.includes("/ai")) return t("sidebar.ai");
    if (pathname.includes("/settings")) return t("sidebar.settings");
    return t("header.title");
  };

  // 获取当前实际主题
  const currentTheme = theme === "system" ? systemTheme : theme;

  // 主题切换处理函数
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    const themeNames = {
      light: "浅色主题",
      dark: "深色主题",
      system: "跟随系统",
    };
    toast.success(`已切换到${themeNames[newTheme as keyof typeof themeNames]}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        {/* 左侧Logo区域 */}
        <div className="flex items-center gap-4">
          <Logo
            className="cursor-pointer"
            size={32}
            onClick={() => router.push("/")}
          />

          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{t("header.title")}</h1>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {getCurrentPageTitle()}
              </span>
            </div>
          </div>
          <div className="md:hidden">
            <span className="text-sm font-medium">{getCurrentPageTitle()}</span>
          </div>
        </div>

        {/* 右侧用户操作区域 */}
        <div className="flex items-center gap-4">
          {/* 通知按钮 */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge
              variant="destructive"
              className="hidden absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
            ></Badge>
          </Button>

          {/* 用户头像下拉菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl} alt={fullName} />
                  <AvatarFallback>{fName}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{fullName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile}>
                <User className="mr-2 h-4 w-4" />
                <span>{t("header.profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("header.settings")}</span>
              </DropdownMenuItem>

              {/* 主题切换区域 */}
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {t("header.theme")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                    {/* 浅色主题按钮 */}
                    <button
                      onClick={() => handleThemeChange("light")}
                      className={cn(
                        "p-1.5 rounded-md transition-all duration-200 relative group",
                        currentTheme === "light"
                          ? "bg-background text-foreground shadow-sm"
                          : "hover:bg-background/50 text-muted-foreground hover:text-foreground"
                      )}
                      title="浅色主题"
                    >
                      <div className="relative">
                        <Sun className="h-3.5 w-3.5" />
                        {/* 浅色主题预览 */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {currentTheme === "light" && (
                        <div className="absolute inset-0 rounded-md ring-2 ring-primary/20" />
                      )}
                    </button>

                    {/* 深色主题按钮 */}
                    <button
                      onClick={() => handleThemeChange("dark")}
                      className={cn(
                        "p-1.5 rounded-md transition-all duration-200 relative group",
                        currentTheme === "dark"
                          ? "bg-background text-foreground shadow-sm"
                          : "hover:bg-background/50 text-muted-foreground hover:text-foreground"
                      )}
                      title="深色主题"
                    >
                      <div className="relative">
                        <Moon className="h-3.5 w-3.5" />
                        {/* 深色主题预览 */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {currentTheme === "dark" && (
                        <div className="absolute inset-0 rounded-md ring-2 ring-primary/20" />
                      )}
                    </button>

                    {/* 系统主题按钮 */}
                    <button
                      onClick={() => handleThemeChange("system")}
                      className={cn(
                        "p-1.5 rounded-md transition-all duration-200 relative group",
                        theme === "system"
                          ? "bg-background text-foreground shadow-sm"
                          : "hover:bg-background/50 text-muted-foreground hover:text-foreground"
                      )}
                      title="跟随系统"
                    >
                      <div className="relative flex items-center justify-center w-3.5 h-3.5">
                        <div className="w-2 h-2 border-2 border-current rounded-full" />
                        {/* 系统主题预览 */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-yellow-400 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {theme === "system" && (
                        <div className="absolute inset-0 rounded-md ring-2 ring-primary/20" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("header.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default LayoutHeader; // Cursor
