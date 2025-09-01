"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ScrollableTabsProps {
  children: React.ReactNode;
  className?: string;
  showScrollButtons?: boolean;
  scrollButtonClassName?: string;
  gradientClassName?: string;
}

/**
 * 可滚动的 Tabs 组件
 * 当内容宽度超过容器宽度时，显示滚动按钮和渐变遮盖效果
 */
export function ScrollableTabs({
  children,
  className,
  showScrollButtons = true,
  scrollButtonClassName,
  gradientClassName,
}: ScrollableTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // 检查是否可以滚动
  const checkScroll = () => {
    if (!containerRef.current || !scrollRef.current) return;

    const container = containerRef.current;
    const scroll = scrollRef.current;

    const canScrollLeftValue = scroll.scrollLeft > 0;
    const canScrollRightValue =
      scroll.scrollLeft < scroll.scrollWidth - scroll.clientWidth;

    setCanScrollLeft(canScrollLeftValue);
    setCanScrollRight(canScrollRightValue);
  };

  // 滚动到指定方向
  const scrollTo = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 200; // 每次滚动的距离
    const currentScroll = scrollRef.current.scrollLeft;
    const newScroll =
      direction === "left"
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

    scrollRef.current.scrollTo({
      left: newScroll,
      behavior: "smooth",
    });
  };

  // 监听滚动事件
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      checkScroll();
    };

    scrollElement.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkScroll);

    // 初始检查
    checkScroll();

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center", className)}
    >
      {/* 左侧渐变遮盖 */}
      {canScrollLeft && (
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent dark:from-gray-900 z-10 pointer-events-none",
            gradientClassName
          )}
        />
      )}

      {/* 右侧渐变遮盖 */}
      {canScrollRight && (
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent dark:from-gray-900 z-10 pointer-events-none",
            gradientClassName
          )}
        />
      )}

      {/* 左侧滚动按钮 */}
      {showScrollButtons && canScrollLeft && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => scrollTo("left")}
          className={cn(
            "absolute left-0 z-20 h-full px-2 rounded-none border-r bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900",
            scrollButtonClassName
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* 右侧滚动按钮 */}
      {showScrollButtons && canScrollRight && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => scrollTo("right")}
          className={cn(
            "absolute right-0 z-20 h-full px-2 rounded-none border-l bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900",
            scrollButtonClassName
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* 滚动容器 */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="flex items-center min-w-max gap-4">{children}</div>
      </div>
    </div>
  );
}

/**
 * 可滚动的 Tabs 触发器组件
 */
interface ScrollableTabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

export function ScrollableTabsTrigger({
  value,
  children,
  className,
  active = false,
  onClick,
}: ScrollableTabsTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center px-0 py-2 text-base font-medium transition-colors whitespace-nowrap",
        "hover:text-gray-900 dark:hover:text-gray-100",
        active
          ? "text-gray-900 dark:text-gray-100 border-b-2 border-purple-600"
          : "text-gray-500 dark:text-gray-400",
        className
      )}
    >
      {children}
    </button>
  );
}

/**
 * 可滚动的 Tabs 内容组件
 */
interface ScrollableTabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export function ScrollableTabsContent({
  value,
  children,
  className,
  active = false,
}: ScrollableTabsContentProps) {
  if (!active) return null;

  return <div className={cn("mt-4", className)}>{children}</div>;
}
