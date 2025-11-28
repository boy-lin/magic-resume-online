"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import IconGithub from "@/components/icon/github";
import { clearLocalStorage } from "@/utils/storage";

const ButtonGoogle = () => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      onClick={async () => {
        if (loading) return;
        setLoading(true);
        try {
          clearLocalStorage();
          await signIn("github", {
            callbackUrl: "/",
          });
        } catch {
          setLoading(false);
        }
      }}
      variant="outline"
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <IconGithub className="h-5 w-5" />
      )}
      GitHub
    </Button>
  );
};

export default ButtonGoogle;
