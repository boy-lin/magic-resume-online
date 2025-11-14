import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui-lab/button";
import { cn } from "@/lib/utils";

export default function ImageBtn({
  activeResume,
  className,
}: {
  activeResume: any;
  className?: string;
}) {
  const t = useTranslations("common");
  const tbs = useTranslations("share");
  const [isLoading, setIsLoading] = useState(false);
  const { title } = activeResume || {};

  const handleJsonExport = async () => {
    try {
      setIsLoading(true);
      const previewDom =
        document.querySelector("#resume-preview").parentElement;
      if (!previewDom) {
        throw new Error("preview resume not found");
      }
      const domToImage = await import(
        /* webpackChunkName: "dom-to-image" */ "dom-to-image"
      );
      const blob = await domToImage.toBlob(previewDom, {
        backgroundColor: "transparent",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title}.png`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success(t("message.success"));
    } catch (error) {
      // console.error("Image export error:", error);
      toast.error(t("message.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      className={cn("flex flex-col items-center gap-1 h-auto", className)}
      onClick={handleJsonExport}
      loading={isLoading}
    >
      <ImageIcon className="w-5 h-5" role="icon" />
      <span className="text-xs">{tbs("btns.image")}</span>
    </Button>
  );
}
