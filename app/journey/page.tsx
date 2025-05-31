'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ViewModeToggle from '@/components/ViewModeToggle'
import { getJourneyProgress, saveJourneyProgress, JourneyProgress } from '@/lib/journey'

export default function JourneyPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<JourneyProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProgress = async () => {
      const journeyProgress = await getJourneyProgress()
      setProgress(journeyProgress)
      setLoading(false)
    }
    loadProgress()
  }, [])

  const handleContinueJourney = () => {
    // Navigate to the current section
    if (progress?.currentSection) {
      router.push(`/journey/${progress.currentSection}`)
    } else {
      // Start new journey
      router.push('/journey/introduction')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading journey...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push('/roadmap/ai-safety-researcher')}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Roadmap
          </button>
          
          <ViewModeToggle />
          
          <div className="w-[140px]"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Safety Research Journey
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              
              {progress?.sectionsCompleted && progress.sectionsCompleted.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Welcome Back, Explorer!</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You've completed {progress.sectionsCompleted.length} sections of your journey.
                  </p>
                  <p className="text-lg mb-6">
                    Current Section: <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {progress.currentSection || 'Ready to begin'}
                    </span>
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Begin Your Journey</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Embark on an interactive adventure through AI Safety Research. 
                    Build projects, solve challenges, and explore concepts at your own pace.
                  </p>
                </div>
              )}

              <button
                onClick={handleContinueJourney}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-transform hover:scale-105"
              >
                {progress?.sectionsCompleted && progress.sectionsCompleted.length > 0 ? 'Continue Journey' : 'Start Journey'}
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Journey Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Building (60-70%)</h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Create AI safety tools</li>
                    <li>• Implement alignment techniques</li>
                    <li>• Build evaluation frameworks</li>
                    <li>• Develop monitoring systems</li>
                  </ul>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Learning (30-40%)</h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Core AI safety concepts</li>
                    <li>• Research methodologies</li>
                    <li>• Case studies & examples</li>
                    <li>• Best practices</li>
                  </ul>
                </div>
              </div>
            </div>

            {progress?.sectionsCompleted && progress.sectionsCompleted.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Progress Tracker</h3>
                <div className="flex flex-wrap gap-2">
                  {progress.sectionsCompleted.map((section) => (
                    <span
                      key={section}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm"
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}