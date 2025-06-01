'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useJourneyData } from '@/hooks/useJourneyData'
import PageHeader from '@/components/PageHeader'

type SortField = 'tier' | 'module' | 'topic' | 'topicCount'
type SortDirection = 'asc' | 'desc'

export default function JourneyStructurePage() {
  const { data: journeyData, loading, error } = useJourneyData()
  
  // State for sorting and filtering
  const [sortField, setSortField] = useState<SortField>('tier')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [filterText, setFilterText] = useState('')
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  
  // Process data into table format
  const tableData = useMemo(() => {
    if (!journeyData) return []
    
    const rows: Array<{
      tierId: string
      tierTitle: string
      tierOrder: number
      moduleId: string
      moduleTitle: string
      moduleOrder: number
      topicId?: string
      topicTitle?: string
      topicOrder?: number
      isModuleRow?: boolean
    }> = []
    
    journeyData.forEach(tier => {
      tier.modules.forEach(module => {
        // Add module row
        rows.push({
          tierId: tier.id,
          tierTitle: tier.title,
          tierOrder: tier.order,
          moduleId: module.id,
          moduleTitle: module.title,
          moduleOrder: module.order,
          isModuleRow: true
        })
        
        // Add topic rows
        module.topics.forEach((topic, topicIndex) => {
          rows.push({
            tierId: tier.id,
            tierTitle: tier.title,
            tierOrder: tier.order,
            moduleId: module.id,
            moduleTitle: module.title,
            moduleOrder: module.order,
            topicId: topic.id,
            topicTitle: topic.title,
            topicOrder: topicIndex
          })
        })
      })
    })
    
    return rows
  }, [journeyData])
  
  // Filter data
  const filteredData = useMemo(() => {
    if (!filterText) return tableData
    
    const searchText = filterText.toLowerCase()
    return tableData.filter(row => 
      row.tierTitle.toLowerCase().includes(searchText) ||
      row.moduleTitle.toLowerCase().includes(searchText) ||
      (row.topicTitle && row.topicTitle.toLowerCase().includes(searchText))
    )
  }, [tableData, filterText])
  
  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData]
    
    sorted.sort((a, b) => {
      let aVal: string | number = 0
      let bVal: string | number = 0
      
      switch (sortField) {
        case 'tier':
          aVal = a.tierOrder
          bVal = b.tierOrder
          break
        case 'module':
          aVal = `${a.tierOrder}-${a.moduleOrder}`
          bVal = `${b.tierOrder}-${b.moduleOrder}`
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
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <PageHeader 
          title="Journey Structure"
          subtitle="Loading journey data..."
        />
      </div>
    )
  }
  
  if (error || !journeyData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <PageHeader 
          title="Journey Structure"
          subtitle="Error loading journey data"
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-red-600 dark:text-red-400">
            {error || 'Failed to load journey data'}
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
      <PageHeader 
        title="Journey Structure Viewer"
        subtitle="Explore the complete AI Safety learning journey"
      />
      
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
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Filter by tier, module, or topic name..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
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
        
        {/* Table */}
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
                {sortedData.map((row, index) => {
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
        
        {/* Development note */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>This tool helps visualize the journey structure. 
          {process.env.NODE_ENV === 'development' && ' (Development mode)'}
          </p>
        </div>
      </div>
    </div>
  )
}