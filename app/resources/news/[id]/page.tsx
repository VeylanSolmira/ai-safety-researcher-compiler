import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { getNewsStory, getNewsByCategory } from '@/lib/db/news-queries'
import type { NewsStory } from '@/lib/db/news-queries'
import { 
  NewspaperIcon,
  CalendarIcon,
  TagIcon,
  ArrowTopRightOnSquareIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

// Helper function for date formatting
function formatNewsDate(dateString: string): string {
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

export default function NewsStoryPage({ params }: { params: { id: string } }) {
  const story = getNewsStory(params.id)
  
  if (!story) {
    notFound()
  }
  
  // Get related stories from same category
  const relatedStories = getNewsByCategory(story.category)
    .filter(s => s.id !== story.id)
    .slice(0, 3)
  
  const categoryLabels: Record<NewsStory['category'], string> = {
    research: 'Research',
    policy: 'Policy',
    community: 'Community',
    technical: 'Technical',
    opportunity: 'Opportunity',
    general: 'General'
  }
  
  const categoryColors: Record<NewsStory['category'], string> = {
    research: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    policy: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    community: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    technical: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    opportunity: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    general: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/resources/news" 
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to News
            </Link>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatNewsDate(story.date)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {story.title}
              </h1>
              {story.featured && (
                <span className="px-3 py-1 text-sm font-semibold bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                  Featured
                </span>
              )}
            </div>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {story.summary}
            </p>
            
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
                <CalendarIcon className="h-4 w-4" />
                {formatNewsDate(story.date)}
              </span>
              
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[story.category]}`}>
                {categoryLabels[story.category]}
              </span>
              
              {story.author && (
                <span className="text-gray-500 dark:text-gray-500">
                  By {story.author}
                </span>
              )}
              
              {story.source && (
                <span className="text-gray-500 dark:text-gray-500">
                  via {story.source.name}
                </span>
              )}
            </div>
            
            {story.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-4">
                <TagIcon className="h-4 w-4 text-gray-400" />
                <div className="flex gap-2 flex-wrap">
                  {story.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Article Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <ReactMarkdown>{story.content}</ReactMarkdown>
          </div>
          
          {/* Source Link */}
          {story.source?.url && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <a
                href={story.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Read more at {story.source.name}
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>
          )}
        </article>
        
        {/* Related Stories */}
        {relatedStories.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related News
            </h2>
            <div className="grid gap-4">
              {relatedStories.map(relatedStory => (
                <Link
                  key={relatedStory.id}
                  href={`/resources/news/${relatedStory.id}`}
                  className="block group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                      {relatedStory.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {relatedStory.summary}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {formatNewsDate(relatedStory.date)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}