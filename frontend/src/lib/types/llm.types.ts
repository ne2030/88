export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionRequest {
  messages: Message[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  provider?: string;
  useCache?: boolean;
  cacheTTL?: number;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export interface ChatResponse {
  id: string;
  content: string;
  model: string;
  usage: TokenUsage;
  finishReason: string;
  provider: string;
  cached?: boolean;
}

export interface ProvidersResponse {
  providers: string[];
  default: string;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
}
