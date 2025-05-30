'use client'

import { useProgress } from '@/hooks/useProgress'

export default function ProgressSummary() {
  const { stats } = useProgress()
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Progress</h3>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-semibold">{stats.completed}</span> / {stats.total || '∞'} topics
        </div>
      </div>
      {stats.percentage > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          {stats.percentage}% complete
        </p>
      )}
    </div>
  )
}