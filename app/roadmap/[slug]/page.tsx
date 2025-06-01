// Dynamic route that handles different roadmaps based on the URL slug
// e.g., /roadmap/ai-safety-researcher will have slug = "ai-safety-researcher"
import { notFound } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import ProgressSummary from '@/components/ProgressSummary'
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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/journey"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold"
            >
              Return to Journey
            </Link>
            <div className="text-center flex-1">
              <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                <h1 className="text-2xl font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  {roadmap.title}
                </h1>
                <p className="text-gray-600">{roadmap.briefDescription}</p>
              </Link>
            </div>
            <div className="w-[150px]"></div>
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