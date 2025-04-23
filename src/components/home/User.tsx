import Link from "next/link";
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
import { avatarUrlDefault } from "@/config";

export default function User() {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useAppContext();
  const user = state.user || {};
  const fullName = user.user_metadata?.full_name;
  const avatarUrl = user.user_metadata?.avatar_url || avatarUrlDefault;

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
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback>{fullName}</AvatarFallback>
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
