import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import fs from 'fs'
import path from 'path'

// Read the case study content at build time
function getCaseStudyContent() {
  const filePath = path.join(process.cwd(), 'development-resources/case-studies/template-literal-injection.md')
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch (error) {
    return '# Case Study Not Found\n\nThe case study content could not be loaded.'
  }
}

export default function TemplateLiteralInjectionPage() {
  const content = getCaseStudyContent()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <PageHeader 
          backLink={{ href: '/highlights', label: 'Back to Highlights' }}
          showViewModeToggle={false}
        />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          {/* Warning banner for meta-vulnerability */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                  <strong>Meta-Alert:</strong> This case study documents a real vulnerability that occurred while writing about vulnerabilities. 
                  The irony is intentional and educational.
                </p>
              </div>
            </div>
          </div>

          <article className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }} />
          </article>

          {/* Related content */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Related Topics</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/journey/foundation/practical-ai-safety-basics/prompt-injection-attacks" 
                    className="block p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <h4 className="font-medium text-blue-600 dark:text-blue-400">Prompt Injection Attacks</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Learn about the vulnerability this case study illustrates
                </p>
              </Link>
              
              <Link href="/journey/foundation/ai-safety-why-it-matters/why-ai-safety" 
                    className="block p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <h4 className="font-medium text-blue-600 dark:text-blue-400">Why AI Safety Matters</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Fundamental challenges in AI safety
                </p>
              </Link>
              
              <Link href="/journey/foundation/practical-ai-safety-basics/build-first-safety-tool" 
                    className="block p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <h4 className="font-medium text-blue-600 dark:text-blue-400">Build Your First Safety Tool</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Security considerations when building tools
                </p>
              </Link>
            </div>
          </div>

          {/* Key takeaways */}
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">Key Takeaways</h3>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Code/data boundary confusion is fundamental to many security vulnerabilities</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>The same issue affects both traditional programming and AI systems</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Perfect defense may be impossible - focus on limiting damage</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple markdown parser (in production, use a proper markdown library)
function parseMarkdown(markdown: string): string {
  return markdown
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mt-8 mb-4">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium mt-6 mb-3">$1</h3>')
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
    .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*)\*/g, '<em>$1</em>')
    .replace(/```(.*?)```/gs, '<pre class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">$1</code>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/^(.+)$/gm, (match) => {
      if (match.trim() && !match.match(/^<[^>]+>/)) {
        return `<p class="mb-4">${match}</p>`
      }
      return match
    })
}