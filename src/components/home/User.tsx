import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { userInfoPath } from "@/utils/routesPath";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignOut } from "@/utils/auth-helpers/server";
import { handleRequest } from "@/utils/auth-helpers/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppContext } from "@/app/providers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function User() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { state } = useAppContext();
  const user = state.user;

  // <HoverCard openDelay={200}>
  // <HoverCardTrigger asChild>
  //   <Avatar className="size-8">
  //     <AvatarImage src="/images/avatar.jpeg" alt="@shadcn" />
  //     <AvatarFallback>CN</AvatarFallback>
  //   </Avatar>
  // </HoverCardTrigger>
  /* <HoverCardContent
      align="end"
      className="flex flex-col gap-1 w-auto p-1"
    >
      <Button variant="ghost" className="text-left">
        账号设置
      </Button>
      <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
        <input type="hidden" name="pathName" value={pathName} />
        <Button
          type="submit"
          variant="ghost"
          className="text-left w-full"
        >
          <div className="text-left">退出</div>
        </Button>
      </form>
    </HoverCardContent>
  </HoverCard> */

  if (state.userLoading === 0)
    return (
      <div className="flex items-center space-x-2">
        {/* <div className="space-y-1">
          <Skeleton className="h-3 w-[40px]" />
          <Skeleton className="h-3 w-[40px]" />
        </div> */}
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );

  return (
    <div className="">
      {user?.aud === "authenticated" ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="size-8">
              <AvatarImage src="/images/avatar.jpeg" alt="avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link className="w-full" href={userInfoPath}>
                账号设置
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <form
                className="w-full"
                onSubmit={(e) => handleRequest(e, SignOut, router)}
              >
                <input type="hidden" name="pathName" value={pathname} />
                <button type="submit" className="text-left w-full">
                  退出
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div>
          <Button
            variant="ghost"
            className="text-sm"
            onClick={() => router.push("/account/signin")}
          >
            登录
          </Button>
          <Button
            variant="ghost"
            className="text-sm"
            onClick={() => router.push("/account/signup")}
          >
            注册
          </Button>
        </div>
      )}
    </div>
  );
}
