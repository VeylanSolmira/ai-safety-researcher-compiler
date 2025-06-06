import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import ViewModeToggle from '@/components/ViewModeToggle'
import TierProgress from './TierProgress'
import Database from 'better-sqlite3'
import { getDatabasePath } from '@/lib/db'

// Generate all possible tier pages at build time
export async function generateStaticParams() {
  const db = new Database(getDatabasePath())
  
  try {
    // Get all tiers
    const tiers = db.prepare(`
      SELECT id as tierId
      FROM tiers
    `).all() as Array<{ tierId: string }>

    return tiers.map(({ tierId }) => ({
      tierId
    }))
  } finally {
    db.close()
  }
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { tierId: string } 
}): Promise<Metadata> {
  const db = new Database(getDatabasePath())
  
  try {
    const tier = db.prepare(`
      SELECT title, description
      FROM tiers
      WHERE id = ?
    `).get(params.tierId) as { title: string; description: string } | undefined

    if (!tier) {
      return {
        title: 'Tier Not Found'
      }
    }

    return {
      title: `${tier.title} - AI Safety Research Compiler`,
      description: tier.description
    }
  } finally {
    db.close()
  }
}

// Helper function to get tier data
async function getTierPageData(tierId: string) {
  const db = new Database(getDatabasePath())
  
  try {
    // Get tier
    const tierData = db.prepare(`
      SELECT *
      FROM tiers
      WHERE id = ?
    `).get(tierId) as any

    if (!tierData) {
      return null
    }

    // Get all modules in this tier
    const modules = db.prepare(`
      SELECT 
        id,
        title,
        description,
        estimated_time,
        assessment_type,
        learning_objectives,
        practical_components
      FROM modules
      WHERE tier_id = ?
      ORDER BY id
    `).all(tierId) as any[]

    // Get topic counts for each module
    const topicCounts = db.prepare(`
      SELECT 
        m.id as module_id,
        COUNT(t.id) as topic_count
      FROM modules m
      LEFT JOIN topics t ON m.id = t.module_id
      WHERE m.tier_id = ?
      GROUP BY m.id
    `).all(tierId) as Array<{ module_id: string; topic_count: number }>

    const topicCountMap = Object.fromEntries(
      topicCounts.map(({ module_id, topic_count }) => [module_id, topic_count])
    )

    // Transform data
    const tier = {
      id: tierData.id,
      title: tierData.title,
      description: tierData.description,
      level: tierData.level,
    estimatedDuration: tierData.estimated_duration,
    type: tierData.type,
    prerequisites: tierData.prerequisites ? JSON.parse(tierData.prerequisites) : [],
    unlocks: tierData.unlocks ? JSON.parse(tierData.unlocks) : [],
    skillsGained: tierData.skills_gained ? JSON.parse(tierData.skills_gained) : [],
    careerRelevance: tierData.career_relevance ? JSON.parse(tierData.career_relevance) : [],
    requiredBackground: tierData.required_background ? JSON.parse(tierData.required_background) : [],
    modules: modules.map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      estimatedTime: m.estimated_time,
      learningObjectives: m.learning_objectives ? JSON.parse(m.learning_objectives) : [],
      practicalComponents: m.practical_components ? JSON.parse(m.practical_components) : [],
      assessmentType: m.assessment_type,
      topicCount: topicCountMap[m.id] || 0
    }))
  }

    const totalTopics = Object.values(topicCountMap).reduce((sum, count) => sum + count, 0)

    return { tier, totalTopics }
  } finally {
    db.close()
  }
}

// Server component - runs at build time
export default async function TierPage({ 
  params 
}: { 
  params: { tierId: string } 
}) {
  const data = await getTierPageData(params.tierId)
  
  if (!data) {
    notFound()
  }
  
  const { tier, totalTopics } = data
  const { tierId } = params

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-400">
            <li><Link href="/journey" className="hover:text-white">Journey</Link></li>
            <li className="text-gray-600">/</li>
            <li className="text-white">{tier.title}</li>
          </ol>
        </nav>
        
        {/* Tier Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{tier.title}</h1>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  tier.level === 'foundation' ? 'bg-green-500/20 text-green-400' :
                  tier.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                  tier.level === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {tier.level.charAt(0).toUpperCase() + tier.level.slice(1)}
                </span>
                <span className="text-gray-500">⏱️ {tier.estimatedDuration}</span>
              </div>
            </div>
            <ViewModeToggle />
          </div>
          <p className="text-xl text-gray-400 mb-6">{tier.description}</p>
          
          {/* Tier Progress */}
          <TierProgress tierId={tierId} totalTopics={totalTopics} />
          
          {/* Tier Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {tier.skillsGained.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Skills You'll Gain</h3>
                <ul className="space-y-1">
                  {tier.skillsGained.map((skill: string, i: number) => (
                    <li key={i} className="text-sm text-gray-400">• {skill}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {tier.requiredBackground.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Prerequisites</h3>
                <ul className="space-y-1">
                  {tier.requiredBackground.map((req: string, i: number) => (
                    <li key={i} className="text-sm text-gray-400">• {req}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {tier.careerRelevance.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Career Relevance</h3>
                <ul className="space-y-1">
                  {tier.careerRelevance.map((career: string, i: number) => (
                    <li key={i} className="text-sm text-gray-400">• {career}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Modules List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tier.modules.map((module, index) => (
              <ModuleCard 
                key={module.id} 
                module={module} 
                tierId={tierId}
                index={index}
              />
            ))}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center">
          <Link 
            href="/journey"
            className="text-gray-400 hover:text-white transition"
          >
            ← Back to Journey
          </Link>
          
          {tier.modules.length > 0 && (
            <Link
              href={`/journey/${tierId}/${tier.modules[0].id}`}
              className="px-6 py-3 bg-gradient-to-r from-[#FF3366] to-[#FF6B6B] rounded-lg text-white font-medium hover:opacity-90 transition"
            >
              Start First Module →
            </Link>
          )}
        </div>
        
        {/* SSG indicator */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-blue-600">
          <span>⚡</span>
          <span>Pre-rendered at build time</span>
        </div>
      </div>
    </div>
  )
}

// Module Card Component
function ModuleCard({ 
  module, 
  tierId,
  index
}: { 
  module: any
  tierId: string
  index: number
}) {
  return (
    <Link
      href={`/journey/${tierId}/${module.id}`}
      className="block bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-gray-600 font-mono text-sm">
              Module {index + 1}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition">
            {module.title}
          </h3>
        </div>
        <div className="text-gray-600 group-hover:text-gray-400 transition">
          →
        </div>
      </div>
      
      <p className="text-gray-400 mb-4">{module.description}</p>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-gray-500">
          <span>📚 {module.topicCount} topics</span>
          <span>⏱️ {module.estimatedTime}</span>
        </div>
        
        {module.assessmentType && (
          <span className="text-xs bg-gray-800 px-2 py-1 rounded">
            {module.assessmentType}
          </span>
        )}
      </div>
    </Link>
  )
}