'use client'

import { useState } from 'react'

export interface AssessmentQuestion {
  question: string
  options: string[]
  correct: number
  explanation?: string
}

interface AssessmentProps {
  title?: string
  questions: AssessmentQuestion[]
  onComplete?: (score: number, total: number) => void
  showExplanations?: boolean
  customSuccessMessage?: (score: number, total: number) => string
}

export default function Assessment({ 
  title = "Knowledge Check",
  questions, 
  onComplete,
  showExplanations = true,
  customSuccessMessage
}: AssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = {...answers, [currentQuestion]: answerIndex}
    setAnswers(newAnswers)
    
    // Show explanation if enabled and answer is wrong
    if (showExplanations && answerIndex !== questions[currentQuestion].correct) {
      setShowExplanation(true)
    } else {
      // Auto-advance to next question
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
          setShowExplanation(false)
        } else {
          // Calculate score and show results
          const score = Object.entries(newAnswers).filter(
            ([q, a]) => a === questions[parseInt(q)].correct
          ).length
          
          setShowResults(true)
          onComplete?.(score, questions.length)
        }
      }, 500)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    }
  }

  const handleRetry = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setShowExplanation(false)
  }

  if (showResults) {
    const score = Object.entries(answers).filter(
      ([q, a]) => a === questions[parseInt(q)].correct
    ).length
    
    const percentage = Math.round((score / questions.length) * 100)
    
    return (
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">Assessment Complete!</h3>
        
        <div className="text-lg">
          You scored <span className="font-bold text-blue-600 dark:text-blue-400">{score}</span> out of {questions.length}
        </div>
        
        <div className="w-32 h-32 mx-auto relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className={percentage >= 80 ? 'text-green-500' : percentage >= 60 ? 'text-yellow-500' : 'text-red-500'}
              strokeDasharray={`${(percentage / 100) * 351.86} 351.86`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold">{percentage}%</span>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-left max-w-md mx-auto">
          {customSuccessMessage ? (
            <p className="text-sm">{customSuccessMessage(score, questions.length)}</p>
          ) : (
            <div>
              <h4 className="font-semibold mb-2">
                {percentage >= 80 ? '🎉 Excellent Work!' : percentage >= 60 ? '👍 Good Progress!' : '💪 Keep Learning!'}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {percentage >= 80 
                  ? "You've demonstrated strong understanding of this material."
                  : percentage >= 60 
                  ? "You're on the right track. Review any concepts you missed."
                  : "Consider reviewing the material before moving on."}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleRetry}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const hasAnswered = answers[currentQuestion] !== undefined

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      <p className="text-lg mb-6">{currentQ.question}</p>

      <div className="space-y-3">
        {currentQ.options.map((option, i) => {
          const isSelected = answers[currentQuestion] === i
          const isCorrect = i === currentQ.correct
          const showFeedback = hasAnswered && (isSelected || (showExplanation && isCorrect))
          
          return (
            <button
              key={i}
              onClick={() => !hasAnswered && handleAnswer(i)}
              disabled={hasAnswered}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                !hasAnswered 
                  ? 'hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer'
                  : showFeedback
                    ? isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  showFeedback && isCorrect
                    ? 'border-green-500 bg-green-500 text-white'
                    : showFeedback && isSelected && !isCorrect
                    ? 'border-red-500 bg-red-500 text-white'
                    : 'border-gray-300'
                }`}>
                  {showFeedback && isCorrect && '✓'}
                  {showFeedback && isSelected && !isCorrect && '✗'}
                </div>
                <span className={showFeedback && isCorrect ? 'font-semibold' : ''}>
                  {option}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {showExplanation && currentQ.explanation && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm font-semibold mb-1">Explanation:</p>
          <p className="text-sm">{currentQ.explanation}</p>
        </div>
      )}

      {/* Navigation for wrong answers */}
      {hasAnswered && answers[currentQuestion] !== currentQ.correct && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Next Question →
          </button>
        </div>
      )}
    </div>
  )
}

// Pre-built assessment templates for common section types
export const assessmentTemplates = {
  conceptual: (concepts: string[]): AssessmentQuestion[] => [
    {
      question: `Which of the following best describes ${concepts[0]}?`,
      options: [
        "Option A - incorrect definition",
        "Option B - correct definition",
        "Option C - common misconception",
        "Option D - partial understanding"
      ],
      correct: 1,
      explanation: "This is the correct definition because..."
    }
  ],
  
  practical: (task: string): AssessmentQuestion[] => [
    {
      question: `What is the first step when ${task}?`,
      options: [
        "Incorrect first step",
        "Correct first step",
        "Common mistake",
        "Step that comes later"
      ],
      correct: 1,
      explanation: "Starting with this step ensures..."
    }
  ],
  
  safety: (risk: string): AssessmentQuestion[] => [
    {
      question: `What is the primary concern with ${risk}?`,
      options: [
        "Minor concern",
        "Primary safety concern",
        "Unrelated issue", 
        "Future consideration"
      ],
      correct: 1,
      explanation: "This is the primary concern because..."
    }
  ]
}