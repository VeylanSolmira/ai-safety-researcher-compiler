// Dynamic route that handles different roadmaps based on the URL slug
// e.g., /roadmap/ai-safety-researcher will have slug = "ai-safety-researcher"
import { notFound } from 'next/navigation'
import RoadmapViewer from '@/components/RoadmapViewer'
import { getRoadmapData } from '@/lib/roadmap'

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
          <h1 className="text-2xl font-bold">{roadmap.title}</h1>
          <p className="text-gray-600">{roadmap.briefDescription}</p>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <RoadmapViewer roadmapData={roadmap.jsonData} />
      </div>
    </div>
  )
}