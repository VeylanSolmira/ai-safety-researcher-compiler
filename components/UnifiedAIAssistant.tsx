'use client'

import { useState, useEffect } from 'react'
import { useClaude } from '@/hooks/useClaude'
import { useViewMode } from '@/contexts/ViewModeContext'

interface UnifiedAIAssistantProps {
  // Content to analyze (for non-chat modes)
  content?: string
  // Section ID for default prompts
  sectionId?: string
  // Initial paradigm
  paradigmId?: string
  // Display mode
  mode?: 'chat' | 'analysis' | 'both'
  // Container styling
  className?: string
  // Show warning about AI tutors
  showWarning?: boolean
  // Custom initial message
  initialMessage?: string
}

// Helper functions for formatting
const formatParadigmName = (paradigm: string): string => {
  return paradigm
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatCategoryName = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

interface AIPrompt {
  id: string
  mode: string
  prompt: string
}

interface ExternalResource {
  id: string
  category: string
  title: string
  url: string
  description?: string
}

export default function UnifiedAIAssistant({
  content,
  sectionId = 'default',
  paradigmId,
  mode = 'both',
  className = '',
  showWarning = true,
  initialMessage
}: UnifiedAIAssistantProps) {
  const { loading, error, analyzeContent, generateQuiz, analyzeWithParadigm, chat } = useClaude()
  const { viewMode } = useViewMode()
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeTab, setActiveTab] = useState<'chat' | 'analysis'>(mode === 'chat' ? 'chat' : 'analysis')
  
  // Data state
  const [prompts, setPrompts] = useState<AIPrompt[]>([])
  const [resources, setResources] = useState<ExternalResource[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  
  // Analysis state
  const [analysisResult, setAnalysisResult] = useState<string>('')
  const [analysisMode, setAnalysisMode] = useState<'summary' | 'quiz' | 'paradigm'>('summary')
  
  // Chat state
  const [question, setQuestion] = useState('')
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'ai', content: string}>>([])
  
  // Paradigm state
  const [selectedParadigm, setSelectedParadigm] = useState<string>(paradigmId || '')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showParadigmSelector, setShowParadigmSelector] = useState(false)
  const [tutorMode, setTutorMode] = useState<'teacher' | 'adversary'>('teacher')
  
  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promptsRes, resourcesRes] = await Promise.all([
          fetch('/api/prompts'),
          fetch('/api/external-resources')
        ])
        
        if (promptsRes.ok) {
          const promptsData = await promptsRes.json()
          setPrompts(promptsData)
        }
        
        if (resourcesRes.ok) {
          const resourcesData = await resourcesRes.json()
          setResources(resourcesData)
        }
      } catch (err) {
        console.error('Failed to load assistant data:', err)
      } finally {
        setDataLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Get unique paradigm modes from prompts
  const allParadigms = [...new Set(prompts.map(p => p.mode))].filter(mode => 
    mode !== 'default' && mode !== 'teacher' && mode !== 'adversary'
  )
  
  // Build paradigm categories from the prompts
  const paradigmCategories = allParadigms.reduce((acc, paradigm) => {
    // Simple categorization based on paradigm name patterns
    let category = 'general'
    if (paradigm.includes('security') || paradigm.includes('safety')) {
      category = 'security'
    } else if (paradigm.includes('research') || paradigm.includes('science')) {
      category = 'research'
    } else if (paradigm.includes('business') || paradigm.includes('corporate')) {
      category = 'business'
    } else if (paradigm.includes('academic') || paradigm.includes('education')) {
      category = 'academic'
    }
    
    if (!acc[category]) acc[category] = []
    acc[category].push(paradigm)
    return acc
  }, {} as Record<string, string[]>)
  
  // Get appropriate system prompt based on paradigm and mode
  const getSystemPrompt = () => {
    if (selectedParadigm) {
      // Find prompt matching the paradigm and tutor mode
      const promptKey = `${selectedParadigm}-${tutorMode}-${viewMode}`
      const prompt = prompts.find(p => 
        p.mode === promptKey || 
        (p.mode === selectedParadigm && p.prompt.includes(tutorMode) && p.prompt.includes(viewMode))
      )
      if (prompt) {
        return prompt.prompt
      }
    }
    
    // Find default prompt for section
    const defaultKey = `${sectionId}-${tutorMode}-${viewMode}`
    const defaultPrompt = prompts.find(p => 
      p.mode === defaultKey ||
      (p.mode === 'default' && p.prompt.includes(tutorMode) && p.prompt.includes(viewMode))
    )
    return defaultPrompt?.prompt || 'I am an AI assistant here to help you learn about AI safety.'
  }
  
  // Generate initial message for chat
  const getInitialMessage = () => {
    if (initialMessage) return initialMessage
    
    if (selectedParadigm) {
      const paradigmName = formatParadigmName(selectedParadigm)
      if (tutorMode === 'adversary') {
        return viewMode === 'academic'
          ? `I'm viewing AI safety through the ${paradigmName} paradigm, and I'm here to challenge your assumptions. Let's examine your reasoning critically.`
          : `Looking at AI through the ${paradigmName} lens, I'm skeptical of your concerns. Let's talk about why your worries might be overblown...`
      }
      return viewMode === 'academic' 
        ? `I'm your AI Safety tutor, approaching our discussion through the ${paradigmName} paradigm. What would you like to explore from this perspective?`
        : `Hey! I'm here to help you learn about AI safety through the ${paradigmName} lens. What's on your mind?`
    }
    
    if (tutorMode === 'adversary') {
      return viewMode === 'academic'
        ? "I'm here to challenge your assumptions about AI safety. Why do you think AI poses existential risks? Let's examine your reasoning critically."
        : "So you're worried about AI taking over? Let's talk about why that might be overblown..."
    }
    
    return viewMode === 'academic' 
      ? "I'm your AI Safety tutor. I can help you understand alignment theory, interpretability research, or any concepts you're studying. What would you like to explore?"
      : "Hey! I'm here to help you learn about AI safety. What's on your mind? Any concepts confusing you?"
  }
  
  // Initialize conversation
  useEffect(() => {
    if (mode !== 'analysis') {
      setConversation([{
        role: 'ai',
        content: getInitialMessage()
      }])
    }
  }, [tutorMode, viewMode, selectedParadigm])
  
  // Analysis handlers
  const handleAnalyze = async (type: 'summary' | 'critique' | 'expand' | 'simplify') => {
    if (!content) return
    
    const analysis = await analyzeContent(content, type)
    if (analysis) {
      setAnalysisResult(analysis)
      setAnalysisMode('summary')
    }
  }
  
  const handleGenerateQuiz = async () => {
    if (!content) return
    
    const quiz = await generateQuiz(content, 3)
    if (quiz) {
      setAnalysisResult(quiz)
      setAnalysisMode('quiz')
    }
  }
  
  const handleParadigmAnalysis = async (paradigm: string) => {
    if (!content || !paradigm) return
    
    const analysis = await analyzeWithParadigm(content, paradigm, tutorMode, viewMode)
    if (analysis) {
      setAnalysisResult(analysis)
      setAnalysisMode('paradigm')
    }
  }
  
  // Chat handlers
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || loading) return
    
    // Add user question
    const newConversation = [...conversation, { role: 'user' as const, content: question }]
    setConversation(newConversation)
    setQuestion('')
    
    // Prepare messages for Claude
    const claudeMessages = newConversation.slice(1).map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }))
    
    // Get Claude's response
    const response = await chat(claudeMessages, {
      systemPrompt: getSystemPrompt(),
      maxTokens: 500,
      temperature: tutorMode === 'adversary' ? 0.8 : 0.7
    })
    
    if (response) {
      setConversation(prev => [...prev, {
        role: 'ai',
        content: response
      }])
    }
  }
  
  // Paradigm handlers
  const handleRandomParadigm = () => {
    const randomParadigm = allParadigms[Math.floor(Math.random() * allParadigms.length)]
    setSelectedParadigm(randomParadigm)
    setShowParadigmSelector(false)
    if (mode === 'analysis' && content) {
      handleParadigmAnalysis(randomParadigm)
    }
  }
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }
  
  const handleParadigmChange = (paradigm: string) => {
    setSelectedParadigm(paradigm)
    setShowParadigmSelector(false)
    if (mode === 'analysis' && content && paradigm) {
      handleParadigmAnalysis(paradigm)
    }
  }
  
  // Don't render if no content and analysis-only mode
  if (mode === 'analysis' && !content) return null
  
  return (
    <div className={className}>
      {/* Container with consistent background */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg">
        {/* Header with fixed padding */}
        <div className="flex items-center gap-2 p-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            🤖 AI Assistant
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`text-xs font-medium ${
              isExpanded 
                ? 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300' 
                : 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
            }`}
          >
            {isExpanded ? 'Hide' : 'Show'}
          </button>
        </div>
      
      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          
          <div className="space-y-3">
          {/* Warning */}
          {showWarning && mode !== 'analysis' && (
            <div className="text-center">
              <p className="text-sm">
                <span className="text-amber-600 dark:text-amber-400">⚠️ Warning:</span>{' '}
                <a 
                  href={externalResources.aiTutor.warningLink}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  There may be risks in using AI as a teacher
                </a>
              </p>
            </div>
          )}
          
          {/* Mode tabs (if both modes available) */}
          {mode === 'both' && (
            <div className="flex justify-center">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-1 flex gap-1">
                <button
                  onClick={() => setActiveTab('analysis')}
                  className={`px-3 py-1 text-xs rounded transition-all ${
                    activeTab === 'analysis' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  📊 Analysis
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-3 py-1 text-xs rounded transition-all ${
                    activeTab === 'chat' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  💬 Chat
                </button>
              </div>
            </div>
          )}
          
          {/* Tutor mode toggle */}
          <div className="flex justify-center">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-1 flex gap-1">
              <button
                onClick={() => setTutorMode('teacher')}
                className={`px-3 py-1 rounded-md text-xs transition-all ${
                  tutorMode === 'teacher' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                👩‍🏫 Teacher
              </button>
              <button
                onClick={() => setTutorMode('adversary')}
                className={`px-3 py-1 rounded-md text-xs transition-all ${
                  tutorMode === 'adversary' 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                😈 Adversary
              </button>
            </div>
          </div>
          
          {/* Paradigm selection */}
          <div className="space-y-2">
            <div className="flex justify-center gap-2">
              <button
                onClick={handleRandomParadigm}
                className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-all"
              >
                🎲 Random Paradigm
              </button>
              <button
                onClick={() => setShowParadigmSelector(!showParadigmSelector)}
                className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-all"
              >
                📋 Choose Paradigm
              </button>
              {selectedParadigm && (
                <button
                  onClick={() => setSelectedParadigm('')}
                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-all"
                >
                  ❌ Clear
                </button>
              )}
            </div>
            
            {selectedParadigm && (
              <div className="text-center text-xs text-gray-600 dark:text-gray-400">
                Current: <span className="font-semibold">{formatParadigmName(selectedParadigm)}</span>
              </div>
            )}
            
            {showParadigmSelector && (
              <div className="bg-gray-200 dark:bg-gray-700 rounded p-2 space-y-2">
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="flex-1 text-xs px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded"
                  >
                    <option value="">Select Category...</option>
                    {Object.keys(paradigmCategories).map(category => (
                      <option key={category} value={category}>
                        {formatCategoryName(category)}
                      </option>
                    ))}
                  </select>
                  
                  {selectedCategory && (
                    <select
                      value={selectedParadigm}
                      onChange={(e) => handleParadigmChange(e.target.value)}
                      className="flex-1 text-xs px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded"
                    >
                      <option value="">Select Paradigm...</option>
                      {(paradigmCategories[selectedCategory] || []).map(paradigm => (
                        <option key={paradigm} value={paradigm}>
                          {formatParadigmName(paradigm)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Analysis mode */}
          {(mode === 'analysis' || (mode === 'both' && activeTab === 'analysis')) && content && (
            <div className="space-y-3">
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
              
              {analysisResult && !loading && (
                <div className="bg-white dark:bg-gray-900 rounded p-3 text-sm">
                  <div className="prose dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans">{analysisResult}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Chat mode */}
          {(mode === 'chat' || (mode === 'both' && activeTab === 'chat')) && (
            <div className="space-y-3">
              <div className="overflow-y-auto space-y-2 max-h-[300px] min-h-[200px] p-2 bg-white dark:bg-gray-900 rounded">
                {conversation.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : tutorMode === 'adversary'
                        ? 'bg-red-100 dark:bg-red-900/20 text-gray-800 dark:text-gray-200 border border-red-300 dark:border-red-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={tutorMode === 'adversary' ? "Defend your position..." : "Ask a question..."}
                  className="flex-1 px-3 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                  disabled={loading}
                >
                  Send
                </button>
              </form>
            </div>
          )}
          
          {/* Loading state */}
          {loading && (
            <div className="text-sm text-gray-500 animate-pulse text-center">
              Claude is thinking...
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 text-center">
              Error: {error}
            </div>
          )}
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            🤖 Powered by Claude AI • {tutorMode === 'adversary' ? 'Adversarial' : 'Supportive'} mode
          </p>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}