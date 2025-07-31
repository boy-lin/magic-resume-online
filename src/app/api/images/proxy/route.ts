import { NextRequest, NextResponse } from "next/server";

interface ProxyOptions {
  url: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: "jpeg" | "png" | "webp";
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  gravity?: "top" | "bottom" | "left" | "right" | "center";
  blur?: number;
  sharpen?: number;
  rotate?: number;
  flip?: "horizontal" | "vertical";
  flop?: "horizontal" | "vertical";
}

/**
 * 图片代理服务
 * 支持跨域图片获取、格式转换、尺寸调整等功能
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");
    const width = searchParams.get("w")
      ? parseInt(searchParams.get("w")!)
      : undefined;
    const height = searchParams.get("h")
      ? parseInt(searchParams.get("h")!)
      : undefined;
    const quality = searchParams.get("q")
      ? parseInt(searchParams.get("q")!)
      : 80;
    const format = (searchParams.get("f") as "jpeg" | "png" | "webp") || "jpeg";
    const fit =
      (searchParams.get("fit") as
        | "cover"
        | "contain"
        | "fill"
        | "inside"
        | "outside") || "cover";
    const gravity =
      (searchParams.get("g") as
        | "top"
        | "bottom"
        | "left"
        | "right"
        | "center") || "center";
    const blur = searchParams.get("blur")
      ? parseInt(searchParams.get("blur")!)
      : undefined;
    const sharpen = searchParams.get("sharpen")
      ? parseInt(searchParams.get("sharpen")!)
      : undefined;
    const rotate = searchParams.get("rotate")
      ? parseInt(searchParams.get("rotate")!)
      : undefined;
    const flip =
      (searchParams.get("flip") as "horizontal" | "vertical") || undefined;
    const flop =
      (searchParams.get("flop") as "horizontal" | "vertical") || undefined;
    const output = searchParams.get("output") || "buffer"; // buffer, base64, json

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
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // 获取原始图片
    const imageResponse = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ImageProxy/1.0)",
        Accept: "image/*",
        "Accept-Encoding": "gzip, deflate",
      },
      // 设置超时
      signal: AbortSignal.timeout(10000), // 10秒超时
    });

    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${imageResponse.statusText}` },
        { status: imageResponse.status }
      );
    }

    // 获取图片数据
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType =
      imageResponse.headers.get("content-type") || "image/jpeg";

    // 如果需要图片处理，使用Sharp库
    if (
      width ||
      height ||
      quality !== 80 ||
      format !== "jpeg" ||
      fit !== "cover" ||
      gravity !== "center" ||
      blur ||
      sharpen ||
      rotate ||
      flip ||
      flop
    ) {
      try {
        const sharp = (await import("sharp")).default;

        let sharpInstance = sharp(Buffer.from(imageBuffer));

        // 应用变换
        if (width || height) {
          sharpInstance = sharpInstance.resize(width, height, {
            fit,
            position: gravity,
            withoutEnlargement: true,
          });
        }

        if (blur) {
          sharpInstance = sharpInstance.blur(blur);
        }

        if (sharpen) {
          sharpInstance = sharpInstance.sharpen(sharpen, 1, 2);
        }

        if (rotate) {
          sharpInstance = sharpInstance.rotate(rotate);
        }

        if (flip) {
          sharpInstance = sharpInstance.flip();
        }

        if (flop) {
          sharpInstance = sharpInstance.flop();
        }

        // 设置输出格式和质量
        switch (format) {
          case "png":
            sharpInstance = sharpInstance.png({ quality });
            break;
          case "webp":
            sharpInstance = sharpInstance.webp({ quality });
            break;
          default:
            sharpInstance = sharpInstance.jpeg({ quality });
            break;
        }

        const processedBuffer = await sharpInstance.toBuffer();

        // 根据输出类型返回不同格式
        if (output === "base64") {
          const base64 = processedBuffer.toString("base64");
          const mimeType = getMimeType(format);
          return NextResponse.json({
            success: true,
            data: `data:${mimeType};base64,${base64}`,
            format,
            size: processedBuffer.length,
          });
        } else if (output === "json") {
          const base64 = processedBuffer.toString("base64");
          const mimeType = getMimeType(format);
          return NextResponse.json({
            success: true,
            data: `data:${mimeType};base64,${base64}`,
            format,
            size: processedBuffer.length,
            originalUrl: imageUrl,
            processed: true,
          });
        } else {
          // 默认返回buffer
          const mimeType = getMimeType(format);
          return new NextResponse(processedBuffer, {
            headers: {
              "Content-Type": mimeType,
              "Cache-Control": "public, max-age=31536000", // 1年缓存
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            },
          });
        }
      } catch (sharpError) {
        console.error("Sharp processing error:", sharpError);
        // 如果Sharp处理失败，返回原始图片
        return new NextResponse(Buffer.from(imageBuffer), {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }
    } else {
      // 不需要处理，直接返回原始图片
      if (output === "base64") {
        const base64 = Buffer.from(imageBuffer).toString("base64");
        return NextResponse.json({
          success: true,
          data: `data:${contentType};base64,${base64}`,
          format: getFormatFromMimeType(contentType),
          size: imageBuffer.byteLength,
        });
      } else if (output === "json") {
        const base64 = Buffer.from(imageBuffer).toString("base64");
        return NextResponse.json({
          success: true,
          data: `data:${contentType};base64,${base64}`,
          format: getFormatFromMimeType(contentType),
          size: imageBuffer.byteLength,
          originalUrl: imageUrl,
          processed: false,
        });
      } else {
        return new NextResponse(Buffer.from(imageBuffer), {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }
    }
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
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
function getFormatFromMimeType(mimeType: string): string {
  if (mimeType.includes("png")) return "png";
  if (mimeType.includes("webp")) return "webp";
  return "jpeg";
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
