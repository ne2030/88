# CLAUDE.md

## Project Overview
This is a full-stack web application with separated backend and frontend:
- **Backend**: NestJS (TypeScript)
- **Frontend**: Svelte
- **Additional**: LLM integration planned

## Project Structure
```
/
├── backend/          # NestJS application
├── frontend/         # Svelte application
└── CLAUDE.md        # This file
```

## Development Guidelines

### General Principles
- Always check existing code patterns before implementing new features
- Maintain consistency between backend API contracts and frontend implementations
- Write clear commit messages describing what and why
- Test changes locally before committing

### Backend Development (NestJS)

#### Architecture
- Follow NestJS module-based architecture
- Use dependency injection for services
- Implement DTOs for request/response validation
- Keep controllers thin, business logic in services

#### Code Standards
- Use TypeScript strict mode
- Implement proper error handling with custom exceptions
- Use class-validator for DTO validation
- Follow RESTful API design principles
- Document API endpoints with Swagger/OpenAPI decorators

#### LLM Integration
- Create a dedicated LLM service module
- Abstract LLM provider logic for easy switching (OpenAI, Anthropic, etc.)
- Implement proper error handling and retry logic for LLM calls
- Add rate limiting and cost tracking for API calls
- Store LLM configurations in environment variables

#### File Organization
```
backend/
├── src/
│   ├── modules/          # Feature modules
│   │   ├── auth/
│   │   ├── llm/         # LLM integration
│   │   └── ...
│   ├── common/          # Shared utilities, guards, filters
│   ├── config/          # Configuration files
│   └── main.ts
└── test/
```

### Frontend Development (Svelte)

#### Architecture
- Use component-based architecture
- Implement stores for global state management
- Create reusable UI components
- Separate business logic from UI components

#### Code Standards
- Use TypeScript for type safety
- Follow Svelte best practices (reactive statements, proper event handling)
- Implement proper loading and error states for async operations
- Use Svelte stores for shared state
- Keep components small and focused

#### API Communication
- Create a centralized API client service
- Use TypeScript interfaces matching backend DTOs
- Implement proper error handling for API calls
- Add loading states for all async operations

#### File Organization
```
frontend/
├── src/
│   ├── lib/
│   │   ├── components/      # Reusable components
│   │   ├── stores/          # Svelte stores
│   │   ├── services/        # API clients, utilities
│   │   └── types/           # TypeScript types/interfaces
│   ├── routes/              # SvelteKit routes
│   └── app.html
└── static/
```

### LLM Feature Development

When implementing LLM features:

1. **Backend Tasks**:
   - Create service methods that handle LLM API calls
   - Implement streaming responses when appropriate
   - Add proper logging for debugging
   - Handle token limits and context management
   - Cache responses when applicable

2. **Frontend Tasks**:
   - Implement streaming UI updates for LLM responses
   - Add user feedback mechanisms (regenerate, copy, etc.)
   - Show token usage or cost information
   - Implement proper loading states (typing indicators, etc.)
   - Handle error states gracefully

3. **Testing**:
   - Mock LLM responses for unit tests
   - Test edge cases (API failures, timeouts, token limits)
   - Test streaming functionality end-to-end

### Development Workflow

1. **Starting Development**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run start:dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Before Committing**:
   - Run linters: `npm run lint`
   - Run tests: `npm run test`
   - Check types: `npm run type-check` (if available)

3. **Adding New Features**:
   - Start with backend API design (DTOs, endpoints)
   - Implement backend logic and test with Swagger/Postman
   - Update frontend types to match backend DTOs
   - Implement frontend UI and connect to API
   - Test end-to-end functionality

### Documentation
- Document complex business logic with comments
- Keep API documentation up-to-date in Swagger
- Document environment variables and their purposes
- Maintain this CLAUDE.md as project evolves

### Questions to Ask Before Implementation
- Does this feature require new API endpoints?
- How should errors be handled and displayed to users?
- Are there any performance considerations?
- Does this need to work offline or have loading states?
- What are the LLM token costs and rate limits?

---

**Note**: When in doubt, ask for clarification before implementing. It's better to discuss approach first than to refactor later.
