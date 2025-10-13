# Technical Brief: Multi-Tenant Creator Economy Platform

## 1. System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                   │
├─────────────────────────────────────────────────────────────┤
│  Next.js 15 App Router + React 19 + TypeScript             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Public    │ │   Tenant    │ │   Admin     │          │
│  │   Pages     │ │   Dashboard │ │   Panel     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│                    API Layer (Edge Runtime)                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Auth      │ │   Tenant    │ │   Content   │          │
│  │   Service   │ │   Service   │ │   Service   │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│                    Business Logic Layer                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Page      │ │   E-commerce│ │   Content   │          │
│  │   Builder   │ │   Engine    │ │   Manager   │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ PostgreSQL  │ │   Redis     │ │   S3/CDN    │          │
│  │ (Multi-tenant)│ │ (Cache)    │ │ (Assets)    │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### Multi-Tenancy Strategy
- **Database-per-tenant**: Isolated schemas for data security
- **Subdomain routing**: `{tenant}.platform.com` and custom domains
- **Tenant middleware**: Automatic tenant resolution and context injection
- **Resource isolation**: All data queries scoped to tenant context

### Domain Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Domain Resolution                        │
├─────────────────────────────────────────────────────────────┤
│  Custom Domain (user.com) → Tenant Resolution → App        │
│  Subdomain (user.platform.com) → Tenant Resolution → App   │
│  Admin (admin.platform.com) → Admin Panel                 │
│  API (api.platform.com) → API Gateway                      │
└─────────────────────────────────────────────────────────────┘
```

## 2. Database Schema

### Core Entities and Relationships

```sql
-- Users table (global, not tenant-specific)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Organizations (tenants)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  custom_domain VARCHAR(255) UNIQUE,
  ssl_verified BOOLEAN DEFAULT FALSE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Organization memberships with roles
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  permissions JSONB DEFAULT '{}',
  invited_by UUID REFERENCES users(id),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Pages (tenant-specific)
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  page_type VARCHAR(50) NOT NULL CHECK (page_type IN ('landing', 'shop', 'blog', 'donations', 'services', 'custom')),
  content JSONB DEFAULT '{}',
  theme JSONB DEFAULT '{}',
  seo_meta JSONB DEFAULT '{}',
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, slug)
);

-- Products (tenant-specific)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  product_type VARCHAR(50) NOT NULL CHECK (product_type IN ('physical', 'digital', 'service')),
  inventory_count INTEGER,
  is_available BOOLEAN DEFAULT TRUE,
  images JSONB DEFAULT '[]',
  variants JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders (tenant-specific)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  payment_intent_id VARCHAR(255),
  shipping_address JSONB,
  items JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Content (tenant-specific)
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('post', 'page', 'newsletter')),
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  tags JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, slug)
);

-- Media files (tenant-specific)
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size INTEGER NOT NULL,
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics (tenant-specific)
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB DEFAULT '{}',
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes for Performance
```sql
-- Performance indexes
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_custom_domain ON organizations(custom_domain);
CREATE INDEX idx_pages_organization_slug ON pages(organization_id, slug);
CREATE INDEX idx_products_organization ON products(organization_id);
CREATE INDEX idx_orders_organization ON orders(organization_id);
CREATE INDEX idx_content_organization ON content(organization_id);
CREATE INDEX idx_media_organization ON media(organization_id);
CREATE INDEX idx_analytics_organization_date ON analytics(organization_id, created_at);
```

## 3. Folder Structure (Next.js 15 App Router)

```
src/
├── app/                          # App Router structure
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── [organization]/
│   │   │   ├── dashboard/
│   │   │   ├── pages/
│   │   │   ├── products/
│   │   │   ├── content/
│   │   │   ├── analytics/
│   │   │   ├── settings/
│   │   │   └── layout.tsx
│   │   └── layout.tsx
│   ├── (public)/                 # Public pages route group
│   │   ├── [domain]/             # Dynamic tenant routing
│   │   │   ├── [slug]/           # Dynamic page routing
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── organizations/
│   │   ├── pages/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── content/
│   │   ├── media/
│   │   └── webhooks/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # Reusable components
│   ├── ui/                      # Shadcn/ui components
│   ├── forms/                   # Form components
│   ├── layout/                  # Layout components
│   ├── page-builder/            # Page builder components
│   │   ├── blocks/
│   │   │   ├── hero/
│   │   │   ├── about/
│   │   │   ├── products/
│   │   │   ├── blog/
│   │   │   ├── contact/
│   │   │   └── cta/
│   │   ├── editor/
│   │   └── preview/
│   ├── dashboard/               # Dashboard components
│   └── public/                  # Public page components
├── lib/                         # Utilities and configurations
│   ├── auth.ts                  # NextAuth configuration
│   ├── db.ts                    # Database connection
│   ├── validations.ts           # Zod schemas
│   ├── utils.ts                 # Utility functions
│   └── constants.ts             # App constants
├── hooks/                       # Custom React hooks
├── types/                       # TypeScript type definitions
├── middleware.ts                # Next.js middleware
└── env.ts                       # Environment variables
```

## 4. API Routes Specification

### Authentication Routes
```
POST /api/auth/signin          # Sign in with credentials
POST /api/auth/signup          # Register new user
POST /api/auth/signout         # Sign out user
GET  /api/auth/session         # Get current session
POST /api/auth/oauth/[provider] # OAuth provider callback
```

### Organization Routes
```
GET    /api/organizations              # List user's organizations
POST   /api/organizations              # Create organization
GET    /api/organizations/[id]         # Get organization details
PUT    /api/organizations/[id]         # Update organization
DELETE /api/organizations/[id]         # Delete organization
POST   /api/organizations/[id]/members # Add member
PUT    /api/organizations/[id]/members/[userId] # Update member role
DELETE /api/organizations/[id]/members/[userId] # Remove member
```

### Page Builder Routes
```
GET    /api/organizations/[id]/pages           # List pages
POST   /api/organizations/[id]/pages           # Create page
GET    /api/organizations/[id]/pages/[slug]    # Get page
PUT    /api/organizations/[id]/pages/[slug]    # Update page
DELETE /api/organizations/[id]/pages/[slug]    # Delete page
POST   /api/organizations/[id]/pages/[slug]/publish # Publish page
```

### E-commerce Routes
```
GET    /api/organizations/[id]/products        # List products
POST   /api/organizations/[id]/products        # Create product
GET    /api/organizations/[id]/products/[id]   # Get product
PUT    /api/organizations/[id]/products/[id]  # Update product
DELETE /api/organizations/[id]/products/[id]  # Delete product
GET    /api/organizations/[id]/orders          # List orders
GET    /api/organizations/[id]/orders/[id]     # Get order
PUT    /api/organizations/[id]/orders/[id]     # Update order status
```

### Content Management Routes
```
GET    /api/organizations/[id]/content         # List content
POST   /api/organizations/[id]/content        # Create content
GET    /api/organizations/[id]/content/[slug]  # Get content
PUT    /api/organizations/[id]/content/[slug] # Update content
DELETE /api/organizations/[id]/content/[slug] # Delete content
```

### Media Routes
```
GET    /api/organizations/[id]/media           # List media
POST   /api/organizations/[id]/media           # Upload media
DELETE /api/organizations/[id]/media/[id]      # Delete media
```

### Public API Routes (for tenant pages)
```
GET    /api/public/[domain]                    # Get tenant by domain
GET    /api/public/[domain]/pages/[slug]       # Get public page
POST   /api/public/[domain]/contact           # Submit contact form
POST   /api/public/[domain]/newsletter        # Subscribe to newsletter
```

### Webhook Routes
```
POST   /api/webhooks/stripe                   # Stripe webhooks
POST   /api/webhooks/domain-verification      # Domain verification
```

## 5. Key Components Breakdown

### Page Builder Architecture
```typescript
// Core page builder components
interface PageBuilder {
  blocks: BlockComponent[];
  theme: ThemeConfig;
  layout: LayoutConfig;
}

interface BlockComponent {
  id: string;
  type: 'hero' | 'about' | 'products' | 'blog' | 'contact' | 'cta';
  props: Record<string, any>;
  children?: BlockComponent[];
}

// Block types
const BLOCK_TYPES = {
  hero: HeroBlock,
  about: AboutBlock,
  products: ProductsBlock,
  blog: BlogBlock,
  contact: ContactBlock,
  cta: CTABlock,
} as const;
```

### Theme System
```typescript
interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
    fontSize: {
      sm: string;
      base: string;
      lg: string;
      xl: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  layout: {
    maxWidth: string;
    padding: string;
    borderRadius: string;
  };
}
```

### Multi-Tenant Middleware
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host');
  const pathname = request.nextUrl.pathname;
  
  // Resolve tenant from subdomain or custom domain
  const tenant = await resolveTenant(hostname);
  
  if (tenant) {
    // Add tenant context to request
    request.headers.set('x-tenant-id', tenant.id);
    request.headers.set('x-tenant-slug', tenant.slug);
  }
  
  return NextResponse.next();
}
```

## 6. Third-Party Integrations

### Authentication
- **NextAuth.js v5**: OAuth providers (Google, GitHub, Twitter/X, LinkedIn)
- **Magic Links**: Email-based authentication
- **2FA**: Time-based OTP support

### Payments & E-commerce
- **Stripe**: Payment processing, subscriptions, webhooks
- **PayPal**: Alternative payment method
- **TaxJar**: Tax calculation for e-commerce

### Content & Media
- **Cloudinary**: Image optimization and CDN
- **Vercel Blob**: File storage for media
- **Resend**: Email delivery for newsletters

### Analytics & Monitoring
- **Vercel Analytics**: Performance monitoring
- **PostHog**: User analytics and feature flags
- **Sentry**: Error tracking and monitoring

### Domain & SSL
- **Cloudflare**: DNS management and SSL certificates
- **Vercel Domains**: Domain registration and management

### Development & Deployment
- **Vercel**: Hosting and deployment
- **GitHub**: Version control and CI/CD
- **Docker**: Containerization for development

## 7. Deployment Considerations

### Production Environment
```yaml
# vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "STRIPE_SECRET_KEY": "@stripe-secret-key"
  }
}
```

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key

# OAuth Providers
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Payments
STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

# Media & Storage
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email
RESEND_API_KEY=...

# Analytics
POSTHOG_KEY=...
SENTRY_DSN=...
```

### Database Setup
```sql
-- Create databases for different environments
CREATE DATABASE wehawt_development;
CREATE DATABASE wehawt_staging;
CREATE DATABASE wehawt_production;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

## 8. Scalability Strategy

### Horizontal Scaling
- **Database**: Read replicas for analytics queries
- **API**: Edge functions for global performance
- **CDN**: Global asset distribution
- **Caching**: Redis for session and query caching

### Performance Optimization
- **Server Components**: Default to server-side rendering
- **Dynamic Imports**: Code splitting for heavy components
- **Image Optimization**: Next.js Image component with WebP
- **Edge Runtime**: API routes on edge for low latency

### Monitoring & Observability
- **Uptime Monitoring**: Health checks for all services
- **Performance Metrics**: Core Web Vitals tracking
- **Error Tracking**: Real-time error monitoring
- **Business Metrics**: Conversion and engagement tracking

### Security Measures
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Zod schemas for all inputs
- **CSRF Protection**: Token-based CSRF prevention
- **Content Security Policy**: XSS protection
- **Data Encryption**: At rest and in transit

This technical brief provides a comprehensive foundation for building a scalable, secure, and performant multi-tenant SaaS platform using Next.js 15 and modern web technologies.
