import { deletePromptAPI, updatePromptAPI } from "@/api/aiForm";
import {
  DeleteOutlined,
  EditOutlined,
  OpenAIOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { styled } from "styled-components";
import { streamGeneratePrompt } from "./stream-generator";

const PromptItemWrapper = styled.div<{ $isSelected?: boolean }>`
  padding: 12px;
  border: ${(props) =>
    props.$isSelected ? "2px solid #1890ff" : "1px solid #e8e8e8"};
  border-radius: 6px;
  background-color: ${(props) => (props.$isSelected ? "#e6f7ff" : "#fafafa")};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  h4 {
    margin: 0;
    font-size: 14px;
    color: #1890ff;
    font-weight: 600;
    flex: 1;
  }

  .item-actions {
    display: flex;
    gap: 4px;
  }

  p {
    margin: 0 0 8px 0;
    font-size: 13px;
    line-height: 1.6;
    color: #333;
    word-break: break-word;
  }

  small {
    color: #999;
    font-size: 12px;
  }
`;

interface PromptItemProps {
  promptItem: {
    id: number;
    user_id: number;
    prompt: string;
    tone: string;
    role: string;
    status: number;
    is_use?: number; // 是否被使用，1表示使用中
    is_show?: number; // 是否显示，1表示显示
    created_at: string;
    updated_at: string;
  };
  onDelete?: (id: number) => void;
  onUpdate?: () => void;
  onUse?: () => void;
}

const PromptItem = ({
  promptItem,
  onDelete,
  onUpdate,
  onUse,
}: PromptItemProps) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isGenerating, setIsGenerating] = useState(false);

  // 处理删除
  const handleDelete = async () => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除这条提示词吗？`,
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        try {
          await deletePromptAPI({ id: promptItem.id });
          message.success("删除成功");
          onDelete?.(promptItem.id);
          onUpdate?.();
        } catch (error) {
          console.error("删除失败:", error);
          message.error("删除失败，请重试");
        }
      },
    });
  };

  // 打开编辑弹窗
  const handleEditClick = () => {
    form.setFieldsValue({
      role: promptItem.role,
      tone: promptItem.tone,
      prompt: promptItem.prompt,
    });
    setIsEditModalVisible(true);
  };

  // 处理编辑保存
  const handleEditSave = async () => {
    try {
      const values = await form.validateFields();
      await updatePromptAPI({
        id: promptItem.id,
        ...values,
      });
      message.success("更新成功");
      setIsEditModalVisible(false);
      onUpdate?.();
    } catch (error) {
      console.error("更新失败:", error);
      message.error("更新失败，请重试");
    }
  };

  // 流式生成提示词
  const handleGenerate = async () => {
    try {
      const values = await form.validateFields();
      console.log("表单值:", values);

      setIsGenerating(true);
      // 清空当前的 prompt 字段
      form.setFieldValue("prompt", "");

      let accumulatedText = "";

      await streamGeneratePrompt({
        params: {
          role: values.role,
          tone: values.tone,
        },
        onChunk: (chunk) => {
          // 累加文本
          accumulatedText += chunk;
          // 实时更新表单中的 prompt 字段
          form.setFieldValue("prompt", accumulatedText);
        },
        onComplete: () => {
          message.success("生成完成");
        },
        onError: () => {
          // 错误消息已在 streamGeneratePrompt 中处理
        },
      });
    } catch (errorInfo) {
      console.log("校验失败或请求出错:", errorInfo);
      message.error("生成失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  // 处理使用提示词
  const handleUse = () => {
    Modal.confirm({
      title: "确认使用",
      content: `确定要使用这条提示词吗？`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        onUse?.();
      },
    });
  };

  // 如果 is_show 不为 1，则不渲染该组件
  if (promptItem.is_show !== 1) {
    return null;
  }

  return (
    <>
      <PromptItemWrapper
        $isSelected={promptItem.is_use === 1}
        onClick={handleUse}
      >
        <div className="item-header">
          <h4>
            {promptItem.role} - {promptItem.tone}语气
          </h4>
          <div className="item-actions">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick();
              }}
              title="编辑"
            />
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              title="删除"
            />
          </div>
        </div>
        <p>{promptItem.prompt}</p>
        <small>
          创建时间: {new Date(promptItem.created_at).toLocaleString()}
        </small>
      </PromptItemWrapper>

      {/* 编辑弹窗 */}
      <Modal
        title="编辑提示词"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
            取消
          </Button>,
          <Button
            onMouseDown={(e) => e.preventDefault()} // 防止点击按钮导致 textarea 失焦
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={isGenerating}
          >
            <OpenAIOutlined />
            {isGenerating ? "生成中..." : "再次生成示例"}
          </Button>,
          <Button
            key="submit"
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleEditSave}
          >
            保存
          </Button>,
        ]}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: "请输入角色" }]}
          >
            <Input placeholder="请输入角色" />
          </Form.Item>
          <Form.Item
            name="tone"
            label="语气"
            rules={[{ required: true, message: "请输入语气" }]}
          >
            <Input placeholder="请输入语气" />
          </Form.Item>
          <Form.Item
            name="prompt"
            label="提示词内容"
            rules={[{ required: true, message: "请输入提示词内容" }]}
          >
            <TextArea rows={6} placeholder="请输入提示词内容" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default PromptItem;
