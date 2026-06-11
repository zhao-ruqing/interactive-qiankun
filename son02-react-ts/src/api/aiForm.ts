// AI表单相关的 api 操作

import type {
  ApplyPromptParams,
  DeletePromptParams,
  GetPromptsListResponse,
  SavePromptParams,
  UpdatePromptParams,
} from "@/types/aiFormAPI";
import request from "@/utils/request";

/** AI表单文本优化 */
export const getAIFormTextOptimizationAPI = () => {
  return request.get("/ai/aiForm/textOptimization");
};

/** 使用提示词 */
export const applyPromptAPI = (data: ApplyPromptParams) => {
  return request.post("/ai/usePrompt", data);
};

/** 保存提示词 */
export const savePromptAPI = (data: SavePromptParams) => {
  return request.post("/ai/savePrompt", data);
};

/** 获取提示词列表 */
export const getPromptsListAPI = (userId: number) => {
  return request.get<GetPromptsListResponse>("/ai/getPromptsList", {
    params: { userId },
  });
};

/** 删除提示词 */
export const deletePromptAPI = (data: DeletePromptParams) => {
  return request.post("/ai/deletePrompt", data);
};

/** 更新提示词 */
export const updatePromptAPI = (data: UpdatePromptParams) => {
  return request.post("/ai/updatePrompt", data);
};
