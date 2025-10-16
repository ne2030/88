import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClaudeProvider } from '../providers/claude.provider';
import { LLMCacheService } from './llm-cache.service';
import {
  LLMMessage,
  LLMCompletionOptions,
  LLMCompletionResponse,
  ILLMProvider,
} from '../interfaces/llm-provider.interface';

export type LLMProviderType = 'claude' | 'openai' | 'custom';

@Injectable()
export class LLMService {
  private readonly logger = new Logger(LLMService.name);
  private providers: Map<string, ILLMProvider> = new Map();
  private defaultProvider: string;

  constructor(
    private configService: ConfigService,
    private cacheService: LLMCacheService,
    claudeProvider: ClaudeProvider,
  ) {
    // Register Claude provider
    this.registerProvider('claude', claudeProvider);

    this.defaultProvider =
      this.configService.get<string>('LLM_DEFAULT_PROVIDER') || 'claude';

    this.logger.log(
      `LLM Service initialized with default provider: ${this.defaultProvider}`,
    );
  }

  registerProvider(name: string, provider: ILLMProvider): void {
    this.providers.set(name, provider);
    this.logger.log(`Registered LLM provider: ${name}`);
  }

  getProvider(name?: string): ILLMProvider {
    const providerName = name || this.defaultProvider;
    const provider = this.providers.get(providerName);

    if (!provider) {
      throw new Error(`LLM provider not found: ${providerName}`);
    }

    return provider;
  }

  async complete(
    messages: LLMMessage[],
    options?: LLMCompletionOptions & {
      provider?: string;
      useCache?: boolean;
      cacheTTL?: number;
    },
  ): Promise<LLMCompletionResponse> {
    const { provider, useCache = true, cacheTTL, ...llmOptions } = options || {};

    // Check cache first
    if (useCache) {
      const cacheKey = this.cacheService.generateKey(messages, llmOptions);
      const cached = await this.cacheService.get<LLMCompletionResponse>(
        cacheKey,
      );

      if (cached) {
        this.logger.log('Returning cached LLM response');
        return { ...cached, id: `${cached.id}-cached` };
      }

      // Get response from provider
      const llmProvider = this.getProvider(provider);
      const response = await llmProvider.complete(messages, llmOptions);

      // Cache the response
      await this.cacheService.set(cacheKey, response, cacheTTL);

      return response;
    }

    // No cache - direct call
    const llmProvider = this.getProvider(provider);
    return llmProvider.complete(messages, llmOptions);
  }

  async *streamComplete(
    messages: LLMMessage[],
    options?: LLMCompletionOptions & { provider?: string },
  ): AsyncIterable<string> {
    const { provider, ...llmOptions } = options || {};
    const llmProvider = this.getProvider(provider);

    if (!llmProvider.streamComplete) {
      throw new Error(
        `Provider ${provider || this.defaultProvider} does not support streaming`,
      );
    }

    yield* llmProvider.streamComplete(messages, llmOptions);
  }

  async clearCache(): Promise<void> {
    await this.cacheService.clear();
    this.logger.log('LLM cache cleared');
  }

  getCacheStats() {
    return this.cacheService.getCacheStats();
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
