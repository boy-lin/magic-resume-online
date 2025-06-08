import { useTranslations } from "next-intl";
import { Printer } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { useHtmlPrint } from "@/hooks/pdf-export";
import { Button } from "@/components/ui-lab/button";

export default function PrintBtn() {
  const t = useTranslations("common");
  const activeResume = useResumeStore((state) => state.activeResume);
  const { globalSettings = {} } = activeResume || {};
  const { printFrameRef, handlePrint } = useHtmlPrint(globalSettings);

  return (
    <div>
      <Button
        withIcon
        variant="ghost"
        className="flex flex-col items-center gap-1 h-auto"
        onClick={handlePrint}
      >
        <Printer className="w-5 h-5" />
        <span className="text-xs">打印</span>
      </Button>
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
    </div>
  );
}
