import { getBaseURL } from "@/utils/request";
import { OpenAIOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useRef, useState } from "react";
import { styled } from "styled-components";

const InputAreaWrapper = styled.div`
  position: relative;
  background-color: #f5f5f5;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;

  .ant-input {
    height: 100%;
    color: #000 !important; // 强制黑色字体
    background: #fff !important;
    caret-color: #000;
  }

  .oper-btn {
    position: absolute;
    right: 20px;
    bottom: 20px;
    z-index: 999;
  }
`;

const InputArea = () => {
  const [promptValue, setPromptValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 中断请求
  const controllerRef = useRef<AbortController | null>(null);

  // AI美化
  const handleAiSSE = async () => {
    if (!promptValue.trim()) {
      return message.warning("请输入文本");
    }

    // 保存用户原始输入
    const userInput = promptValue;

    // 清空文本框，准备流式输出
    setPromptValue("");

    setIsLoading(true);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetch(`${getBaseURL()}/ai/aiForm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userInput,
          userId: JSON.parse(localStorage.getItem("user") || "{}").state
            .userInfo.userId,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("响应流为空");
      }

      const reader = response.body.getReader();

      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, {
          stream: true,
        });

        const lines = buffer.split("\n");

        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const dataStr = line.slice(6);

          // 流结束
          if (dataStr === "[DONE]") {
            setIsLoading(false);
            return;
          }

          try {
            const data = JSON.parse(dataStr);

            if (data.done) {
              setIsLoading(false);
              return;
            }

            // 覆盖式流输出
            setPromptValue((prev) => prev + (data.content || ""));
          } catch (err) {
            console.error("SSE解析失败:", err);
          }
        }
      }
    } catch (error: any) {
      console.error(error);

      if (error.name === "AbortError") {
        message.info("已停止生成");
      } else {
        message.error(
          error?.message || "请求超时，可点击继续，或切换模型后重试",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 停止生成
  const handleStop = () => {
    controllerRef.current?.abort();
    setIsLoading(false);
  };

  return (
    <InputAreaWrapper>
      <div className="oper-btn">
        {isLoading ? (
          <Button onClick={handleStop}>停止生成</Button>
        ) : (
          <Button onClick={handleAiSSE}>
            <OpenAIOutlined />
            AI美化
          </Button>
        )}
      </div>

      <TextArea
        rows={10}
        placeholder="请输入文本"
        value={promptValue}
        onChange={(e) => setPromptValue(e.target.value)}
        style={{
          color: "#000",
          background: "#fff",
        }}
      />
    </InputAreaWrapper>
  );
};

export default InputArea;
