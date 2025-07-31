"use client";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui-lab/button";
import { useRouter, usePathname } from "next/navigation";
import { handleRequest } from "@/utils/auth-helpers/client";
import { SignOut } from "@/utils/auth-helpers/server";
import { clearLocalStorage } from "@/utils/storage";
import { LogOutIcon } from "lucide-react";
import { useRequest } from "ahooks";
import { toast } from "sonner";
import { ButtonProps } from "@/components/ui-lab/button";

const ButtonSignout = (props: ButtonProps) => {
  const { className, ...rest } = props;
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const { loading, runAsync } = useRequest(
    (e, router) => {
      return handleRequest(e, SignOut, router);
    },
    {
      manual: true,
      onSuccess: () => {
        clearLocalStorage();
      },
      onError: (e) => {
        toast.error(e.message);
      },
    }
  );

  return (
    <form
      className="w-full"
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await runAsync(e, router);
      }}
    >
      <input type="hidden" name="pathName" value={pathname} />
      <Button
        type="submit"
        className={cn(className, "w-full")}
        variant="destructive"
        loading={loading}
        onClick={(e) => e.stopPropagation()}
        {...rest}
      >
        <LogOutIcon className="w-4 h-4" role="icon" />
        退出登录
      </Button>
    </form>
  );
};

export default ButtonSignout;
