import { NextRequest, NextResponse } from "next/server";

/**
 * PDF生成接口
 * 接收HTML内容和样式，返回PDF文件
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, styles, margin = 0, debug = false } = body;

    // 验证必需参数
    if (!content) {
      return NextResponse.json(
        { error: "Missing required parameter: content" },
        { status: 400 }
      );
    }

    // 调试模式：返回HTML而不是PDF
    if (debug || process.env.PDF_DEBUG === "true") {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PDF Preview - Debug</title>
            <style>
              ${styles || ""}
              
              @page {
                size: A4;
                margin: ${margin}px;
              }
              
              * {
                box-sizing: border-box;
              }
              
              body {
                margin: 0;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                background: #f5f5f5;
              }
              
              .debug-info {
                background: white;
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                font-size: 12px;
                color: #666;
              }
              
              .debug-info h3 {
                margin-top: 0;
                color: #333;
              }
              
              .preview-container {
                background: white;
                padding: ${margin}px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                min-height: 297mm;
                width: 210mm;
                margin: 0 auto;
              }
              
              .page-break-line {
                display: none !important;
              }
            </style>
          </head>
          <body>
            <div class="debug-info">
              <h3>🔍 PDF调试模式</h3>
              <p><strong>页边距:</strong> ${margin}px</p>
              <p><strong>页面尺寸:</strong> A4 (210mm × 297mm)</p>
              <p><strong>样式长度:</strong> ${styles?.length || 0} 字符</p>
              <p><strong>内容长度:</strong> ${content.length} 字符</p>
              <p><em>这是预览模式，实际PDF可能略有不同。打印此页面或保存为PDF以查看最终效果。</em></p>
            </div>
            <div class="preview-container">
              ${content}
            </div>
          </body>
        </html>
      `;

      return new NextResponse(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    // 动态导入puppeteer-core和chromium（避免在客户端打包）
    let puppeteer: any;
    let chromium: any;

    try {
      puppeteer = await import("puppeteer-core");
      chromium = await import("@sparticuz/chromium");
    } catch (importError) {
      console.error("Failed to import puppeteer dependencies:", importError);
      return NextResponse.json(
        {
          error: "PDF generation service not available",
          details: "Please install puppeteer-core package",
        },
        { status: 503 }
      );
    }

    // 配置Chromium选项（仅在serverless环境）
    if (chromium.setGraphicsMode) {
      chromium.setGraphicsMode(false);
    }

      // 确定executablePath（开发环境和生产环境不同）
      const isDev = process.env.NODE_ENV === "development";
      let executablePath: string | undefined;
      let launchOptions: any;

      // Chrome 参数，确保字体正确加载
      const chromeArgs = [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--enable-font-subpixel-positioning", // 启用字体子像素定位（对中文重要）
      ];

      if (isDev) {
        // 开发环境：尝试使用系统安装的Chrome
        const fs = await import("fs");
        const path = await import("path");

        // 常见的Chrome安装路径（macOS, Linux, Windows）
        const possiblePaths = [
          // macOS
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          "/Applications/Chromium.app/Contents/MacOS/Chromium",
          // Linux
          "/usr/bin/google-chrome",
          "/usr/bin/google-chrome-stable",
          "/usr/bin/chromium",
          "/usr/bin/chromium-browser",
          // Windows
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        ];

        // 查找存在的Chrome路径
        for (const chromePath of possiblePaths) {
          try {
            if (fs.existsSync(chromePath)) {
              executablePath = chromePath;
              break;
            }
          } catch {
            // 继续查找
          }
        }

        // 如果找不到Chrome，尝试使用环境变量
        if (!executablePath && process.env.CHROME_PATH) {
          executablePath = process.env.CHROME_PATH;
        }

        // 如果还是找不到，尝试使用puppeteer的channel选项
        if (!executablePath) {
          launchOptions = {
            channel: "chrome", // 尝试使用puppeteer的channel选项
            args: chromeArgs,
            headless: true,
          };
        } else {
          launchOptions = {
            executablePath,
            args: chromeArgs,
            headless: true,
          };
        }
      } else {
        // 生产环境：使用@sparticuz/chromium
        executablePath = await chromium.executablePath();
        launchOptions = {
          args: [...chromium.args, ...chromeArgs],
          defaultViewport: chromium.defaultViewport,
          executablePath,
          headless: chromium.headless,
        };
      }

    // 启动浏览器
    const browser = await puppeteer.launch(launchOptions);

    try {
      const page = await browser.newPage();

      // 设置字体支持（确保中文字体可用）
      await page.evaluateOnNewDocument(() => {
        // 注入支持中文的字体配置
        const style = document.createElement("style");
        style.textContent = `
          * {
            font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Microsoft JhengHei", "SimSun", "SimHei", "STSong", "STKaiti", "STFangsong", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans CJK SC", "Noto Sans SC", "WenQuanYi Micro Hei", sans-serif !important;
          }
        `;
        document.head.appendChild(style);
      });

      // 设置视口大小（A4尺寸）
      await page.setViewport({
        width: 794, // A4 width in pixels at 96 DPI (210mm)
        height: 1123, // A4 height in pixels at 96 DPI (297mm)
        deviceScaleFactor: 2, // 提高渲染质量
      });

      // 创建完整的HTML文档
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              ${styles || ""}
              
              @page {
                size: A4;
                margin: ${margin}px;
              }
              
              * {
                box-sizing: border-box;
              }
              
              html {
                font-size: 16px;
              }
              
              body {
                margin: 0;
                padding: 0;
                font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Microsoft JhengHei", "SimSun", "SimHei", "STSong", "STKaiti", "STFangsong", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans CJK SC", "Noto Sans SC", "WenQuanYi Micro Hei", sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                color: #000 !important;
                background: #fff !important;
              }
              
              /* 确保所有元素都使用支持中文的字体 */
              * {
                font-family: inherit;
              }
              
              /* 确保文字可见性和渲染质量 */
              * {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                text-rendering: optimizeLegibility;
              }
              
              /* 防止文字被裁剪或隐藏 */
              p, span, div, h1, h2, h3, h4, h5, h6, li, a, td, th {
                color: inherit !important;
                opacity: 1 !important;
                visibility: visible !important;
              }
              
              /* 确保所有文本元素可见 */
              [style*="opacity: 0"], 
              [style*="opacity:0"],
              [style*="display: none"],
              [style*="visibility: hidden"] {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
              }
              
              /* 强制显示文字内容 */
              ::before, ::after {
                color: inherit !important;
              }
              
              .page-break-line {
                display: none !important;
              }
              
              /* 修复可能的CSS变量问题 */
              :root {
                --background: 0 0% 100%;
                --foreground: 224 71.4% 4.1%;
                --primary: 209.84deg 76.71% 51.18%;
                --text-letter: 215 25% 26.67%;
                --text-letter-head: 228 84% 4.9%;
              }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `;

      // 设置页面内容，等待所有资源加载完成
      await page.setContent(html, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      // 等待字体加载完成（特别重要：中文字体需要完全加载）
      await page.evaluate(async () => {
        await document.fonts.ready;
        
        // 额外等待中文字体加载
        const chineseText = document.querySelector("body");
        if (chineseText) {
          // 创建一个测试元素来强制加载中文字体
          const testEl = document.createElement("span");
          testEl.textContent = "中文字体测试";
          testEl.style.fontSize = "12px";
          testEl.style.fontFamily = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Microsoft JhengHei", "SimSun", "SimHei", "STSong", "STKaiti", "STFangsong", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans CJK SC", "Noto Sans SC", "WenQuanYi Micro Hei", sans-serif';
          testEl.style.position = "absolute";
          testEl.style.opacity = "0";
          testEl.style.pointerEvents = "none";
          document.body.appendChild(testEl);
          
          // 强制渲染
          testEl.offsetHeight;
          
          // 等待字体加载
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // 移除测试元素
          testEl.remove();
        }
        
        // 确保所有CSS变量都被计算
        const root = document.documentElement;
        const computedStyle = window.getComputedStyle(root);
        // 强制重新计算样式
        root.style.display = "none";
        root.offsetHeight; // 触发重排
        root.style.display = "";
      });

      // 额外等待一段时间确保所有内容渲染完成（中文字体需要更多时间）
      await page.waitForTimeout(3000);

      // 将CSS变量转换为实际值（PDF渲染可能不支持CSS变量）
      await page.evaluate(() => {
        // 获取所有元素
        const allElements = document.querySelectorAll("*");
        allElements.forEach((el) => {
          const computedStyle = window.getComputedStyle(el);
          const inlineStyle = (el as HTMLElement).style;

          // 获取计算后的颜色值并应用
          const color = computedStyle.color;
          const backgroundColor = computedStyle.backgroundColor;

          // 如果颜色不是transparent，确保它被应用
          if (color !== "rgba(0, 0, 0, 0)" && color !== "transparent") {
            // 检查是否使用了CSS变量（通过比较和计算样式）
            if (color.includes("rgb") || color.includes("#")) {
              inlineStyle.color = color;
            }
          }

          // 确保背景色也正确
          if (
            backgroundColor !== "rgba(0, 0, 0, 0)" &&
            backgroundColor !== "transparent"
          ) {
            inlineStyle.backgroundColor = backgroundColor;
          }
        });
      });

      await page.waitForTimeout(500);

      // 确保所有文本都可见
      await page.evaluate(() => {
        // 修复可能的opacity或visibility问题
        const allElements = document.querySelectorAll("*");
        allElements.forEach((el) => {
          const style = window.getComputedStyle(el);
          if (style.opacity === "0" || style.visibility === "hidden") {
            (el as HTMLElement).style.opacity = "1";
            (el as HTMLElement).style.visibility = "visible";
          }
          // 确保颜色不是透明或白色
          const color = style.color;
          if (color === "rgba(0, 0, 0, 0)" || color === "transparent") {
            (el as HTMLElement).style.color = "inherit";
          }
          // 确保背景色不是透明导致文字看不见
          const bgColor = style.backgroundColor;
          if (bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
            // 检查父元素的背景色
            const parent = el.parentElement;
            if (parent) {
              const parentBg = window.getComputedStyle(parent).backgroundColor;
              if (
                parentBg !== "rgba(0, 0, 0, 0)" &&
                parentBg !== "transparent"
              ) {
                (el as HTMLElement).style.backgroundColor = parentBg;
              }
            }
          }
        });

        // 强制触发重绘
        document.body.offsetHeight;
      });

      // 强制应用中文字体到所有文本元素（PDF生成前）
      await page.evaluate(() => {
        const chineseFontStack = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Microsoft JhengHei", "SimSun", "SimHei", "STSong", "STKaiti", "STFangsong", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans CJK SC", "Noto Sans SC", "WenQuanYi Micro Hei", sans-serif';
        
        // 获取所有包含文本的元素
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
          null
        );
        
        const textElements = new Set<HTMLElement>();
        let node;
        
        // 遍历所有节点，收集包含文本的元素
        while ((node = walker.nextNode())) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            const text = el.textContent?.trim();
            // 检查是否包含中文字符
            if (text && /[\u4e00-\u9fa5]/.test(text)) {
              textElements.add(el);
              // 向上查找父元素
              let parent = el.parentElement;
              while (parent && parent !== document.body) {
                textElements.add(parent);
                parent = parent.parentElement;
              }
            }
          }
        }
        
        // 强制所有包含中文的元素使用中文字体
        textElements.forEach((el) => {
          el.style.fontFamily = chineseFontStack;
        });
        
        // 确保body也使用中文字体
        document.body.style.fontFamily = chineseFontStack;
      });

      // 再次等待字体应用
      await page.waitForTimeout(1000);

      // 验证中文字体是否加载
      const fontCheck = await page.evaluate(() => {
        const testText = "中文字体测试";
        const testEl = document.createElement("span");
        testEl.textContent = testText;
        testEl.style.fontSize = "12px";
        testEl.style.fontFamily = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Microsoft JhengHei", "SimSun", "SimHei", "STSong", "STKaiti", "STFangsong", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans CJK SC", "Noto Sans SC", "WenQuanYi Micro Hei", sans-serif';
        testEl.style.position = "absolute";
        testEl.style.opacity = "0";
        testEl.style.visibility = "hidden";
        document.body.appendChild(testEl);
        
        const computedStyle = window.getComputedStyle(testEl);
        const fontFamily = computedStyle.fontFamily;
        const actualFont = document.fonts.check(`12px ${fontFamily}`);
        
        testEl.remove();
        
        return {
          fontFamily,
          fontLoaded: actualFont,
          hasChinese: /[\u4e00-\u9fa5]/.test(testText),
        };
      });

      if (process.env.NODE_ENV === "development") {
        console.log("🔤 字体检查:", fontCheck);
      }

      // 再等待一次确保所有样式已应用
      await page.waitForTimeout(500);

      // 调试模式：可选地保存HTML到文件（仅开发环境）
      if (
        process.env.NODE_ENV === "development" &&
        process.env.SAVE_DEBUG_HTML === "true"
      ) {
        const fs = await import("fs");
        const path = await import("path");
        const debugDir = path.join(process.cwd(), "debug");
        if (!fs.existsSync(debugDir)) {
          fs.mkdirSync(debugDir, { recursive: true });
        }
        const debugFile = path.join(debugDir, `pdf-debug-${Date.now()}.html`);
        fs.writeFileSync(debugFile, html, "utf-8");
        console.log(`📄 调试HTML已保存到: ${debugFile}`);
      }

      // 调试日志
      if (process.env.NODE_ENV === "development") {
        console.log("📊 PDF生成参数:", {
          margin,
          stylesLength: styles?.length || 0,
          contentLength: content.length,
          viewport: await page.viewport(),
        });
      }

      // 生成PDF
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: `${margin}px`,
          right: `${margin}px`,
          bottom: `${margin}px`,
          left: `${margin}px`,
        },
        preferCSSPageSize: false,
        displayHeaderFooter: false,
      });

      // 关闭浏览器
      await browser.close();

      // 返回PDF文件
      return new NextResponse(pdf, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="resume.pdf"',
          "Cache-Control": "no-cache",
        },
      });
    } catch (error) {
      // 确保关闭浏览器
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
      throw error;
    }
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * 处理OPTIONS请求（CORS预检）
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
