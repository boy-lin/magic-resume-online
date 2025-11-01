import { NextRequest, NextResponse } from "next/server";

// 配置常量
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const FETCH_TIMEOUT = 10000; // 10秒
const CACHE_MAX_AGE = 31536000; // 1年

// 允许的图片格式
const ALLOWED_FORMATS = ["jpeg", "png", "webp"] as const;
type ImageFormat = (typeof ALLOWED_FORMATS)[number];

// 允许的fit选项
const ALLOWED_FIT = ["cover", "contain", "fill", "inside", "outside"] as const;
type FitOption = (typeof ALLOWED_FIT)[number];

// 允许的重力选项
const ALLOWED_GRAVITY = ["top", "bottom", "left", "right", "center"] as const;
type GravityOption = (typeof ALLOWED_GRAVITY)[number];

// 输出类型
type OutputType = "buffer" | "base64" | "json";

// 解析和验证参数
interface ImageProxyParams {
  url: string;
  width?: number;
  height?: number;
  quality: number;
  format: ImageFormat;
  fit: FitOption;
  gravity: GravityOption;
  blur?: number;
  sharpen?: number;
  rotate?: number;
  flip?: "horizontal" | "vertical";
  flop?: "horizontal" | "vertical";
  output: OutputType;
}

/**
 * 验证URL是否安全（防止SSRF攻击）
 */
function isUrlSafe(url: URL): boolean {
  const protocol = url.protocol.toLowerCase();
  // 只允许 http 和 https
  if (protocol !== "http:" && protocol !== "https:") {
    return false;
  }

  // 禁止本地/内网地址
  const hostname = url.hostname.toLowerCase();
  const localHosts = [
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "::1",
    "localhost.localdomain",
  ];

  if (localHosts.includes(hostname)) {
    return false;
  }

  // 禁止私有IP地址段
  const privateIpPatterns = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^169\.254\./,
    /^fc00:/,
    /^fe80:/,
  ];

  for (const pattern of privateIpPatterns) {
    if (pattern.test(hostname)) {
      return false;
    }
  }

  return true;
}

/**
 * 解析和验证查询参数
 */
function parseParams(searchParams: URLSearchParams): ImageProxyParams | null {
  const url = searchParams.get("url");
  console.log("url22", url);

  if (!url) return null;
  // 验证URL格式
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return null;
  }

  // 验证URL安全性
  if (!isUrlSafe(parsedUrl)) {
    return null;
  }

  // 解析宽度和高度
  const width = searchParams.get("w")
    ? Math.max(1, Math.min(10000, parseInt(searchParams.get("w")!)))
    : undefined;
  const height = searchParams.get("h")
    ? Math.max(1, Math.min(10000, parseInt(searchParams.get("h")!)))
    : undefined;

  // 解析质量
  const quality = Math.max(
    1,
    Math.min(100, parseInt(searchParams.get("q") || "80"))
  );

  // 解析格式
  const formatParam = searchParams.get("f");
  const format: ImageFormat = ALLOWED_FORMATS.includes(
    formatParam as ImageFormat
  )
    ? (formatParam as ImageFormat)
    : "jpeg";

  // 解析fit
  const fitParam = searchParams.get("fit");
  const fit: FitOption = ALLOWED_FIT.includes(fitParam as FitOption)
    ? (fitParam as FitOption)
    : "cover";

  // 解析gravity
  const gravityParam = searchParams.get("g");
  const gravity: GravityOption = ALLOWED_GRAVITY.includes(
    gravityParam as GravityOption
  )
    ? (gravityParam as GravityOption)
    : "center";

  // 解析blur
  const blur = searchParams.get("blur")
    ? Math.max(0, Math.min(1000, parseInt(searchParams.get("blur")!)))
    : undefined;

  // 解析sharpen
  const sharpen = searchParams.get("sharpen")
    ? Math.max(0, Math.min(1000, parseInt(searchParams.get("sharpen")!)))
    : undefined;

  // 解析rotate
  const rotate = searchParams.get("rotate")
    ? parseInt(searchParams.get("rotate")!)
    : undefined;

  // 解析flip和flop
  const flipParam = searchParams.get("flip");
  const flip: "horizontal" | "vertical" | undefined =
    flipParam === "horizontal" || flipParam === "vertical"
      ? flipParam
      : undefined;

  const flopParam = searchParams.get("flop");
  const flop: "horizontal" | "vertical" | undefined =
    flopParam === "horizontal" || flopParam === "vertical"
      ? flopParam
      : undefined;

  // 解析output
  const outputParam = searchParams.get("output") || "buffer";
  const output: OutputType =
    outputParam === "base64" || outputParam === "json" ? outputParam : "buffer";

  return {
    url,
    width,
    height,
    quality,
    format,
    fit,
    gravity,
    blur,
    sharpen,
    rotate,
    flip,
    flop,
    output,
  };
}

/**
 * 获取公共响应头
 */
function getCommonHeaders(contentType: string) {
  return {
    "Content-Type": contentType,
    "Cache-Control": `public, max-age=${CACHE_MAX_AGE}`,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

/**
 * 获取MIME类型
 */
function getMimeType(format: string): string {
  switch (format) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    default:
      return "image/jpeg";
  }
}

/**
 * 从MIME类型获取格式
 */
function getFormatFromMimeType(mimeType: string): ImageFormat {
  if (mimeType.includes("png")) return "png";
  if (mimeType.includes("webp")) return "webp";
  return "jpeg";
}

/**
 * 判断是否需要图片处理
 */
function needsProcessing(params: ImageProxyParams): boolean {
  return !!(
    params.width ||
    params.height ||
    params.quality !== 80 ||
    params.format !== "jpeg" ||
    params.fit !== "cover" ||
    params.gravity !== "center" ||
    params.blur ||
    params.sharpen ||
    params.rotate ||
    params.flip ||
    params.flop
  );
}

/**
 * 创建JSON响应（base64或json输出）
 */
function createJsonResponse(
  buffer: Buffer,
  contentType: string,
  format: ImageFormat,
  originalUrl: string,
  processed: boolean,
  output: OutputType
): NextResponse {
  const base64 = buffer.toString("base64");
  const mimeType =
    output === "base64" || output === "json"
      ? getMimeType(format)
      : contentType;

  const response: any = {
    success: true,
    data: `data:${mimeType};base64,${base64}`,
    format:
      output === "base64" || output === "json"
        ? format
        : getFormatFromMimeType(contentType),
    size: buffer.length,
  };

  if (output === "json") {
    response.originalUrl = originalUrl;
    response.processed = processed;
  }

  return NextResponse.json(response);
}

/**
 * 图片代理服务
 * 支持跨域图片获取、格式转换、尺寸调整等功能
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // 解析和验证参数
    const params = parseParams(searchParams);

    if (!params) {
      return NextResponse.json(
        { error: "Invalid or missing required parameter: url" },
        { status: 400 }
      );
    }

    // 获取原始图片
    let imageResponse: Response;
    try {
      imageResponse = await fetch(params.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ImageProxy/1.0)",
          Accept: "image/*",
          "Accept-Encoding": "gzip, deflate",
        },
        signal: AbortSignal.timeout(FETCH_TIMEOUT),
      });
    } catch (error) {
      if (error instanceof Error && error.name === "TimeoutError") {
        return NextResponse.json({ error: "Request timeout" }, { status: 408 });
      }
      throw error;
    }

    if (!imageResponse.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch image: ${imageResponse.statusText}`,
          status: imageResponse.status,
        },
        { status: imageResponse.status }
      );
    }

    // 验证Content-Type
    const contentType =
      imageResponse.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "URL does not point to an image" },
        { status: 400 }
      );
    }

    // 获取图片数据
    const imageBuffer = await imageResponse.arrayBuffer();

    // 检查图片大小
    if (imageBuffer.byteLength > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: `Image too large. Maximum size: ${MAX_IMAGE_SIZE} bytes` },
        { status: 413 }
      );
    }

    // 如果需要图片处理，使用Sharp库
    if (needsProcessing(params)) {
      try {
        const sharp = (await import("sharp")).default;
        let sharpInstance = sharp(Buffer.from(imageBuffer));

        // 应用变换
        if (params.width || params.height) {
          sharpInstance = sharpInstance.resize(params.width, params.height, {
            fit: params.fit,
            position: params.gravity,
            withoutEnlargement: true,
          });
        }

        if (params.blur) {
          sharpInstance = sharpInstance.blur(params.blur);
        }

        if (params.sharpen) {
          sharpInstance = sharpInstance.sharpen(params.sharpen, 1, 2);
        }

        if (params.rotate) {
          sharpInstance = sharpInstance.rotate(params.rotate);
        }

        if (params.flip) {
          sharpInstance = sharpInstance.flip();
        }

        if (params.flop) {
          sharpInstance = sharpInstance.flop();
        }

        // 设置输出格式和质量
        switch (params.format) {
          case "png":
            sharpInstance = sharpInstance.png({ quality: params.quality });
            break;
          case "webp":
            sharpInstance = sharpInstance.webp({ quality: params.quality });
            break;
          default:
            sharpInstance = sharpInstance.jpeg({ quality: params.quality });
            break;
        }

        const processedBuffer = await sharpInstance.toBuffer();

        // 根据输出类型返回
        if (params.output === "base64" || params.output === "json") {
          return createJsonResponse(
            processedBuffer,
            contentType,
            params.format,
            params.url,
            true,
            params.output
          );
        } else {
          const mimeType = getMimeType(params.format);
          return new NextResponse(Uint8Array.from(processedBuffer), {
            headers: getCommonHeaders(mimeType),
          });
        }
      } catch (sharpError) {
        console.error("Sharp processing error:", sharpError);
        // 如果Sharp处理失败，返回原始图片
        const buffer = Buffer.from(imageBuffer);
        if (params.output === "base64" || params.output === "json") {
          return createJsonResponse(
            buffer,
            contentType,
            getFormatFromMimeType(contentType),
            params.url,
            false,
            params.output
          );
        }
        return new NextResponse(Uint8Array.from(buffer), {
          headers: getCommonHeaders(contentType),
        });
      }
    } else {
      // 不需要处理，直接返回原始图片
      const buffer = Buffer.from(imageBuffer);
      if (params.output === "base64" || params.output === "json") {
        return createJsonResponse(
          buffer,
          contentType,
          getFormatFromMimeType(contentType),
          params.url,
          false,
          params.output
        );
      }
      return new NextResponse(Uint8Array.from(buffer), {
        headers: getCommonHeaders(contentType),
      });
    }
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
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
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

/**
 * 使用示例：
 *
 * 1. 获取原始图片：
 * GET /api/images/proxy?url=https://example.com/image.jpg
 *
 * 2. 调整尺寸：
 * GET /api/images/proxy?url=https://example.com/image.jpg&w=300&h=200
 *
 * 3. 获取base64：
 * GET /api/images/proxy?url=https://example.com/image.jpg&output=base64
 *
 * 4. 格式转换：
 * GET /api/images/proxy?url=https://example.com/image.jpg&f=webp&q=90
 *
 * 5. 图片处理：
 * GET /api/images/proxy?url=https://example.com/image.jpg&w=300&h=200&blur=5&rotate=90
 *
 * 6. 获取JSON响应：
 * GET /api/images/proxy?url=https://example.com/image.jpg&output=json
 */
