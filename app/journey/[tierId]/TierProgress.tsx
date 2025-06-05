'use client'

import { useState, useEffect } from 'react'
import { getJourneyProgress, getTierProgress } from '@/lib/journey'

interface TierProgressProps {
  tierId: string
  totalTopics: number
}

export default function TierProgress({ tierId, totalTopics }: TierProgressProps) {
  const [progress, setProgress] = useState({ completed: 0, total: totalTopics, percentage: 0 })

  useEffect(() => {
    async function loadProgress() {
      const journeyProgress = await getJourneyProgress()
      if (journeyProgress) {
        const tierProgress = getTierProgress(tierId, journeyProgress)
        setProgress(tierProgress)
      }
    }
    loadProgress()
  }, [tierId])

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">Progress</span>
        <span className="text-sm text-white">
          {progress.completed} / {progress.total} topics
        </span>
      </div>
      <div className="bg-gray-800 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-[#FF3366] to-[#FF6B6B] h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
      <div className="text-right mt-1">
        <span className="text-xs text-gray-500">{progress.percentage}% complete</span>
      </div>
    </div>
  )
}