import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import ViewModeToggle from '@/components/ViewModeToggle'
import ModuleProgress from './ModuleProgress'
import Database from 'better-sqlite3'
import path from 'path'

// Helper to get database
function getRawDb() {
  const dbPath = process.env.NODE_ENV === 'production' 
    ? path.join(process.cwd(), 'journey-public.db')
    : path.join(process.cwd(), 'journey-dev.db')
  const db = new Database(dbPath)
  db.pragma('foreign_keys = ON')
  return db
}

// Generate all possible module pages at build time
export async function generateStaticParams() {
  const db = getRawDb()
  
  try {
    // Get all modules with their tier IDs
    const modules = db.prepare(`
      SELECT 
        m.id as moduleId,
        m.tier_id as tierId
      FROM modules m
    `).all() as Array<{ moduleId: string; tierId: string }>

    return modules.map(({ tierId, moduleId }) => ({
      tierId,
      moduleId
    }))
  } finally {
    db.close()
  }
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { tierId: string; moduleId: string } 
}): Promise<Metadata> {
  const db = getRawDb()
  
  try {
    const module = db.prepare(`
      SELECT title, description
      FROM modules
      WHERE id = ?
    `).get(params.moduleId) as { title: string; description: string } | undefined

    if (!module) {
      return {
        title: 'Module Not Found'
      }
    }

    return {
      title: `${module.title} - AI Safety Research Compiler`,
      description: module.description
    }
  } finally {
    db.close()
  }
}

// Server component - runs at build time
export default async function ModulePage({ 
  params 
}: { 
  params: { tierId: string; moduleId: string } 
}) {
  const { tierId, moduleId } = params
  const db = getRawDb()
  
  try {
    // Get module with tier info
    const moduleData = db.prepare(`
      SELECT 
        m.*,
        t.id as tier_id,
        t.title as tier_title
      FROM modules m
      JOIN tiers t ON m.tier_id = t.id
      WHERE m.id = ?
    `).get(moduleId) as any

    if (!moduleData) {
      notFound()
    }

    // Get all topics in this module
    const topics = db.prepare(`
      SELECT 
        id,
        title,
        description,
        estimated_time,
        difficulty,
        tags
      FROM topics
      WHERE module_id = ?
      ORDER BY position, id
    `).all(moduleId) as any[]

    // Transform data
    const module = {
      id: moduleData.id,
      title: moduleData.title,
      description: moduleData.description,
      estimatedTime: moduleData.estimated_time,
      learningObjectives: moduleData.learning_objectives ? JSON.parse(moduleData.learning_objectives) : [],
      practicalComponents: moduleData.practical_components ? JSON.parse(moduleData.practical_components) : [],
      assessmentType: moduleData.assessment_type,
      topics: topics.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        estimatedTime: t.estimated_time,
        difficulty: t.difficulty,
        tags: t.tags ? JSON.parse(t.tags) : []
      }))
    }

    const tier = {
      id: moduleData.tier_id,
      title: moduleData.tier_title
    }

    return (
      <div className="min-h-screen bg-[#0A0A0B]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center space-x-2 text-gray-400">
              <li><Link href="/journey" className="hover:text-white">Journey</Link></li>
              <li className="text-gray-600">/</li>
              <li><Link href={`/journey/${tierId}`} className="hover:text-white">{tier.title}</Link></li>
              <li className="text-gray-600">/</li>
              <li className="text-white">{module.title}</li>
            </ol>
          </nav>
          
          {/* Module Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-white">{module.title}</h1>
              <ViewModeToggle />
            </div>
            <p className="text-xl text-gray-400 mb-6">{module.description}</p>
            
            {/* Module Progress */}
            <ModuleProgress tierId={tierId} moduleId={moduleId} totalTopics={module.topics.length} />
            
            {/* Module Metadata */}
            {(module.learningObjectives.length > 0 || module.practicalComponents.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {module.learningObjectives.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Learning Objectives</h3>
                    <ul className="space-y-2">
                      {module.learningObjectives.map((objective: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-gray-400">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {module.practicalComponents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Practical Components</h3>
                    <ul className="space-y-2">
                      {module.practicalComponents.map((component: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-gray-400">
                          <span className="text-blue-500 mt-1">🔧</span>
                          <span>{component}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Topics List */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Topics</h2>
            <div className="space-y-4">
              {module.topics.map((topic, index) => (
                <TopicCard 
                  key={topic.id} 
                  topic={topic} 
                  tierId={tierId} 
                  moduleId={moduleId}
                  index={index}
                />
              ))}
            </div>
          </div>
          
          {/* Navigation */}
          <div className="mt-12">
            <Link 
              href={`/journey/${tierId}`}
              className="text-gray-400 hover:text-white transition"
            >
              ← Back to {tier.title}
            </Link>
          </div>
          
          {/* SSG indicator */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-blue-600">
            <span>⚡</span>
            <span>Pre-rendered at build time</span>
          </div>
        </div>
      </div>
    )
  } finally {
    db.close()
  }
}

// Topic Card Component
function TopicCard({ 
  topic, 
  tierId, 
  moduleId,
  index
}: { 
  topic: any
  tierId: string
  moduleId: string
  index: number
}) {
  return (
    <Link
      href={`/journey/${tierId}/${moduleId}/${topic.id}`}
      className="block bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-gray-600 font-mono text-sm">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition">
              {topic.title}
            </h3>
          </div>
          <p className="text-gray-400 mb-3">{topic.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>⏱️ {topic.estimatedTime}</span>
            <span className={`
              ${topic.difficulty === 'beginner' ? 'text-green-500' :
                topic.difficulty === 'intermediate' ? 'text-yellow-500' :
                'text-orange-500'}
            `}>
              {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
            </span>
            {topic.tags.length > 0 && (
              <div className="flex gap-1">
                {topic.tags.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-800 rounded text-xs">
                    {tag}
                  </span>
                ))}
                {topic.tags.length > 3 && (
                  <span className="text-gray-600">+{topic.tags.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="ml-4 text-gray-600 group-hover:text-gray-400 transition">
          →
        </div>
      </div>
    </Link>
  )
}