"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import IconGoogle from "@/components/icon/google";
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
          await signIn("google", {
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
        <IconGoogle className="h-5 w-5" />
      )}
      Google
    </Button>
  );
};

export default ButtonGoogle;
