"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui-lab/button";
import { useRouter } from "next/navigation";
import { clearLocalStorage } from "@/utils/storage";
import { LogOutIcon } from "lucide-react";
import { toast } from "sonner";
import { ButtonProps } from "@/components/ui-lab/button";
import { signOut } from "next-auth/react";
import { useAppStore } from "@/store/useApp";

const ButtonSignout = (props: ButtonProps) => {
  const { className, ...rest } = props;
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      clearLocalStorage();
      useAppStore.getState().setUser(null);
      useAppStore.getState().setUserLoading(0);
      await signOut({ callbackUrl: "/account/signin" });
    } catch (error) {
      console.error(error);
      toast.error("退出登录失败");
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      className={cn(className, "w-full")}
      variant="destructive"
      loading={loading}
      onClick={handleLogout}
      {...rest}
    >
      <LogOutIcon className="w-4 h-4" role="icon" />
      退出登录
    </Button>
  );
};

export default ButtonSignout;

