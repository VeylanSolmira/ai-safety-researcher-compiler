'use client'

import { useState, useEffect } from 'react'
import { isFeatureEnabled, setFeatureFlag, getAllFlags, FeatureFlag } from '@/lib/feature-flags'

export default function DatabaseToggle() {
  const [flags, setFlags] = useState(getAllFlags())
  const [showPanel, setShowPanel] = useState(false)

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const toggleFlag = (flag: FeatureFlag) => {
    const newValue = !flags[flag]
    setFeatureFlag(flag, newValue)
    setFlags(getAllFlags())
    
    // Store in localStorage for persistence
    localStorage.setItem(`feature_flag_${flag}`, String(newValue))
    
    // Reload to apply changes
    window.location.reload()
  }

  // Load flags from localStorage on mount
  useEffect(() => {
    const flagKeys: FeatureFlag[] = [
      'USE_DATABASE_FOR_JOURNEY',
      'USE_DATABASE_FOR_PROGRESS', 
      'USE_DATABASE_FOR_RESOURCES'
    ]
    
    flagKeys.forEach(flag => {
      const stored = localStorage.getItem(`feature_flag_${flag}`)
      if (stored !== null) {
        setFeatureFlag(flag, stored === 'true')
      }
    })
    
    setFlags(getAllFlags())
  }, [])

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-4 right-4 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition z-50"
        title="Toggle Database Settings"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Settings Panel */}
      {showPanel && (
        <div className="fixed bottom-20 right-4 bg-gray-900 text-white p-6 rounded-lg shadow-xl z-50 min-w-[300px]">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>🔧</span> Database Feature Flags
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm">
                Journey Data
                <span className="block text-xs text-gray-400">Tiers, modules, topics</span>
              </label>
              <button
                onClick={() => toggleFlag('USE_DATABASE_FOR_JOURNEY')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  flags.USE_DATABASE_FOR_JOURNEY ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    flags.USE_DATABASE_FOR_JOURNEY ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm">
                Progress Tracking
                <span className="block text-xs text-gray-400">User completion data</span>
              </label>
              <button
                onClick={() => toggleFlag('USE_DATABASE_FOR_PROGRESS')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  flags.USE_DATABASE_FOR_PROGRESS ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    flags.USE_DATABASE_FOR_PROGRESS ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm">
                Resources
                <span className="block text-xs text-gray-400">Mentors, organizations</span>
              </label>
              <button
                onClick={() => toggleFlag('USE_DATABASE_FOR_RESOURCES')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  flags.USE_DATABASE_FOR_RESOURCES ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    flags.USE_DATABASE_FOR_RESOURCES ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              {flags.USE_DATABASE_FOR_JOURNEY || flags.USE_DATABASE_FOR_PROGRESS || flags.USE_DATABASE_FOR_RESOURCES
                ? '⚡ Database active - 97% faster'
                : '📁 Using file imports'
              }
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Changes require page reload
            </p>
          </div>
        </div>
      )}
    </>
  )
}