"use client";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const ThemeToggle = ({ children }: { children?: React.ReactNode }) => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const options = React.useMemo(() => ["Light", "Dark", "System"], []);

  console.log(`aa ThemeToggle theme`, theme);

  // 确保组件挂载后再渲染
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 在客户端渲染之前返回null
  if (!mounted) {
    return <Skeleton className="h-8 w-8" />;
  }

  // 获取当前实际主题
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {!children ? (
          <Button
            variant="outline"
            size="icon"
            className="relative overflow-hidden"
          >
            <Sun
              className={cn(
                "h-[1.2rem] w-[1.2rem] transition-all duration-500",
                currentTheme === "dark"
                  ? "-rotate-90 scale-0"
                  : "rotate-0 scale-100"
              )}
            />
            <Moon
              className={cn(
                "absolute h-[1.2rem] w-[1.2rem] transition-all duration-500",
                currentTheme === "dark"
                  ? "rotate-0 scale-100"
                  : "rotate-90 scale-0"
              )}
            />
            <span className="sr-only">Toggle theme</span>
          </Button>
        ) : (
          children
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((it) => {
          return (
            <DropdownMenuItem
              key={it}
              onClick={() => setTheme(it.toLowerCase())}
            >
              {it}
              {it.toLowerCase() === theme ? (
                <span className="text-xs text-muted-foreground">✓</span>
              ) : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
