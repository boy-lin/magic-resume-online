"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui-lab/button";
import { useRouter, usePathname } from "next/navigation";
import { handleRequest } from "@/utils/auth-helpers/client";
import { SignOut } from "@/utils/auth-helpers/server";
import {
  setLocalStorageByName,
  getLocalStorageByName,
  clearLocalStorage,
} from "@/utils/storage";

const ButtonSignout = ({ className, variant }) => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <form
      className="w-full px-2 py-1.5"
      onSubmit={async (e) => {
        try {
          setLoading(true);
          await handleRequest(e, SignOut, router);
          clearLocalStorage();
        } finally {
          setLoading(false);
        }
      }}
    >
      <input type="hidden" name="pathName" value={pathname} />
      <Button
        type="submit"
        className={cn(className, "w-full")}
        variant={variant}
        loading={loading}
      >
        退出登录
      </Button>
    </form>
  );
};

export default ButtonSignout;
