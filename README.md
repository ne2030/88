# 88 Boilerplate

Mobile-first web service with separate frontend and backend applications.

## Structure

```
arete/
├── frontend/    # Svelte + TypeScript
└── backend/     # NestJS + TypeScript
```

## Frontend (Svelte)

```bash
cd frontend
npm install
npm run dev     # http://localhost:5173
```

## Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev     # http://localhost:3000
```

## Production Build

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

Backend:
```bash
cd backend
npm run build
npm run start:prod
```

## Features

- **Frontend**: Mobile-first responsive design with Svelte
- **Backend**: Production-ready NestJS framework with:
  - Dependency injection
  - Module system
  - Environment configuration
  - Built-in testing
  - TypeScript decorators
