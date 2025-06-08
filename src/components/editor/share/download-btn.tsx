import { useTranslations } from "next-intl";
import { Download } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { usePdfExport } from "@/hooks/pdf-export";
import { Button } from "@/components/ui-lab/button";

export default function DownloadBtn() {
  const t = useTranslations("common");
  const { activeResume } = useResumeStore();
  const { isExporting, handleExport } = usePdfExport(activeResume);

  return (
    <Button
      variant="ghost"
      className="flex flex-col items-center gap-1 h-auto"
      onClick={handleExport}
      loading={isExporting}
    >
      <Download className="w-5 h-5" role="icon" />
      <span className="text-xs">下载</span>
    </Button>
  );
}
