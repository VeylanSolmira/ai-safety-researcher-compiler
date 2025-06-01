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
      
      <div className="flex gap-4 flex-wrap justify-center">
        <Link 
          href="/journey"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105 shadow-lg text-lg font-semibold"
        >
          Start Journey
        </Link>
        <Link 
          href="/highlights"
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 shadow-lg text-lg font-semibold"
        >
          View Highlights
        </Link>
        <Link 
          href="/roadmap/ai-safety-researcher"
          className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-lg hover:from-gray-700 hover:to-gray-800 transition transform hover:scale-105 shadow-lg text-lg font-semibold"
        >
          View Roadmap
        </Link>
        <Link 
          href="/resources"
          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition transform hover:scale-105 shadow-lg text-lg font-semibold"
        >
          Resources
        </Link>
      </div>
      
      <div className="mt-12 max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Two Modes, One Journey</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center">
            <h3 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">🎓 Academic Mode</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Rigorous, technical content with formal definitions, mathematical proofs, and citations. 
              Presenting established research, consensus positions, and empirical findings from the AI safety literature. 
              This mode maintains academic neutrality - focusing on what we know, how we know it, and where uncertainty remains.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">💭 Personal Mode</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              My personal takes on AI&apos;s most disputed questions.
              Covering impact, goals, and responses where evidence allows multiple views. These opinionated perspectives invite challenge and revision - modeling the intellectual humility and value pluralism this project advocates.
            </p>
          </div>
        </div>
        <p className="text-center mt-4 text-gray-600 dark:text-gray-400 text-sm italic">
          Toggle between modes anytime to match your learning style and goals
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
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

      {/* Featured Highlights Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Featured Deep Dives</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/journey/deep-dives/case-studies/alpha-evolve" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition p-6 h-full">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">CASE STUDY</span>
              <h3 className="font-semibold mt-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                AlphaEvolve Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-world recursive self-improvement in Google DeepMind's system
              </p>
            </div>
          </Link>
          
          <Link href="/journey/deep-dives/experiments/recursive-improvement-notebook" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition p-6 h-full">
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">EXPERIMENT</span>
              <h3 className="font-semibold mt-2 mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition">
                Build Self-Improving Code
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hands-on notebook creating recursive improvement systems
              </p>
            </div>
          </Link>
          
          <Link href="/journey/deep-dives/explorations/dark-forest-philosophy" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition p-6 h-full">
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">EXPLORATION</span>
              <h3 className="font-semibold mt-2 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                The Dark Forest of AI Safety
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Philosophy of information hazards in safety research
              </p>
            </div>
          </Link>
        </div>
        
        <div className="text-center mt-6">
          <Link 
            href="/highlights"
            className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 underline"
          >
            View all highlights →
          </Link>
        </div>
      </div>
    </div>
  )
}