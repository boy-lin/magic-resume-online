/**
 * 从文本中提取图片URL，优先解析 Markdown 图片语法，其次解析裸链接
 * @param text 包含图片URL的文本
 * @returns 提取到的图片URL，如果没有找到则返回null
 * By Cursor
 */
export function extractImageUrl(text: string): string | null {
  // 清理输入文本
  const cleanText = (text || "").trim();
  if (!cleanText) return null;
  // 1) Markdown 图片: ![alt](url)
  const mdImg = cleanText.match(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/i);
  if (mdImg && mdImg[1]) {
    const url = mdImg[1];
    return url;
  }
  // // 2) key:value 形式（image: / url: / src: / link:）
  // const kvPatterns: RegExp[] = [
  //   /(?:^|\s|,|\n)image\s*:\s*(https?:\/\/[^\s,\n`]+)/i,
  //   /(?:^|\s|,|\n)url\s*:\s*(https?:\/\/[^\s,\n`]+)/i,
  //   /(?:^|\s|,|\n)src\s*:\s*(https?:\/\/[^\s,\n`]+)/i,
  //   /(?:^|\s|,|\n)link\s*:\s*(https?:\/\/[^\s,\n`]+)/i,
  //   /response_format\s*:\s*url[^,]*,\s*(https?:\/\/[^\s,\n`]+)/i,
  // ];
  // for (const re of kvPatterns) {
  //   const m = cleanText.match(re);
  //   if (m && m[1]) return m[1];
  // }
  // // 3) 通用兜底：捕获首个 http(s) URL，并清理尾部异常符号
  // const any = cleanText.match(/https?:\/\/[^\s)\]\}"'>]+/i);
  // if (any && any[0]) {
  //   let candidate = any[0]
  //     .replace(/[\]\};]+$/, "")
  //     .replace(/["']+$/, "")
  //     .replace(/^["']+/, "");
  //   if (candidate) return candidate;
  // }
  // // 4) JSON结构兜底："url":"..." 或 "image":"..."
  // const jsonUrl = cleanText.match(/"url"\s*:\s*"([^"]+)"/i);
  // if (jsonUrl && jsonUrl[1]) return jsonUrl[1];
  // const jsonImage = cleanText.match(/"image"\s*:\s*"([^"]+)"/i);
  // if (jsonImage && jsonImage[1]) return jsonImage[1];

  return null;
}

/**
 * 验证图片URL的有效性
 * @param url 待验证的URL字符串
 * @returns 是否为有效的图片URL
 * By Cursor
 */
export function isValidImageUrl(url: string): boolean {
  console.log("isValidImageUrl", url);
  try {
    // 基本URL格式验证
    const urlObj = new URL(url);

    // 检查协议
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return false;
    }

    // 检查域名
    if (!urlObj.hostname || urlObj.hostname.length < 3) {
      return false;
    }

    // 检查路径
    if (!urlObj.pathname || urlObj.pathname.length < 1) {
      return false;
    }

    // 检查是否包含明显的损坏字符和HTML实体
    if (
      url.includes("&quot;") ||
      url.includes("&#39;") ||
      url.includes("&lt;") ||
      url.includes("&gt;") ||
      url.includes("&amp;") ||
      url.includes("&nbsp;")
    ) {
      return false;
    }

    // 检查是否包含不完整的引号或括号
    if (url.includes('"') && !url.includes('"', url.indexOf('"') + 1)) {
      return false;
    }

    // 检查是否以损坏的字符结尾
    if (url.match(/[\]\};"']+$/)) {
      return false;
    }

    // 检查是否包含明显的JSON结构残留
    if (
      url.includes("{") ||
      url.includes("}") ||
      url.includes("[") ||
      url.includes("]")
    ) {
      return false;
    }

    // 检查URL长度合理性（通常图片URL不会超过500字符）
    if (url.length > 500) {
      return false;
    }

    // 检查URL是否包含有效的文件扩展名（可选）
    const validExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".bmp",
    ];
    const hasValidExtension = validExtensions.some((ext) =>
      urlObj.pathname.toLowerCase().includes(ext)
    );

    // 如果没有有效扩展名，检查是否包含常见的图片服务域名
    const imageServiceDomains = [
      "cdn",
      "images",
      "img",
      "static",
      "media",
      "assets",
    ];
    const hasImageServiceDomain = imageServiceDomains.some((domain) =>
      urlObj.hostname.toLowerCase().includes(domain)
    );

    // 如果既没有有效扩展名，也没有图片服务域名，则可能不是有效的图片URL
    if (!hasValidExtension && !hasImageServiceDomain) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * 验证SSE数据块的完整性
 * @param chunk SSE数据块对象
 * @returns 数据块是否完整有效
 * By Cursor
 */
export function isValidChunk(chunk: any): boolean {
  try {
    // 检查基本结构
    if (!chunk || typeof chunk !== "object") {
      return false;
    }

    // 检查必要的字段
    if (
      !chunk.choices ||
      !Array.isArray(chunk.choices) ||
      chunk.choices.length === 0
    ) {
      return false;
    }

    // 检查choices[0]的结构
    const choice = chunk.choices[0];
    if (!choice || typeof choice !== "object") {
      return false;
    }

    // 检查delta字段
    if (!choice.delta || typeof choice.delta !== "object") {
      return false;
    }

    // 检查content字段（如果存在）
    if (
      choice.delta.content !== undefined &&
      typeof choice.delta.content !== "string"
    ) {
      return false;
    }

    // 检查content内容是否包含损坏的字符
    if (choice.delta.content && typeof choice.delta.content === "string") {
      const content = choice.delta.content;

      // 检查是否包含不完整的引号
      if (
        content.includes('"') &&
        !content.includes('"', content.indexOf('"') + 1)
      ) {
        return false;
      }

      // 检查是否包含明显的JSON结构残留
      if (
        content.includes("{") ||
        content.includes("}") ||
        content.includes("[") ||
        content.includes("]")
      ) {
        return false;
      }

      // 检查是否包含损坏的URL字符
      if (
        content.includes("&quot;") ||
        content.includes("&#39;") ||
        content.includes("&lt;") ||
        content.includes("&gt;")
      ) {
        return false;
      }
    }

    // 检查是否包含明显的错误字段
    if (chunk.error || chunk.error_message || chunk.error_code) {
      return false;
    }

    // 检查choices数组是否包含损坏的choice
    for (const choice of chunk.choices) {
      if (!choice || typeof choice !== "object") {
        return false;
      }

      // 检查finish_reason字段（如果存在）
      if (
        choice.finish_reason !== undefined &&
        choice.finish_reason !== null &&
        typeof choice.finish_reason !== "string"
      ) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}
