import {
  FileText,
  SwatchBook,
  Settings,
  Bot,
  Home,
  ExternalLink,
} from "lucide-react";

export interface SidebarMenuItem {
  id: string;
  title: string;
  url?: string;
  href?: string;
  icon: any;
  badge?: string | number | (() => string | number);
  items?: { title: string; href: string }[];
  external?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

// 侧边栏菜单配置
export const SIDEBAR_MENU_ITEMS: Omit<SidebarMenuItem, "title">[] = [
  // {
  //   id: "home",
  //   url: "/app/dashboard",
  //   icon: Home,
  // },
  {
    id: "resumes",
    url: "/app/dashboard/resumes",
    icon: FileText,
    badge: () => "0", // 动态获取简历数量
  },
  {
    id: "templates",
    url: "/app/dashboard/templates",
    icon: SwatchBook,
    badge: "NEW",
  },
  {
    id: "ai",
    url: "/app/dashboard/ai",
    icon: Bot,
  },
  // {
  //   id: "settings",
  //   url: "/app/dashboard/settings",
  //   icon: Settings,
  // },
  // {
  //   id: "docs",
  //   url: "https://docs.example.com",
  //   icon: ExternalLink,
  //   external: true,
  // },
];

// 侧边栏底部链接配置
export const SIDEBAR_FOOTER_LINKS = [
  // {
  //   id: "feedback",
  //   title: "反馈建议",
  //   url: "/feedback",
  //   external: false,
  // },
  // {
  //   id: "github",
  //   title: "GitHub",
  //   url: "https://github.com/your-repo",
  //   external: true,
  // },
  // {
  //   id: "docs",
  //   title: "文档",
  //   url: "https://docs.example.com",
  //   external: true,
  // },
];

// 侧边栏配置
export const SIDEBAR_CONFIG = {
  // 响应式断点
  breakpoints: {
    mobile: 768,
    tablet: 1024,
  },
  // 动画配置
  animations: {
    duration: 200,
    easing: "ease-in-out",
  },
  // 默认状态
  defaults: {
    open: true,
    collapsible: "icon" as const,
  },
  // 版本信息
  version: "v1.0.0",
  // 应用信息
  app: {
    name: "Dashboard",
    description: "简历制作平台",
  },
};

// 获取菜单项的工具函数
export const getSidebarMenuItems = (
  t: (key: string) => string,
  resumes: Record<string, any> = {}
) => {
  return SIDEBAR_MENU_ITEMS.map((item) => ({
    ...item,
    title: t(`sidebar.${item.id}`),
    badge:
      item.id === "resumes"
        ? () => Object.keys(resumes).length.toString()
        : item.badge,
  })).filter((item) => !item.hidden);
};

// 获取底部链接的工具函数
export const getSidebarFooterLinks = (t: (key: string) => string) => {
  return SIDEBAR_FOOTER_LINKS.map((link) => ({
    ...link,
    title: t(`sidebar.footer.${link.id}`),
  }));
};
