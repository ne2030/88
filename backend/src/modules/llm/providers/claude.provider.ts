import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import {
  ILLMProvider,
  LLMMessage,
  LLMCompletionOptions,
  LLMCompletionResponse,
} from '../interfaces/llm-provider.interface';

@Injectable()
export class ClaudeProvider implements ILLMProvider {
  private readonly logger = new Logger(ClaudeProvider.name);
  private client: Anthropic;
  private readonly defaultModel: string;
  private readonly maxRetries: number;
  private readonly retryDelay: number;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    if (!apiKey) {
      this.logger.warn('ANTHROPIC_API_KEY not found in environment variables');
    }

    this.client = new Anthropic({
      apiKey: apiKey || '',
    });

    this.defaultModel =
      this.configService.get<string>('ANTHROPIC_MODEL') ||
      'claude-3-5-sonnet-20241022';
    this.maxRetries = this.configService.get<number>('LLM_MAX_RETRIES') || 3;
    this.retryDelay = this.configService.get<number>('LLM_RETRY_DELAY') || 1000;
  }

  async complete(
    messages: LLMMessage[],
    options?: LLMCompletionOptions,
  ): Promise<LLMCompletionResponse> {
    const model = options?.model || this.defaultModel;
    const maxTokens = options?.maxTokens || 1024;
    const temperature = options?.temperature ?? 1;

    this.logger.log(
      `Calling Claude API - Model: ${model}, Messages: ${messages.length}`,
    );

    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const startTime = Date.now();

        const response = await this.client.messages.create({
          model,
          max_tokens: maxTokens,
          temperature,
          messages: messages.map((msg) => ({
            role: msg.role === 'system' ? 'user' : msg.role,
            content: msg.content,
          })),
        });

        const duration = Date.now() - startTime;
        this.logger.log(
          `Claude API response received - Duration: ${duration}ms, Tokens: ${response.usage.input_tokens + response.usage.output_tokens}`,
        );

        return {
          id: response.id,
          content: response.content[0]?.type === 'text'
            ? response.content[0].text
            : '',
          model: response.model,
          usage: {
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
            totalTokens:
              response.usage.input_tokens + response.usage.output_tokens,
          },
          finishReason: response.stop_reason || 'end_turn',
          provider: 'anthropic',
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.logger.error(
          `Claude API error (attempt ${attempt}/${this.maxRetries}): ${lastError.message}`,
        );

        if (attempt < this.maxRetries) {
          const delay = this.retryDelay * attempt;
          this.logger.log(`Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    throw new Error(
      `Failed to get response from Claude after ${this.maxRetries} attempts: ${lastError?.message || 'Unknown error'}`,
    );
  }

  async *streamComplete(
    messages: LLMMessage[],
    options?: LLMCompletionOptions,
  ): AsyncIterable<string> {
    const model = options?.model || this.defaultModel;
    const maxTokens = options?.maxTokens || 1024;
    const temperature = options?.temperature ?? 1;

    this.logger.log(`Streaming from Claude API - Model: ${model}`);

    const stream = await this.client.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: messages.map((msg) => ({
        role: msg.role === 'system' ? 'user' : msg.role,
        content: msg.content,
      })),
      stream: true,
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        yield event.delta.text;
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
