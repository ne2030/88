# Arete Backend

Production-ready NestJS backend with LLM integration.

## Features

- **Modular Architecture**: Clean separation with feature modules
- **LLM Integration**: Claude AI with pluggable provider system
- **Advanced Features**:
  - Automatic retry logic with exponential backoff
  - Response caching for cost optimization
  - Comprehensive logging
  - Streaming support
  - Provider-agnostic design

## Project Structure

```
src/
├── common/              # Shared utilities
│   ├── decorators/     # Custom decorators
│   ├── dto/            # Common DTOs
│   ├── filters/        # Exception filters
│   ├── guards/         # Auth guards
│   ├── interceptors/   # Request/response interceptors
│   └── pipes/          # Validation pipes
├── config/             # Configuration
├── modules/
│   ├── health/         # Health check
│   ├── users/          # User management
│   └── llm/            # LLM service
│       ├── dto/        # Request/response DTOs
│       ├── interfaces/ # Provider interface
│       ├── providers/  # LLM provider implementations
│       │   └── claude.provider.ts
│       └── services/
│           ├── llm.service.ts        # Main service
│           └── llm-cache.service.ts  # Caching
├── app.module.ts
└── main.ts
```

## Getting Started

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env` and configure:

```env
# Required
ANTHROPIC_API_KEY=your-api-key-here

# Optional (with defaults)
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
LLM_DEFAULT_PROVIDER=claude
LLM_MAX_RETRIES=3
LLM_RETRY_DELAY=1000
LLM_CACHE_ENABLED=true
LLM_CACHE_TTL=3600000
```

### Run

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

### LLM Service

#### Chat Completion
```bash
POST /api/llm/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "model": "claude-3-5-sonnet-20241022",
  "maxTokens": 1024,
  "temperature": 1,
  "useCache": true,
  "provider": "claude"
}
```

**Response:**
```json
{
  "id": "msg_xxx",
  "content": "Hello! How can I help you?",
  "model": "claude-3-5-sonnet-20241022",
  "usage": {
    "inputTokens": 10,
    "outputTokens": 15,
    "totalTokens": 25
  },
  "finishReason": "end_turn",
  "provider": "anthropic",
  "cached": false
}
```

#### Get Available Providers
```bash
GET /api/llm/providers
```

#### Cache Stats
```bash
GET /api/llm/cache/stats
```

#### Clear Cache
```bash
DELETE /api/llm/cache
```

### Health Check
```bash
GET /api/health
```

### Users CRUD
```bash
GET    /api/users
POST   /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

## LLM Provider System

### Adding a New Provider

1. Implement the `ILLMProvider` interface:

```typescript
import { Injectable } from '@nestjs/common';
import { ILLMProvider, LLMMessage, LLMCompletionOptions, LLMCompletionResponse } from '../interfaces/llm-provider.interface';

@Injectable()
export class CustomProvider implements ILLMProvider {
  async complete(messages: LLMMessage[], options?: LLMCompletionOptions): Promise<LLMCompletionResponse> {
    // Your implementation
  }

  async *streamComplete(messages: LLMMessage[], options?: LLMCompletionOptions): AsyncIterable<string> {
    // Optional streaming support
  }
}
```

2. Register in `LLMModule`:

```typescript
@Module({
  providers: [LLMService, LLMCacheService, ClaudeProvider, CustomProvider],
})
export class LLMModule {}
```

3. Register in `LLMService` constructor:

```typescript
constructor(private customProvider: CustomProvider) {
  this.registerProvider('custom', customProvider);
}
```

## Advanced Features

### Retry Logic
Automatic retry with exponential backoff:
- Configurable max retries (default: 3)
- Configurable delay (default: 1000ms)
- Exponential backoff multiplier

### Caching
In-memory response caching:
- SHA256 hashing of request parameters
- Configurable TTL (default: 1 hour)
- Automatic cleanup of expired entries
- Cache hit/miss logging

### Logging
Comprehensive logging throughout:
- Request/response timing
- Token usage
- Cache operations
- Retry attempts
- Errors and warnings

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## Development

```bash
# Format code
npm run format

# Lint
npm run lint
```
