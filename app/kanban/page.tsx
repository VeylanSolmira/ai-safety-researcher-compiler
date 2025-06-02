'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/24/outline'

interface Task {
  id: string
  title: string
  description?: string
  priority?: 'high' | 'medium' | 'low'
  category?: string
  notes?: string[]
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

// Parse and reorganize tasks from next steps.md by impact and semantic grouping
const kanbanData: Column[] = [
  {
    id: 'critical-platform',
    title: '🚨 Critical - Platform Infrastructure',
    tasks: [
      {
        id: 'feature-flags',
        title: 'Feature flags strategy for file v. database data',
        description: 'Finally remove data from ts - this blocks other development',
        category: 'infrastructure',
        priority: 'high'
      },
      {
        id: 'test-export',
        title: 'Test export of db data to markdown files',
        description: 'Essential for content workflow',
        category: 'infrastructure',
        priority: 'high'
      }
    ]
  },
  {
    id: 'high-impact-content',
    title: '⭐ High Impact - Core Content',
    tasks: [
      {
        id: 'course-intro',
        title: 'Course Introduction & Orientation',
        description: 'Course orientation philosophy - First thing users see',
        notes: ['What are the primary risks from AI', 'Why AI Safety Matters', 'Landscape of AI Risks'],
        category: 'curriculum',
        priority: 'high'
      },
      {
        id: 'modules-expand',
        title: 'Expand Foundation Modules',
        description: 'Mathematical & Technical Foundations, ML fundamentals, AI safety core knowledge',
        category: 'curriculum',
        priority: 'high'
      },
      {
        id: 'ai-agents-module',
        title: 'AI Agents Module',
        description: 'Critical missing module in journey',
        category: 'curriculum',
        priority: 'high'
      },
      {
        id: 'tier-structure',
        title: 'Four-Tier Curriculum Structure',
        description: 'Foundation (0-3m), Intermediate (3-9m), Advanced (9-15m), Expert (15m+)',
        notes: ['Day 1 hands-on', 'Project-first approach', 'Real tools not toys'],
        category: 'curriculum',
        priority: 'high'
      }
    ]
  },
  {
    id: 'high-impact-features',
    title: '🎯 High Impact - Key Features',
    tasks: [
      {
        id: 'ai-prompts',
        title: 'AI Teacher/Tutor System',
        description: 'Teacher, adversary, techno-utopian, other personalities',
        notes: ['Maybe from each of the paradigms?', 'Socratic dialogue', 'Adaptive difficulty'],
        category: 'ai-feature',
        priority: 'high'
      },
      {
        id: 'assessments',
        title: 'Assessment System Design',
        description: 'How do assessments work? Define quiz/project/peer-review system',
        category: 'learning-feature',
        priority: 'high'
      }
    ]
  },
  {
    id: 'medium-content-gaps',
    title: '📚 Medium Impact - Content Gaps',
    tasks: [
      {
        id: 'seri-mats',
        title: 'SERI-MATS Integration',
        description: 'Integrate research areas from summer 2025 program',
        category: 'content-expansion',
        priority: 'medium'
      },
      {
        id: 'governance-risks',
        title: 'Governance & Geopolitics',
        notes: [
          'US-China AI relations',
          'UN AI governance report',
          'International coordination'
        ],
        category: 'content-expansion',
        priority: 'medium'
      },
      {
        id: 'reasoning-models',
        title: 'Post-Training Compute',
        description: 'Reasoning vs thinking models, emergent capabilities',
        category: 'technical-content',
        priority: 'medium'
      },
      {
        id: 'mlops-cybersecurity',
        title: 'AI Security vs Traditional Security',
        description: 'MLOps security - needs better framing',
        notes: ['Include hackathon examples'],
        category: 'technical-content',
        priority: 'medium'
      }
    ]
  },
  {
    id: 'medium-community',
    title: '👥 Medium Impact - Community Building',
    tasks: [
      {
        id: 'people-orgs',
        title: 'Expand People & Organizations',
        description: 'Add more researchers, labs, initiatives to Community Directory',
        category: 'community',
        priority: 'medium'
      },
      {
        id: 'path-definitions',
        title: 'Learning Path Definitions',
        description: 'Safety Engineer, Governance, Alignment Researcher paths',
        notes: ['Clear progression indicators', 'Career guidance'],
        category: 'curriculum',
        priority: 'medium'
      }
    ]
  },
  {
    id: 'low-polish',
    title: '✨ Low Impact - Polish & Cleanup',
    tasks: [
      {
        id: 'remove-yoshua',
        title: 'Remove Yoshua Bengio topic',
        description: 'Cleanup orphaned content',
        category: 'cleanup',
        priority: 'low'
      },
      {
        id: 'merge-adversarial',
        title: 'Merge adversarial content versions',
        description: 'Combine academic and personal versions?',
        category: 'cleanup',
        priority: 'low'
      },
      {
        id: 'cleanup-roadmaps',
        title: 'Cleanup roadmap visual display',
        description: 'UI improvements for roadmap viewer',
        category: 'ui-polish',
        priority: 'low'
      }
    ]
  },
  {
    id: 'ideas-research',
    title: '💡 Ideas & Research',
    tasks: [
      {
        id: 'loss-meaning',
        title: 'Semantic Apocalypse Essay',
        description: 'Loss of meaning in AI age - Ideas Lab content?',
        category: 'ideas-lab',
        priority: 'low'
      },
      {
        id: 'extrapolated-volition',
        title: 'Extrapolated Volition',
        description: 'Normative moral theory research',
        category: 'research-topic',
        priority: 'low'
      }
    ]
  },
  {
    id: 'external-resources',
    title: '🔗 External Resources',
    tasks: [
      {
        id: 'resource-links',
        title: 'Curated External Links',
        description: 'OpenEvolve, Hinton Nobel, AI Control Twitter',
        notes: [
          'https://github.com/codelion/openevolve',
          'Rohin Shah resources',
          'https://www.simeon.ai/resources-on-ai-risks'
        ],
        category: 'resources',
        priority: 'low'
      }
    ]
  }
]

const priorityColors = {
  high: 'border-red-500 bg-red-50 dark:bg-red-900/20',
  medium: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  low: 'border-gray-300 bg-gray-50 dark:bg-gray-800'
}

const categoryColors = {
  infrastructure: '🏗️',
  curriculum: '🎓',
  'ai-feature': '🤖',
  'learning-feature': '📐',
  'content-expansion': '📚',
  'technical-content': '🔬',
  community: '👥',
  cleanup: '🧹',
  'ui-polish': '🎨',
  'ideas-lab': '💡',
  'research-topic': '🔍',
  resources: '🔗'
}

export default function KanbanPage() {
  const [columns, setColumns] = useState(kanbanData)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(null)

  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask(task)
    setDraggedFromColumn(columnId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()
    
    if (!draggedTask || !draggedFromColumn) return
    
    if (draggedFromColumn === targetColumnId) return
    
    setColumns(prevColumns => {
      const newColumns = [...prevColumns]
      
      // Remove task from source column
      const sourceColumn = newColumns.find(col => col.id === draggedFromColumn)
      if (sourceColumn) {
        sourceColumn.tasks = sourceColumn.tasks.filter(task => task.id !== draggedTask.id)
      }
      
      // Add task to target column
      const targetColumn = newColumns.find(col => col.id === targetColumnId)
      if (targetColumn) {
        targetColumn.tasks.push(draggedTask)
      }
      
      return newColumns
    })
    
    setDraggedTask(null)
    setDraggedFromColumn(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Back to Home
              </Link>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Development Kanban
              </h1>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Source: development-resources/next steps.md
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto">
          {columns.map(column => (
            <div
              key={column.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 min-w-[300px]"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                  {column.title}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                    {column.tasks.length}
                  </span>
                </h2>
              </div>
              
              <div
                className="p-4 space-y-3 min-h-[400px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {column.tasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task, column.id)}
                    className={`p-3 rounded-lg border-2 cursor-move hover:shadow-md transition-shadow ${
                      task.priority ? priorityColors[task.priority] : priorityColors.low
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-sm text-gray-900 dark:text-white flex-1">
                        {task.title}
                      </h3>
                      {task.category && (
                        <span className="text-lg ml-2" title={task.category}>
                          {categoryColors[task.category as keyof typeof categoryColors] || '📌'}
                        </span>
                      )}
                    </div>
                    
                    {task.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {task.description}
                      </p>
                    )}
                    
                    {task.notes && task.notes.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {task.notes.map((note, idx) => (
                          <p key={idx} className="text-xs text-gray-500 dark:text-gray-500">
                            • {note}
                          </p>
                        ))}
                      </div>
                    )}
                    
                    {task.priority && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          task.priority === 'high' ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' :
                          task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' :
                          'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                
                {column.tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-600">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded"></span>
                  <span className="text-gray-600 dark:text-gray-400">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-500 rounded"></span>
                  <span className="text-gray-600 dark:text-gray-400">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-gray-300 rounded"></span>
                  <span className="text-gray-600 dark:text-gray-400">Low</span>
                </div>
              </div>
            </div>
            
            <div className="col-span-3">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Categories</h4>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(categoryColors).map(([category, emoji]) => (
                  <div key={category} className="flex items-center gap-2">
                    <span>{emoji}</span>
                    <span className="text-gray-600 dark:text-gray-400 capitalize">{category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Drag and drop tasks between columns. Changes are temporary (not persisted).</p>
          <p className="mt-1">To add/edit tasks, update development-resources/next steps.md</p>
        </div>
      </main>
    </div>
  )
}