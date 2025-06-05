import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import JourneyTopicContent from '@/components/JourneyTopicContent'
import ViewModeToggle from '@/components/ViewModeToggle'
import ProgressButtons from './ProgressButtons'
import RelatedResources from './RelatedResources'
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

// Generate all possible topic pages at build time
export async function generateStaticParams() {
  const db = getRawDb()
  
  try {
    // Get all topics with their tier and module IDs
    const topics = db.prepare(`
      SELECT 
        t.id as topicId,
        t.module_id as moduleId,
        m.tier_id as tierId
      FROM topics t
      JOIN modules m ON t.module_id = m.id
    `).all() as Array<{ topicId: string; moduleId: string; tierId: string }>

    return topics.map(({ tierId, moduleId, topicId }) => ({
      tierId,
      moduleId,
      topicId
    }))
  } finally {
    db.close()
  }
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { tierId: string; moduleId: string; topicId: string } 
}): Promise<Metadata> {
  const db = getRawDb()
  
  try {
    const topic = db.prepare(`
      SELECT title, description
      FROM topics
      WHERE id = ?
    `).get(params.topicId) as { title: string; description: string } | undefined

    if (!topic) {
      return {
        title: 'Topic Not Found'
      }
    }

    return {
      title: `${topic.title} - AI Safety Research Compiler`,
      description: topic.description
    }
  } finally {
    db.close()
  }
}

// Server component - runs at build time
export default async function TopicPage({ 
  params 
}: { 
  params: { tierId: string; moduleId: string; topicId: string } 
}) {
  const { tierId, moduleId, topicId } = params
  const db = getRawDb()
  
  try {
    // Get topic with tier and module info
    const topicData = db.prepare(`
      SELECT 
        t.*,
        m.id as module_id,
        m.title as module_title,
        ti.id as tier_id,
        ti.title as tier_title
      FROM topics t
      JOIN modules m ON t.module_id = m.id
      JOIN tiers ti ON m.tier_id = ti.id
      WHERE t.id = ?
    `).get(topicId) as any

    if (!topicData) {
      notFound()
    }

    // Transform database row to expected format
    const topic = {
      id: topicData.id,
      title: topicData.title,
      description: topicData.description,
      estimatedTime: topicData.estimated_time,
      content: topicData.content_academic,
      contentPersonal: topicData.content_personal,
      difficulty: topicData.difficulty,
      tags: topicData.tags ? JSON.parse(topicData.tags) : [],
      prerequisites: topicData.prerequisites ? JSON.parse(topicData.prerequisites) : [],
      relatedCaseStudies: topicData.related_case_studies ? JSON.parse(topicData.related_case_studies) : [],
      relatedExperiments: topicData.related_experiments ? JSON.parse(topicData.related_experiments) : [],
      relatedExplorations: topicData.related_explorations ? JSON.parse(topicData.related_explorations) : [],
      hasJourneyExtras: topicData.has_journey_extras === 1,
      hasInteractiveTransition: topicData.has_interactive_transition === 1
    }

    const tier = {
      id: topicData.tier_id,
      title: topicData.tier_title
    }

    const module = {
      id: topicData.module_id,
      title: topicData.module_title
    }

    // Get all topics in module for navigation
    const moduleTopics = db.prepare(`
      SELECT id, title 
      FROM topics 
      WHERE module_id = ? 
      ORDER BY position, id
    `).all(moduleId) as Array<{ id: string; title: string }>

    const currentIndex = moduleTopics.findIndex(t => t.id === topicId)
    const nextTopic = currentIndex < moduleTopics.length - 1 ? moduleTopics[currentIndex + 1] : null
    const prevTopic = currentIndex > 0 ? moduleTopics[currentIndex - 1] : null

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
              <li><Link href={`/journey/${tierId}/${moduleId}`} className="hover:text-white">{module.title}</Link></li>
              <li className="text-gray-600">/</li>
              <li className="text-white">{topic.title}</li>
            </ol>
          </nav>
          
          {/* Topic Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold text-white">{topic.title}</h1>
                <ProgressButtons 
                  tierId={tierId} 
                  moduleId={moduleId} 
                  topicId={topicId}
                  nextTopicId={nextTopic?.id}
                />
              </div>
              {/* View Mode Toggle */}
              <ViewModeToggle />
            </div>
            <p className="text-xl text-gray-400 mb-6">{topic.description}</p>
            
            {/* Topic Metadata */}
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>⏱️ {topic.estimatedTime}</span>
              <span className={`
                ${topic.difficulty === 'beginner' ? 'text-green-500' :
                  topic.difficulty === 'intermediate' ? 'text-yellow-500' :
                  'text-orange-500'}
              `}>
                {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
              </span>
              {topic.tags && topic.tags.length > 0 && (
                <div className="flex gap-1">
                  {topic.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-gray-800 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Topic Content - Pre-rendered at build time! */}
          <JourneyTopicContent 
            topic={topic}
            tierId={tierId}
            moduleId={moduleId}
          />
          
          {/* Related Resources */}
          <RelatedResources 
            caseStudyIds={topic.relatedCaseStudies}
            experimentIds={topic.relatedExperiments}
            explorationIds={topic.relatedExplorations}
          />
          
          {/* Navigation */}
          <div className="mt-12 flex justify-between items-center">
            <Link 
              href={`/journey/${tierId}/${moduleId}`}
              className="text-gray-400 hover:text-white transition"
            >
              ← Back to Module
            </Link>
            
            <ProgressButtons 
              tierId={tierId} 
              moduleId={moduleId} 
              topicId={topicId}
              nextTopicId={nextTopic?.id}
              showMarkComplete
            />
          </div>
          
          {/* SSG indicator */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-blue-600">
            <span>⚡</span>
            <span>Pre-rendered at build time (instant load)</span>
          </div>
        </div>
      </div>
    )
  } finally {
    db.close()
  }
}