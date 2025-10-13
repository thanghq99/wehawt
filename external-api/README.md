# Wehawt External API Server

A dedicated external API server for the Wehawt multi-tenant platform, providing RESTful endpoints for third-party integrations, webhooks, and analytics.

## 🚀 Features

- **RESTful API**: Complete REST API for external integrations
- **Authentication**: JWT-based authentication with API keys
- **Webhooks**: Support for Stripe, domain verification, and custom webhooks
- **Analytics**: Comprehensive analytics and tracking endpoints
- **Rate Limiting**: Built-in rate limiting and request throttling
- **Security**: CORS, Helmet, and input validation
- **Database**: Separate database schema for external API data

## 🛠️ Tech Stack

- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with separate schema
- **Authentication**: JWT tokens and API keys
- **Validation**: Joi for request validation
- **Security**: Helmet, CORS, rate limiting
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js 22
- pnpm package manager
- PostgreSQL database

## 🚀 Quick Start

1. **Setup Environment:**
   ```bash
   cd external-api
   nvm use 22
   pnpm install
   ```

2. **Configure Database:**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
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
external-api/
├── src/
│   ├── routes/           # API route handlers
│   │   ├── auth.js       # Authentication endpoints
│   │   ├── organizations.js # Organization management
│   │   ├── users.js      # User profile endpoints
│   │   ├── analytics.js  # Analytics and tracking
│   │   └── webhooks.js   # Webhook endpoints
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # Authentication middleware
│   │   └── validation.js # Request validation
│   ├── models/          # Database models
│   │   └── database.js   # Database connection
│   └── server.js        # Main server file
├── scripts/             # Database scripts
│   ├── migrations/      # Database migrations
│   └── migrate.js       # Migration runner
├── docs/               # API documentation
└── tests/              # Test files
```

## 🔧 Available Scripts

- `pnpm start` - Start production server
- `pnpm dev` - Start development server with nodemon
- `pnpm test` - Run tests
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed database with sample data

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Organizations
- `GET /api/organizations` - List organizations
- `GET /api/organizations/:id` - Get organization
- `POST /api/organizations` - Create organization
- `PUT /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Delete organization

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/organizations` - Get user organizations
- `GET /api/users/analytics` - Get user analytics

### Analytics
- `GET /api/analytics/organization/:orgId` - Get organization analytics
- `GET /api/analytics/pages/:pageId` - Get page analytics
- `POST /api/analytics/track` - Track custom events

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook handler
- `POST /api/webhooks/domain-verification` - Domain verification webhook
- `POST /api/webhooks/custom/:eventType` - Custom webhook handler

## 🔐 Authentication

The API supports two authentication methods:

### JWT Tokens
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3001/api/users/profile
```

### API Keys
```bash
curl -H "X-API-Key: YOUR_API_KEY" \
     http://localhost:3001/api/organizations
```

## 📊 Database Schema

The external API uses a separate database schema with the following tables:

- **external_api_users** - API users and their permissions
- **external_api_organizations** - Organization configurations
- **external_api_sessions** - Active API sessions
- **external_api_events** - API usage events and tracking
- **external_api_webhooks** - Webhook configurations
- **external_api_analytics** - Analytics data and metrics

## 🔧 Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
EXTERNAL_DATABASE_URL=postgresql://user:pass@localhost:5432/wehawt_external_api

# Authentication
JWT_SECRET=your-jwt-secret
API_KEY_SECRET=your-api-key-secret

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3001/health
```

### Authentication Test
```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Use token
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3001/api/users/profile
```

### Analytics Test
```bash
# Track event
curl -X POST http://localhost:3001/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"pageId": "page-123", "organizationId": "org-123", "eventType": "page_view"}'
```

## 🔗 Integration with Main App

The external API is designed to work alongside the main Wehawt application:

1. **Shared Database**: Can use the same PostgreSQL instance with different schemas
2. **Cross-Origin**: Configured to accept requests from the main app
3. **Webhooks**: Can receive webhooks from the main app
4. **Analytics**: Can track events from the main app

## 📈 Monitoring

The API includes built-in monitoring features:

- **Health Check**: `/health` endpoint for uptime monitoring
- **Request Logging**: Morgan middleware for request logging
- **Error Tracking**: Comprehensive error handling and logging
- **Rate Limiting**: Built-in rate limiting to prevent abuse
- **Analytics**: Automatic tracking of API usage and performance

## 🚀 Deployment

### Production Setup
```bash
# Install dependencies
pnpm install --production

# Run migrations
pnpm db:migrate

# Start server
pnpm start
```

### Docker Support
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
