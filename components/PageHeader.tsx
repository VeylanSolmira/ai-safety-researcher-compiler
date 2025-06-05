'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import ViewModeToggle from './ViewModeToggle'

interface PageHeaderProps {
  backLink?: {
    href: string
    label: string
  }
  showViewModeToggle?: boolean
}

export default function PageHeader({ backLink, showViewModeToggle = true }: PageHeaderProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="w-[180px]">
        {backLink && (
          mounted ? (
            <button
              onClick={() => router.push(backLink.href)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {backLink.label}
            </button>
          ) : (
            <Link
              href={backLink.href}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {backLink.label}
            </Link>
          )
        )}
      </div>
      
      {showViewModeToggle && (
        <div className="flex justify-center">
          <ViewModeToggle />
        </div>
      )}
      
      <div className="w-[180px]"></div>
    </div>
  )
}