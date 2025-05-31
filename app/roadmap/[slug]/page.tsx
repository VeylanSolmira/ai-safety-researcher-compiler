// Dynamic route that handles different roadmaps based on the URL slug
// e.g., /roadmap/ai-safety-researcher will have slug = "ai-safety-researcher"
import { notFound } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import ProgressSummary from '@/components/ProgressSummary'
import ViewModeToggle from '@/components/ViewModeToggle'
import { getRoadmapData } from '@/lib/roadmap'

const RoadmapViewer = dynamic(() => import('@/components/RoadmapViewer'), {
  ssr: false
})

// This tells Next.js which pages to pre-generate at build time
export async function generateStaticParams() {
  return [
    { slug: 'ai-safety-researcher' },
    // Add more roadmaps here as you create them
  ]
}

// Dynamic metadata based on the roadmap
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const roadmap = await getRoadmapData(params.slug)
  if (!roadmap) return {}
  
  return {
    title: `${roadmap.title} - AI Safety Researcher Compiler`,
    description: roadmap.description,
  }
}

// The actual page component
export default async function RoadmapPage({ params }: { params: { slug: string } }) {
  const roadmap = await getRoadmapData(params.slug)
  
  // Show 404 if roadmap doesn't exist
  if (!roadmap) {
    notFound()
  }
  
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              About
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">{roadmap.title}</h1>
            <p className="text-gray-600">{roadmap.briefDescription}</p>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <ViewModeToggle />
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <ProgressSummary />
        </div>
        <RoadmapViewer roadmapData={roadmap.jsonData} />
      </div>
    </div>
  )
}