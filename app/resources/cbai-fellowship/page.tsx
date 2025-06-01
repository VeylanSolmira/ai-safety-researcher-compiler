import ResourceViewer from '@/components/ResourceViewer'
import Link from 'next/link'

export const metadata = {
  title: 'CBAI Fellowship 2025 - AI Safety Resources',
  description: 'Explore CBAI Fellowship mentors, organizations, and research topics',
}

export default function CBAIFellowshipPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/resources" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Back to Resources
              </Link>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                CBAI Fellowship 2025
              </h1>
            </div>
            <Link
              href="/journey"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              Return to Journey →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <ResourceViewer />
      </main>
    </div>
  )
}