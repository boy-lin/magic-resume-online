"use client";
import Link from "next/link";
import { userInfoPath } from "@/utils/routesPath";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppContext } from "@/hooks/app";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { avatarUrlDefault } from "@/config";
import ButtonSignout from "@/components/biz/account/info/button-signout";
import { useAppStore } from "@/store/useApp";
import { memo } from "react";
import { SettingsIcon } from "lucide-react";

function User() {
  const user = useAppStore((state) => state.user) || {};
  const userLoading = useAppStore((state) => state.userLoading);

  const fullName = user?.user_metadata?.full_name || "";
  const fName = fullName.substr(0, 2).toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url || avatarUrlDefault;

  // console.log("aaa3", user, userLoading);

  if (userLoading < 2)
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
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback>{fName}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-2 flex flex-col gap-2">
            <DropdownMenuItem className="px-0 py-0">
              <Button asChild variant="ghost">
                <Link className="w-full" href={userInfoPath}>
                  <SettingsIcon className="w-4 h-4" />
                  账号设置
                </Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem className="px-0 py-0">
              <ButtonSignout className="justify-start leading-4 h-auto font-normal" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div>
          <Button asChild variant="ghost">
            <Link href="/account/signup">注册</Link>
          </Button>
          <Button asChild>
            <Link href="/account/signin">登录</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default memo(User);
