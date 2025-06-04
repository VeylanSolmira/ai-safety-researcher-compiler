'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'

interface ExperimentPageProps {
  params: {
    experimentId: string
  }
}

interface Experiment {
  id: string
  metadata: {
    title: string
    description: string
    estimatedTime: string
    prerequisites?: string[]
    relatedTopic?: string
    tags?: string[]
    notebookUrl?: string
    githubUrl?: string
    nextExperiment?: string
  }
  content: {
    introduction: string
    keyConcepts?: Array<{
      title: string
      description: string
    }>
    exercises?: Array<{
      title: string
      description: string
      hint?: string
    }>
    reflectionQuestions?: string[]
  }
}

export default function ExperimentPage({ params }: ExperimentPageProps) {
  const router = useRouter()
  const [experiment, setExperiment] = useState<Experiment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadExperiment = async () => {
      try {
        const response = await fetch(`/api/experiments/${params.experimentId}`)
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/highlights')
            return
          }
          throw new Error('Failed to fetch experiment')
        }
        
        const data = await response.json()
        setExperiment(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load experiment')
      } finally {
        setLoading(false)
      }
    }

    loadExperiment()
  }, [params.experimentId, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading experiment...</div>
      </div>
    )
  }

  if (error || !experiment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error || 'Experiment not found'}
          </h1>
          <Link 
            href="/highlights" 
            className="text-blue-600 hover:underline"
          >
            ← Back to Highlights
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <PageHeader 
          backLink={{ 
            href: experiment.metadata?.relatedTopic ? `/journey/study-risks/${experiment.metadata.relatedTopic}` : '/highlights', 
            label: 'Back' 
          }}
          showViewModeToggle={false}
        />

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/journey" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                Journey
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link href="/highlights" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                Highlights
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-700 dark:text-gray-300">
              Experiment
            </li>
          </ol>
        </nav>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
                Interactive Experiment
              </span>
              <span>⏱️ {experiment.metadata.estimatedTime}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{experiment.metadata.title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {experiment.metadata.description}
            </p>
          </div>

          {/* Prerequisites */}
          {experiment.metadata.prerequisites && (
            <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h3 className="font-semibold mb-2">Prerequisites</h3>
              <ul className="list-disc list-inside text-sm">
                {experiment.metadata.prerequisites.map((prereq: string, index: number) => (
                  <li key={index}>{prereq}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {experiment.content.introduction}
              </p>
            </section>

            {/* Notebook Embed or Link */}
            <section className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">🧪 Interactive Notebook</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                This experiment includes hands-on coding exercises. You can run the code directly in your browser.
              </p>
              
              {experiment.metadata.notebookUrl ? (
                <div className="space-y-4">
                  <a 
                    href={experiment.metadata.notebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Open in Google Colab
                  </a>
                  
                  {experiment.metadata.githubUrl && (
                    <a 
                      href={experiment.metadata.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block ml-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      View on GitHub
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 italic">
                  Notebook coming soon...
                </p>
              )}
            </section>

            {/* Key Concepts */}
            {experiment.content.keyConcepts && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Key Concepts</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {experiment.content.keyConcepts.map((concept: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h3 className="font-semibold mb-2">{concept.title}</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {concept.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Exercises */}
            {experiment.content.exercises && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Exercises</h2>
                <ol className="space-y-4">
                  {experiment.content.exercises.map((exercise: any, index: number) => (
                    <li key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h3 className="font-semibold mb-2">{index + 1}. {exercise.title}</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">
                        {exercise.description}
                      </p>
                      {exercise.hint && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm text-blue-600 dark:text-blue-400">
                            Need a hint?
                          </summary>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {exercise.hint}
                          </p>
                        </details>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Reflection Questions */}
            {experiment.content.reflectionQuestions && (
              <section className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">🤔 Reflection Questions</h2>
                <ul className="space-y-3">
                  {experiment.content.reflectionQuestions.map((question: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-600 dark:text-purple-400">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{question}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Tags */}
          {experiment.metadata.tags && (
            <div className="flex flex-wrap gap-2 mt-8">
              {experiment.metadata.tags.map((tag: string) => (
                <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/highlights"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← Back to Highlights
            </Link>

            {experiment.metadata.nextExperiment && (
              <Link
                href={`/journey/deep-dives/experiments/${experiment.metadata.nextExperiment}`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Next Experiment →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}