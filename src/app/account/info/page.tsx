"use client";
import Link from "next/link";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppContext } from "@/app/providers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { handleRequest } from "@/utils/auth-helpers/client";
import { SignOut } from "@/utils/auth-helpers/server";
import { ChevronRightIcon } from "lucide-react";
import { avatarUrlDefault } from "@/config";

const NextPage = () => {
  const { state } = useAppContext();
  const user = state.user || {};
  const fullName = user.user_metadata?.full_name;
  const avatarUrl = user.user_metadata?.avatar_url || avatarUrlDefault;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="self-start py-12 sm:px-6 lg:px-8">
      <div className="flex flex-1 flex-col justify-center max-w-4xl m-auto">
        <div className="flex items-center justify-start gap-4 p-6">
          <div className="shrink-0">
            <Avatar className="size-16">
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback>{fullName}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm/6 font-medium w-[20em]">
              {fullName || "-"}
            </span>
            <span className="truncate text-sm/6 w-[25em]">
              ID: {user.id || "-"}
            </span>
          </div>
        </div>

        <div>
          <div className="text-letter-head mb-2 text-sm">账户</div>
          <div className="rounded-md border text-base overflow-clip">
            <Link
              className="group px-4 py-4 bg-card cursor-pointer flex justify-between items-center"
              href="/account/info/setting"
            >
              <span>设置个人资料</span>
              <ChevronRightIcon />
            </Link>
            <form
              className="w-full px-4 py-4 bg-card"
              onSubmit={(e) => handleRequest(e, SignOut, router)}
            >
              <input type="hidden" name="pathName" value={pathname} />
              <button type="submit" className="text-left w-full">
                退出登录
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextPage;
