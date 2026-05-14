import { getBaseURL } from "@/utils/request";
import { message } from "antd";

/**
 * 流式生成提示词的回调函数类型
 */
export type OnChunkCallback = (chunk: string) => void;

/**
 * 流式生成提示词的配置选项
 */
export interface StreamGenerateOptions {
  /** 请求参数（role 和 tone） */
  params: {
    role: string;
    tone: string;
  };
  /** 接收到每个数据块时的回调 */
  onChunk: OnChunkCallback;
  /** 生成开始时的回调 */
  onStart?: () => void;
  /** 生成完成时的回调 */
  onComplete?: (fullText: string) => void;
  /** 生成失败时的回调 */
  onError?: (error: Error) => void;
}

/**
 * 流式生成提示词
 * @param options 配置选项
 */
export const streamGeneratePrompt = async (
  options: StreamGenerateOptions,
): Promise<void> => {
  const { params, onChunk, onStart, onComplete, onError } = options;

  try {
    // 调用开始回调
    onStart?.();

    const response = await fetch(`${getBaseURL()}/ai/promptEngine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;
    let accumulatedText = "";

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;

      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        // SSE 格式通常每行以 data: 开头，可能包含多个事件在一个块中
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const content = line.slice(6); // 去除 "data: " 前缀
            // 如果内容是 [DONE] 或其他结束标记，可以根据后端约定处理
            if (content === "[DONE]") {
              done = true;
              break;
            }
            const data = JSON.parse(content);
            accumulatedText += data.content;
            // 调用 chunk 回调
            onChunk(data.content);
          } else if (line.startsWith("data:")) {
            // 处理 data: 后直接跟内容的情况（较少见，但兼容）
            const content = line.slice(5);
            if (content === "[DONE]") {
              done = true;
              break;
            }
            const data = JSON.parse(content);
            accumulatedText += data.content;
            // 调用 chunk 回调
            onChunk(data.content);
          }
        }
      }
    }

    // 调用完成回调
    onComplete?.(accumulatedText);
  } catch (error) {
    console.error("流式生成失败:", error);
    message.error("生成失败，请重试");
    // 调用错误回调
    onError?.(error as Error);
  }
};
