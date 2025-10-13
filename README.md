# Wehawt - Multi-Tenant Creator Economy Platform

A comprehensive multi-tenant SaaS platform built with Next.js 15, React 19, and PostgreSQL, designed for creators to build and manage their digital presence.

## 🚀 Features

- **Multi-Tenancy**: Complete tenant isolation with subdomain and custom domain support
- **Authentication**: Secure authentication with JWT, OAuth, and magic links
- **Role-Based Access Control**: Granular permissions for team collaboration
- **Page Builder**: Drag-and-drop page builder for custom websites
- **E-commerce**: Built-in product management and order processing
- **Content Management**: Blog and content publishing system
- **Analytics**: Comprehensive usage and performance tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL, Redis
- **Authentication**: NextAuth.js v5, JWT, OAuth providers
- **Database**: PostgreSQL with multi-tenant architecture
- **Deployment**: Vercel, Docker support
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js 22
- pnpm package manager
- PostgreSQL database

## 🚀 Quick Start

1. **Setup Environment:**
   ```bash
   nvm use 22
   pnpm install
   ```

2. **Configure Database:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your database credentials
   ```

3. **Run Database Migrations:**
   ```bash
   pnpm db:migrate
   ```

4. **Start Development Server:**
   ```bash
   pnpm dev
   ```

## 📁 Project Structure

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

## 🗄️ Database Schema

The platform uses a multi-tenant database architecture with the following core entities:

- **Users**: Global user accounts with authentication
- **Organizations**: Multi-tenant organizations (tenants)
- **Organization Members**: User-organization relationships with roles
- **Pages**: Tenant-specific pages and content
- **Products**: E-commerce product management
- **Orders**: Order processing and fulfillment
- **Content**: Blog posts and content management
- **Media**: File storage and management
- **Analytics**: Usage tracking and insights

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:migrate` - Run database migrations
- `pnpm db:reset` - Reset database (development only)
- `pnpm db:test` - Test database connection

## 📚 Documentation

- [Setup Instructions](./docs/SETUP.md)
- [Technical Brief](./docs/TECHNICAL_BRIEF.md)
- [Feature Implementation Plan](./docs/features/0001_PLAN.md)
- [Product Brief](./docs/PRODUCT_BRIEF.md)
- [External API Documentation](./external-api/README.md)
- [External API Reference](./external-api/docs/API.md)

## 🏗️ Development Status

### ✅ Completed (Week 1-2)
- Database schema and migrations
- Multi-tenant architecture setup
- Authentication utilities
- TypeScript type definitions
- Project structure with Next.js 15
- External API server with mock endpoints
- Database setup for external API
- Comprehensive API documentation

### 🚧 In Progress
- Authentication API routes
- Tenant resolution middleware
- Dashboard components
- OAuth provider integration

### 📋 Planned
- Page builder implementation
- E-commerce functionality
- Content management system
- Analytics dashboard
- Custom domain support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.