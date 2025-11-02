import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

// html2pdf 类型声明
declare global {
  interface Window {
    html2pdf: any;
  }
}

// 加载 html2pdf.js 脚本的函数
const loadHtml2Pdf = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载
    if (window.html2pdf) {
      resolve();
      return;
    }

    // 检查脚本是否正在加载
    const existingScript = document.querySelector(
      'script[src="/javascript/html2pdf.bundle.min.js"]'
    );
    if (existingScript) {
      // 等待脚本加载完成
      existingScript.addEventListener("load", () => {
        if (window.html2pdf) {
          resolve();
        } else {
          reject(new Error("html2pdf not available after script load"));
        }
      });
      existingScript.addEventListener("error", reject);
      return;
    }

    // 创建并加载脚本
    const script = document.createElement("script");
    script.src = "/javascript/html2pdf.bundle.min.js";
    script.async = true;
    script.onload = () => {
      if (window.html2pdf) {
        resolve();
      } else {
        reject(new Error("html2pdf not available after script load"));
      }
    };
    script.onerror = () => {
      reject(new Error("Failed to load html2pdf script"));
    };
    document.head.appendChild(script);
  });
};

export const usePdfExport = (props) => {
  const [isExporting, setIsExporting] = useState(false);
  const [html2PdfLoaded, setHtml2PdfLoaded] = useState(false);
  const t = useTranslations("share.pdf");

  // 在组件挂载时预加载 html2pdf.js
  useEffect(() => {
    loadHtml2Pdf()
      .then(() => {
        setHtml2PdfLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to load html2pdf:", error);
      });
  }, []);

  const handleExport = async () => {
    const exportStartTime = performance.now();
    setIsExporting(true);

    try {
      // 确保 html2pdf 已加载
      if (!window.html2pdf) {
        await loadHtml2Pdf();
        setHtml2PdfLoaded(true);
      }

      const pdfElement = document.querySelector<HTMLElement>("#resume-preview");
      if (!pdfElement) {
        throw new Error("PDF element not found");
      }

      const clonedElement = pdfElement.cloneNode(true) as HTMLElement;

      // 隐藏分页线
      const pageBreakLines =
        clonedElement.querySelectorAll<HTMLElement>(".page-break-line");
      pageBreakLines.forEach((line) => {
        line.style.display = "none";
      });

      // 为需要避免分页的元素添加 CSS 样式
      const avoidBreakElements = [
        ...Array.from(clonedElement.querySelectorAll("img")),
        ...Array.from(clonedElement.querySelectorAll("h1, h2, h3, h4, h5, h6")),
        ...Array.from(clonedElement.querySelectorAll("p")),
        ...Array.from(clonedElement.querySelectorAll("li")),
        ...Array.from(
          clonedElement.querySelectorAll(
            ".experience-item, .project-item, .education-item, .skill-item"
          )
        ),
        ...Array.from(clonedElement.querySelectorAll("[data-section]")),
      ];
      avoidBreakElements.forEach((el) => {
        (el as HTMLElement).style.pageBreakInside = "avoid";
        (el as HTMLElement).style.breakInside = "avoid";
      });
      const { globalSettings, title } = props;

      // 检查是否启用调试模式（通过URL参数或localStorage）
      const urlParams = new URLSearchParams(window.location.search);
      const debugMode = urlParams.get("pdfDebug") === "true";

      // 调试模式：打开HTML预览页面
      if (debugMode) {
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>PDF Debug Preview</title>
              <style>
                ${Array.from(document.styleSheets)
                  .map((sheet) => {
                    try {
                      return Array.from(sheet.cssRules)
                        .map((rule) => rule.cssText)
                        .join("\n");
                    } catch (e) {
                      return "";
                    }
                  })
                  .join("\n")}
              </style>
            </head>
            <body>
              ${clonedElement.outerHTML}
            </body>
          </html>
        `;
        const previewWindow = window.open("", "_blank");
        if (previewWindow) {
          previewWindow.document.write(html);
          previewWindow.document.close();
        }
        console.log(
          `Total export took ${performance.now() - exportStartTime}ms`
        );
        toast.success("调试模式：HTML预览已在新窗口打开");
        setIsExporting(false);
        return;
      }

      // 为了确保 html2pdf 能正确处理，将克隆元素临时添加到 DOM（但隐藏）
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "fixed";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = "210mm"; // A4 宽度
      tempContainer.style.overflow = "visible";
      tempContainer.style.zIndex = "-1";

      // 确保克隆元素有正确的宽度和样式，防止内容被截断
      clonedElement.style.width = "210mm";
      clonedElement.style.minWidth = "210mm";
      clonedElement.style.maxWidth = "210mm";
      clonedElement.style.overflow = "visible";
      clonedElement.style.position = "relative";
      clonedElement.style.padding = `${globalSettings?.pagePadding}px`;
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);

      try {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        // 配置 html2pdf 选项
        const options = {
          filename: `${title}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            logging: false,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
          pagebreak: {
            mode: ["css", "css-paged"], //"avoid-all"
            autoPaging: "text",
            // 避免在以下元素内部分页
            avoid: [
              "img", // 图片不应被分页
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6", // 标题不应与内容分离
              "p", // 段落尽量不分页
              "li", // 列表项尽量保持完整
              "[data-section]", // 所有带 data-section 属性的元素
            ],
            // 在以下元素之后分页（如果可能）
            after: [".page-break-after"],
            // 在以下元素之前分页（如果可能）
            before: [".page-break-before"],
          },
        };

        // 使用 html2pdf 生成 PDF（从克隆的元素）
        await window.html2pdf().set(options).from(clonedElement).save();
      } finally {
        // 清理临时 DOM 元素
        if (document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      }
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
    html2PdfLoaded,
  };
};

export const useHtmlPrint = (globalSettings) => {
  const printFrameRef = useRef<HTMLIFrameElement>(null);

  const handlePrint = async () => {
    if (!printFrameRef.current) {
      console.error("Print frame not found");
      return;
    }

    const resumeContent = document.getElementById("resume-preview");
    if (!resumeContent) {
      console.error("Resume content not found");
      return;
    }

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
              ${resumeContent.innerHTML}
            </div>
          </body>
        </html>
      `;

      iframeWindow.document.write(htmlContent);
      iframeWindow.document.close();
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      iframeWindow.focus();
      iframeWindow.print();
    } catch (error) {
      console.error("Error setting up print:", error);
    }
  };

  return {
    printFrameRef,
    handlePrint,
  };
};
