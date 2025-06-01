'use client'

import { useState } from 'react'
import { useClaude } from '@/hooks/useClaude'

interface ClaudeAssistantProps {
  content?: string
  className?: string
}

export default function ClaudeAssistant({ content, className = '' }: ClaudeAssistantProps) {
  const { loading, error, analyzeContent, generateQuiz } = useClaude()
  const [result, setResult] = useState<string>('')
  const [mode, setMode] = useState<'hidden' | 'summary' | 'quiz'>('hidden')

  const handleAnalyze = async (type: 'summary' | 'critique' | 'expand' | 'simplify') => {
    if (!content) return
    
    const analysis = await analyzeContent(content, type)
    if (analysis) {
      setResult(analysis)
      setMode('summary')
    }
  }

  const handleGenerateQuiz = async () => {
    if (!content) return
    
    const quiz = await generateQuiz(content, 3)
    if (quiz) {
      setResult(quiz)
      setMode('quiz')
    }
  }

  if (!content) return null

  return (
    <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          🤖 Claude Assistant
        </h3>
        <button
          onClick={() => setMode(mode === 'hidden' ? 'summary' : 'hidden')}
          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {mode === 'hidden' ? 'Show' : 'Hide'}
        </button>
      </div>

      {mode !== 'hidden' && (
        <div className="space-y-3">
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleAnalyze('summary')}
              disabled={loading}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Summarize
            </button>
            <button
              onClick={() => handleAnalyze('simplify')}
              disabled={loading}
              className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Simplify
            </button>
            <button
              onClick={() => handleAnalyze('expand')}
              disabled={loading}
              className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              Expand
            </button>
            <button
              onClick={() => handleAnalyze('critique')}
              disabled={loading}
              className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
            >
              Critique
            </button>
            <button
              onClick={handleGenerateQuiz}
              disabled={loading}
              className="px-3 py-1 text-xs bg-pink-500 text-white rounded hover:bg-pink-600 disabled:opacity-50"
            >
              Generate Quiz
            </button>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="text-sm text-gray-500 animate-pulse">
              Claude is thinking...
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              Error: {error}
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="bg-white dark:bg-gray-900 rounded p-3 text-sm">
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans">{result}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}