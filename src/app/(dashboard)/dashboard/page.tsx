'use client'

import { ProtectedLayout } from '@/components/layouts/protected-layout'
import { RoleGuard, OwnerOnly, AdminOnly, EditorOnly } from '@/components/guards/role-guard'
import { authClient, useSession, signOut, } from '@/lib/auth-client'

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {session?.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-6">
              <h2 className="text-2xl font-bold mb-4">Dashboard Content</h2>
              
              {/* Public content - visible to all authenticated users */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">General Information</h3>
                <p className="text-gray-600">This content is visible to all authenticated users.</p>
              </div>

              {/* Editor content */}
              <EditorOnly>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-blue-800">Editor Section</h3>
                  <p className="text-blue-600">This content is only visible to editors, admins, and owners.</p>
                </div>
              </EditorOnly>

              {/* Admin content */}
              <AdminOnly>
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-green-800">Admin Section</h3>
                  <p className="text-green-600">This content is only visible to admins and owners.</p>
                </div>
              </AdminOnly>

              {/* Owner content */}
              <OwnerOnly>
                <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-purple-800">Owner Section</h3>
                  <p className="text-purple-600">This content is only visible to owners.</p>
                </div>
              </OwnerOnly>

              {/* Custom role guard example */}
              <RoleGuard allowedRoles={['admin', 'owner']}>
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-yellow-800">Custom Role Section</h3>
                  <p className="text-yellow-600">This content is visible to admins and owners only.</p>
                </div>
              </RoleGuard>
            </div>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  )
}
