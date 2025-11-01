#!/usr/bin/env node

/**
 * 使用 Puppeteer 打开并测试 PDF 调试文件
 *
 * 使用方法:
 * node scripts/test-pdf-debug.js [html文件路径]
 *
 * 示例:
 * node scripts/test-pdf-debug.js debug/pdf-debug-1762006563035.html
 */

const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

async function main() {
  // 获取 HTML 文件路径
  const htmlPath = process.argv[2] || "debug/pdf-debug-1762006563035.html";

  if (!fs.existsSync(htmlPath)) {
    console.error(`❌ 文件不存在: ${htmlPath}`);
    console.log("\n💡 提示: 请先启用调试模式生成 HTML 文件");
    console.log("   设置环境变量: SAVE_DEBUG_HTML=true");
    console.log("   或使用调试模式导出 PDF");
    process.exit(1);
  }

  console.log(`📄 读取文件: ${htmlPath}`);
  const htmlContent = fs.readFileSync(htmlPath, "utf-8");

  // 查找 Chrome 路径
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

  let executablePath = null;
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

  if (!executablePath && process.env.CHROME_PATH) {
    executablePath = process.env.CHROME_PATH;
  }

  if (!executablePath) {
    console.error("❌ 未找到 Chrome/Chromium 安装路径");
    console.log("\n💡 提示: 请设置环境变量 CHROME_PATH 指向 Chrome 可执行文件");
    console.log(
      "   例如: export CHROME_PATH=/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome"
    );
    process.exit(1);
  }

  console.log(`🌐 使用 Chrome: ${executablePath}`);

  // 启动浏览器
  console.log("🚀 启动浏览器...");
  const browser = await puppeteer.launch({
    executablePath,
    headless: false, // 显示浏览器窗口，方便调试
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: null, // 使用默认视口，不限制大小
  });

  try {
    const page = await browser.newPage();

    // 先设置一个较大的视口以查看完整内容
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 1,
    });

    // 监听控制台消息
    page.on("console", (msg) => {
      const type = msg.type();
      const text = msg.text();
      const icons = {
        log: "📝",
        error: "❌",
        warning: "⚠️",
        info: "ℹ️",
      };
      console.log(`${icons[type] || "  "} [${type}] ${text}`);
    });

    // 监听页面错误
    page.on("pageerror", (error) => {
      console.error("❌ 页面错误:", error.message);
    });

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

    // 加载 HTML 内容
    console.log("📖 加载 HTML 内容...");
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // 等待字体加载
    console.log("⏳ 等待字体加载...");
    await page.evaluate(async () => {
      await document.fonts.ready;
      console.log("✅ 字体加载完成");
    });

    // 等待渲染
    await page.waitForTimeout(2000);

    // 获取实际内容高度并调整视口
    console.log("📏 测量内容高度...");
    const contentDimensions = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;

      // 获取实际内容高度
      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );

      // 获取实际内容宽度
      const width = Math.max(
        body.scrollWidth,
        body.offsetWidth,
        html.clientWidth,
        html.scrollWidth,
        html.offsetWidth,
        1200 // 最小宽度
      );

      return { width, height };
    });

    console.log(
      `📐 内容尺寸: ${contentDimensions.width}px × ${contentDimensions.height}px`
    );

    // 调整视口以显示完整内容（留一些边距）
    const viewportHeight = Math.min(contentDimensions.height + 100, 3000); // 最大3000px
    await page.setViewport({
      width: Math.max(contentDimensions.width, 1200),
      height: viewportHeight,
      deviceScaleFactor: 1,
    });

    // 滚动到顶部
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });

    console.log(
      `✅ 视口已调整为: ${Math.max(
        contentDimensions.width,
        1200
      )}px × ${viewportHeight}px`
    );

    // 检查文字可见性
    console.log("🔍 检查文字可见性...");
    const textIssues = await page.evaluate(() => {
      const issues = [];
      const allElements = document.querySelectorAll(
        "p, span, div, h1, h2, h3, h4, h5, h6, li, a, td, th"
      );

      allElements.forEach((el) => {
        const style = window.getComputedStyle(el);
        const text = el.textContent?.trim();

        if (text && text.length > 0) {
          if (style.opacity === "0" || style.visibility === "hidden") {
            issues.push({
              element: el.tagName,
              text: text.substring(0, 50),
              issue: `${style.opacity === "0" ? "opacity: 0" : ""} ${
                style.visibility === "hidden" ? "visibility: hidden" : ""
              }`,
            });
          }

          const color = style.color;
          if (color === "rgba(0, 0, 0, 0)" || color === "transparent") {
            issues.push({
              element: el.tagName,
              text: text.substring(0, 50),
              issue: `color: ${color}`,
            });
          }
        }
      });

      return issues;
    });

    if (textIssues.length > 0) {
      console.log(`\n⚠️  发现 ${textIssues.length} 个文字可见性问题:`);
      textIssues.slice(0, 10).forEach((issue, i) => {
        console.log(
          `   ${i + 1}. [${issue.element}] ${issue.text} - ${issue.issue}`
        );
      });
      if (textIssues.length > 10) {
        console.log(`   ... 还有 ${textIssues.length - 10} 个问题`);
      }
    } else {
      console.log("✅ 未发现文字可见性问题");
    }

    // 生成 PDF 测试（使用A4视口）
    console.log("\n📄 生成测试 PDF...");
    const pdfPath = path.join(
      path.dirname(htmlPath),
      `test-${path.basename(htmlPath, ".html")}.pdf`
    );

    // 临时设置为A4尺寸用于PDF生成
    console.log("  🔄 切换到A4视口...");
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2,
    });

    // 等待视口切换完成
    await page.waitForTimeout(1000);

    // 确保字体重新加载
    console.log("  ⏳ 等待字体重新加载...");
    await page.evaluate(async () => {
      await document.fonts.ready;
      // 强制重新计算样式
      const root = document.documentElement;
      root.style.display = "none";
      root.offsetHeight; // 触发重排
      root.style.display = "";
    });

    // 等待渲染完成
    await page.waitForTimeout(1000);

    // 将CSS变量转换为实际值（PDF渲染可能不支持CSS变量）
    console.log("  🔄 转换CSS变量为实际值...");
    await page.evaluate(() => {
      // 获取所有元素
      const allElements = document.querySelectorAll("*");
      allElements.forEach((el) => {
        const computedStyle = window.getComputedStyle(el);
        const inlineStyle = el.style;

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

    // 再次等待渲染
    await page.waitForTimeout(500);

    // 再次确保所有文本都可见（视口切换后可能需要重新检查）
    console.log("  🔍 检查文字可见性（PDF模式）...");
    const textFixStats = await page.evaluate(() => {
      let fixedCount = 0;
      let transparentCount = 0;

      // 修复可能的opacity或visibility问题
      const allElements = document.querySelectorAll("*");
      allElements.forEach((el) => {
        const style = window.getComputedStyle(el);
        const text = el.textContent?.trim();

        if (text && text.length > 0) {
          // 修复opacity和visibility
          if (style.opacity === "0" || style.visibility === "hidden") {
            el.style.opacity = "1";
            el.style.visibility = "visible";
            fixedCount++;
          }

          // 确保颜色不是透明
          const color = style.color;
          if (color === "rgba(0, 0, 0, 0)" || color === "transparent") {
            // 尝试从父元素继承颜色
            let parent = el.parentElement;
            while (parent && parent !== document.body) {
              const parentColor = window.getComputedStyle(parent).color;
              if (
                parentColor !== "rgba(0, 0, 0, 0)" &&
                parentColor !== "transparent"
              ) {
                el.style.color = parentColor;
                fixedCount++;
                break;
              }
              parent = parent.parentElement;
            }
            // 如果还是透明，设置为黑色
            if (
              window.getComputedStyle(el).color === "rgba(0, 0, 0, 0)" ||
              window.getComputedStyle(el).color === "transparent"
            ) {
              el.style.color = "#000000";
              transparentCount++;
            }
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
                el.style.backgroundColor = parentBg;
              }
            }
          }
        }
      });

      // 强制触发重绘
      document.body.offsetHeight;

      return { fixedCount, transparentCount };
    });

    if (textFixStats.fixedCount > 0 || textFixStats.transparentCount > 0) {
      console.log(
        `  ⚠️  修复了 ${textFixStats.fixedCount} 个可见性问题，${textFixStats.transparentCount} 个透明文字`
      );
    } else {
      console.log("  ✅ 未发现文字可见性问题");
    }

    await page.waitForTimeout(500);

    console.log("  📝 生成PDF文件...");
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "32px",
        right: "32px",
        bottom: "32px",
        left: "32px",
      },
      preferCSSPageSize: false,
      displayHeaderFooter: false,
    });

    // 恢复大视口以便查看
    await page.setViewport({
      width: Math.max(contentDimensions.width, 1200),
      height: viewportHeight,
      deviceScaleFactor: 1,
    });

    console.log(`✅ PDF 已保存到: ${pdfPath}`);

    // 统计信息
    const stats = await page.evaluate(() => {
      return {
        totalElements: document.querySelectorAll("*").length,
        textElements: document.querySelectorAll(
          "p, span, div, h1, h2, h3, h4, h5, h6, li"
        ).length,
        images: document.querySelectorAll("img").length,
        fonts: Array.from(document.fonts).map((f) => f.family),
      };
    });

    console.log("\n📊 页面统计:");
    console.log(`   总元素数: ${stats.totalElements}`);
    console.log(`   文本元素: ${stats.textElements}`);
    console.log(`   图片数: ${stats.images}`);
    console.log(`   字体: ${stats.fonts.join(", ")}`);

    console.log("\n💡 提示:");
    console.log("   1. 浏览器窗口已打开，您可以手动检查页面");
    console.log("   2. 按任意键关闭浏览器并退出");
    console.log("   3. 检查生成的 PDF 文件查看效果");

    // 等待用户输入（仅在交互模式下）
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on("data", () => {
        process.stdin.setRawMode(false);
        process.stdin.pause();
      });

      await new Promise((resolve) => {
        process.stdin.once("data", () => {
          resolve();
        });
      });
    } else {
      // 非交互模式，等待 10 秒
      console.log("   等待 10 秒后自动关闭...");
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  } catch (error) {
    console.error("❌ 错误:", error);
  } finally {
    await browser.close();
    console.log("\n👋 已关闭浏览器");
  }
}

main().catch((error) => {
  console.error("❌ 执行失败:", error);
  process.exit(1);
});
