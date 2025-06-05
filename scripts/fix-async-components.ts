#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

console.log('🔧 Fixing async component issues...\n')

// Fix 1: Fix journey topic page - remove inline awaits in map
const journeyTopicPagePath = './app/journey/[tierId]/[moduleId]/[topicId]/page.tsx'
let journeyTopicContent = fs.readFileSync(journeyTopicPagePath, 'utf-8')

// Replace the problematic pattern with Promise.all approach
journeyTopicContent = journeyTopicContent.replace(
  /{topic.relatedCaseStudies.map\(caseStudyId => {[\s\S]*?}\)}/g,
  `{await Promise.all(topic.relatedCaseStudies.map(async caseStudyId => {
                  const caseStudy = await getCaseStudy(caseStudyId)
                  if (!caseStudy) return null
                  return (
                    <Link 
                      key={caseStudyId} 
                      href={\`/journey/deep-dives/case-studies/\${caseStudyId}\`}
                      className="block bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition"
                    >
                      <h4 className="font-medium text-white mb-1">{caseStudy.title}</h4>
                      <p className="text-sm text-gray-400">{caseStudy.description}</p>
                    </Link>
                  )
                }))}`
)

// Do the same for experiments
journeyTopicContent = journeyTopicContent.replace(
  /{topic.relatedExperiments.map\(experimentId => {[\s\S]*?}\)}/g,
  `{await Promise.all(topic.relatedExperiments.map(async experimentId => {
                  const experiment = await getExperiment(experimentId)
                  if (!experiment) return null
                  return (
                    <Link 
                      key={experimentId} 
                      href={\`/journey/deep-dives/experiments/\${experimentId}\`}
                      className="block bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition"
                    >
                      <h4 className="font-medium text-white mb-1">{experiment.title}</h4>
                      <p className="text-sm text-gray-400">{experiment.description}</p>
                    </Link>
                  )
                }))}`
)

// And for explorations
journeyTopicContent = journeyTopicContent.replace(
  /{topic.relatedExplorations.map\(explorationId => {[\s\S]*?}\)}/g,
  `{await Promise.all(topic.relatedExplorations.map(async explorationId => {
                  const exploration = await getExploration(explorationId)
                  if (!exploration) return null
                  return (
                    <Link 
                      key={explorationId} 
                      href={\`/journey/deep-dives/explorations/\${explorationId}\`}
                      className="block bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition"
                    >
                      <h4 className="font-medium text-white mb-1">{exploration.title}</h4>
                      <p className="text-sm text-gray-400">{exploration.description}</p>
                    </Link>
                  )
                }))}`
)

fs.writeFileSync(journeyTopicPagePath, journeyTopicContent)
console.log('✅ Fixed journey topic page')

// Fix 2: Fix case study page - make generateMetadata and component async
const caseStudyPagePath = './app/resources/case-studies/[id]/page.tsx'
let caseStudyContent = fs.readFileSync(caseStudyPagePath, 'utf-8')

// Make generateMetadata async
caseStudyContent = caseStudyContent.replace(
  'export const generateMetadata = ({ params }: { params: { id: string } }) => {',
  'export const generateMetadata = async ({ params }: { params: { id: string } }) => {'
)

// Make component async
caseStudyContent = caseStudyContent.replace(
  'export default function CaseStudyPage({ params }: { params: { id: string } }) {',
  'export default async function CaseStudyPage({ params }: { params: { id: string } }) {'
)

fs.writeFileSync(caseStudyPagePath, caseStudyContent)
console.log('✅ Fixed case study page')

// Fix 3: Fix other resource pages
const resourcePages = [
  './app/resources/communities/[id]/page.tsx',
  './app/resources/news/[id]/page.tsx',
  './app/resources/tools/[id]/page.tsx'
]

for (const pagePath of resourcePages) {
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf-8')
    
    // Make generateMetadata async if it exists
    content = content.replace(
      /export const generateMetadata = \(({ params }: { params: { id: string } })\) => {/g,
      'export const generateMetadata = async $1 => {'
    )
    
    // Make default export async
    content = content.replace(
      /export default function \w+Page\(/g,
      'export default async function Page('
    )
    
    fs.writeFileSync(pagePath, content)
    console.log(`✅ Fixed ${pagePath}`)
  }
}

console.log('\n🎉 Async component fixes applied!')
console.log('Run "npm run build" to test.')