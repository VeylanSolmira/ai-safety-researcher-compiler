import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Author Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Created By</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Veylan Solmira</strong>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI Safety Researcher & Educator
            </p>
            <div className="mt-4 space-y-2">
              <a 
                href="mailto:veylan@example.com" 
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 block"
              >
                ✉️ veylan@example.com
              </a>
              <a 
                href="https://linkedin.com/in/veylansolmira" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 block"
              >
                💼 LinkedIn
              </a>
              <a 
                href="https://github.com/veylansolmira" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 block"
              >
                🐙 GitHub
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/journey" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                  AI Safety Journey
                </Link>
              </li>
              <li>
                <Link href="/highlights" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                  Featured Work
                </Link>
              </li>
              <li>
                <Link href="/roadmap/ai-safety-researcher" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                  Interactive Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* About This Project */}
          <div>
            <h3 className="font-semibold text-lg mb-4">About This Project</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              The AI Safety Research Compiler is a comprehensive curriculum designed to systematically 
              develop AI safety research capabilities. It features dual learning modes, hands-on experiments, 
              and philosophical explorations.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This project represents original work in AI safety education, including case studies, 
              interactive notebooks, and philosophical essays.
            </p>
            <Link 
              href="/about"
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Learn more about the project →
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              © {currentYear} Veylan Solmira. All rights reserved.
            </p>
            <p className="mt-2 md:mt-0">
              Built with Next.js, TypeScript, and a commitment to AI safety
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}