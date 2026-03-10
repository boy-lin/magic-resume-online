import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { FileJson } from "lucide-react";

import { Button } from "@/components/ui-lab/button";
import { useResumeStore } from "@/store/resume/useResumeStore";
import type { ResumeData } from "@/types/resume";

export default function JsonBtn({
  activeResume,
}: {
  activeResume: ResumeData | null;
}) {
  const t = useTranslations("share");
  const [isLoading, setIsLoading] = useState(false);
  const activeSection = useResumeStore((state) => state.activeSection);
  const { title } = activeResume || {};

  const handleJsonExport = () => {
    try {
      setIsLoading(true);
      if (!activeResume) {
        throw new Error("No active resume");
      }

      const exportData = {
        ...activeResume,
        activeSection,
      };
      const jsonStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title}.json`;
      link.click();

      window.URL.revokeObjectURL(url);
      toast.success(t("pdf.toast.jsonSuccess"));
    } catch (error) {
      console.error("JSON export error:", error);
      toast.error(t("pdf.toast.jsonError"));
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
      <span className="text-xs">{t("btns.json")}</span>
    </Button>
  );
}
