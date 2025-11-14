import { Download } from "lucide-react";
import { usePdfExport } from "@/hooks/pdf-export";
import { Button } from "@/components/ui-lab/button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

export default function DownloadBtn({
  activeResume,
  className,
}: {
  activeResume: any;
  className?: string;
}) {
  const t = useTranslations("share");
  const { isExporting, handleExport } = usePdfExport(activeResume);

  const { isMobile } = useIsMobile();

  return (
    <Button
      variant="ghost"
      className={cn("flex flex-col items-center gap-1 h-auto", className)}
      onClick={() => {
        if (isMobile) {
          toast.info("用PC设备打开页面，可以正常下载");
          return;
        }
        handleExport();
      }}
      loading={isExporting}
    >
      <Download className="w-5 h-5" role="icon" />
      <span className="text-xs">{t("btns.download")}</span>
    </Button>
  );
}
