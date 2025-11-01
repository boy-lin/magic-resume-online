import { NextRequest, NextResponse } from "next/server";

// 配置常量
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const FETCH_TIMEOUT = 10000; // 10秒

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
 * 图片代理服务
 * 接收url参数，返回图片的base64数据
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    // 验证必需参数
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Missing required parameter: url" },
        { status: 400 }
      );
    }

    // 验证URL格式
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(imageUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // 验证URL安全性
    if (!isUrlSafe(parsedUrl)) {
      return NextResponse.json(
        { error: "URL is not allowed" },
        { status: 400 }
      );
    }

    // 获取原始图片
    let imageResponse: Response;
    try {
      imageResponse = await fetch(imageUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ImageProxy/1.0)",
          Accept: "image/*",
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
        {
          error: `Image too large. Maximum size: ${MAX_IMAGE_SIZE} bytes`,
        },
        { status: 413 }
      );
    }

    // 转换为base64
    const base64 = Buffer.from(imageBuffer).toString("base64");

    // 返回base64数据
    return NextResponse.json({
      success: true,
      data: `data:${contentType};base64,${base64}`,
      size: imageBuffer.byteLength,
    });
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
 * GET /api/images/proxy?url=https://example.com/image.jpg
 *
 * 返回格式：
 * {
 *   "success": true,
 *   "data": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
 *   "size": 123456
 * }
 */
