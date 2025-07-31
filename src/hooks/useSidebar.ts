import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

export type SidebarCollapsible = "offcanvas" | "icon" | "none";

interface UseSidebarOptions {
  defaultOpen?: boolean;
  defaultCollapsible?: SidebarCollapsible;
  mobileBreakpoint?: number;
  tabletBreakpoint?: number;
}

interface UseSidebarReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  collapsible: SidebarCollapsible;
  setCollapsible: (collapsible: SidebarCollapsible) => void;
  toggle: () => void;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * Sidebar state management Hook
 * Provides responsive handling, state management, and convenient methods
 */
export const useSidebar = (
  options: UseSidebarOptions = {}
): UseSidebarReturn => {
  const {
    defaultOpen = true,
    defaultCollapsible = "icon",
    mobileBreakpoint = 768,
    tabletBreakpoint = 1024,
  } = options;

  const pathname = usePathname();

  // State management
  const [open, setOpen] = useState(defaultOpen);
  const [collapsible, setCollapsible] =
    useState<SidebarCollapsible>(defaultCollapsible);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  // Responsive handling
  const handleResize = useCallback(() => {
    const width = window.innerWidth;

    setIsMobile(width < mobileBreakpoint);
    setIsTablet(width >= mobileBreakpoint && width < tabletBreakpoint);
    setIsDesktop(width >= tabletBreakpoint);

    if (width < mobileBreakpoint) {
      setOpen(false);
      setCollapsible("offcanvas");
    } else if (width < tabletBreakpoint) {
      setCollapsible("icon");
    } else {
      setCollapsible("icon");
    }
  }, [mobileBreakpoint, tabletBreakpoint]);

  // Initialize responsive state
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Workbench page handling
  useEffect(() => {
    if (pathname.includes("/workbench")) {
      setOpen(false);
    }
  }, [pathname]);

  // Toggle sidebar state
  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return {
    open,
    setOpen,
    collapsible,
    setCollapsible,
    toggle,
    isMobile,
    isTablet,
    isDesktop,
  };
};

/**
 * Sidebar keyboard shortcut Hook
 * Provides keyboard shortcut support
 */
export const useSidebarKeyboard = (
  open: boolean,
  setOpen: (open: boolean) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + B toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setOpen(!open);
      }

      // Escape close sidebar
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen, enabled]);
};

/**
 * Sidebar persistence Hook
 * Saves sidebar state to localStorage
 */
export const useSidebarPersistence = (
  open: boolean,
  setOpen: (open: boolean) => void,
  key: string = "sidebar-open"
) => {
  // Restore state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      setOpen(JSON.parse(saved));
    }
  }, [key, setOpen]);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(open));
  }, [open, key]);
};

// 全局侧边栏状态管理
interface GlobalSidebarState {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// 全局状态存储
let globalSidebarState: GlobalSidebarState | null = null;

/**
 * 设置全局侧边栏状态
 */
export const setGlobalSidebarState = (state: GlobalSidebarState) => {
  globalSidebarState = state;
};

/**
 * 获取全局侧边栏状态
 */
export const getGlobalSidebarState = (): GlobalSidebarState | null => {
  return globalSidebarState;
};

/**
 * 全局侧边栏Hook
 * 用于在组件中访问全局侧边栏状态
 */
export const useGlobalSidebar = () => {
  const [state, setState] = useState<GlobalSidebarState | null>(
    globalSidebarState
  );

  useEffect(() => {
    const updateState = () => {
      setState(globalSidebarState);
    };

    // 监听全局状态变化
    const interval = setInterval(updateState, 100);
    return () => clearInterval(interval);
  }, []);

  return state;
};
