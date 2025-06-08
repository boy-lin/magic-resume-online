"use client";
import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { FileText, Menu, Moon, Sun, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Logo from "@/components/shared/Logo";
import ThemeToggle from "@/components/shared/ThemeToggle";
import LanguageSwitch from "@/components/shared/LanguageSwitch";
import { GitHubStars } from "@/components/shared/GitHubStars";
import { cn } from "@/lib/utils";

import ScrollHeader from "./client/ScrollHeader";
import MobileMenu from "./client/MobileMenu";
import GoDashboard from "./GoDashboard";
import User from "./User";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useAppStore } from "@/store/useApp";
import { useAppContext } from "@/hooks/app";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function LandingHeader() {
  const user = useAppStore((state) => state.user);
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const locale = pathname.split("/")[1]; // 从路径中获取语言代码
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // console.debug("aa LandingHeader render user", user);
  return (
    <>
      <ScrollHeader>
        <div className="m-auto max-w-[1200px] px-4">
          <div className="flex items-center justify-between h-16">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => (window.location.href = `/${locale}/`)}
            >
              <Logo size={32} />
              <span className="font-bold text-[24px]">{t("header.title")}</span>
            </div>

            <div className="flex-1 flex items-center justify-start pl-8">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">
                      {tc("menu.product")}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full select-none flex-col justify-center rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              href="/"
                            >
                              <div className="flex items-center gap-2 mb-2 mt-4 text-lg leading-5 font-medium">
                                <Logo size={32} />
                                <div className="">{t("header.title")}</div>
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                利用 AI 技术，帮助您快速创建专业的简历,
                                多种模板可选，多端同步。
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <ListItem
                          href="/app/dashboard/resumes"
                          title="我的简历"
                        >
                          查看我的简历
                        </ListItem>
                        <ListItem
                          href="/app/dashboard/templates"
                          title="浏览模板"
                        >
                          浏览所有简历模板
                        </ListItem>
                        <ListItem
                          href={`/${locale}/docs/changelog`}
                          title="更新日志"
                        >
                          新特性更新日志
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">
                      企业服务
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[220px]">
                        <li className="row-span-3">
                          <AlertTitle>功能未开启</AlertTitle>
                          <AlertDescription>敬请期待</AlertDescription>
                        </li>
                        {/* <ListItem
                          href="/app/dashboard/resumes"
                          title="我的简历"
                        >
                          查看我的简历
                        </ListItem>
                        <ListItem
                          href="/app/dashboard/templates"
                          title="浏览模板"
                        >
                          浏览所有简历模板
                        </ListItem>
                        <ListItem
                          href={`/${locale}/docs/changelog`}
                          title="更新日志"
                        >
                          新特性更新日志
                        </ListItem> */}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <LanguageSwitch />
              <ThemeToggle>
                <div className="w-8 h-8 relative cursor-pointer rounded-md hover:bg-accent/50 flex items-center justify-center">
                  <Sun className="h-[1.2rem] w-[1.2rem] absolute inset-0 m-auto rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="h-[1.2rem] w-[1.2rem] absolute inset-0 m-auto rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </div>
              </ThemeToggle>

              {/* <GoDashboard>
                <Button
                  type="submit"
                  className="bg-primary hover:opacity-90 text-white h-8 text-sm px-4"
                >
                  {t("header.startButton")}
                </Button>
              </GoDashboard> */}
              <User />
            </div>

            <button
              className="md:hidden p-2 hover:bg-accent rounded-md"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </ScrollHeader>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        buttonText={t("header.startButton")}
      />
    </>
  );
}
