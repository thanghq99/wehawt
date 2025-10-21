# Better Auth Migration Guide

## Tổng quan

Dự án đã được migrate từ NextAuth sang Better Auth với wehawt-api server. Điều này cho phép:

- Sử dụng wehawt-api server cho authentication logic
- Giữ lại local session management
- Hỗ trợ OAuth providers (Google, GitHub)
- JWT token validation với wehawt-api

## Cấu hình Environment Variables

Cập nhật file `.env` với các biến sau:

```env
# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
BETTER_AUTH_SECRET=your-better-auth-secret-here
BETTER_AUTH_URL=http://localhost:3000

# API Server
API_BASE_URL=http://localhost:3001/api

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## API Endpoints

### Authentication Routes

- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/session` - Lấy thông tin session

### API Integration

Tất cả authentication requests được forward tới API server:

- Login: `POST {API_BASE_URL}/auth/login`
- Register: `POST {API_BASE_URL}/auth/register`
- Logout: `POST {API_BASE_URL}/auth/logout`
- Refresh: `POST {API_BASE_URL}/auth/refresh`

## Session Management

- Local sessions được lưu trong database
- JWT tokens được validate với API server
- Session expiration được đồng bộ với API server

## Middleware

Middleware mới được tạo để:

- Validate authentication tokens
- Redirect unauthenticated users
- Add user info to request headers

## Cài đặt Dependencies

```bash
pnpm install better-auth
```

## Chạy API Server

Đảm bảo API server đang chạy trên port 3001:

```bash
# Clone API repository
git clone <api-repo-url>
cd api-server
npm start
```

## Testing

1. Start API server
2. Start Next.js application
3. Test authentication endpoints
4. Verify session management
