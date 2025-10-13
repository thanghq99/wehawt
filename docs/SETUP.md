# Setup Instructions

## Prerequisites

- Node.js 22 (use `nvm use 22`)
- pnpm package manager
- PostgreSQL database

## Installation

1. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd wehawt
   nvm use 22
   pnpm install
   ```

2. **Environment Configuration:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your database credentials
   ```

3. **Database Setup:**
   ```bash
   # Create PostgreSQL database
   createdb wehawt_development
   
   # Run migrations
   pnpm db:migrate
   
   # Test database connection
   pnpm db:test
   ```

4. **Start Development Server:**
   ```bash
   pnpm dev
   ```

## Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── (public)/          # Public pages
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities and configurations
│   ├── db.ts              # Database connection
│   ├── auth.ts            # Authentication utilities
│   ├── tenant.ts          # Tenant resolution
│   └── migrations/        # Database migrations
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom React hooks
```

## Database Schema

The database includes the following core tables:

- **users** - Global user accounts
- **organizations** - Multi-tenant organizations
- **organization_members** - User-organization relationships with roles
- **user_sessions** - Authentication sessions
- **pages** - Tenant-specific pages
- **products** - E-commerce products
- **orders** - Order management
- **content** - Content management
- **media** - File storage
- **analytics** - Usage analytics

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:migrate` - Run database migrations
- `pnpm db:reset` - Reset database (development only)
- `pnpm db:test` - Test database connection

## Development Workflow

1. **Database Changes:**
   - Create new migration files in `src/lib/migrations/`
   - Run `pnpm db:migrate` to apply changes
   - Update TypeScript types in `src/types/`

2. **Authentication:**
   - Use the auth utilities in `src/lib/auth.ts`
   - Implement tenant resolution in `src/lib/tenant.ts`
   - Add API routes in `src/app/api/auth/`

3. **Multi-tenancy:**
   - All queries should be scoped to organization_id
   - Use tenant resolution middleware for routing
   - Implement role-based access control

## Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/wehawt_development

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Optional OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## External API Server

The project includes a separate external API server for third-party integrations and webhooks.

### External API Setup

1. **Navigate to external API directory:**
   ```bash
   cd external-api
   nvm use 22
   pnpm install
   ```

2. **Configure external API database:**
   ```bash
   cp env.example .env
   # Edit .env with your external API database credentials
   ```

3. **Run external API migrations:**
   ```bash
   pnpm db:migrate
   ```

4. **Start external API server:**
   ```bash
   pnpm dev
   ```

The external API will be available at `http://localhost:3001`

### External API Features

- **RESTful API**: Complete REST API for external integrations
- **Authentication**: JWT tokens and API key authentication
- **Webhooks**: Support for Stripe, domain verification, and custom webhooks
- **Analytics**: Comprehensive analytics and tracking endpoints
- **Rate Limiting**: Built-in rate limiting and request throttling
- **Security**: CORS, Helmet, and input validation

## Next Steps

1. Implement authentication API routes
2. Create tenant resolution middleware
3. Build dashboard components
4. Add OAuth provider integration
5. Implement role-based access control
6. Set up external API integrations
