// This is the homepage of your app (what users see at '/')
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">AI Safety Researcher Compiler</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl text-center">
        A comprehensive, interactive curriculum for systematically developing 
        AI safety research capabilities - from foundations to advanced technical contributions
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/roadmap/ai-safety-researcher"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Start Learning
        </Link>
        <Link 
          href="/about"
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
        >
          Learn More
        </Link>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        <div className="text-center">
          <h3 className="font-semibold mb-2">Value Pluralism</h3>
          <p className="text-gray-600">Acknowledging multiple valid approaches to AI safety</p>
        </div>
        <div className="text-center">
          <h3 className="font-semibold mb-2">Hands-on Implementation</h3>
          <p className="text-gray-600">Build transformers and alignment techniques from scratch</p>
        </div>
        <div className="text-center">
          <h3 className="font-semibold mb-2">Progressive Competency</h3>
          <p className="text-gray-600">Embedded assessments verify understanding at each stage</p>
        </div>
      </div>
    </div>
  )
}