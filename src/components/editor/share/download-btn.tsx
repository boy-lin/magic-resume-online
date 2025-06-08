import { Download } from "lucide-react";
import { usePdfExport } from "@/hooks/pdf-export";
import { Button } from "@/components/ui-lab/button";

export default function DownloadBtn({ activeResume }) {
  // const t = useTranslations("common");
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
