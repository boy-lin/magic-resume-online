"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/app/providers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/client";
import { ChevronRightIcon } from "lucide-react";

const NextPage = () => {
  const { state } = useAppContext();
  const user = state.user || {};
  const [info, setInfo] = useState({
    full_name: "-",
  });

  const supabase = createClient();

  useEffect(() => {
    if (!user.id) return;

    async function findInfo() {
      const res = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      setInfo(res.data);
      // const res = await supabase
      //   .from("users")
      //   .update({
      //     full_name: generateRandomUsername(),
      //     avatar_url: "/images/avatar.jpeg",
      //   })
      //   .eq("id", user.id);
      console.debug("findInfo", res);
    }

    findInfo();
  }, [user.id]);

  return (
    <div className=" min-h-full py-12 sm:px-6 lg:px-8">
      <div className="flex flex-1 flex-col justify-center max-w-4xl m-auto">
        <div className="flex items-center justify-start gap-4 p-6">
          <div className="shrink-0">
            <Avatar className="size-16">
              <AvatarImage src="/images/avatar.jpeg" alt="@shadcn" />
              <AvatarFallback>{info.full_name}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm/6 font-medium text-gray-950 dark:text-white w-[20em]">
              {info.full_name || "-"}
            </span>
            <span className="truncate text-sm/6 text-gray-500 dark:text-gray-400 w-[25em]">
              ID: {user.id || "-"}
            </span>
          </div>
        </div>

        <div>
          <div className="text-gray-500 mb-2 text-sm">账户</div>
          <div className="bg-gray-100 rounded-md text-base overflow-clip">
            <Link
              className="px-4 py-4 hover:bg-gray-200 cursor-pointer flex justify-between items-center"
              href="/account/setting/user"
            >
              <span>设置个人资料</span>
              <ChevronRightIcon />
            </Link>
            <div className="px-4 py-4 hover:bg-gray-200 cursor-pointer">
              退出登录
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextPage;
