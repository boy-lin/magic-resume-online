/**
 * 图片代理客户端工具函数
 * 提供便捷的API来使用图片代理服务
 */

export interface ImageProxyOptions {
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
  output?: "buffer" | "base64" | "json";
}

export interface ImageProxyResponse {
  success: boolean;
  data?: string;
  format?: string;
  size?: number;
  originalUrl?: string;
  processed?: boolean;
  error?: string;
}

/**
 * 构建图片代理URL
 */
export function buildImageProxyUrl(options: ImageProxyOptions): string {
  const params = new URLSearchParams();

  // 必需参数
  params.set("url", options.url);

  // 可选参数
  if (options.width) params.set("w", options.width.toString());
  if (options.height) params.set("h", options.height.toString());
  if (options.quality) params.set("q", options.quality.toString());
  if (options.format) params.set("f", options.format);
  if (options.fit) params.set("fit", options.fit);
  if (options.gravity) params.set("g", options.gravity);
  if (options.blur) params.set("blur", options.blur.toString());
  if (options.sharpen) params.set("sharpen", options.sharpen.toString());
  if (options.rotate) params.set("rotate", options.rotate.toString());
  if (options.flip) params.set("flip", options.flip);
  if (options.flop) params.set("flop", options.flop);
  if (options.output) params.set("output", options.output);

  return `/api/images/proxy?${params.toString()}`;
}

/**
 * 获取图片的base64数据
 */
export async function getImageBase64(
  options: Omit<ImageProxyOptions, "output">
): Promise<string> {
  try {
    const response = await fetch(
      buildImageProxyUrl({ ...options, output: "base64" })
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ImageProxyResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to get image base64");
    }

    return result.data;
  } catch (error) {
    console.error("Error getting image base64:", error);
    throw error;
  }
}

/**
 * 获取图片的JSON响应（包含详细信息）
 */
export async function getImageInfo(
  options: Omit<ImageProxyOptions, "output">
): Promise<ImageProxyResponse> {
  try {
    const response = await fetch(
      buildImageProxyUrl({ ...options, output: "json" })
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ImageProxyResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to get image info");
    }

    return result;
  } catch (error) {
    console.error("Error getting image info:", error);
    throw error;
  }
}

/**
 * 获取图片的Blob数据
 */
export async function getImageBlob(
  options: Omit<ImageProxyOptions, "output">
): Promise<Blob> {
  try {
    const response = await fetch(
      buildImageProxyUrl({ ...options, output: "buffer" })
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("Error getting image blob:", error);
    throw error;
  }
}

/**
 * 创建图片元素并设置src
 */
export function createImageElement(
  options: ImageProxyOptions
): HTMLImageElement {
  const img = new Image();
  img.src = buildImageProxyUrl(options);
  return img;
}

/**
 * 预加载图片
 */
export function preloadImage(options: ImageProxyOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = createImageElement(options);
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load image"));
  });
}

/**
 * 批量预加载图片
 */
export async function preloadImages(
  optionsList: ImageProxyOptions[]
): Promise<void[]> {
  return Promise.all(optionsList.map((options) => preloadImage(options)));
}

/**
 * 图片代理工具类
 */
export class ImageProxy {
  private baseUrl: string;

  constructor(baseUrl: string = "/api/images/proxy") {
    this.baseUrl = baseUrl;
  }

  /**
   * 获取图片base64
   */
  async getBase64(options: Omit<ImageProxyOptions, "output">): Promise<string> {
    return getImageBase64(options);
  }

  /**
   * 获取图片信息
   */
  async getInfo(
    options: Omit<ImageProxyOptions, "output">
  ): Promise<ImageProxyResponse> {
    return getImageInfo(options);
  }

  /**
   * 获取图片blob
   */
  async getBlob(options: Omit<ImageProxyOptions, "output">): Promise<Blob> {
    return getImageBlob(options);
  }

  /**
   * 构建URL
   */
  buildUrl(options: ImageProxyOptions): string {
    return buildImageProxyUrl(options);
  }

  /**
   * 创建图片元素
   */
  createImage(options: ImageProxyOptions): HTMLImageElement {
    return createImageElement(options);
  }

  /**
   * 预加载图片
   */
  preload(options: ImageProxyOptions): Promise<void> {
    return preloadImage(options);
  }
}

// 默认实例
export const imageProxy = new ImageProxy();

/**
 * 使用示例：
 *
 * // 1. 获取base64数据
 * const base64 = await getImageBase64({
 *   url: "https://example.com/image.jpg",
 *   width: 300,
 *   height: 200,
 *   quality: 90
 * });
 *
 * // 2. 获取详细信息
 * const info = await getImageInfo({
 *   url: "https://example.com/image.jpg",
 *   format: "webp",
 *   blur: 5
 * });
 *
 * // 3. 获取blob数据
 * const blob = await getImageBlob({
 *   url: "https://example.com/image.jpg",
 *   width: 300,
 *   height: 200
 * });
 *
 * // 4. 构建URL
 * const url = buildImageProxyUrl({
 *   url: "https://example.com/image.jpg",
 *   width: 300,
 *   height: 200,
 *   quality: 90
 * });
 *
 * // 5. 创建图片元素
 * const img = createImageElement({
 *   url: "https://example.com/image.jpg",
 *   width: 300,
 *   height: 200
 * });
 * document.body.appendChild(img);
 *
 * // 6. 预加载图片
 * await preloadImage({
 *   url: "https://example.com/image.jpg",
 *   width: 300,
 *   height: 200
 * });
 *
 * // 7. 使用工具类
 * const proxy = new ImageProxy();
 * const base64 = await proxy.getBase64({
 *   url: "https://example.com/image.jpg",
 *   width: 300,
 *   height: 200
 * });
 */
