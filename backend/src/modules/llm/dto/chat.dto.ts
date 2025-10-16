import {
  IsString,
  IsIn,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({
    description: 'Role of the message sender',
    enum: ['user', 'assistant', 'system'],
    example: 'user',
  })
  @IsString()
  @IsIn(['user', 'assistant', 'system'])
  role!: 'user' | 'assistant' | 'system';

  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello, how are you?',
  })
  @IsString()
  content!: string;
}

export class ChatCompletionDto {
  @ApiProperty({
    description: 'Array of chat messages',
    type: [MessageDto],
    example: [{ role: 'user', content: 'Hello!' }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages!: MessageDto[];

  @ApiProperty({
    description: 'LLM model to use',
    example: 'claude-3-5-sonnet-20241022',
    required: false,
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({
    description: 'Maximum tokens to generate',
    minimum: 1,
    maximum: 8192,
    example: 1024,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(8192)
  maxTokens?: number;

  @ApiProperty({
    description: 'Sampling temperature',
    minimum: 0,
    maximum: 2,
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @ApiProperty({
    description: 'Top-p sampling parameter',
    minimum: 0,
    maximum: 1,
    example: 0.9,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  topP?: number;

  @ApiProperty({
    description: 'LLM provider to use',
    example: 'claude',
    required: false,
  })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiProperty({
    description: 'Whether to use response caching',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  useCache?: boolean;

  @ApiProperty({
    description: 'Cache time-to-live in milliseconds',
    minimum: 0,
    example: 3600000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cacheTTL?: number;
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'Unique response ID',
    example: 'msg_01ABC123',
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'Generated response content',
    example: 'Hello! How can I help you today?',
  })
  @IsString()
  content!: string;

  @ApiProperty({
    description: 'Model used for generation',
    example: 'claude-3-5-sonnet-20241022',
  })
  @IsString()
  model!: string;

  @ApiProperty({
    description: 'Token usage statistics',
    example: {
      inputTokens: 10,
      outputTokens: 25,
      totalTokens: 35,
    },
  })
  @ValidateNested()
  @Type(() => Object)
  usage!: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };

  @ApiProperty({
    description: 'Reason for completion finish',
    example: 'end_turn',
  })
  @IsString()
  finishReason!: string;

  @ApiProperty({
    description: 'Provider used',
    example: 'anthropic',
  })
  @IsString()
  provider!: string;

  @ApiProperty({
    description: 'Whether response was cached',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  cached?: boolean;
}
