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
  organization?: string
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

// NextAuth configuration types
export interface NextAuthConfig {
  providers: any[]
  callbacks: {
    jwt: (token: any, user: any) => Promise<any>
    session: (session: any, token: any) => Promise<any>
  }
  pages: {
    signIn: string
    signUp: string
    error: string
  }
  session: {
    strategy: 'jwt' | 'database'
    maxAge: number
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
