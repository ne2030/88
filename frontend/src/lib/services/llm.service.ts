import { apiService } from './api.service';
import type {
  ChatCompletionRequest,
  ChatResponse,
  ProvidersResponse,
  CacheStats,
} from '../types';

export const llmService = {
  async chat(request: ChatCompletionRequest): Promise<ChatResponse> {
    return apiService.post<ChatResponse, ChatCompletionRequest>('/api/llm/chat', request);
  },

  async getProviders(): Promise<ProvidersResponse> {
    return apiService.get<ProvidersResponse>('/api/llm/providers');
  },

  async getCacheStats(): Promise<CacheStats> {
    return apiService.get<CacheStats>('/api/llm/cache/stats');
  },

  async clearCache(): Promise<void> {
    return apiService.delete<void>('/api/llm/cache');
  },
};
