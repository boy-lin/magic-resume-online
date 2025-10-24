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
          <div className="text-sm font-medium leading-none whitespace-nowrap">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground whitespace-nowrap">
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
  const menuItems = tc.raw("menu.items");

  return (
    <>
      <ScrollHeader>
        <div className="m-auto max-w-[1200px] px-4">
          <div className="flex items-center justify-between h-16">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => (window.location.href = `/${locale}/`)}
            >
              <Logo size={32} className="text-primary" />
              <span className="font-bold text-2xl">{t("header.title")}</span>
            </div>

            <div className="flex-1 flex items-center justify-start pl-8">
              <NavigationMenu>
                <NavigationMenuList>
                  {menuItems.map((item, index) => (
                    <NavigationMenuItem key={index}>
                      <NavigationMenuTrigger className="bg-transparent">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="flex p-4 gap-2">
                        {item.poster && (
                          <div className="">
                            <NavigationMenuLink asChild>
                              <a
                                className={cn(
                                  "h-full w-full select-none flex-col justify-center",
                                  "rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md",
                                  "md:flex hidden"
                                )}
                                href={item.poster.href}
                              >
                                <div className="flex items-center gap-2 mb-2 mt-4 text-lg leading-5 font-medium">
                                  {item.poster.icon || <Logo size={32} />}
                                  <div className="">{item.poster.title}</div>
                                </div>
                                <p
                                  className="text-sm leading-tight text-muted-foreground"
                                  style={{
                                    width:
                                      item.poster.description.length > 150
                                        ? "150px"
                                        : "auto",
                                  }}
                                >
                                  {item.poster.description}
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </div>
                        )}
                        <ul className="flex flex-col gap-2">
                          {item.items &&
                            item.items.map((it, i) => (
                              <ListItem key={i} href={it.href} title={it.title}>
                                {it.description}
                              </ListItem>
                            ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ))}
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
