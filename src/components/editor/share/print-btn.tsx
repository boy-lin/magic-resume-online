import { useTranslations } from "next-intl";
import { Printer } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { useHtmlPrint } from "@/hooks/pdf-export";
import { Button } from "@/components/ui-lab/button";

export default function PrintBtn({ activeResume }) {
  // const t = useTranslations("common");
  const { globalSettings = {} } = activeResume || {};
  const { printFrameRef, handlePrint } = useHtmlPrint(globalSettings);

  return (
    <>
      <Button
        variant="ghost"
        className="flex flex-col items-center gap-1 h-auto"
        onClick={handlePrint}
      >
        <Printer className="w-5 h-5" role="icon" />
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
    </>
  );
}
