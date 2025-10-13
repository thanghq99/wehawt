export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Wehawt
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Multi-Tenant Creator Economy Platform
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Database Schema Setup Complete
            </h2>
            <p className="text-gray-600 mb-4">
              The core database schema has been implemented with the following features:
            </p>
            <ul className="text-left text-gray-600 space-y-2">
              <li>✅ Multi-tenant organization structure</li>
              <li>✅ User authentication and sessions</li>
              <li>✅ Role-based access control</li>
              <li>✅ Database migrations system</li>
              <li>✅ TypeScript types and utilities</li>
            </ul>
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Run <code className="bg-gray-100 px-2 py-1 rounded">pnpm db:migrate</code> to set up your database
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
