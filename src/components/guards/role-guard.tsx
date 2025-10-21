'use client'

import { useSession } from '@/lib/auth-client'
import { ReactNode } from 'react'

type UserRole = 'owner' | 'admin' | 'editor' | 'viewer'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallback?: ReactNode
  requireAll?: boolean
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = <div className="p-4 text-center text-red-600">Access Denied</div>,
  requireAll = false 
}: RoleGuardProps) {
  const { data: session } = useSession()

  if (!session?.user) {
    return <>{fallback}</>
  }

  // Get user role from session
  const userRole = (session as any)?.role || (session.user as any)?.role || 'viewer'

  const hasPermission = requireAll 
    ? allowedRoles.every(role => userRole === role)
    : allowedRoles.includes(userRole as UserRole)

  if (!hasPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Convenience components for common roles
export function OwnerOnly({ children, fallback }: { children: ReactNode, fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['owner']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function AdminOnly({ children, fallback }: { children: ReactNode, fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['owner', 'admin']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function EditorOnly({ children, fallback }: { children: ReactNode, fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['owner', 'admin', 'editor']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}
