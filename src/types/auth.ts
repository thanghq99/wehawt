import { User, Organization } from './database'

// Authentication session type
export interface AuthSession {
  user: User
  organization?: Organization
  permissions: string[]
  expires: Date
}

// Login request type
export interface LoginRequest {
  email: string
  password: string
  organizationId?: string
}

// Register request type
export interface RegisterRequest {
  email: string
  password: string
  name: string
  organizationName?: string
}

// Magic link request type
export interface MagicLinkRequest {
  email: string
  organization?: string
}

// OAuth provider type
export type OAuthProvider = 'google' | 'github' | 'twitter' | 'linkedin'

// Role type
export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer'

// Permission type
export interface Permission {
  resource: string
  action: string
  conditions?: Record<string, any>
}

// JWT payload type
export interface JWTPayload {
  userId: string
  organizationId?: string
  role?: UserRole
  permissions: string[]
  iat: number
  exp: number
}

// Better Auth configuration types
export interface BetterAuthConfig {
  baseURL: string
  secret: string
  database: {
    provider: string
    url: string
  }
  emailAndPassword: {
    enabled: boolean
    requireEmailVerification: boolean
  }
  socialProviders: {
    google?: {
      clientId: string
      clientSecret: string
    }
    github?: {
      clientId: string
      clientSecret: string
    }
  }
  session: {
    expiresIn: number
    updateAge: number
  }
}

// Auth error types
export interface AuthError {
  code: string
  message: string
  field?: string
}

// Tenant resolution types
export interface TenantResolution {
  organization: Organization | null
  isCustomDomain: boolean
  redirectUrl?: string
}

// Organization invitation types
export interface OrganizationInvitation {
  id: string
  organization_id: string
  email: string
  role: UserRole
  invited_by: string
  expires_at: Date
  created_at: Date
}

// Password reset types
export interface PasswordResetRequest {
  email: string
  organization?: string
}

export interface PasswordResetConfirm {
  token: string
  password: string
}

// External API response types
export interface ExternalAPIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ExternalAuthResponse {
  success: boolean
  user: User
  token: string
  expiresIn: string
  organization?: Organization
}

export interface ExternalUserResponse {
  success: boolean
  user: User
}
