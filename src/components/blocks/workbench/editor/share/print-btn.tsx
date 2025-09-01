import { useTranslations } from "next-intl";
import { Printer } from "lucide-react";
import { useResumeListStore } from "@/store/resume";
import { useHtmlPrint } from "@/hooks/pdf-export";
import { Button } from "@/components/ui-lab/button";
import { cn } from "@/lib/utils";

export default function PrintBtn({
  activeResume,
  className,
}: {
  activeResume: any;
  className?: string;
}) {
  const t = useTranslations("share");
  const { globalSettings = {} } = activeResume || {};
  const { printFrameRef, handlePrint } = useHtmlPrint(globalSettings);

  return (
    <>
      <Button
        variant="ghost"
        className={cn("flex flex-col items-center gap-1 h-auto", className)}
        onClick={handlePrint}
      >
        <Printer className="w-5 h-5" role="icon" />
        <span className="text-xs">{t("btns.print")}</span>
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
