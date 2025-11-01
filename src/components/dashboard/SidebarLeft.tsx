"use client";
import {
  startTransition,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  ChevronRight,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar as SidebarUI,
  SidebarContent as UISidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem as UISidebarMenuItem,
  SidebarProvider,
  useSidebar as useUISidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Logo from "@/components/shared/Logo";
import { useTranslations } from "next-intl";
import { useResumeListStore } from "@/store/resume/useResumeListStore";
import {
  getSidebarMenuItems,
  getSidebarFooterLinks,
  SIDEBAR_CONFIG,
  type SidebarMenuItem,
} from "@/config/sidebar";
import {
  useSidebar,
  useSidebarKeyboard,
  useSidebarPersistence,
  setGlobalSidebarState,
  useGlobalSidebar,
} from "@/hooks/useSidebar";
import { toast } from "sonner";

interface SidebarProps {}

// 内部组件，在SidebarProvider内部使用
const SidebarInner: React.FC = () => {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const pathname = usePathname();
  const { resumes } = useResumeListStore();
  const { open } = useUISidebar(); // 使用UI库的useSidebar Hook
  // 状态管理
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);

  // 动态获取徽章值
  const getBadgeValue = useCallback(
    (badge: string | number | (() => string | number)) => {
      if (typeof badge === "function") {
        return badge();
      }
      return badge;
    },
    []
  );

  // 侧边栏菜单项配置
  const sidebarItems = useMemo(
    () => getSidebarMenuItems(t, resumes),
    [t, resumes]
  );

  const sidebarState = useGlobalSidebar();

  // 侧边栏切换处理函数
  const handleSidebarToggle = () => {
    if (sidebarState?.toggle) {
      sidebarState.toggle();
      toast.success(
        sidebarState.open
          ? t("header.sidebar.collapsed")
          : t("header.sidebar.expanded")
      );
    }
  };

  // 底部链接配置
  const footerLinks = useMemo(() => getSidebarFooterLinks(t), [t]);

  // 键盘导航支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      const currentIndex = sidebarItems.findIndex(
        (item) => item.id === focusedItem
      );

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % sidebarItems.length;
          setFocusedItem(sidebarItems[nextIndex]?.id || null);
          break;
        case "ArrowUp":
          e.preventDefault();
          const prevIndex =
            currentIndex <= 0 ? sidebarItems.length - 1 : currentIndex - 1;
          setFocusedItem(sidebarItems[prevIndex]?.id || null);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusedItem) {
            const item = sidebarItems.find((i) => i.id === focusedItem);
            if (item) handleItemClick(item);
          }
          break;
        case "Escape":
          setFocusedItem(null);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, focusedItem, sidebarItems]);

  // 菜单项点击处理
  const handleItemClick = (item: SidebarMenuItem) => {
    startTransition(() => {
      if (item.items) {
        // 子菜单展开/折叠逻辑
        console.log("Toggle submenu for:", item.title);
      } else if (item.external) {
        // 外部链接
        window.open(item.url || item.href, "_blank");
      } else {
        // 内部导航
        router.push(item.url || item.href || "/");
      }
    });
  };

  // 判断菜单项是否激活
  const isItemActive = (item: SidebarMenuItem) => {
    if (item.items) {
      return item.items.some((subItem) => pathname === subItem.href);
    }
    return item.url === pathname || item.href === pathname;
  };

  // 渲染菜单项
  const renderMenuItem = (item: SidebarMenuItem) => {
    const badgeValue = item.badge ? getBadgeValue(item.badge) : null;

    return (
      <TooltipProvider delayDuration={200} key={item.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <UISidebarMenuItem
              title={item.title}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onFocus={() => setFocusedItem(item.id)}
              onBlur={() => setFocusedItem(null)}
            >
              <SidebarMenuButton
                asChild
                isActive={isItemActive(item)}
                size="lg"
                className={cn(
                  "transition-all duration-200",
                  hoveredItem === item.id && "scale-105",
                  focusedItem === item.id && "ring-2 ring-primary/20"
                )}
              >
                <div
                  className="flex justify-center items-center gap-2 p-[8px] relative group"
                  onClick={() => handleItemClick(item)}
                  tabIndex={0}
                  role="button"
                  aria-label={item.title}
                >
                  <item.icon
                    className={cn(
                      "w-6 h-6 shrink-0 transition-colors duration-200",
                      isItemActive(item)
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />

                  {open && (
                    <span className="flex-1 text-sm font-medium transition-colors duration-200">
                      {item.title}
                    </span>
                  )}

                  {/* 徽章 */}
                  {badgeValue && (
                    <Badge
                      variant={
                        badgeValue === "NEW" ? "destructive" : "secondary"
                      }
                      className={cn(
                        "text-xs px-1.5 py-0.5 transition-all duration-200",
                        !open && "absolute -top-1 -right-1"
                      )}
                    >
                      {badgeValue}
                    </Badge>
                  )}

                  {/* 外部链接图标 */}
                  {item.external && open && (
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  )}

                  {/* 子菜单指示器 */}
                  {item.items && open && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-hover:rotate-90" />
                  )}
                </div>
              </SidebarMenuButton>

              {/* 子菜单 */}
              {item.items && open && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.items.map((subItem) => (
                    <div
                      key={subItem.href}
                      className={cn(
                        "cursor-pointer px-3 py-2 rounded-md text-sm transition-all duration-200",
                        pathname === subItem.href
                          ? "bg-accent text-accent-foreground font-medium"
                          : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => router.push(subItem.href)}
                    >
                      {subItem.title}
                    </div>
                  ))}
                </div>
              )}
            </UISidebarMenuItem>
          </TooltipTrigger>
          {!open && (
            <TooltipContent side="right" className="flex items-center gap-2">
              <span>{item.title}</span>
              {badgeValue && (
                <Badge
                  variant={badgeValue === "NEW" ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {badgeValue}
                </Badge>
              )}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <SidebarUI collapsible="icon" className="border-r border-border/40">
      {/* 侧边栏头部 */}
      <SidebarHeader className="p-2 border-b border-border/40">
        <div
          className={cn(
            "hidden p-2 items-center justify-center",
            open ? "flex" : "hidden"
          )}
        >
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">
              {SIDEBAR_CONFIG.app.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              {SIDEBAR_CONFIG.app.description}
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* 侧边栏内容 */}
      <UISidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{sidebarItems.map(renderMenuItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </UISidebarContent>

      {/* 侧边栏底部 */}
      <SidebarFooter className="px-2 border-t border-border/40 flex items-center flex-row">
        {/* 侧边栏切换按钮 */}
        {sidebarState && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSidebarToggle}
            title={
              sidebarState.open
                ? t("header.sidebar.collapse")
                : t("header.sidebar.expand")
            }
            className="h-8 w-8 pl-[6px]"
          >
            {sidebarState.open ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
        )}
        {open && (
          <div className="text-xs text-muted-foreground">
            <p>版本 {SIDEBAR_CONFIG.version}</p>
          </div>
        )}
        <div className="flex gap-2">
          {footerLinks.slice(0, 2).map((link) => (
            <Button
              key={link.id}
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => {
                if (link.external) {
                  window.open(link.url, "_blank");
                } else {
                  router.push(link.url);
                }
              }}
            >
              {link.title}
            </Button>
          ))}
        </div>
      </SidebarFooter>
    </SidebarUI>
  );
};

// 主组件
const SidebarLeft: React.FC<SidebarProps> = () => {
  // 使用侧边栏Hook管理状态
  const { open, setOpen, collapsible, isMobile, isTablet, isDesktop, toggle } =
    useSidebar({
      defaultOpen: SIDEBAR_CONFIG.defaults.open,
      defaultCollapsible: SIDEBAR_CONFIG.defaults.collapsible,
      mobileBreakpoint: SIDEBAR_CONFIG.breakpoints.mobile,
      tabletBreakpoint: SIDEBAR_CONFIG.breakpoints.tablet,
    });

  // 键盘快捷键支持
  useSidebarKeyboard(open, setOpen, isDesktop);

  // 状态持久化
  useSidebarPersistence(open, setOpen);

  // 设置全局侧边栏状态
  useEffect(() => {
    setGlobalSidebarState({
      open,
      setOpen,
      toggle,
      isMobile,
      isTablet,
      isDesktop,
    });
  }, [open, setOpen, toggle, isMobile, isTablet, isDesktop]);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <SidebarInner />
    </SidebarProvider>
  );
};

export default SidebarLeft; // Cursor
