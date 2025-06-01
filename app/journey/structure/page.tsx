'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useJourneyData } from '@/hooks/useJourneyData'
import { useViewMode } from '@/contexts/ViewModeContext'

type SortField = 'tier' | 'module' | 'topic' | 'topicCount'
type SortDirection = 'asc' | 'desc'
type SearchMode = 'names' | 'content'

interface ContentSearchResult {
  tierId: string
  tierTitle: string
  moduleId: string
  moduleTitle: string
  topicId: string
  topicTitle: string
  matches: Array<{
    text: string
    context: string
  }>
}

export default function JourneyStructurePage() {
  const { data: journeyData, loading, error } = useJourneyData()
  const { viewMode } = useViewMode()
  
  // State for sorting and filtering
  const [sortField, setSortField] = useState<SortField>('tier')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [filterText, setFilterText] = useState('')
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [searchMode, setSearchMode] = useState<SearchMode>('names')
  const [contentSearchResults, setContentSearchResults] = useState<ContentSearchResult[]>([])
  const [contentSearching, setContentSearching] = useState(false)
  
  // Process data into table format
  const tableData = useMemo(() => {
    if (!journeyData) return []
    
    const rows: Array<{
      tierId: string
      tierTitle: string
      tierIndex: number
      moduleId: string
      moduleTitle: string
      moduleIndex: number
      topicId?: string
      topicTitle?: string
      topicOrder?: number
      isModuleRow?: boolean
      roadmapContentId?: string
    }> = []
    
    journeyData.forEach((tier, tierIndex) => {
      tier.modules.forEach((module, moduleIndex) => {
        // Add module row
        rows.push({
          tierId: tier.id,
          tierTitle: tier.title,
          tierIndex,
          moduleId: module.id,
          moduleTitle: module.title,
          moduleIndex,
          isModuleRow: true
        })
        
        // Add topic rows
        module.topics.forEach((topic, topicIndex) => {
          rows.push({
            tierId: tier.id,
            tierTitle: tier.title,
            tierIndex,
            moduleId: module.id,
            moduleTitle: module.title,
            moduleIndex,
            topicId: topic.id,
            topicTitle: topic.title,
            topicOrder: topicIndex,
            roadmapContentId: topic.roadmapContentId
          })
        })
      })
    })
    
    return rows
  }, [journeyData])
  
  // Content search function
  const searchContent = useCallback(async (searchText: string) => {
    if (!searchText || searchText.length < 2) {
      setContentSearchResults([])
      return
    }
    
    setContentSearching(true)
    const results: ContentSearchResult[] = []
    
    try {
      // Search through all topics with content
      for (const row of tableData) {
        if (!row.topicId || !row.roadmapContentId) continue
        
        try {
          // Fetch topic content
          const response = await fetch(
            `/api/topic-content?roadmap=ai-safety-researcher&topic=${row.roadmapContentId}&viewMode=${viewMode}`
          )
          
          if (response.ok) {
            const data = await response.json()
            const content = data.content || ''
            
            // Search for matches (case-insensitive)
            const searchRegex = new RegExp(searchText, 'gi')
            const matches = [...content.matchAll(searchRegex)]
            
            if (matches.length > 0) {
              // Extract context around matches
              const contextMatches = matches.slice(0, 3).map(match => {
                const start = Math.max(0, match.index! - 100)
                const end = Math.min(content.length, match.index! + searchText.length + 100)
                const context = content.slice(start, end)
                  .replace(/\n+/g, ' ')
                  .trim()
                
                return {
                  text: match[0],
                  context: start > 0 ? '...' + context : context
                }
              })
              
              results.push({
                tierId: row.tierId,
                tierTitle: row.tierTitle,
                moduleId: row.moduleId,
                moduleTitle: row.moduleTitle,
                topicId: row.topicId,
                topicTitle: row.topicTitle!,
                matches: contextMatches
              })
            }
          }
        } catch (error) {
          console.error(`Error searching content for ${row.topicId}:`, error)
        }
      }
      
      setContentSearchResults(results)
    } finally {
      setContentSearching(false)
    }
  }, [tableData, viewMode])
  
  // Debounced content search
  useEffect(() => {
    if (searchMode === 'content' && filterText) {
      const timer = setTimeout(() => {
        searchContent(filterText)
      }, 500)
      
      return () => clearTimeout(timer)
    } else {
      setContentSearchResults([])
    }
  }, [filterText, searchMode, searchContent])
  
  // Filter data by name
  const filteredData = useMemo(() => {
    if (!filterText || searchMode === 'content') return tableData
    
    const searchText = filterText.toLowerCase()
    return tableData.filter(row => 
      row.tierTitle.toLowerCase().includes(searchText) ||
      row.moduleTitle.toLowerCase().includes(searchText) ||
      (row.topicTitle && row.topicTitle.toLowerCase().includes(searchText))
    )
  }, [tableData, filterText, searchMode])
  
  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData]
    
    sorted.sort((a, b) => {
      let aVal: string | number = 0
      let bVal: string | number = 0
      
      switch (sortField) {
        case 'tier':
          aVal = a.tierIndex
          bVal = b.tierIndex
          break
        case 'module':
          aVal = `${a.tierIndex}-${a.moduleIndex}`
          bVal = `${b.tierIndex}-${b.moduleIndex}`
          break
        case 'topic':
          aVal = a.topicTitle || ''
          bVal = b.topicTitle || ''
          break
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
    
    return sorted
  }, [filteredData, sortField, sortDirection])
  
  // Toggle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  // Toggle module expansion
  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }
  
  // Export data as JSON
  const exportData = () => {
    const exportObj = {
      tiers: journeyData,
      exported: new Date().toISOString()
    }
    const dataStr = JSON.stringify(exportObj, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'journey-structure.json'
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }
  
  // Copy structure as markdown
  const copyAsMarkdown = () => {
    if (!journeyData) return
    
    let markdown = '# AI Safety Journey Structure\n\n'
    
    journeyData.forEach(tier => {
      markdown += `## ${tier.title}\n\n`
      tier.modules.forEach(module => {
        markdown += `### ${module.title}\n\n`
        module.topics.forEach((topic, i) => {
          markdown += `${i + 1}. ${topic.title}\n`
        })
        markdown += '\n'
      })
    })
    
    navigator.clipboard.writeText(markdown)
    alert('Structure copied to clipboard as markdown!')
  }
  
  // Highlight search term in text
  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm) return text
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))
    return parts.map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() 
        ? <mark key={i} className="bg-yellow-300 dark:bg-yellow-700">{part}</mark>
        : part
    )
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Journey Structure
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Loading journey data...</p>
        </div>
      </div>
    )
  }
  
  if (error || !journeyData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Journey Structure
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Error loading journey data</p>
          <p className="text-red-600 dark:text-red-400">
            {error ? error.toString() : 'Failed to load journey data'}
          </p>
        </div>
      </div>
    )
  }
  
  // Calculate stats
  const stats = {
    tiers: journeyData.length,
    modules: journeyData.reduce((sum, tier) => sum + tier.modules.length, 0),
    topics: journeyData.reduce((sum, tier) => 
      sum + tier.modules.reduce((mSum, module) => mSum + module.topics.length, 0), 0
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Journey Structure Viewer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore the complete AI Safety learning journey
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {stats.tiers}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tiers</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.modules}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Modules</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.topics}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Topics</div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 space-y-4">
          {/* Search mode toggle */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Search in:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSearchMode('names')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  searchMode === 'names'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                📝 Names Only
              </button>
              <button
                onClick={() => setSearchMode('content')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  searchMode === 'content'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                📄 Topic Content
              </button>
            </div>
            {searchMode === 'content' && filterText && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                {contentSearching ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                    <span>Searching content...</span>
                  </>
                ) : (
                  <span>{contentSearchResults.length} results found</span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder={searchMode === 'content' 
                ? "Search in topic content (e.g., 'RLHF', 'alignment', 'safety')..." 
                : "Filter by tier, module, or topic name..."}
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {searchMode === 'names' && (
              <>
                <button
                  onClick={() => {
                    const newExpanded = new Set<string>()
                    tableData.forEach(row => {
                      if (row.isModuleRow) {
                        newExpanded.add(row.moduleId)
                      }
                    })
                    setExpandedModules(newExpanded)
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Expand All
                </button>
                <button
                  onClick={() => setExpandedModules(new Set())}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Collapse All
                </button>
              </>
            )}
            <button
              onClick={copyAsMarkdown}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Copy as Markdown
            </button>
            <button
              onClick={exportData}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Export JSON
            </button>
          </div>
        </div>
        
        {/* Content Search Results */}
        {searchMode === 'content' && contentSearchResults.length > 0 && (
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Content Search Results
            </h3>
            {contentSearchResults.map((result, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {result.topicTitle}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {result.tierTitle} → {result.moduleTitle}
                    </p>
                  </div>
                  <Link
                    href={`/journey/${result.tierId}/${result.moduleId}/${result.topicId}`}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View Topic →
                  </Link>
                </div>
                <div className="space-y-2">
                  {result.matches.map((match, matchIndex) => (
                    <div key={matchIndex} className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      {highlightMatch(match.context, filterText)}
                      {matchIndex < result.matches.length - 1 && match.context.endsWith('...') && '...'}
                    </div>
                  ))}
                  {result.matches.length < 3 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {result.matches.length} match{result.matches.length > 1 ? 'es' : ''} found
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Table (only show in names mode) */}
        {searchMode === 'names' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={() => handleSort('tier')}
                    >
                      <div className="flex items-center gap-2">
                        Tier
                        {sortField === 'tier' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={() => handleSort('module')}
                    >
                      <div className="flex items-center gap-2">
                        Module
                        {sortField === 'module' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={() => handleSort('topic')}
                    >
                      <div className="flex items-center gap-2">
                        Topic
                        {sortField === 'topic' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedData.map((row) => {
                    if (row.isModuleRow) {
                      const isExpanded = expandedModules.has(row.moduleId)
                      const moduleTopics = sortedData.filter(r => 
                        r.moduleId === row.moduleId && r.topicId
                      )
                      
                      return (
                        <tr key={`${row.moduleId}-module`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            {row.tierTitle}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            <button
                              onClick={() => toggleModule(row.moduleId)}
                              className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                              <span>{isExpanded ? '▼' : '▶'}</span>
                              <span className="font-medium">{row.moduleTitle}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({moduleTopics.length} topics)
                              </span>
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            -
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Link
                              href={`/journey/${row.tierId}/${row.moduleId}`}
                              className="text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              View Module →
                            </Link>
                          </td>
                        </tr>
                      )
                    }
                    
                    // Topic row - only show if module is expanded
                    const isExpanded = expandedModules.has(row.moduleId)
                    if (!isExpanded || !row.topicId) return null
                    
                    return (
                      <tr 
                        key={`${row.moduleId}-${row.topicId}`} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {row.tierTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 pl-12">
                          {row.moduleTitle}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                          {row.topicTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            href={`/journey/${row.tierId}/${row.moduleId}/${row.topicId}`}
                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            View Topic →
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Development note */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            {searchMode === 'content' 
              ? 'Content search looks through all topic markdown files' 
              : 'Name search filters the table by tier, module, and topic names'}
          </p>
          {process.env.NODE_ENV === 'development' && ' (Development mode)'}
        </div>
      </div>
    </div>
  )
}