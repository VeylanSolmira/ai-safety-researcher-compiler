'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import ViewModeToggle from '@/components/ViewModeToggle'
import { useLearningPath } from '@/hooks/useLearningPath'
import { 
  getJourneyProgress, 
  JourneyProgress, 
  journeyTiers, 
  getTierProgress,
  LearningPath,
  // Legacy imports for compatibility
  journeySections, 
  getAvailableSections, 
  getSubsectionProgress 
} from '@/lib/journey'

export default function JourneyPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<JourneyProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [devMode, setDevMode] = useState(false)
  const [overviewExpanded, setOverviewExpanded] = useState(false)
  const { selectedPath, setSelectedPath } = useLearningPath()

  useEffect(() => {
    const loadProgress = async () => {
      const journeyProgress = await getJourneyProgress()
      setProgress(journeyProgress)
      setLoading(false)
    }
    loadProgress()
  }, [])

  const handleContinueJourney = () => {
    // Check if user has new tier progress
    if (progress?.currentTierId) {
      router.push(`/journey/${progress.currentTierId}`)
    } else if (progress?.currentSection) {
      // Fall back to legacy section
      router.push(`/journey/legacy/${progress.currentSection}`)
    } else {
      // Start new journey with Foundation tier
      router.push('/journey/foundation')
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
      {/* Header Banner */}
      <header className="bg-white shadow-sm border-b dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                <h1 className="text-2xl font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center">
                  AI Safety Research Journey
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-center">Interactive learning path through AI safety</p>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <ViewModeToggle />
              
              {/* Development Mode Toggle */}
              <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/20 px-3 py-1 rounded-lg">
                <span className="text-xs font-medium text-yellow-800 dark:text-yellow-200">Dev Mode</span>
                <button
                  onClick={() => setDevMode(!devMode)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    devMode ? 'bg-yellow-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      devMode ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          showViewModeToggle={false}
        />

        <div className="max-w-4xl mx-auto">

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

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleContinueJourney}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-transform hover:scale-105"
                >
                  {progress?.sectionsCompleted && progress.sectionsCompleted.length > 0 ? 'Continue Journey' : 'Start Journey'}
                </button>
                
                <Link
                  href="/roadmap/ai-safety-researcher"
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg shadow transition-colors flex items-center gap-2 justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Show Roadmap
                </Link>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Journey Overview</h3>
                <button
                  onClick={() => setOverviewExpanded(!overviewExpanded)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label={overviewExpanded ? "Collapse overview" : "Expand overview"}
                >
                  <svg 
                    className={`w-5 h-5 text-gray-600 dark:text-gray-400 transform transition-transform ${overviewExpanded ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {overviewExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
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
              )}
            </div>

            {/* New Tier-Based Journey */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">AI Safety Learning Path</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                A structured curriculum progressing from foundations to expertise
              </p>
              
              {/* Learning Path Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Your Learning Path:
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Filter modules based on your interests
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {[
                    { value: 'all' as LearningPath, label: 'All Paths', icon: '🌍', color: 'gray' },
                    { value: 'technical-safety' as LearningPath, label: 'Technical Safety', icon: '🔧', color: 'blue' },
                    { value: 'governance' as LearningPath, label: 'Governance', icon: '⚖️', color: 'purple' },
                    { value: 'engineering' as LearningPath, label: 'Engineering', icon: '👷', color: 'green' },
                    { value: 'research' as LearningPath, label: 'Research', icon: '🔬', color: 'orange' }
                  ].map((path) => (
                    <button
                      key={path.value}
                      onClick={() => setSelectedPath(path.value)}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1
                        ${selectedPath === path.value
                          ? path.color === 'gray' ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-400' :
                            path.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-400' :
                            path.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-2 border-purple-400' :
                            path.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-400' :
                            'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-2 border-orange-400'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                        }
                      `}
                    >
                      <span>{path.icon}</span>
                      <span>{path.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                {journeyTiers.map((tier) => {
                  const tierProgress = progress ? getTierProgress(tier.id, progress) : null
                  const isUnlocked = devMode || tier.prerequisites.length === 0 || 
                    (progress && tier.prerequisites.every(prereq => progress.tiersCompleted?.includes(prereq)))
                  
                  // Filter modules based on selected path
                  const visibleModules = selectedPath === 'all' 
                    ? tier.modules 
                    : tier.modules.filter(module => 
                        module.paths?.includes('all' as LearningPath) || module.paths?.includes(selectedPath)
                      )
                  
                  // Skip tier if no modules match the selected path
                  if (visibleModules.length === 0) return null
                  
                  return (
                    <Link
                      key={tier.id}
                      href={isUnlocked ? `/journey/${tier.id}` : '#'}
                      className={`block ${!isUnlocked ? 'cursor-not-allowed' : ''}`}
                    >
                      <div className={`
                        relative p-6 rounded-xl border-2 transition-all
                        ${!isUnlocked 
                          ? 'opacity-50 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800' 
                          : tierProgress && tierProgress.percentage === 100
                          ? 'hover:shadow-lg border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20'
                          : tierProgress && tierProgress.percentage > 0
                          ? 'hover:shadow-lg border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'hover:shadow-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}
                      `}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`
                                px-3 py-1 rounded-full text-sm font-medium
                                ${tier.level === 'foundation' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                  tier.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                                  tier.level === 'advanced' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                                  'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'}
                              `}>
                                {tier.level.charAt(0).toUpperCase() + tier.level.slice(1)}
                              </span>
                              <h4 className="text-xl font-bold">{tier.title}</h4>
                              {!isUnlocked && (
                                <span className="text-gray-500">🔒</span>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-3">{tier.description}</p>
                            
                            <div className="flex items-center gap-6 text-sm">
                              <span className="text-gray-500">
                                ⏱️ {tier.estimatedDuration}
                              </span>
                              <span className="text-gray-500">
                                📚 {visibleModules.length}{visibleModules.length !== tier.modules.length ? ` of ${tier.modules.length}` : ''} modules
                              </span>
                              {tierProgress && (
                                <span className="text-gray-500">
                                  ✅ {tierProgress.topicsCompleted}/{tierProgress.totalTopics} topics
                                </span>
                              )}
                            </div>
                            
                            {/* Progress bar */}
                            {tierProgress && tierProgress.percentage > 0 && (
                              <div className="mt-4">
                                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
                                    style={{ width: `${tierProgress.percentage}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {isUnlocked && (
                            <div className="ml-4">
                              <span className="text-gray-400 text-2xl">→</span>
                            </div>
                          )}
                        </div>
                        
                        {!isUnlocked && tier.prerequisites.length > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                            Complete prerequisites: {tier.prerequisites.map(p => {
                              const prereqTier = journeyTiers.find(t => t.id === p)
                              return prereqTier?.title || p
                            }).join(', ')}
                          </p>
                        )}
                        {devMode && tier.prerequisites.length > 0 && 
                         !(progress && tier.prerequisites.every(prereq => progress.tiersCompleted?.includes(prereq))) && (
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-3">
                            [Dev Mode] Prerequisites bypassed
                          </p>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Legacy Journey Sections Navigation */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Journey Sections (Legacy)</h3>
              <div className="space-y-3">
                {journeySections.map((section) => {
                  const isCompleted = progress?.sectionsCompleted?.includes(section.id) || false
                  const isCurrent = progress?.currentSection === section.id
                  const isStarted = progress?.sectionsStarted?.includes(section.id) || false
                  const availableSections = progress ? getAvailableSections(progress.sectionsCompleted || []) : [journeySections[0]]
                  const isAvailable = availableSections.some(s => s.id === section.id)
                  const isLocked = !devMode && !isAvailable && !isCompleted

                  return (
                    <div
                      key={section.id}
                      className={`
                        p-4 rounded-lg border-2 transition-all
                        ${isLocked ? 'opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800' :
                          isCompleted ? 'cursor-pointer hover:shadow-md border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20' :
                          isCurrent ? 'cursor-pointer hover:shadow-md border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' :
                          'cursor-pointer hover:shadow-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}
                      `}
                      onClick={() => {
                        if (!isLocked) {
                          router.push(`/journey/legacy/${section.id}`)
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${isCompleted ? 'bg-green-500 text-white' :
                              isCurrent ? 'bg-blue-500 text-white' :
                              isStarted ? 'bg-yellow-500 text-white' :
                              isLocked ? 'bg-gray-300 dark:bg-gray-600 text-gray-500' :
                              'bg-gray-200 dark:bg-gray-700 text-gray-600'}
                          `}>
                            {isCompleted ? '✓' : 
                             isLocked ? '🔒' : 
                             (devMode && !isAvailable && !isCompleted) ? '🔓' :
                             journeySections.indexOf(section) + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold">{section.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`
                            px-2 py-1 rounded text-xs font-medium
                            ${section.contentType === 'build' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                              section.contentType === 'learn' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                              'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'}
                          `}>
                            {section.contentType === 'build' ? '🔨 Build' :
                             section.contentType === 'learn' ? '📚 Learn' :
                             '🎯 Mixed'}
                          </span>
                          <span className="text-sm text-gray-500">{section.estimatedTime}</span>
                        </div>
                      </div>
                      {((isLocked && section.prerequisites.length > 0) || 
                        (devMode && !isAvailable && !isCompleted && section.prerequisites.length > 0)) && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-11">
                          {devMode && !isAvailable && !isCompleted ? 
                            <span className="text-yellow-600 dark:text-yellow-400">
                              [Dev Mode] Prerequisites bypassed: {section.prerequisites.join(', ')}
                            </span> :
                            `Complete prerequisites: ${section.prerequisites.join(', ')}`
                          }
                        </p>
                      )}
                      
                      {/* Show subsection progress if section has subsections */}
                      {section.subsections && section.subsections.length > 0 && (
                        <div className="mt-3 ml-11">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-blue-500 h-full transition-all duration-300"
                                style={{ width: `${progress ? getSubsectionProgress(section.id, progress).percentage : 0}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {progress ? getSubsectionProgress(section.id, progress).completed : 0}/{section.subsections.length}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {section.subsections.map((subsection) => {
                              const isSubsectionComplete = progress?.subsectionsCompleted?.[section.id]?.includes(subsection.id) || false
                              return (
                                <div 
                                  key={subsection.id} 
                                  className={`flex items-center gap-2 text-xs p-1 rounded transition-colors ${
                                    !isLocked ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''
                                  }`}
                                  onClick={(e) => {
                                    if (!isLocked) {
                                      e.stopPropagation()
                                      router.push(`/journey/${section.id}/${subsection.id}`)
                                    }
                                  }}
                                >
                                  <span className={`
                                    w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
                                    ${isSubsectionComplete ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}
                                  `}>
                                    {isSubsectionComplete ? '✓' : ''}
                                  </span>
                                  <span className={`
                                    ${isSubsectionComplete ? 'text-green-600 dark:text-green-400 line-through' : 'text-gray-600 dark:text-gray-400'}
                                    ${!isLocked ? 'hover:text-blue-600 dark:hover:text-blue-400' : ''}
                                  `}>
                                    {subsection.title}
                                  </span>
                                  <span className="text-gray-400 dark:text-gray-500">
                                    ({subsection.estimatedTime})
                                  </span>
                                  {!isLocked && (
                                    <svg className="w-3 h-3 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}