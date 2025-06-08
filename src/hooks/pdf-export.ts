import { useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const getOptimizedStyles = () => {
  const styleCache = new Map();
  const startTime = performance.now();

  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .filter((rule) => {
            const ruleText = rule.cssText;
            if (styleCache.has(ruleText)) return false;
            styleCache.set(ruleText, true);

            if (rule instanceof CSSFontFaceRule) return false;
            if (ruleText.includes("font-family")) return false;
            if (ruleText.includes("@keyframes")) return false;
            if (ruleText.includes("animation")) return false;
            if (ruleText.includes("transition")) return false;
            if (ruleText.includes("hover")) return false;
            return true;
          })
          .map((rule) => rule.cssText)
          .join("\n");
      } catch (e) {
        console.warn("Style processing error:", e);
        return "";
      }
    })
    .join("\n");

  console.log(`Style processing took ${performance.now() - startTime}ms`);
  return styles;
};

const optimizeImages = async (element: HTMLElement) => {
  const startTime = performance.now();
  const images = element.getElementsByTagName("img");

  const imagePromises = Array.from(images)
    .filter((img) => !img.src.startsWith("data:"))
    .map(async (img) => {
      try {
        const response = await fetch(img.src);
        const blob = await response.blob();
        return new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            img.src = reader.result as string;
            resolve();
          };
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error("Image conversion error:", error);
        return Promise.resolve();
      }
    });

  await Promise.all(imagePromises);
  console.log(`Image processing took ${performance.now() - startTime}ms`);
};

export const usePdfExport = (props) => {
  const [isExporting, setIsExporting] = useState(false);
  const t = useTranslations("pdfExport");
  const handleExport = async () => {
    const exportStartTime = performance.now();
    setIsExporting(true);

    try {
      const pdfElement = document.querySelector<HTMLElement>("#resume-preview");
      if (!pdfElement) {
        throw new Error("PDF element not found");
      }

      const clonedElement = pdfElement.cloneNode(true) as HTMLElement;

      const pageBreakLines =
        clonedElement.querySelectorAll<HTMLElement>(".page-break-line");
      pageBreakLines.forEach((line) => {
        line.style.display = "none";
      });

      const [styles] = await Promise.all([
        getOptimizedStyles(),
        optimizeImages(clonedElement),
      ]);

      const { globalSettings, title } = props;

      const response = await fetch(
        "https://1255612844-0z3iovadu8.ap-chengdu.tencentscf.com/generate-pdf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: clonedElement.outerHTML,
            styles,
            margin: globalSettings.pagePadding,
          }),
          // 允许跨域请求
          mode: "cors",
        }
      );

      if (!response.ok) {
        throw new Error(`PDF generation failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
      console.log(`Total export took ${performance.now() - exportStartTime}ms`);
      toast.success(t("toast.success"));
    } catch (error) {
      console.error("Export error:", error);
      toast.error(t("toast.error"));
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    handleExport,
  };
};

export const useHtmlPrint = (globalSettings) => {
  const printFrameRef = useRef<HTMLIFrameElement>(null);

  const handlePrint = () => {
    if (!printFrameRef.current) {
      console.error("Print frame not found");
      return;
    }

    const resumeContent = document.getElementById("resume-preview");
    if (!resumeContent) {
      console.error("Resume content not found");
      return;
    }

    const actualContent = resumeContent.parentElement;
    if (!actualContent) {
      console.error("Actual content not found");
      return;
    }

    console.log("Found content:", actualContent);

    const pagePadding = globalSettings?.pagePadding;
    const iframeWindow = printFrameRef.current.contentWindow;
    if (!iframeWindow) {
      console.error("IFrame window not found");
      return;
    }

    try {
      iframeWindow.document.open();
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Resume</title>
            <style>
              @font-face {
                font-family: "MiSans VF";
                src: url("/fonts/MiSans-VF.ttf") format("woff2");
                font-weight: normal;
                font-style: normal;
                font-display: swap;
              }

              @page {
                size: A4;
                margin: ${pagePadding}px;
                padding: 0;
              }
              * {
                box-sizing: border-box;
              }
              html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                background: white;
              }
              body {
                font-family: sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }

              #resume-preview {
                padding: 0 !important;
                margin: 0 !important;
                font-family: "MiSans VF", sans-serif !important;
              }

              #print-content {
                width: 210mm;
                min-height: 297mm;
                margin: 0 auto;
                padding: 0;
                background: white;
                box-shadow: none;
              }
              #print-content * {
                box-shadow: none !important;
                transform: none !important;
                scale: 1 !important;
              }
              .scale-90 {
                transform: none !important;
              }
              
              .page-break-line {
                display: none;
              }

              ${Array.from(document.styleSheets)
                .map((sheet) => {
                  try {
                    return Array.from(sheet.cssRules)
                      .map((rule) => rule.cssText)
                      .join("\n");
                  } catch (e) {
                    console.warn("Could not copy styles from sheet:", e);
                    return "";
                  }
                })
                .join("\n")}
            </style>
          </head>
          <body>
            <div id="print-content">
              ${actualContent.innerHTML}
            </div>
          </body>
        </html>
      `;

      iframeWindow.document.write(htmlContent);
      iframeWindow.document.close();

      setTimeout(() => {
        try {
          iframeWindow.focus();
          iframeWindow.print();
        } catch (error) {
          console.error("Error  print:", error);
        }
      }, 1000);
    } catch (error) {
      console.error("Error setting up print:", error);
    }
  };

  return {
    printFrameRef,
    handlePrint,
  };
};
