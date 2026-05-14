import request from "@/utils/request";

/**
 * AI表单文本优化
 */
export const getAIFormTextOptimizationAPI = () => {
  return request.get("/ai/aiForm/textOptimization");
};

// 使用提示词
export const applyPromptAPI = (data: any) => {
  return request.post("/ai/usePrompt", data);
};

// 存储提示词
export const savePromptAPI = (data: any) => {
  return request.post("/ai/savePrompt", data);
};

// 获取提示词列表
export const getPromptsListAPI = (params: any) => {
  return request.get(`/ai/getPromptsList?userId=${params}`);
};

// 删除提示词
export const deletePromptAPI = (data: any) => {
  return request.post("/ai/deletePrompt", data);
};

// 更新提示词
export const updatePromptAPI = (data: any) => {
  return request.post("/ai/updatePrompt", data);
};
