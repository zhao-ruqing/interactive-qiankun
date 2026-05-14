import { applyPromptAPI, getPromptsListAPI, savePromptAPI } from "@/api/aiForm";
import {
  DoubleLeftOutlined,
  OpenAIOutlined,
  SaveOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message } from "antd"; // 引入 message 用于提示
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react"; // 引入 useState
import { styled } from "styled-components";
import PromptItem from "./prompt-item";
import { streamGeneratePrompt } from "./stream-generator";

const PromptListWrapper = styled.div`
  padding: 10px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  .input-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .oper-area {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    & > .ant-form-item {
      margin-bottom: 0;
      flex: 1;
    }
    & > button {
      flex-shrink: 0;
    }
  }
  .sample-area {
    width: 100%;
    height: 200px;
  }
  .prompt-list {
    width: 100%;
    height: 250px;
    overflow-y: auto;
    border: 1px solid #e8e8e8;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const PromptEngine = () => {
  const [form] = Form.useForm();
  const [generatedSample, setGeneratedSample] = useState<string>(""); // 状态管理生成的示例
  const [promptList, setPromptList] = useState<
    { id: number; prompt: string; role: string; tone: string }[]
  >([]);

  const handleGenerate = async () => {
    try {
      const values = await form.validateFields();
      console.log("表单值:", values);

      setGeneratedSample(""); // 清空之前的生成内容

      await streamGeneratePrompt({
        params: {
          role: values.role,
          tone: values.tone,
        },
        onChunk: (chunk) => {
          setGeneratedSample((prev) => prev + chunk);
        },
      });
    } catch (errorInfo) {
      console.log("校验失败或请求出错:", errorInfo);
      message.error("生成失败，请重试");
    }
  };

  // 新增: 处理文本框变化
  const handleSampleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGeneratedSample(e.target.value);
  };

  // 存储提示词
  const handleSave = async () => {
    try {
      const isValidate = await form.validateFields();
      if (!isValidate) return;
      const values = {
        prompt: generatedSample,
        role: form.getFieldValue("role"),
        tone: form.getFieldValue("tone"),
        userId: JSON.parse(localStorage.getItem("user") || "{}").state.userInfo
          .userId,
      };
      await savePromptAPI(values);
      console.log("表单值:", values);
      message.success("保存成功");
      fetchPromptsList();
    } catch (errorInfo) {
      console.log("校验失败或保存出错:", errorInfo);
      message.error("保存失败,请重试");
    }
  };
  // 获取提示词列表
  const fetchPromptsList = async () => {
    try {
      const res = await getPromptsListAPI(
        JSON.parse(localStorage.getItem("user") || "{}").state.userInfo.userId,
      );
      setPromptList(res.data || []);
    } catch (error) {
      console.error("获取提示词列表失败:", error);
      message.error("获取提示词列表失败");
    }
  };
  useEffect(() => {
    fetchPromptsList();
  }, []);

  // 处理删除后的刷新
  const handleDelete = (id: number) => {
    setPromptList((prev) => prev.filter((item) => item.id !== id));
  };

  // 处理更新后的刷新
  const handleUpdate = async () => {
    try {
      const res = await getPromptsListAPI(
        JSON.parse(localStorage.getItem("user") || "{}").state.userInfo.userId,
      );
      setPromptList(res.data || []);
    } catch (error) {
      console.error("刷新列表失败:", error);
    }
  };

  // 使用提示词
  const handleUsePrompt = async (id?: number) => {
    try {
      let params: {
        id?: number;
        prompt?: string;
        tone?: string;
        role?: string;
        userId: number;
      };

      if (id) {
        // 使用列表中的提示词
        params = {
          id,
          userId: JSON.parse(localStorage.getItem("user") || "{}").state
            .userInfo.userId,
        };
      } else {
        // 使用当前生成的提示词
        params = {
          prompt: generatedSample,
          tone: form.getFieldValue("tone"),
          role: form.getFieldValue("role"),
          userId: JSON.parse(localStorage.getItem("user") || "{}").state
            .userInfo.userId,
        };
      }

      await applyPromptAPI(params);
      message.success("使用成功");
      fetchPromptsList();
    } catch (error) {
      message.error(error ? error.message : "使用失败,请重试");
    }
  };
  return (
    <PromptListWrapper>
      <div className="input-content">
        <Form form={form} className="oper-area">
          {/* 期望角色 */}
          <Form.Item
            name="role"
            rules={[{ required: true, message: "请输入期望角色" }]}
          >
            <Input placeholder="请输入期望角色" />
          </Form.Item>

          {/* 语气描述 */}
          <Form.Item
            name="tone"
            rules={[{ required: true, message: "请输入语气描述" }]}
          >
            <Input placeholder="请输入语气描述" />
          </Form.Item>

          <Button
            onMouseDown={(e) => e.preventDefault()} // 防止点击按钮导致 textarea 失焦
            onClick={handleGenerate}
          >
            <OpenAIOutlined />
            生成示例
          </Button>
        </Form>
        <div className="sample-area">
          {/* 生成示例 */}
          <TextArea
            style={{ height: "180px" }}
            placeholder="等待生成示例"
            value={generatedSample} // 绑定状态
            disabled={!generatedSample} // 没有文本时禁用
            onChange={handleSampleChange} // 新增: 允许编辑并更新状态
          />
        </div>
      </div>
      <div className="oper-btn-area">
        <Button onClick={() => handleUsePrompt()}>
          <DoubleLeftOutlined />
          使用
        </Button>
        <Button
          style={{ marginLeft: "10px" }}
          onClick={() => {
            setGeneratedSample("");
            form.resetFields();
          }}
        >
          <VerticalAlignTopOutlined />
          清空
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: "10px" }}
          onClick={handleSave}
        >
          <SaveOutlined />
          保存
        </Button>
      </div>
      <div className="prompt-list">
        {promptList.map((promptItem) => (
          <PromptItem
            key={promptItem.id}
            promptItem={promptItem}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onUse={() => handleUsePrompt(promptItem.id)}
          />
        ))}
      </div>
    </PromptListWrapper>
  );
};
export default PromptEngine;
