'use client'

import { useState, useEffect } from 'react'
import { useViewMode } from '@/contexts/ViewModeContext'
import { externalResources } from '@/lib/external-resources'
import { useClaude } from '@/hooks/useClaude'

interface InteractiveTransitionProps {
  fromSection: string
  toSection: string
  sectionId?: string // To determine which prompts to use
}

export default function InteractiveTransition({ fromSection, toSection, sectionId = 'default' }: InteractiveTransitionProps) {
  const [activeTab, setActiveTab] = useState<'ai-teacher' | 'quiz'>('ai-teacher')
  const [tutorMode, setTutorMode] = useState<'teacher' | 'adversary'>('teacher')
  const { viewMode } = useViewMode()

  return (
    <div className="my-12 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Interactive Learning Tools
      </h2>
      
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 flex gap-1">
          <button
            onClick={() => setActiveTab('ai-teacher')}
            className={`px-4 py-2 rounded-md transition-all ${
              activeTab === 'ai-teacher' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            🤖 AI Safety Tutor
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-md transition-all ${
              activeTab === 'quiz' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            ✅ Readiness Check
          </button>
        </div>
      </div>

      {/* Content Areas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-h-[400px]">
        {activeTab === 'ai-teacher' && (
          <AITeacher 
            viewMode={viewMode} 
            sectionId={sectionId} 
            tutorMode={tutorMode} 
            setTutorMode={setTutorMode} 
          />
        )}
        {activeTab === 'quiz' && <ReadinessQuiz />}
      </div>
    </div>
  )
}


// AI Teacher Component with Claude integration
function AITeacher({ 
  viewMode, 
  sectionId, 
  tutorMode,
  setTutorMode 
}: { 
  viewMode: 'academic' | 'personal'
  sectionId: string
  tutorMode: 'teacher' | 'adversary'
  setTutorMode: (mode: 'teacher' | 'adversary') => void
}) {
  const [question, setQuestion] = useState('')
  const { chat, loading, error } = useClaude()
  
  // Get appropriate system prompt based on section and mode
  const getSystemPrompt = () => {
    if (tutorMode === 'adversary') {
      return viewMode === 'academic'
        ? `You are an AI safety adversary challenging the user's assumptions. Be intellectually rigorous but respectful. 
           Challenge their reasoning, point out potential flaws, and present counterarguments. 
           Focus on: orthogonality thesis, instrumental convergence, mesa-optimization, and alignment difficulties.
           Stay in character as someone skeptical of AI safety concerns but engage substantively.`
        : `You're playing devil's advocate about AI safety in a casual way. 
           Challenge the user's concerns but keep it conversational. 
           Question whether AI risk is real, suggest it might be hype, but engage with their actual arguments.`
    }
    
    return viewMode === 'academic' 
      ? `You are an expert AI safety tutor with deep knowledge of alignment, interpretability, and x-risk.
         Provide rigorous, technically accurate responses. Reference key papers and researchers when relevant.
         Help the user understand complex concepts while maintaining academic standards.
         Current section context: ${sectionId}`
      : `You're a friendly AI safety guide helping someone learn. 
         Keep explanations clear and engaging. Use analogies and examples.
         Be encouraging but accurate. Help them see why this stuff matters.
         Current section context: ${sectionId}`
  }
  
  const getInitialMessage = () => {
    if (tutorMode === 'adversary') {
      return viewMode === 'academic'
        ? "I'm here to challenge your assumptions about AI safety. Why do you think AI poses existential risks? Let's examine your reasoning critically."
        : "So you're worried about AI taking over? Let's talk about why that might be overblown..."
    }
    
    return viewMode === 'academic' 
      ? "I'm your AI Safety tutor. I can help you understand alignment theory, interpretability research, or any concepts you're studying. What would you like to explore?"
      : "Hey! I'm here to help you learn about AI safety. What's on your mind? Any concepts confusing you?"
  }
  
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'ai', content: string}>>([
    {
      role: 'ai',
      content: getInitialMessage()
    }
  ])
  
  // Update conversation when mode or view changes
  useEffect(() => {
    setConversation([{
      role: 'ai',
      content: getInitialMessage()
    }])
  }, [tutorMode, viewMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || loading) return

    // Add user question
    const newConversation = [...conversation, { role: 'user', content: question }]
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

  return (
    <div className="flex flex-col h-full">
      {/* Warning about AI teacher risks */}
      <div className="mb-3 text-center">
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

      {/* Mode Toggle */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex gap-1">
          <button
            onClick={() => {
              setTutorMode('teacher')
            }}
            className={`px-3 py-1 rounded-md text-sm transition-all ${
              tutorMode === 'teacher' 
                ? 'bg-green-600 text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            👩‍🏫 Teacher Mode
          </button>
          <button
            onClick={() => {
              setTutorMode('adversary')
            }}
            className={`px-3 py-1 rounded-md text-sm transition-all ${
              tutorMode === 'adversary' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            😈 Adversary Mode
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[250px]">
        {conversation.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white' 
                : tutorMode === 'adversary'
                ? 'bg-red-100 dark:bg-red-900/20 text-gray-800 dark:text-gray-200 border border-red-300 dark:border-red-700'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={tutorMode === 'adversary' ? "Defend your position..." : "Ask about prerequisites, foundations, or your learning path..."}
          className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>

      {error && (
        <p className="text-xs text-red-500 mt-2 text-center">
          Error: {error}
        </p>
      )}
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        🤖 Powered by Claude AI • {tutorMode === 'adversary' ? 'Adversarial' : 'Supportive'} mode
      </p>
    </div>
  )
}

// Readiness Quiz Component
function ReadinessQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  const questions = [
    {
      question: "How would you describe the relationship between STEM optimization and AI risk?",
      options: [
        "STEM approaches are the only reliable path to AI safety",
        "STEM creates risks through narrow optimization but is still necessary",
        "We should abandon STEM approaches entirely",
        "STEM and ethics are completely separate domains"
      ],
      correct: 1
    },
    {
      question: "What's most important when approaching AI safety research?",
      options: [
        "Mathematical brilliance above all else",
        "Following established research consensus",
        "Balancing technical knowledge with ethical grounding",
        "Focusing only on immediate practical applications"
      ],
      correct: 2
    },
    {
      question: "How should we think about value pluralism in AI safety?",
      options: [
        "Find the one correct value system and optimize for it",
        "Acknowledge multiple valid approaches while maintaining critical thinking",
        "Values don't matter, only technical solutions do",
        "Every opinion is equally valid regardless of evidence"
      ],
      correct: 1
    }
  ]

  const handleAnswer = (answer: number) => {
    setAnswers({...answers, [currentQuestion]: questions[currentQuestion].options[answer]})
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  if (showResults) {
    const score = Object.keys(answers).filter(
      (q) => answers[parseInt(q)] === questions[parseInt(q)].options[questions[parseInt(q)].correct]
    ).length

    return (
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">Your Results</h3>
        <p className="text-lg">You got {score} out of {questions.length} correct!</p>
        
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-left">
          <h4 className="font-semibold mb-2">Key Takeaways:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>AI safety requires both technical depth and ethical grounding</li>
            <li>Value pluralism doesn&apos;t mean relativism - evidence and reasoning matter</li>
            <li>The intersection of STEM and ethics is where safety research happens</li>
          </ul>
        </div>

        <button
          onClick={() => {
            setCurrentQuestion(0)
            setAnswers({})
            setShowResults(false)
          }}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Question {currentQuestion + 1} of {questions.length}</h3>
        <div className="text-sm text-gray-500">
          Progress: {Object.keys(answers).length}/{questions.length}
        </div>
      </div>

      <p className="text-lg mb-6">{questions[currentQuestion].question}</p>

      <div className="space-y-3">
        {questions[currentQuestion].options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className="w-full text-left p-4 rounded-lg border hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}