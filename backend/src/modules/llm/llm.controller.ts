import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LLMService } from './services/llm.service';
import { ChatCompletionDto, ChatResponseDto } from './dto/chat.dto';

@ApiTags('llm')
@Controller('api/llm')
export class LLMController {
  constructor(private readonly llmService: LLMService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send chat completion request to LLM' })
  @ApiResponse({
    status: 200,
    description: 'Successful LLM response',
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 500, description: 'LLM service error' })
  async chat(@Body() chatDto: ChatCompletionDto) {
    const response = await this.llmService.complete(chatDto.messages, {
      model: chatDto.model,
      maxTokens: chatDto.maxTokens,
      temperature: chatDto.temperature,
      topP: chatDto.topP,
      provider: chatDto.provider,
      useCache: chatDto.useCache,
      cacheTTL: chatDto.cacheTTL,
    });

    return {
      ...response,
      cached: response.id.includes('-cached'),
    };
  }

  @Get('providers')
  @ApiOperation({ summary: 'Get list of available LLM providers' })
  @ApiResponse({
    status: 200,
    description: 'List of available providers',
  })
  getProviders() {
    return {
      providers: this.llmService.getAvailableProviders(),
      default: 'claude',
    };
  }

  @Get('cache/stats')
  @ApiOperation({ summary: 'Get cache statistics' })
  @ApiResponse({
    status: 200,
    description: 'Cache statistics',
  })
  getCacheStats() {
    return this.llmService.getCacheStats();
  }

  @Delete('cache')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear LLM response cache' })
  @ApiResponse({ status: 204, description: 'Cache cleared successfully' })
  async clearCache() {
    await this.llmService.clearCache();
  }
}
