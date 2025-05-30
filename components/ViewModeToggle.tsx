'use client'

import React from 'react'
import { useViewMode } from '@/contexts/ViewModeContext'

export default function ViewModeToggle() {
  const { viewMode, setViewMode, isPersonalMode } = useViewMode()
  
  return (
    <div className="flex items-center space-x-3 bg-gray-100 rounded-full px-4 py-2">
      <span className={`text-sm font-medium transition-opacity ${!isPersonalMode ? 'opacity-100' : 'opacity-50'}`}>
        🎓 Academic
      </span>
      
      <button
        onClick={() => setViewMode(isPersonalMode ? 'neutral' : 'personal')}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        style={{ backgroundColor: isPersonalMode ? '#f59e0b' : '#e5e7eb' }}
        role="switch"
        aria-checked={isPersonalMode}
        aria-label="Toggle between academic and personal view"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isPersonalMode ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      
      <span className={`text-sm font-medium transition-opacity ${isPersonalMode ? 'opacity-100' : 'opacity-50'}`}>
        💭 Personal
      </span>
    </div>
  )
}