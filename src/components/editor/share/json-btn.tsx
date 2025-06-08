import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { FileJson } from "lucide-react";

import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui-lab/button";

export default function PrintBtn() {
  const t = useTranslations("pdfExport");
  const [isLoading, setIsLoading] = useState(false);
  const { activeResume } = useResumeStore();
  const { title } = activeResume || {};

  const handleJsonExport = () => {
    try {
      setIsLoading(true);
      if (!activeResume) {
        throw new Error("No active resume");
      }

      const jsonStr = JSON.stringify(activeResume, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title}.json`;
      link.click();

      window.URL.revokeObjectURL(url);
      toast.success(t("toast.jsonSuccess"));
    } catch (error) {
      console.error("JSON export error:", error);
      toast.error(t("toast.jsonError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      className="flex flex-col items-center gap-1 h-auto"
      onClick={handleJsonExport}
      loading={isLoading}
    >
      <FileJson className="w-5 h-5" role="icon" />
      <span className="text-xs">Json</span>
    </Button>
  );
}
