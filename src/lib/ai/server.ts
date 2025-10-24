import OpenAI from "openai";
import type { 
  ChatCompletionCreateParams
} from "openai/resources/chat/completions";
export class AIAdapter {
  private baseUrl: string;
  private apiKey: string;
  client: OpenAI;
  public chat: {
    completions: {
      create: (params: ChatCompletionCreateParams) => Promise<Response>;
    };
  };

  constructor(baseUrl?: string, apiKey?: string) {
    if (!baseUrl || !apiKey) {
      throw new Error("AIAdapter: baseUrl or apiKey is empty");
    }
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;

    this.client = new OpenAI({ apiKey: this.apiKey, baseURL: this.baseUrl });

    // 初始化 chat 对象
    this.chat = {
      completions: {
        create: this.createChatCompletion.bind(this),
      },
    };
  }

  async fetch(url: string, options: RequestInit = {}) {
    const href = `${this.baseUrl}${url}`;
    const startTime = Date.now();
    console.log("AI API Request:", href);
    try {
      const response = await fetch(href, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        redirect: "follow",
        // timeout: 30000, // 30 second timeout - not supported in native fetch
        ...options,
      });

      const responseTime = Date.now() - startTime;
      console.log(`AI API Response Time: ${responseTime}ms`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`AI API HTTP Error (${response.status}):`, errorText);
        throw new Error(
          `AI service HTTP error: ${response.status} ${response.statusText}. Response: ${errorText}`
        );
      }

      return response;
    } catch (error: any) {
      console.error("AI API Network Error:", error);
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          `Network error: Unable to connect to AI service at ${href}. Please check your internet connection.`
        );
      }
      throw error;
    }
  }

  /**
   * 创建聊天补全，与 OpenAI SDK 的 chat.completions.create 方法兼容
   * 支持完整的聊天补全参数，包括多模态输入和高级参数
   * @param params 包含 model, messages 和其他可选参数
   * @returns Promise<Response> 返回响应对象
   * By Cursor
   */
  private async createChatCompletion(
    params: ChatCompletionCreateParams
  ): Promise<Response> {
    const {
      model,
      messages,
      stream = false,
    } = params;

    // 构建请求体，只包含非 undefined 的参数
    const requestBody = {
      model,
      messages,
      stream,
    };

    if (stream) {
      const streamResponse = new TransformStream();
      const writer = streamResponse.writable.getWriter();

      // 流式响应处理 - 使用 OpenAI SDK 并转换为 Response
      this.client.chat.completions.create(requestBody).then(async (stream: any) => {
        if (stream.iterator) {
          // 使用 Stream 的 iterator 方法来获取数据
          const iterator = stream.iterator();
          for await (const chunk of iterator) {
            try {
              // 将每个 chunk 转换为 SSE 格式
              const data = JSON.stringify({
                choices: chunk.choices || [],
              });
              const sseData = `data: ${data}\n\n`;
              // 确保编码为 Uint8Array
              const encodedData = new TextEncoder().encode(sseData);
              writer.write(encodedData);
            } catch (chunkError) {
              // 发送错误信息
              const errorData = new TextEncoder().encode(
                `data: {"error": "chunk processing failed"}\n\n`
              );
              writer.write(errorData);
              writer.close();
            }
          }
        }
        // 流结束时发送 [DONE] 信号
        const doneData = new TextEncoder().encode("data: [DONE]\n\n");
        writer.write(doneData);
        writer.close();
      });
      
      return new Response(streamResponse.readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Connection: "keep-alive",
          "X-Accel-Buffering": "no",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Cache-Control",
        },
      });
      // return this.fetch("/chat/completions", {
      //   method: "POST",
      //   body: JSON.stringify(requestBody),
      // });
    } else {
      // 非流式响应处理 - 使用 OpenAI SDK 并转换为 Response
      const completion = await this.client.chat.completions.create(requestBody);
      return new Response(JSON.stringify(completion), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
}

export default AIAdapter;
