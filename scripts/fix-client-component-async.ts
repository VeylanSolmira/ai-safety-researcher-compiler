#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

console.log('🔧 Fixing client component async issues...\n')

// Fix journey topic page - convert back to client-side data fetching
const journeyTopicPagePath = './app/journey/[tierId]/[moduleId]/[topicId]/page.tsx'
let content = fs.readFileSync(journeyTopicPagePath, 'utf-8')

// Find the related resources section and replace with useEffect-based loading
const relatedResourcesSection = `{/* Related Resources */}
        <div className="mt-12 space-y-6">
          {/* Case Studies */}
          {topic.relatedCaseStudies && topic.relatedCaseStudies.length > 0 && (
            <RelatedCaseStudies caseStudyIds={topic.relatedCaseStudies} />
          )}
          
          {/* Experiments */}
          {topic.relatedExperiments && topic.relatedExperiments.length > 0 && (
            <RelatedExperiments experimentIds={topic.relatedExperiments} />
          )}
          
          {/* Explorations */}
          {topic.relatedExplorations && topic.relatedExplorations.length > 0 && (
            <RelatedExplorations explorationIds={topic.relatedExplorations} />
          )}
        </div>`

// Replace the existing section
content = content.replace(
  /{\/\* Related Resources \*\/}[\s\S]*?<\/div>\s*{\/\* Navigation \*\/}/,
  relatedResourcesSection + '\n        \n        {/* Navigation */}'
)

// Add the new components before the export
const componentsToAdd = `
// Related resource components
function RelatedCaseStudies({ caseStudyIds }: { caseStudyIds: string[] }) {
  const [caseStudies, setCaseStudies] = useState<any[]>([])
  
  useEffect(() => {
    Promise.all(caseStudyIds.map(id => getCaseStudy(id)))
      .then(results => setCaseStudies(results.filter(Boolean)))
  }, [caseStudyIds])
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Related Case Studies</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {caseStudies.map(caseStudy => (
          <Link 
            key={caseStudy.id} 
            href={\`/journey/deep-dives/case-studies/\${caseStudy.id}\`}
            className="block bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition"
          >
            <h4 className="font-medium text-white mb-1">{caseStudy.title}</h4>
            <p className="text-sm text-gray-400">{caseStudy.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

function RelatedExperiments({ experimentIds }: { experimentIds: string[] }) {
  const [experiments, setExperiments] = useState<any[]>([])
  
  useEffect(() => {
    Promise.all(experimentIds.map(id => getExperiment(id)))
      .then(results => setExperiments(results.filter(Boolean)))
  }, [experimentIds])
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Related Experiments</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {experiments.map(experiment => (
          <Link 
            key={experiment.id} 
            href={\`/journey/deep-dives/experiments/\${experiment.id}\`}
            className="block bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition"
          >
            <h4 className="font-medium text-white mb-1">{experiment.title}</h4>
            <p className="text-sm text-gray-400">{experiment.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

function RelatedExplorations({ explorationIds }: { explorationIds: string[] }) {
  const [explorations, setExplorations] = useState<any[]>([])
  
  useEffect(() => {
    Promise.all(explorationIds.map(id => getExploration(id)))
      .then(results => setExplorations(results.filter(Boolean)))
  }, [explorationIds])
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Related Explorations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {explorations.map(exploration => (
          <Link 
            key={exploration.id} 
            href={\`/journey/deep-dives/explorations/\${exploration.id}\`}
            className="block bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition"
          >
            <h4 className="font-medium text-white mb-1">{exploration.title}</h4>
            <p className="text-sm text-gray-400">{exploration.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

`

// Add the components before the default export
content = content.replace(
  'export default function TopicPage() {',
  componentsToAdd + '\nexport default function TopicPage() {'
)

fs.writeFileSync(journeyTopicPagePath, content)
console.log('✅ Fixed journey topic page client-side async')

// Fix 2: Fix community profile page - it's using hooks inside async function
const communityPagePath = './app/resources/communities/[id]/page.tsx'
let communityContent = fs.readFileSync(communityPagePath, 'utf-8')

// Remove async from default export
communityContent = communityContent.replace(
  'export default async function Page()',
  'export default function Page()'
)

fs.writeFileSync(communityPagePath, communityContent)
console.log('✅ Fixed community profile page')

// Fix 3: Fix tools page - same issue
const toolsPagePath = './app/resources/tools/[id]/page.tsx'
let toolsContent = fs.readFileSync(toolsPagePath, 'utf-8')

// Remove async from default export
toolsContent = toolsContent.replace(
  'export default async function Page()',
  'export default function Page()'
)

fs.writeFileSync(toolsPagePath, toolsContent)
console.log('✅ Fixed tools page')

console.log('\n🎉 Client component async fixes applied!')
console.log('Run "npm run build" to test.')