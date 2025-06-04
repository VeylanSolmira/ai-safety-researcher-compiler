'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BeakerIcon, 
  CodeBracketIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CpuChipIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon,
  ArrowTopRightOnSquareIcon,
  FunnelIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface Tool {
  id: string
  name: string
  description: string
  category: string
  subcategory?: string
  url?: string
  github_url?: string
  documentation_url?: string
  research_areas: string[]
  use_cases?: string[]
  difficulty_level?: string
  tool_type?: string
  programming_languages?: string[]
  is_open_source: boolean
  maintained: boolean
  created_by?: string
}

interface ToolsResponse {
  tools: Tool[]
  categories: string[]
  tags: string[]
  total: number
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Alignment Techniques': AdjustmentsHorizontalIcon,
  'Interpretability': EyeIcon,
  'Robustness & Security': ShieldCheckIcon,
  'Evaluation & Benchmarking': ChartBarIcon,
  'Governance & Policy': BeakerIcon,
  'Multi-Agent Systems': CpuChipIcon,
  'Training & Fine-tuning': CodeBracketIcon,
  'Monitoring & Observability': EyeIcon
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  advanced: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  expert: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchTools()
  }, [selectedCategory, selectedType, selectedTag])

  const fetchTools = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory)
      if (selectedType) params.append('type', selectedType)
      if (selectedTag) params.append('tag', selectedTag)

      const response = await fetch(`/api/tools${params.toString() ? `?${params}` : ''}`)
      const data: ToolsResponse = await response.json()
      
      setTools(data.tools)
      setCategories(data.categories)
      setTags(data.tags)
    } catch (error) {
      console.error('Error fetching tools:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedType(null)
    setSelectedTag(null)
  }

  const hasActiveFilters = selectedCategory || selectedType || selectedTag

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
                AI Safety Tools & Frameworks
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                View: {viewMode === 'grid' ? 'Grid' : 'List'}
              </button>
              <Link
                href="/journey"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                Return to Journey →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FunnelIcon className="h-5 w-5" />
              Filters
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tool Type
              </label>
              <select
                value={selectedType || ''}
                onChange={(e) => setSelectedType(e.target.value || null)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="library">Library</option>
                <option value="framework">Framework</option>
                <option value="platform">Platform</option>
                <option value="dataset">Dataset</option>
                <option value="benchmark">Benchmark</option>
                <option value="evaluation">Evaluation</option>
                <option value="visualization">Visualization</option>
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tag
              </label>
              <select
                value={selectedTag || ''}
                onChange={(e) => setSelectedTag(e.target.value || null)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Tags</option>
                {tags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {tools.length} {tools.length === 1 ? 'tool' : 'tools'}
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>

        {/* Tools Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : tools.length === 0 ? (
          <div className="text-center py-12">
            <BeakerIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No tools found. Try adjusting your filters.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {tools.map(tool => (
              <ToolListItem key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        {/* Coming Soon Message */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
          <p className="text-blue-800 dark:text-blue-200">
            This is a preview of the Tools & Frameworks section. More tools are being added regularly.
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
            Have a tool to suggest?{' '}
            <a
              href="https://github.com/yourusername/ai-safety-research-compiler/issues"
              className="underline hover:no-underline"
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

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = categoryIcons[tool.category] || BeakerIcon

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <div className="flex items-center gap-2">
          {tool.is_open_source && (
            <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
              Open Source
            </span>
          )}
          {tool.maintained ? (
            <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" title="Actively maintained" />
          ) : (
            <XCircleIcon className="h-4 w-4 text-gray-400" title="Not actively maintained" />
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {tool.name}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {tool.description}
      </p>

      {tool.difficulty_level && (
        <span className={`inline-block text-xs px-2 py-1 rounded-full ${difficultyColors[tool.difficulty_level]} mb-3`}>
          {tool.difficulty_level}
        </span>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {tool.research_areas.slice(0, 3).map(area => (
          <span key={area} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
            {area}
          </span>
        ))}
        {tool.research_areas.length > 3 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            +{tool.research_areas.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {tool.github_url && (
          <a
            href={tool.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
          >
            GitHub
            <ArrowTopRightOnSquareIcon className="h-3 w-3" />
          </a>
        )}
        {tool.documentation_url && (
          <a
            href={tool.documentation_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
          >
            Docs
            <ArrowTopRightOnSquareIcon className="h-3 w-3" />
          </a>
        )}
        <Link
          href={`/resources/tools/${tool.id}`}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white ml-auto"
        >
          Details →
        </Link>
      </div>
    </div>
  )
}

function ToolListItem({ tool }: { tool: Tool }) {
  const Icon = categoryIcons[tool.category] || BeakerIcon

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {tool.name}
            </h3>
            <div className="flex items-center gap-2">
              {tool.is_open_source && (
                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                  Open Source
                </span>
              )}
              {tool.maintained ? (
                <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" title="Actively maintained" />
              ) : (
                <XCircleIcon className="h-4 w-4 text-gray-400" title="Not actively maintained" />
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {tool.description}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Category: {tool.category}
            </span>
            {tool.difficulty_level && (
              <span className={`px-2 py-1 rounded-full ${difficultyColors[tool.difficulty_level]}`}>
                {tool.difficulty_level}
              </span>
            )}
            <div className="flex items-center gap-3 ml-auto">
              {tool.github_url && (
                <a
                  href={tool.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
                >
                  GitHub
                  <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                </a>
              )}
              <Link
                href={`/resources/tools/${tool.id}`}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}