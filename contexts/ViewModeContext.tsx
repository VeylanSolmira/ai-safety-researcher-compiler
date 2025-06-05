'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type ViewMode = 'academic' | 'personal'

interface ViewModeContextType {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  isPersonalMode: boolean
  isClient: boolean
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined)

export function ViewModeProvider({ children }: { children: ReactNode }) {
  // Always start with 'academic' for consistent server/client rendering
  const [viewMode, setViewModeState] = useState<ViewMode>('academic')
  const [isClient, setIsClient] = useState(false)
  
  // Load from localStorage after mount (client-side only)
  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem('viewMode') as ViewMode
    if (saved === 'personal' || saved === 'academic') {
      setViewModeState(saved)
    }
  }, [])
  
  // Save to localStorage when changed
  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('viewMode', mode)
    }
  }
  
  const isPersonalMode = viewMode === 'personal'
  
  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode, isPersonalMode, isClient }}>
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