# API Server Setup

## Tổng quan

Dự án này sử dụng API server riêng biệt cho authentication logic. API server là một repository riêng biệt chứa tất cả logic authentication và API endpoints.

## Cấu hình

### Environment Variables

Cập nhật file `.env` với:

```env
# API Server
API_BASE_URL=http://localhost:3001/api
```

### Chạy API Server

1. Clone API repository:

```bash
git clone <api-repo-url>
cd api-server
```

2. Cài đặt dependencies:

```bash
npm install
# hoặc
pnpm install
```

3. Cấu hình environment variables trong API server
4. Chạy server:

```bash
npm start
# hoặc
pnpm start
```

## API Endpoints

API server cung cấp các endpoints sau:

- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `POST /auth/logout` - Đăng xuất
- `POST /auth/refresh` - Refresh token
- `GET /users/:id` - Lấy thông tin user
- `GET /users?email=...` - Tìm user theo email

## Integration

Next.js application sẽ gọi tới API server thông qua:

- `src/lib/auth.ts` - Authentication functions
- `src/app/api/auth/*` - API routes
- `src/middleware.ts` - Authentication middleware

## Development

Để phát triển, bạn cần chạy cả hai servers:

1. API server (port 3001)
2. Next.js application (port 3000)

```bash
# Terminal 1 - API Server
cd api-server
npm start

# Terminal 2 - Next.js App
cd wehawt
npm run dev
```
