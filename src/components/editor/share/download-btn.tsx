import { Download } from "lucide-react";
import { usePdfExport } from "@/hooks/pdf-export";
import { Button } from "@/components/ui-lab/button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export default function DownloadBtn({
  activeResume,
  className,
}: {
  activeResume: any;
  className?: string;
}) {
  const t = useTranslations("share");
  const { isExporting, handleExport } = usePdfExport(activeResume);

  return (
    <Button
      variant="ghost"
      className={cn("flex flex-col items-center gap-1 h-auto", className)}
      onClick={handleExport}
      loading={isExporting}
    >
      <Download className="w-5 h-5" role="icon" />
      <span className="text-xs">{t("btns.download")}</span>
    </Button>
  );
}
