import Link from 'next/link'
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  UserGroupIcon, 
  BeakerIcon,
  NewspaperIcon,
  GlobeAltIcon,
  LightBulbIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export const metadata = {
  title: 'Resources - AI Safety Research Journey',
  description: 'Explore AI safety resources including fellowships, papers, tools, and communities',
}

interface ResourceCard {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  available: boolean
  badge?: string
}

const resources: ResourceCard[] = [
  {
    title: 'CBAI Fellowship 2025',
    description: 'Connect with 19+ AI safety mentors from leading organizations. Find research topics and application guidance.',
    icon: AcademicCapIcon,
    href: '/resources/cbai-fellowship',
    available: true,
    badge: 'New'
  },
  {
    title: 'Research Papers Hub',
    description: 'Curated collection of essential AI safety papers organized by topic and difficulty level.',
    icon: BookOpenIcon,
    href: '/resources/papers',
    available: true,
    badge: 'New'
  },
  {
    title: 'Community Directory',
    description: 'AI safety organizations, research groups, and communities worldwide.',
    icon: UserGroupIcon,
    href: '/resources/communities',
    available: true,
    badge: 'New'
  },
  {
    title: 'Tools & Frameworks',
    description: 'Open-source tools for AI safety research, interpretability, and evaluation.',
    icon: BeakerIcon,
    href: '/resources/tools',
    available: false
  },
  {
    title: 'News & Updates',
    description: 'Latest developments in AI safety research, policy, and governance.',
    icon: NewspaperIcon,
    href: '/resources/news',
    available: true,
    badge: 'New'
  },
  {
    title: 'Case Studies & Incidents',
    description: 'Learn from documented AI safety incidents and near-misses. Understanding past failures prevents future ones.',
    icon: ExclamationTriangleIcon,
    href: '/resources/case-studies',
    available: true,
    badge: 'New'
  },
  {
    title: 'External Resources',
    description: 'Links to courses, blogs, podcasts, and other AI safety learning materials.',
    icon: GlobeAltIcon,
    href: '/resources/external',
    available: false
  }
]

export default function ResourcesPage() {
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
                AI Safety Resources
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
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI Safety Resources Hub
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore curated resources to support your AI safety journey, from fellowship opportunities to research tools and community connections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => {
            const Icon = resource.icon
            return (
              <div
                key={resource.href}
                className={`relative group ${
                  resource.available 
                    ? 'hover:shadow-lg transition-shadow' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                {resource.available ? (
                  <Link href={resource.href}>
                    <ResourceCardContent resource={resource} Icon={Icon} />
                  </Link>
                ) : (
                  <ResourceCardContent resource={resource} Icon={Icon} />
                )}
              </div>
            )
          })}
        </div>

        {/* Ideas Lab - Secondary Section */}
        <div className="mt-12 p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-4">
            <LightBulbIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                🧪 Ideas Lab - Experimental Content
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                A scratchpad for rough ideas, contrarian takes, and experimental thoughts about AI safety. 
                Not ready for the main curriculum but potentially valuable for sparking discussions.
              </p>
              <Link
                href="/resources/ideas-lab"
                className="inline-flex items-center gap-2 text-yellow-700 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-200 font-medium"
              >
                Explore experimental ideas →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            More resources coming soon. Have suggestions?{' '}
            <a 
              href="https://github.com/VeylanSolmira/ai-safety-research-compiler/issues"
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Let us know
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}

function ResourceCardContent({ 
  resource, 
  Icon 
}: { 
  resource: ResourceCard
  Icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-full border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        {resource.badge && (
          <span className="px-2 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
            {resource.badge}
          </span>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {resource.title}
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {resource.description}
      </p>
      
      {!resource.available && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 italic">
          Coming soon
        </p>
      )}
    </div>
  )
}