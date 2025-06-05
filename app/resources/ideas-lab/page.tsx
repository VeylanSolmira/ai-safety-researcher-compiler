'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  LightBulbIcon, 
  BeakerIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import ReactMarkdown from 'react-markdown'
import type { Idea } from '@/lib/db/ideas-queries'

export default function IdeasLabPage() {
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [percolatingIdeas, setPercolatingIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch ideas from API
  useEffect(() => {
    async function fetchIdeas() {
      try {
        const response = await fetch('/api/ideas')
        if (!response.ok) throw new Error('Failed to fetch ideas')
        const data = await response.json() as any as any
        setPercolatingIdeas(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load ideas')
      } finally {
        setLoading(false)
      }
    }
    
    fetchIdeas()
  }, [])

  const filteredIdeas = percolatingIdeas.filter(idea =>
    idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const selectedIdeaData = selectedIdea 
    ? percolatingIdeas.find(idea => idea.id === selectedIdea)
    : null

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
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BeakerIcon className="h-5 w-5" />
                Ideas Lab
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Intro Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <SparklesIcon className="h-8 w-8 text-yellow-500" />
            AI Safety Ideas Lab
          </h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-800 dark:text-yellow-200 font-medium mb-1">
                  Experimental Content Zone
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  This section contains percolating ideas, rough drafts, and experimental thoughts that aren't yet ready 
                  for the main curriculum. Content here is speculative, possibly controversial, and definitely not polished. 
                  Think of it as a public notebook for AI safety musings.
                </p>
              </div>
            </div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A scratchpad for lower-quality ideas, contrarian takes, and half-baked thoughts that might someday 
            graduate to the main curriculum—or might just spark interesting discussions.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="search"
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ideas List */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Percolating Ideas ({filteredIdeas.length})
            </h3>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading ideas...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredIdeas.map(idea => (
                <button
                  key={idea.id}
                  onClick={() => setSelectedIdea(idea.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedIdea === idea.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <LightBulbIcon className={`h-5 w-5 mt-0.5 ${
                      selectedIdea === idea.id 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-400'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {idea.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {idea.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {idea.tags.map(tag => (
                          <span 
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>Quality: {idea.quality}/5</span>
                        <span>•</span>
                        <span>{idea.status}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filteredIdeas.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No ideas match your search
              </div>
            )}
          </div>

          {/* Selected Idea Content */}
          <div className="lg:col-span-2">
            {selectedIdeaData ? (
              <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <header className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedIdeaData.status === 'raw' 
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        : selectedIdeaData.status === 'developing'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    }`}>
                      {selectedIdeaData.status}
                    </span>
                    <span>•</span>
                    <span>Quality: {'⭐'.repeat(selectedIdeaData.quality)}{'☆'.repeat(5 - selectedIdeaData.quality)}</span>
                    <span>•</span>
                    <span>{selectedIdeaData.date}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedIdeaData.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedIdeaData.description}
                  </p>
                  {selectedIdeaData.author && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      By {selectedIdeaData.author}
                    </p>
                  )}
                </header>

                {selectedIdeaData.warning && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      <strong>Note:</strong> {selectedIdeaData.warning}
                    </p>
                  </div>
                )}

                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{selectedIdeaData.content}</ReactMarkdown>
                </div>

                {selectedIdeaData.questions && selectedIdeaData.questions.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Open Questions
                    </h3>
                    <ul className="space-y-2">
                      {selectedIdeaData.questions.map((question, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">?</span>
                          <span className="text-gray-600 dark:text-gray-400">{question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedIdeaData.relatedIdeas && selectedIdeaData.relatedIdeas.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Related Ideas:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedIdeaData.relatedIdeas.map(relatedId => {
                        const related = percolatingIdeas.find(i => i.id === relatedId)
                        return related ? (
                          <button
                            key={relatedId}
                            onClick={() => setSelectedIdea(relatedId)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {related.title}
                          </button>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </article>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
                <LightBulbIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Select an idea from the list to view its content
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Idea CTA */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Have a wild AI safety idea?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This lab thrives on unconventional thinking. If you have a half-baked idea, contrarian take, 
            or experimental thought about AI safety, we'd love to add it to the collection.
          </p>
          <a
            href="https://github.com/YourUsername/ai-safety-research-compiler/issues/new?title=Ideas%20Lab%20Submission"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SparklesIcon className="h-5 w-5" />
            Submit an Idea
          </a>
        </div>
      </main>
    </div>
  )
}