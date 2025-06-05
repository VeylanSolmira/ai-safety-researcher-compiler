import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { getCaseStudy } from '@/lib/db/case-studies-queries'
import type { CaseStudy } from '@/lib/db/case-studies-queries'
import { 
  ExclamationTriangleIcon,
  CalendarIcon,
  TagIcon,
  DocumentTextIcon,
  LightBulbIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'

// Helper function for date formatting
function formatCaseStudyDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  } catch {
    return dateString
  }
}

export const generateMetadata = async ({ params }: { params: { id: string } }) => {
  const caseStudy = await getCaseStudy(params.id)
  if (!caseStudy) return { title: 'Case Study Not Found' }
  
  return {
    title: `${caseStudy.title} - AI Safety Case Study`,
    description: caseStudy.summary,
  }
}

export default async function CaseStudyPage({ params }: { params: { id: string } }) {
  const caseStudy = await getCaseStudy(params.id)
  
  if (!caseStudy) {
    notFound()
  }
  
  const categoryLabels: Record<CaseStudy['category'], string> = {
    misinformation: 'Misinformation',
    security: 'Security',
    alignment: 'Alignment',
    policy: 'Policy',
    accident: 'Accident',
    adversarial: 'Adversarial'
  }
  
  const categoryColors: Record<CaseStudy['category'], string> = {
    misinformation: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    security: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    alignment: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    policy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    accident: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    adversarial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  
  const severityColors: Record<CaseStudy['severity'], string> = {
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700'
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/resources/case-studies" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Back to Case Studies
              </Link>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5" />
                Case Study
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title and Metadata */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {caseStudy.title}
            </h1>
            <span 
              className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold border ${severityColors[caseStudy.severity]}`}
            >
              {caseStudy.severity.toUpperCase()}
            </span>
          </div>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            {caseStudy.summary}
          </p>
          
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
              <CalendarIcon className="h-4 w-4" />
              {formatCaseStudyDate(caseStudy.date)}
            </span>
            
            <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[caseStudy.category]}`}>
              {categoryLabels[caseStudy.category]}
            </span>
          </div>
          
          {caseStudy.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <TagIcon className="h-4 w-4 text-gray-400" />
              <div className="flex gap-2 flex-wrap">
                {caseStudy.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mt-4 mb-2">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="ml-4">
                    {children}
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900 dark:text-white">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-700 dark:text-gray-300">
                    {children}
                  </em>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 text-gray-700 dark:text-gray-300 italic">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {caseStudy.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Key Lessons */}
        {caseStudy.lessons.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8 border border-blue-200 dark:border-blue-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <LightBulbIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Key Lessons
            </h2>
            <ul className="space-y-3">
              {caseStudy.lessons.map((lesson, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-3 mt-0.5">
                    {index + 1}.
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {lesson}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Citations */}
        {caseStudy.citations.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <DocumentTextIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              Sources & Citations
            </h2>
            <div className="space-y-4">
              {caseStudy.citations.map((citation, index) => (
                <div key={index} className="border-l-4 border-gray-300 dark:border-gray-600 pl-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {citation.title}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>{citation.source}</span>
                    {citation.date && <span> • {citation.date}</span>}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    {citation.finding}
                  </p>
                  {citation.url && (
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      View source
                      <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Resources */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Related Resources
          </h3>
          <div className="space-y-2">
            <Link
              href="/journey/intermediate/advanced-red-teaming/prompt-injection-defense"
              className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              → Learn about Prompt Injection Defense
            </Link>
            <Link
              href="/journey/intermediate/advanced-red-teaming/jailbreak-techniques"
              className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              → Explore Jailbreak Techniques
            </Link>
            <Link
              href="/journey/foundation/ai-safety-landscape/risk-landscape"
              className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              → Understand the AI Risk Landscape
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}