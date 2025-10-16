import { Module } from '@nestjs/common';
import { LLMController } from './llm.controller';
import { LLMService } from './services/llm.service';
import { LLMCacheService } from './services/llm-cache.service';
import { ClaudeProvider } from './providers/claude.provider';

@Module({
  controllers: [LLMController],
  providers: [LLMService, LLMCacheService, ClaudeProvider],
  exports: [LLMService],
})
export class LLMModule {}
