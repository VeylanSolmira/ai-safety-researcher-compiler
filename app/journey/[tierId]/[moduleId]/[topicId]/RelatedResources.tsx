import Link from 'next/link'
import { getCaseStudy } from '@/lib/case-studies'
import { getExperiment } from '@/lib/experiments'
import { getExploration } from '@/lib/explorations'

interface RelatedResourcesProps {
  caseStudyIds?: string[]
  experimentIds?: string[]
  explorationIds?: string[]
}

async function RelatedCaseStudies({ caseStudyIds }: { caseStudyIds: string[] }) {
  // Fetch all case studies at build time
  const caseStudies = await Promise.all(
    caseStudyIds.map(id => getCaseStudy(id))
  ).then(results => results.filter((study): study is NonNullable<typeof study> => study !== null && study !== undefined))

  if (caseStudies.length === 0) return null

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Related Case Studies</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {caseStudies.map(caseStudy => (
          <Link 
            key={caseStudy.id} 
            href={`/journey/deep-dives/case-studies/${caseStudy.id}`}
            className="block bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition"
          >
            <h4 className="font-medium text-white mb-1">{caseStudy.title}</h4>
            <p className="text-sm text-gray-400">{caseStudy.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

async function RelatedExperiments({ experimentIds }: { experimentIds: string[] }) {
  // Fetch all experiments at build time
  const experiments = await Promise.all(
    experimentIds.map(id => getExperiment(id))
  ).then(results => results.filter((exp): exp is NonNullable<typeof exp> => exp !== null && exp !== undefined))

  if (experiments.length === 0) return null

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Related Experiments</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {experiments.map(experiment => (
          <Link 
            key={experiment.metadata.id} 
            href={`/journey/deep-dives/experiments/${experiment.metadata.id}`}
            className="block bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition"
          >
            <h4 className="font-medium text-white mb-1">{experiment.metadata.title}</h4>
            <p className="text-sm text-gray-400">{experiment.metadata.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

async function RelatedExplorations({ explorationIds }: { explorationIds: string[] }) {
  // Fetch all explorations at build time
  const explorations = await Promise.all(
    explorationIds.map(id => getExploration(id))
  ).then(results => results.filter((exp): exp is NonNullable<typeof exp> => exp !== null && exp !== undefined))

  if (explorations.length === 0) return null

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Related Explorations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {explorations.map(exploration => (
          <Link 
            key={exploration.metadata.id} 
            href={`/journey/deep-dives/explorations/${exploration.metadata.id}`}
            className="block bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition"
          >
            <h4 className="font-medium text-white mb-1">{exploration.metadata.title}</h4>
            <p className="text-sm text-gray-400">{exploration.metadata.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default async function RelatedResources({ 
  caseStudyIds = [], 
  experimentIds = [], 
  explorationIds = [] 
}: RelatedResourcesProps) {
  const hasRelatedContent = 
    caseStudyIds.length > 0 || 
    experimentIds.length > 0 || 
    explorationIds.length > 0

  if (!hasRelatedContent) return null

  return (
    <div className="mt-12 space-y-6">
      {caseStudyIds.length > 0 && (
        <RelatedCaseStudies caseStudyIds={caseStudyIds} />
      )}
      
      {experimentIds.length > 0 && (
        <RelatedExperiments experimentIds={experimentIds} />
      )}
      
      {explorationIds.length > 0 && (
        <RelatedExplorations explorationIds={explorationIds} />
      )}
    </div>
  )
}