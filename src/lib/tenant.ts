import { query } from './db'
import { Organization, TenantResolution } from '@/types/database'
import { TenantResolution as TenantResolutionType } from '@/types/auth'

// Resolve tenant from hostname
export async function resolveTenant(hostname: string): Promise<TenantResolutionType> {
  try {
    // Check if it's a custom domain
    const customDomainResult = await query(
      'SELECT * FROM organizations WHERE custom_domain = $1 AND ssl_verified = true',
      [hostname]
    )
    
    if (customDomainResult.rows.length > 0) {
      return {
        organization: customDomainResult.rows[0],
        isCustomDomain: true
      }
    }
    
    // Check if it's a subdomain
    const subdomain = hostname.split('.')[0]
    if (subdomain && subdomain !== 'www' && subdomain !== 'api' && subdomain !== 'admin') {
      const subdomainResult = await query(
        'SELECT * FROM organizations WHERE slug = $1',
        [subdomain]
      )
      
      if (subdomainResult.rows.length > 0) {
        return {
          organization: subdomainResult.rows[0],
          isCustomDomain: false
        }
      }
    }
    
    // No tenant found
    return {
      organization: null,
      isCustomDomain: false
    }
  } catch (error) {
    console.error('Error resolving tenant:', error)
    return {
      organization: null,
      isCustomDomain: false
    }
  }
}

// Get tenant by slug
export async function getTenantBySlug(slug: string): Promise<Organization | null> {
  try {
    const result = await query(
      'SELECT * FROM organizations WHERE slug = $1',
      [slug]
    )
    
    return result.rows[0] || null
  } catch (error) {
    console.error('Error getting tenant by slug:', error)
    return null
  }
}

// Get tenant by custom domain
export async function getTenantByDomain(domain: string): Promise<Organization | null> {
  try {
    const result = await query(
      'SELECT * FROM organizations WHERE custom_domain = $1',
      [domain]
    )
    
    return result.rows[0] || null
  } catch (error) {
    console.error('Error getting tenant by domain:', error)
    return null
  }
}

// Validate tenant access
export async function validateTenantAccess(
  userId: string, 
  organizationId: string
): Promise<boolean> {
  try {
    const result = await query(
      'SELECT id FROM organization_members WHERE user_id = $1 AND organization_id = $2',
      [userId, organizationId]
    )
    
    return result.rows.length > 0
  } catch (error) {
    console.error('Error validating tenant access:', error)
    return false
  }
}

// Get user's organizations
export async function getUserOrganizations(userId: string): Promise<Organization[]> {
  try {
    const result = await query(`
      SELECT o.*, om.role, om.permissions
      FROM organizations o
      JOIN organization_members om ON o.id = om.organization_id
      WHERE om.user_id = $1
      ORDER BY om.joined_at DESC
    `, [userId])
    
    return result.rows
  } catch (error) {
    console.error('Error getting user organizations:', error)
    return []
  }
}

// Check if user is owner or admin
export async function isUserOwnerOrAdmin(
  userId: string, 
  organizationId: string
): Promise<boolean> {
  try {
    const result = await query(
      'SELECT role FROM organization_members WHERE user_id = $1 AND organization_id = $2 AND role IN ($3, $4)',
      [userId, organizationId, 'owner', 'admin']
    )
    
    return result.rows.length > 0
  } catch (error) {
    console.error('Error checking user permissions:', error)
    return false
  }
}
