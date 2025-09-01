"use client";
import React, { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Download,
  Loader2,
  FileJson,
  Printer,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import useResumeListStore from "@/store/resume/useResumeListStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePdfExport, useHtmlPrint } from "@/hooks/pdf-export";

const PdfExport = () => {
  const t = useTranslations("share.pdf");
  const [isExportingJson, setIsExportingJson] = useState(false);
  const { activeResume } = useResumeListStore();
  const { globalSettings = {}, title } = activeResume || {};
  const { isExporting, handleExport } = usePdfExport(activeResume);
  const { printFrameRef, handlePrint } = useHtmlPrint(globalSettings);

  const handleJsonExport = () => {
    try {
      setIsExportingJson(true);
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
      setIsExportingJson(false);
    }
  };

  const isLoading = isExporting || isExportingJson;
  const loadingText = isExporting
    ? t("button.exporting")
    : isExportingJson
    ? t("button.exportingJson")
    : "";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="flex items-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{loadingText}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t("button.export")}</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExport} disabled={isLoading}>
            <Download className="w-4 h-4 mr-2" />
            {t("button.exportPdf")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrint} disabled={isLoading}>
            <Printer className="w-4 h-4 mr-2" />
            {t("button.print")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleJsonExport} disabled={isLoading}>
            <FileJson className="w-4 h-4 mr-2" />
            {t("button.exportJson")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <iframe
        ref={printFrameRef}
        style={{
          position: "absolute",
          width: "210mm",
          height: "297mm",
          visibility: "hidden",
          zIndex: -1,
        }}
        title="Print Frame"
      />
    </>
  );
};

export default PdfExport;
