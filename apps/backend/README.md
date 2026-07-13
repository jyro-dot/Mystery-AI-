# Mystery AI Backend

Production-ready NestJS backend for the Mystery AI platform.

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env

# Setup database
pnpm prisma:migrate
pnpm prisma:generate

# Start development server
pnpm start:dev
```

## Available Scripts

- `pnpm start` - Start production server
- `pnpm start:dev` - Start development server with hot reload
- `pnpm start:debug` - Start with debugger
- `pnpm build` - Build for production
- `pnpm test` - Run unit tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:cov` - Generate coverage report
- `pnpm test:e2e` - Run E2E tests
- `pnpm lint` - Run ESLint
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:generate` - Generate Prisma client

## API Endpoints

### Health
- `GET /api/health` - Health check

### Clock
- `GET /api/clock` - Get current time in multiple time zones
- `GET /api/clock?timeZones=America/New_York,Asia/Tokyo` - Custom time zones
- `GET /api/clock/timezone?timeZone=Asia/Tokyo` - Single time zone
- `GET /api/clock/timezones` - List available time zones

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get current user (JWT protected)
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/github` - GitHub OAuth

## Documentation

API documentation is available at `http://localhost:3000/api/docs`

## Project Structure

```
apps/backend/
├── src/
│   ├── health/
│   ├── clock/
│   ├── auth/
│   ├── app.module.ts
│   └── main.ts
├── test/
├── prisma/
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Features

- ✅ JWT Authentication with refresh tokens
- ✅ OAuth 2.0 (Google, GitHub)
- ✅ Role-Based Access Control (RBAC)
- ✅ Swagger/OpenAPI documentation
- ✅ Request validation with class-validator
- ✅ Rate limiting with throttler
- ✅ Security with helmet and CORS
- ✅ Database ORM with Prisma
- ✅ Redis support for caching
- ✅ Comprehensive test coverage

## Environment Variables

See `.env.example` for all available options.

## Testing

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov

# E2E tests
pnpm test:e2e
```

## License

MIT
