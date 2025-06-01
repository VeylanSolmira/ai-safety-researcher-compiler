import DatabaseDemo from '@/components/DatabaseDemo'
import Link from 'next/link'

export const metadata = {
  title: 'Database Migration Demo - AI Safety Research Journey',
  description: 'See the efficiency improvements from migrating to a database',
}

export default function DatabaseDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Back to Home
              </Link>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Database Migration Demo
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <DatabaseDemo />
        
        <div className="max-w-4xl mx-auto px-6 mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Implementation Details</h2>
            
            <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="font-semibold mb-2">Phase 1: Database Setup ✅</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>SQLite database with 44 tables</li>
                  <li>Drizzle ORM for type-safe queries</li>
                  <li>Proper foreign key relationships</li>
                  <li>Indexed for fast searches</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Phase 2: Data Migration ✅</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>71 topics across 19 modules in 4 tiers</li>
                  <li>19 mentors from 10 organizations</li>
                  <li>All relationships preserved</li>
                  <li>Migration scripts for easy updates</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Phase 3: API Layer 🚧</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>REST API endpoints created</li>
                  <li>Efficient query functions</li>
                  <li>React hooks for data fetching</li>
                  <li>Components can now use APIs instead of imports</li>
                </ul>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="font-semibold text-green-800 dark:text-green-300 mb-2">
                  Benefits Achieved:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-green-700 dark:text-green-400">
                  <li>95-99% reduction in token usage</li>
                  <li>Instant search capabilities</li>
                  <li>Atomic updates without file manipulation</li>
                  <li>Scalable to thousands of topics</li>
                  <li>Better performance for users</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}