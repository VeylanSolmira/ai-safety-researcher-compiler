'use client'

import { useState, useCallback } from 'react'

export interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

interface UseClaudeReturn {
  loading: boolean
  error: string | null
  
  // Chat with Claude
  chat: (messages: ClaudeMessage[], options?: any) => Promise<string | null>
  
  // Analyze content
  analyzeContent: (
    content: string, 
    type?: 'summary' | 'critique' | 'expand' | 'simplify'
  ) => Promise<string | null>
  
  // Generate quiz
  generateQuiz: (content: string, count?: number) => Promise<string | null>
  
  // Analyze with paradigm
  analyzeWithParadigm: (
    content: string,
    paradigm: string,
    mode?: 'teacher' | 'adversary',
    style?: 'academic' | 'personal'
  ) => Promise<string | null>
}

export function useClaude(): UseClaudeReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const makeRequest = useCallback(async (body: any): Promise<string | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Request failed')
      }
      
      return data.result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const chat = useCallback(async (messages: ClaudeMessage[], options?: any) => {
    return makeRequest({ action: 'chat', messages, options })
  }, [makeRequest])

  const analyzeContent = useCallback(async (
    content: string,
    analysisType: 'summary' | 'critique' | 'expand' | 'simplify' = 'summary'
  ) => {
    return makeRequest({ action: 'analyze', content, analysisType })
  }, [makeRequest])

  const generateQuiz = useCallback(async (content: string, count: number = 5) => {
    return makeRequest({ action: 'quiz', content, count })
  }, [makeRequest])

  const analyzeWithParadigm = useCallback(async (
    content: string,
    paradigm: string,
    mode: 'teacher' | 'adversary' = 'teacher',
    style: 'academic' | 'personal' = 'academic'
  ) => {
    return makeRequest({ action: 'paradigm', content, paradigm, mode, style })
  }, [makeRequest])

  return {
    loading,
    error,
    chat,
    analyzeContent,
    generateQuiz,
    analyzeWithParadigm
  }
}