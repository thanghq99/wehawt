// Core database types
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  email_verified: boolean
  created_at: Date
  updated_at: Date
}

export interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
  website_url?: string
  custom_domain?: string
  ssl_verified: boolean
  settings: Record<string, any>
  created_at: Date
  updated_at: Date
}

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  permissions: Record<string, any>
  invited_by?: string
  joined_at: Date
}

export interface UserSession {
  id: string
  user_id: string
  token: string
  expires_at: Date
  created_at: Date
}

export interface Page {
  id: string
  organization_id: string
  title: string
  slug: string
  page_type: 'landing' | 'shop' | 'blog' | 'donations' | 'services' | 'custom'
  content: Record<string, any>
  theme: Record<string, any>
  seo_meta: Record<string, any>
  is_published: boolean
  published_at?: Date
  created_at: Date
  updated_at: Date
}

export interface Product {
  id: string
  organization_id: string
  name: string
  description?: string
  price: number
  currency: string
  product_type: 'physical' | 'digital' | 'service'
  inventory_count?: number
  is_available: boolean
  images: string[]
  variants: Record<string, any>[]
  metadata: Record<string, any>
  created_at: Date
  updated_at: Date
}

export interface Order {
  id: string
  organization_id: string
  customer_email: string
  customer_name?: string
  total_amount: number
  currency: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  payment_intent_id?: string
  shipping_address?: Record<string, any>
  items: Record<string, any>[]
  created_at: Date
  updated_at: Date
}

export interface Content {
  id: string
  organization_id: string
  title: string
  slug: string
  content_type: 'post' | 'page' | 'newsletter'
  content: string
  excerpt?: string
  featured_image?: string
  tags: string[]
  is_published: boolean
  published_at?: Date
  created_at: Date
  updated_at: Date
}

export interface Media {
  id: string
  organization_id: string
  filename: string
  original_name: string
  mime_type: string
  size: number
  url: string
  alt_text?: string
  metadata: Record<string, any>
  created_at: Date
}

export interface Analytics {
  id: string
  organization_id: string
  page_id?: string
  event_type: string
  event_data: Record<string, any>
  user_agent?: string
  ip_address?: string
  referrer?: string
  created_at: Date
}

// Extended types with relations
export interface UserWithOrganizations extends User {
  organizations: (OrganizationMember & { organization: Organization })[]
}

export interface OrganizationWithMembers extends Organization {
  members: (OrganizationMember & { user: User })[]
}

export interface PageWithOrganization extends Page {
  organization: Organization
}

export interface ProductWithOrganization extends Product {
  organization: Organization
}

// Database query result types
export interface QueryResult<T> {
  rows: T[]
  rowCount: number
}

// Tenant context type
export interface TenantContext {
  organization: Organization
  user?: User
  permissions: string[]
}
