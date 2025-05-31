'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/PageHeader'
import JourneyContent, { JourneyIntroductionExtras } from '@/components/JourneyContent'
import { 
  getSection, 
  getJourneyProgress, 
  markSectionStarted,
  markSectionComplete,
  getAvailableSections,
  saveChoice,
  JourneySection,
  JourneyProgress 
} from '@/lib/journey'

export default function JourneySectionPage({ params }: { params: { sectionId: string } }) {
  const router = useRouter()
  const [section, setSection] = useState<JourneySection | null>(null)
  const [progress, setProgress] = useState<JourneyProgress | null>(null)
  const [availableChoices, setAvailableChoices] = useState<JourneySection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSection = async () => {
      const currentSection = getSection(params.sectionId)
      if (!currentSection) {
        router.push('/journey')
        return
      }

      const journeyProgress = await getJourneyProgress()
      const available = journeyProgress ? getAvailableSections(journeyProgress.sectionsCompleted) : []
      
      setSection(currentSection)
      setProgress(journeyProgress)
      setAvailableChoices(available.filter(s => currentSection.unlocks.includes(s.id)))
      
      // Mark section as started
      await markSectionStarted(params.sectionId)
      
      setLoading(false)
    }
    
    loadSection()
  }, [params.sectionId, router])

  const handleCompleteSection = async () => {
    await markSectionComplete(params.sectionId)
    
    if (section?.type === 'linear' && section.unlocks.length > 0) {
      // For linear sections, go to the first unlocked section
      router.push(`/journey/${section.unlocks[0]}`)
    } else {
      // For open-world or end sections, go back to journey overview
      router.push('/journey')
    }
  }

  const handleChooseSection = async (chosenSectionId: string) => {
    await saveChoice(params.sectionId, 'nextSection', chosenSectionId)
    router.push(`/journey/${chosenSectionId}`)
  }

  if (loading || !section) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading section...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <PageHeader 
            backLink={{ href: '/journey', label: 'Journey Overview' }}
            showViewModeToggle={true}
          />
          
          {/* Section info */}
          <div className="flex items-center justify-end mb-8 -mt-4">
            <div className="flex items-center gap-2">
              <span className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${section.contentType === 'build' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                  section.contentType === 'learn' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                  'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'}
              `}>
                {section.contentType === 'build' ? '🔨 Build' :
                 section.contentType === 'learn' ? '📚 Learn' :
                 '🎯 Mixed'}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {section.estimatedTime}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-4">{section.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{section.description}</p>

            {/* Section-specific content based on type */}
            {section.type === 'open-world' ? (
              <div className="space-y-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    🗺️ Open World Section
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Choose your own path! Select any of the available options below to continue your journey.
                  </p>
                </div>

                <div className="grid gap-4">
                  {availableChoices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => handleChooseSection(choice.id)}
                      className="text-left p-6 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {choice.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            {choice.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className={`
                              ${choice.contentType === 'build' ? 'text-green-600 dark:text-green-400' :
                                choice.contentType === 'learn' ? 'text-blue-600 dark:text-blue-400' :
                                'text-purple-600 dark:text-purple-400'}
                            `}>
                              {choice.contentType === 'build' ? '🔨 Build' :
                               choice.contentType === 'learn' ? '📚 Learn' :
                               '🎯 Mixed'}
                            </span>
                            <span className="text-gray-500 dark:text-gray-500">
                              {choice.estimatedTime}
                            </span>
                          </div>
                        </div>
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Load roadmap content and journey-specific extras */}
                <JourneyContent 
                  sectionId={section.id}
                  roadmapContentIds={section.roadmapContentIds || []}
                  additionalContent={
                    section.hasAdditionalContent && section.id === 'introduction' ? (
                      <JourneyIntroductionExtras />
                    ) : undefined
                  }
                />

                {/* Complete button for linear sections */}
                <div className="flex justify-end">
                  <button
                    onClick={handleCompleteSection}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-transform hover:scale-105"
                  >
                    Complete Section
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Progress indicator */}
          {progress && (
            <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              <span>Progress: {progress.sectionsCompleted.length} sections completed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}