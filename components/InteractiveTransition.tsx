'use client'

import { useState } from 'react'
import { useViewMode } from '@/contexts/ViewModeContext'
import { externalResources } from '@/lib/external-resources'

interface InteractiveTransitionProps {
  fromSection: string
  toSection: string
  sectionId?: string // To determine which prompts to use
}

export default function InteractiveTransition({ fromSection, toSection, sectionId = 'default' }: InteractiveTransitionProps) {
  const [activeTab, setActiveTab] = useState<'compass' | 'ai-teacher' | 'quiz'>('compass')
  const [tutorMode, setTutorMode] = useState<'teacher' | 'adversary'>('teacher')
  const { viewMode } = useViewMode()

  return (
    <div className="my-12 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Bridge to Foundations
      </h2>
      
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 flex gap-1">
          <button
            onClick={() => setActiveTab('compass')}
            className={`px-4 py-2 rounded-md transition-all ${
              activeTab === 'compass' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            🧭 Your AI Safety Compass
          </button>
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
        {activeTab === 'compass' && <AICompass />}
        {activeTab === 'ai-teacher' && <AITeacher viewMode={viewMode} sectionId={sectionId} tutorMode={tutorMode} setTutorMode={setTutorMode} />}
        {activeTab === 'quiz' && <ReadinessQuiz />}
      </div>
    </div>
  )
}

// AI Safety Compass Component
function AICompass() {
  const [values, setValues] = useState({
    timeHorizon: 50, // 0 = near-term, 100 = long-term
    approach: 50,    // 0 = technical, 100 = governance
    focus: 50,       // 0 = capability, 100 = safety
  })

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Find Your Research Orientation</h3>
      
      <div className="space-y-4">
        <div>
          <label className="flex justify-between text-sm font-medium mb-2">
            <span>Near-term (1-5 years)</span>
            <span>Long-term (10+ years)</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={values.timeHorizon}
            onChange={(e) => setValues({...values, timeHorizon: parseInt(e.target.value)})}
            className="w-full"
          />
        </div>

        <div>
          <label className="flex justify-between text-sm font-medium mb-2">
            <span>Technical Solutions</span>
            <span>Governance & Policy</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={values.approach}
            onChange={(e) => setValues({...values, approach: parseInt(e.target.value)})}
            className="w-full"
          />
        </div>

        <div>
          <label className="flex justify-between text-sm font-medium mb-2">
            <span>Capability Research</span>
            <span>Safety Research</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={values.focus}
            onChange={(e) => setValues({...values, focus: parseInt(e.target.value)})}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
        <h4 className="font-semibold mb-2">Your Profile Suggests Focusing On:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {values.timeHorizon > 70 && <li>Alignment theory and existential safety</li>}
          {values.timeHorizon < 30 && <li>Current model safety and deployment practices</li>}
          {values.approach > 70 && <li>AI governance frameworks and policy</li>}
          {values.approach < 30 && <li>Technical alignment solutions</li>}
          {values.focus > 70 && <li>Safety-first research methodologies</li>}
        </ul>
      </div>
    </div>
  )
}

// AI Teacher Component with placeholder for future API integration
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
  
  // Get appropriate system prompt based on section and mode
  const getInitialMessage = () => {
    const prompts = externalResources.aiTutor.systemPrompts[sectionId as keyof typeof externalResources.aiTutor.systemPrompts] 
      || externalResources.aiTutor.systemPrompts.default
    
    if (tutorMode === 'adversary') {
      return viewMode === 'academic'
        ? "I'm here to challenge your assumptions about AI safety. Let's test your reasoning. (Note: Adversarial mode placeholder)"
        : "So you think AI safety matters? Let me play devil's advocate... (Note: Adversarial mode placeholder)"
    }
    
    return viewMode === 'academic' 
      ? "I'm your AI Safety tutor. Ask me anything about the content you've covered or what's ahead. (Note: This is currently a placeholder for future AI integration)"
      : "Hey! I'm here to help you on your AI safety journey. What questions do you have? (Note: This is currently a placeholder - but imagine the meta-irony!)"
  }
  
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'ai', content: string}>>([
    {
      role: 'ai',
      content: getInitialMessage()
    }
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    // Add user question
    setConversation([...conversation, { role: 'user', content: question }])
    
    // Placeholder response
    setTimeout(() => {
      setConversation(prev => [...prev, {
        role: 'ai',
        content: "This AI tutor feature is coming soon! For now, consider: How does your question relate to the ethical frameworks we just explored? What technical knowledge would help answer it?"
      }])
    }, 500)

    setQuestion('')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex gap-1">
          <button
            onClick={() => {
              setTutorMode('teacher')
              setConversation([{ role: 'ai', content: getInitialMessage() }])
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
              setConversation([{ role: 'ai', content: getInitialMessage() }])
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
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Send
        </button>
      </form>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        🔮 Future feature: This will connect to an AI tutor API with {tutorMode === 'adversary' ? 'adversarial' : 'supportive'} prompts
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
            <li>Value pluralism doesn't mean relativism - evidence and reasoning matter</li>
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