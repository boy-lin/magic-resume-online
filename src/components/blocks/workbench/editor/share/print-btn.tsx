import { useTranslations } from "next-intl";
import { Printer } from "lucide-react";
import { useHtmlPrint } from "@/hooks/pdf-export";
import { Button } from "@/components/ui-lab/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

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

  const { isMobile } = useIsMobile();

  return (
    <>
      <Button
        variant="ghost"
        className={cn("flex flex-col items-center gap-1 h-auto", className)}
        onClick={() => {
          if (isMobile) {
            toast.info("用PC设备打开页面，可以正常打印");
            return;
          }
          handlePrint();
        }}
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
