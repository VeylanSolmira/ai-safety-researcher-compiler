'use client'

import { useState } from 'react'
import UnifiedAIAssistant from '@/components/UnifiedAIAssistant'

interface InteractiveTransitionProps {
  fromSection: string
  toSection: string
  sectionId?: string // To determine which prompts to use
  paradigmId?: string // Specific paradigm for focused discussion
}

export default function InteractiveTransition({ sectionId = 'default', paradigmId }: InteractiveTransitionProps) {
  const [activeTab, setActiveTab] = useState<'ai-teacher' | 'quiz'>('ai-teacher')

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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {activeTab === 'ai-teacher' && (
          <UnifiedAIAssistant
            mode="chat"
            sectionId={sectionId}
            paradigmId={paradigmId}
            showWarning={true}
            className=""
          />
        )}
        {activeTab === 'quiz' && <ReadinessQuiz />}
      </div>
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