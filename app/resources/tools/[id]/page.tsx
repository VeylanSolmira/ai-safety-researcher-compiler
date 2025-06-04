'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Github, Book, FileText, Globe, Package, CheckCircle, XCircle, Tag, Code } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface ToolExample {
  id: string
  title: string
  description?: string
  code: string
  language: string
  example_type: string
}

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
  difficulty_level: string
  tool_type: string
  programming_languages?: string[]
  is_open_source: boolean
  maintained: boolean
  created_by?: string
  key_papers?: string[]
  related_tools?: string[]
  installation_guide?: string
  quick_start?: string
  tags?: string[]
  examples?: ToolExample[]
}

export default function ToolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTool()
  }, [params.id])

  const fetchTool = async () => {
    try {
      const response = await fetch(`/api/tools/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch tool')
      }
      const data = await response.json()
      setTool(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">{error || 'Tool not found'}</p>
          </div>
          <button
            onClick={() => router.push('/resources/tools')}
            className="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </button>
        </div>
      </div>
    )
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'advanced': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/resources/tools')}
          className="mb-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {tool.name}
            </h1>
            <div className="flex items-center gap-2">
              {tool.is_open_source && (
                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Open Source
                </span>
              )}
              {tool.maintained ? (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-xs flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Maintained
                </span>
              ) : (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full text-xs flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Not Maintained
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {tool.description}
          </p>

          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Category</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">{tool.category}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Type</span>
              <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">{tool.tool_type}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Difficulty</span>
              <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tool.difficulty_level)}`}>
                {tool.difficulty_level}
              </p>
            </div>
            {tool.created_by && (
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Created By</span>
                <p className="font-medium text-gray-900 dark:text-gray-100">{tool.created_by}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-gray-400" />
              {tool.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tool.github_url && (
              <a
                href={tool.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-gray-100">GitHub Repository</span>
              </a>
            )}
            {tool.documentation_url && (
              <a
                href={tool.documentation_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <Book className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-gray-100">Documentation</span>
              </a>
            )}
            {tool.url && (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-gray-100">Website</span>
              </a>
            )}
            {tool.key_papers && tool.key_papers.length > 0 && (
              <div className="col-span-full">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Key Papers</h3>
                {tool.key_papers.map((paper, index) => (
                  <a
                    key={index}
                    href={paper}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors mb-2"
                  >
                    <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-100">{paper}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Use Cases & Research Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {tool.research_areas && tool.research_areas.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Research Areas</h2>
              <ul className="space-y-2">
                {tool.research_areas.map((area, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700 dark:text-gray-300">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {tool.use_cases && tool.use_cases.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Use Cases</h2>
              <ul className="space-y-2">
                {tool.use_cases.map((useCase, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700 dark:text-gray-300">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Installation & Quick Start */}
        {(tool.installation_guide || tool.quick_start) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Getting Started</h2>
            {tool.installation_guide && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Installation
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <code className="text-sm text-gray-800 dark:text-gray-200">{tool.installation_guide}</code>
                </div>
              </div>
            )}
            {tool.quick_start && (
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Quick Start
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm text-gray-800 dark:text-gray-200">
                    <code>{tool.quick_start}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Examples */}
        {tool.examples && tool.examples.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Examples</h2>
            <div className="space-y-6">
              {tool.examples.map((example) => (
                <div key={example.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                  <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100 mb-2">
                    {example.title}
                  </h3>
                  {example.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{example.description}</p>
                  )}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      <code className={`language-${example.language}`}>{example.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}