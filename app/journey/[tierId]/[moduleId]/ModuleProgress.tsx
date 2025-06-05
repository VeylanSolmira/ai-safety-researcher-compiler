'use client'

import { useState, useEffect } from 'react'
import { getJourneyProgress, getModuleProgress } from '@/lib/journey'

interface ModuleProgressProps {
  tierId: string
  moduleId: string
  totalTopics: number
}

export default function ModuleProgress({ tierId, moduleId, totalTopics }: ModuleProgressProps) {
  const [progress, setProgress] = useState({ completed: 0, total: totalTopics, percentage: 0 })

  useEffect(() => {
    async function loadProgress() {
      const journeyProgress = await getJourneyProgress()
      if (journeyProgress) {
        const moduleProgress = getModuleProgress(tierId, moduleId, journeyProgress)
        setProgress(moduleProgress)
      }
    }
    loadProgress()
  }, [tierId, moduleId])

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 bg-gray-800 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-[#FF3366] to-[#FF6B6B] h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
      <span className="text-sm text-gray-400 min-w-[100px] text-right">
        {progress.completed}/{progress.total} completed
      </span>
    </div>
  )
}