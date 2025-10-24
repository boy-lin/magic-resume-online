import { extractImageUrl } from "./utils";

export async function generateImage(
  data: { model?: string; prompt: string; imgs: string[] },
  onDelta?: (deltaText: string, rawChunk?: any) => void
) {
  // 调用服务端接口
  const response = await fetch("/api/demo/gen-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.prompt,
      images: data.imgs,
      stream: true, // 启用流式响应
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // 检查响应类型
  const contentType = response.headers.get("content-type");
  const isStreaming = contentType?.includes("text/event-stream");

  if (isStreaming) {
    // 处理流式响应
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("无法获取响应流读取器");
    }

    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    const allChunks: any[] = [];
    let fullContent = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE 事件通常以两个换行作为分隔
        const parts = buffer.split(/\n\n/);
        // 留下最后一段在缓冲区，避免切断包
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          // 只处理以 data: 开头的行
          const lines = part.split(/\n/);
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const dataStr = trimmed.replace(/^data:\s*/, "").trim();
            if (dataStr === "[DONE]") {
              // 结束信号
              break;
            }
            try {
              const chunk = JSON.parse(dataStr);
              allChunks.push(chunk);
              const delta = chunk?.choices?.[0]?.delta ?? {};
              if (typeof delta.content === "string") {
                fullContent += delta.content;
                onDelta?.(delta.content, chunk);
              }
            } catch (e) {
              // 非 JSON 行忽略
              console.warn("解析数据块失败:", dataStr, e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock(); // 确保释放读取器
    }
    console.log("fullContent", fullContent);
    const imageUrl = extractImageUrl(fullContent);
    return imageUrl;
  } else {
    // 处理普通JSON响应
    const resJson = await response.json();
    if (resJson.code === 0 && resJson.data) {
      return extractImageUrl(resJson.data?.content);
    }
    throw new Error(resJson.message || "生成失败");
  }
}
