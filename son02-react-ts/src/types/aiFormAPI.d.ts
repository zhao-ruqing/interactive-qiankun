// AI表单与提示词 API 类型定义
import type { CommonResponse } from "./common";

/** 提示词列表项 */
export interface PromptItem {
  id: number;
  user_id?: number;
  prompt: string;
  role: string;
  tone: string;
  status?: number;
  is_use?: number;
  is_show?: number;
  created_at?: string;
  updated_at?: string;
}

/** 保存提示词 */
export interface SavePromptParams {
  prompt: string;
  role: string;
  tone: string;
  userId: number;
}

/** 使用提示词 */
export interface ApplyPromptParams {
  userId: number;
  id?: number;
  prompt?: string;
  role?: string;
  tone?: string;
}

/** 删除提示词 */
export interface DeletePromptParams {
  id: number;
}

/** 更新提示词 */
export interface UpdatePromptParams {
  id: number;
  prompt?: string;
  role?: string;
  tone?: string;
}

/** 提示词列表响应 */
export type GetPromptsListResponse = CommonResponse<PromptItem[]>;
