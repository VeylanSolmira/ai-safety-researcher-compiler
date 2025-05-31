import Link from 'next/link'
import PageHeader from '@/components/PageHeader'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          backLink={{ href: '/', label: 'Back to Home' }}
          showViewModeToggle={false}
        />

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About AI Safety Research Compiler
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 space-y-6">
            {/* Author Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Created By
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">Veylan Solmira</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  AI Safety Researcher & Educator
                </p>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Veylan is passionate about making AI safety research accessible while maintaining 
                  rigorous technical standards. They created this curriculum to bridge the gap between 
                  theoretical AI safety concepts and practical implementation skills.
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold mb-2">Connect</h4>
                  <a 
                    href="mailto:veylan@example.com" 
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 block"
                  >
                    ✉️ Email: veylan@example.com
                  </a>
                  <a 
                    href="https://linkedin.com/in/veylansolmira" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 block"
                  >
                    💼 LinkedIn: /in/veylansolmira
                  </a>
                  <a 
                    href="https://github.com/veylansolmira" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 block"
                  >
                    🐙 GitHub: @veylansolmira
                  </a>
                  <a 
                    href="https://twitter.com/veylansolmira" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 block"
                  >
                    🐦 Twitter: @veylansolmira
                  </a>
                </div>
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Our Mission
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The AI Safety Research Compiler is a comprehensive, interactive curriculum designed to systematically develop 
                AI safety research capabilities. We believe that making AI safety research accessible and engaging is crucial 
                for building a community of researchers who can contribute to ensuring AI systems are safe and beneficial.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                What We Offer
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-blue-600 dark:text-blue-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Interactive Roadmap</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      A visual, interactive roadmap that guides you through the essential concepts and skills needed 
                      for AI safety research, from fundamentals to advanced topics.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 text-green-600 dark:text-green-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Journey Mode</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      An engaging, game-like experience where you build real AI safety tools and explore concepts 
                      through hands-on projects, with a 60-70% focus on practical building.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 text-purple-600 dark:text-purple-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Dual Learning Modes</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Toggle between Academic mode for rigorous technical content and Personal mode for intuitive, 
                      accessible explanations that include practical insights and real-world applications.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 text-amber-600 dark:text-amber-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Progress Tracking</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Track your learning progress across topics, mark completed sections, and maintain a clear view 
                      of your advancement through the curriculum.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Who This Is For
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Whether you&apos;re a computer science student, a software engineer transitioning into AI safety, 
                a researcher from another field, or simply someone passionate about ensuring AI benefits humanity, 
                this curriculum provides a structured path to develop the skills and knowledge needed for 
                meaningful contributions to AI safety research.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                No prior AI safety experience is required, but a basic understanding of programming and mathematics 
                will help you get the most out of the curriculum.
              </p>
            </section>

            <section className="border-t pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Get Started
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/roadmap/ai-safety-researcher"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Explore Roadmap
                </Link>
                <Link
                  href="/journey"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
                >
                  Start Journey
                </Link>
              </div>
            </section>

            <section className="border-t pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Open Source
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This project is open source and available on{' '}
                <a 
                  href="https://github.com/VeylanSolmira/ai-safety-researcher-compiler" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  GitHub
                </a>
                . We welcome contributions, feedback, and suggestions from the community to help improve and 
                expand this resource.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}