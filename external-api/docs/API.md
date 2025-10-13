# External API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

All API endpoints (except health check) require authentication. Use either JWT tokens or API keys.

### JWT Authentication
```bash
Authorization: Bearer <jwt_token>
```

### API Key Authentication
```bash
X-API-Key: <api_key>
```

## Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:00:00Z",
  "version": "1.0.0"
}
```

### Authentication

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "organizationId": "org-123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "Mock User",
    "organizationId": "org-123",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

#### Register
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User",
  "organizationName": "New Organization"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout
```http
POST /api/auth/logout
```

### Organizations

#### List Organizations
```http
GET /api/organizations
```

**Response:**
```json
{
  "success": true,
  "organizations": [
    {
      "id": "org-123",
      "name": "Acme Corporation",
      "slug": "acme-corp",
      "description": "Leading technology company",
      "logoUrl": "https://example.com/logo.png",
      "websiteUrl": "https://acme.com",
      "customDomain": "acme.com",
      "sslVerified": true,
      "settings": {
        "theme": "modern",
        "features": ["ecommerce", "blog", "analytics"]
      },
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 1
}
```

#### Get Organization
```http
GET /api/organizations/:id
```

#### Create Organization
```http
POST /api/organizations
```

**Request Body:**
```json
{
  "name": "New Organization",
  "description": "Organization description",
  "websiteUrl": "https://neworg.com"
}
```

#### Update Organization
```http
PUT /api/organizations/:id
```

#### Delete Organization
```http
DELETE /api/organizations/:id
```

### Users

#### Get User Profile
```http
GET /api/users/profile
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "Mock User",
    "avatarUrl": "https://example.com/avatar.jpg",
    "emailVerified": true,
    "organizations": [
      {
        "id": "org-123",
        "name": "Acme Corporation",
        "role": "owner",
        "permissions": ["all"]
      }
    ],
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

#### Update User Profile
```http
PUT /api/users/profile
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

#### Get User Organizations
```http
GET /api/users/organizations
```

#### Get User Analytics
```http
GET /api/users/analytics
```

### Analytics

#### Get Organization Analytics
```http
GET /api/analytics/organization/:orgId?period=30d&metric=all
```

**Query Parameters:**
- `period`: `7d`, `30d`, `90d`, `1y` (default: `30d`)
- `metric`: `all`, `traffic`, `content`, `ecommerce` (default: `all`)

**Response:**
```json
{
  "success": true,
  "analytics": {
    "organizationId": "org-123",
    "period": "30d",
    "overview": {
      "totalPageViews": 12500,
      "uniqueVisitors": 3400,
      "bounceRate": 0.35,
      "avgSessionDuration": "2m 45s",
      "conversionRate": 0.08
    },
    "traffic": {
      "sources": [
        { "source": "Direct", "visitors": 1200, "percentage": 35.3 },
        { "source": "Google", "visitors": 980, "percentage": 28.8 }
      ],
      "devices": [
        { "device": "Desktop", "visitors": 1800, "percentage": 52.9 },
        { "device": "Mobile", "visitors": 1200, "percentage": 35.3 }
      ]
    },
    "ecommerce": {
      "revenue": {
        "total": 125000,
        "currency": "USD",
        "growth": 0.15
      },
      "orders": {
        "total": 156,
        "averageOrderValue": 801.28,
        "conversionRate": 0.08
      }
    }
  }
}
```

#### Get Page Analytics
```http
GET /api/analytics/pages/:pageId?period=30d
```

#### Track Event
```http
POST /api/analytics/track
```

**Request Body:**
```json
{
  "pageId": "page-123",
  "organizationId": "org-123",
  "eventType": "page_view",
  "eventData": {
    "customProperty": "value"
  }
}
```

### Webhooks

#### Stripe Webhook
```http
POST /api/webhooks/stripe
```

**Headers:**
```
X-Webhook-Signature: <signature>
Content-Type: application/json
```

#### Domain Verification Webhook
```http
POST /api/webhooks/domain-verification
```

#### Custom Webhook
```http
POST /api/webhooks/custom/:eventType
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "message": "Request validation failed",
  "details": [
    {
      "field": "email",
      "message": "Email is required",
      "value": null
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required",
  "message": "Authorization header with Bearer token is required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions",
  "message": "Required role: admin, current role: viewer"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "The requested resource was not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests from this IP, please try again later"
}
```

### 500 Internal Server Error
```json
{
  "error": "Something went wrong!",
  "message": "Internal server error"
}
```

## Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit information is included in response headers
- **Exceeded**: Returns 429 status with retry information

## Webhook Signatures

All webhook endpoints verify signatures using HMAC-SHA256:

```javascript
const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(JSON.stringify(payload))
  .digest('hex');
```

## SDK Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});

// Get organizations
const organizations = await api.get('/organizations');

// Track event
await api.post('/analytics/track', {
  pageId: 'page-123',
  organizationId: 'org-123',
  eventType: 'page_view'
});
```

### Python
```python
import requests

headers = {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
}

# Get organizations
response = requests.get('http://localhost:3001/api/organizations', headers=headers)
organizations = response.json()

# Track event
data = {
    'pageId': 'page-123',
    'organizationId': 'org-123',
    'eventType': 'page_view'
}
response = requests.post('http://localhost:3001/api/analytics/track', 
                        headers=headers, json=data)
```

### cURL Examples
```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Get organizations
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3001/api/organizations

# Track event
curl -X POST http://localhost:3001/api/analytics/track \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"pageId": "page-123", "organizationId": "org-123", "eventType": "page_view"}'
```
