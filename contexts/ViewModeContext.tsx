'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type ViewMode = 'academic' | 'personal'

interface ViewModeContextType {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  isPersonalMode: boolean
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined)

export function ViewModeProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage if available, default to academic
  const [viewMode, setViewModeState] = useState<ViewMode>('academic')
  
  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('viewMode') as ViewMode
    if (saved === 'personal' || saved === 'academic') {
      setViewModeState(saved)
    }
  }, [])
  
  // Save to localStorage when changed
  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode)
    localStorage.setItem('viewMode', mode)
  }
  
  const isPersonalMode = viewMode === 'personal'
  
  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode, isPersonalMode }}>
      {children}
    </ViewModeContext.Provider>
  )
}

export function useViewMode() {
  const context = useContext(ViewModeContext)
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider')
  }
  return context
}