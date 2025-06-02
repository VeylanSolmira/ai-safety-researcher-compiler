'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  UserGroupIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  BeakerIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { profiles } from '@/lib/community-profiles'

interface Community {
  id: string
  name: string
  type: 'organization' | 'researcher' | 'community' | 'lab' | 'forum'
  category: 'research' | 'education' | 'policy' | 'technical' | 'general'
  description: string
  website?: string
  location?: string
  focus: string[]
  resources?: {
    type: 'paper' | 'course' | 'tool' | 'blog'
    title: string
    url: string
  }[]
}

const communities: Community[] = [
  // Organizations
  {
    id: 'anthropic',
    name: 'Anthropic',
    type: 'organization',
    category: 'research',
    description: 'AI safety company focused on building reliable, interpretable, and steerable AI systems.',
    website: 'https://www.anthropic.com',
    location: 'San Francisco, CA',
    focus: ['Constitutional AI', 'Interpretability', 'RLHF', 'Claude'],
    resources: [
      { type: 'paper', title: 'Constitutional AI', url: 'https://arxiv.org/abs/2212.08073' },
      { type: 'tool', title: 'Claude', url: 'https://claude.ai' }
    ]
  },
  {
    id: 'deepmind-safety',
    name: 'DeepMind Safety Team',
    type: 'organization',
    category: 'research',
    description: 'Research team within DeepMind focused on technical AI safety and alignment.',
    website: 'https://deepmind.google/safety-and-responsibility/',
    location: 'London, UK',
    focus: ['Alignment', 'Robustness', 'Interpretability', 'Safety Research']
  },
  {
    id: 'openai-safety',
    name: 'OpenAI Safety Team',
    type: 'organization',
    category: 'research',
    description: 'Team dedicated to ensuring AGI benefits all of humanity through safety research.',
    website: 'https://openai.com/safety',
    location: 'San Francisco, CA',
    focus: ['Superalignment', 'Red Teaming', 'Safety Systems']
  },
  {
    id: 'miri',
    name: 'Machine Intelligence Research Institute',
    type: 'organization',
    category: 'research',
    description: 'Non-profit research institute focused on ensuring smarter-than-human AI has a positive impact.',
    website: 'https://intelligence.org',
    location: 'Berkeley, CA',
    focus: ['Agent Foundations', 'Alignment Theory', 'Decision Theory']
  },
  {
    id: 'fhi',
    name: 'Future of Humanity Institute',
    type: 'organization',
    category: 'research',
    description: 'Multidisciplinary research institute studying existential risks and the future of humanity.',
    website: 'https://www.fhi.ox.ac.uk',
    location: 'Oxford, UK',
    focus: ['Existential Risk', 'AI Governance', 'Long-term Safety']
  },
  {
    id: 'chai',
    name: 'Center for Human-Compatible AI',
    type: 'organization',
    category: 'research',
    description: 'UC Berkeley research center focused on value alignment and beneficial AI.',
    website: 'https://humancompatible.ai',
    location: 'Berkeley, CA',
    focus: ['Value Alignment', 'Cooperative AI', 'Human-AI Interaction']
  },

  // Individual Researchers
  {
    id: 'neel-nanda',
    name: 'Neel Nanda',
    type: 'researcher',
    category: 'technical',
    description: 'Mechanistic interpretability researcher at Anthropic, known for accessible tutorials and TransformerLens.',
    website: 'https://www.neelnanda.io',
    focus: ['Mechanistic Interpretability', 'Transformer Circuits', 'Education'],
    resources: [
      { type: 'blog', title: '200 Concrete Open Problems', url: 'https://www.alignmentforum.org/posts/example' },
      { type: 'tool', title: 'TransformerLens', url: 'https://github.com/neelnanda-io/TransformerLens' },
      { type: 'course', title: 'Mech Interp Tutorial', url: 'https://arena3-chapter1-transformer-interp.streamlit.app/' }
    ]
  },
  {
    id: 'paul-christiano',
    name: 'Paul Christiano',
    type: 'researcher',
    category: 'research',
    description: 'Alignment researcher, founder of Alignment Research Center, pioneer of RLHF and IDA.',
    website: 'https://paulfchristiano.com',
    focus: ['Alignment Theory', 'RLHF', 'Iterated Distillation and Amplification'],
    resources: [
      { type: 'paper', title: 'AI Safety via Debate', url: 'https://arxiv.org/abs/1805.00899' }
    ]
  },
  {
    id: 'eliezer-yudkowsky',
    name: 'Eliezer Yudkowsky',
    type: 'researcher',
    category: 'research',
    description: 'AI safety researcher and founder of MIRI, known for foundational work on AI alignment.',
    website: 'https://yudkowsky.net',
    focus: ['Alignment Theory', 'Rationality', 'AI Risk'],
    resources: [
      { type: 'blog', title: 'AGI Ruin: A List of Lethalities', url: 'https://www.lesswrong.com/posts/uMQ3cqWDPHhjtiesc/agi-ruin-a-list-of-lethalities' }
    ]
  },
  {
    id: 'stuart-russell',
    name: 'Stuart Russell',
    type: 'researcher',
    category: 'research',
    description: 'UC Berkeley professor, co-author of leading AI textbook, advocate for beneficial AI.',
    website: 'https://people.eecs.berkeley.edu/~russell/',
    focus: ['Value Alignment', 'AI Governance', 'Human-Compatible AI'],
    resources: [
      { type: 'paper', title: 'Human Compatible', url: 'https://www.humancompatible.ai/book' }
    ]
  },

  // Communities and Forums
  {
    id: 'alignment-forum',
    name: 'Alignment Forum',
    type: 'forum',
    category: 'general',
    description: 'Dedicated forum for technical AI alignment research and discussion.',
    website: 'https://www.alignmentforum.org',
    focus: ['Technical Research', 'Alignment Theory', 'Research Discussion']
  },
  {
    id: 'lesswrong',
    name: 'LessWrong',
    type: 'community',
    category: 'general',
    description: 'Community blog focused on rationality, AI safety, and effective reasoning.',
    website: 'https://www.lesswrong.com',
    focus: ['Rationality', 'AI Safety', 'Epistemology']
  },
  {
    id: 'ea-forum',
    name: 'EA Forum',
    type: 'forum',
    category: 'general',
    description: 'Effective Altruism community forum with significant AI safety discussion.',
    website: 'https://forum.effectivealtruism.org',
    focus: ['Effective Altruism', 'AI Safety', 'Career Advice']
  },

  // Research Labs
  {
    id: 'redwood-research',
    name: 'Redwood Research',
    type: 'lab',
    category: 'technical',
    description: 'Independent AI safety research lab focused on interpretability and adversarial training.',
    website: 'https://www.redwoodresearch.org',
    location: 'Berkeley, CA',
    focus: ['Interpretability', 'Adversarial Training', 'Safety Techniques']
  },
  {
    id: 'conjecture',
    name: 'Conjecture',
    type: 'lab',
    category: 'technical',
    description: 'AI safety startup working on controllable AI systems.',
    website: 'https://conjecture.dev',
    location: 'London, UK',
    focus: ['Controllability', 'Interpretability', 'Safety Tools']
  },
  {
    id: 'far-ai',
    name: 'FAR.AI (FAR Labs)',
    type: 'lab',
    category: 'research',
    description: 'Research organization focused on making AI go well for humanity through technical research and field-building.',
    website: 'https://far.ai',
    location: 'Berkeley, CA',
    focus: ['AI Safety Research', 'Field Building', 'Technical Alignment', 'Research Infrastructure'],
    resources: [
      { type: 'blog', title: 'FAR.AI Blog', url: 'https://far.ai/blog' },
      { type: 'paper', title: 'Research Publications', url: 'https://far.ai/research' }
    ]
  },

  // Educational Programs
  {
    id: 'aisf',
    name: 'AI Safety Fundamentals',
    type: 'community',
    category: 'education',
    description: 'Educational program offering courses on AI alignment and governance.',
    website: 'https://aisafetyfundamentals.com',
    focus: ['Education', 'Curriculum', 'Community Building'],
    resources: [
      { type: 'course', title: 'Alignment Course', url: 'https://course.aisafetyfundamentals.com/alignment' },
      { type: 'course', title: 'Governance Course', url: 'https://course.aisafetyfundamentals.com/governance' }
    ]
  },
  {
    id: 'arena',
    name: 'ARENA',
    type: 'community',
    category: 'education',
    description: 'Alignment Research Engineer Accelerator - intensive program for aspiring alignment researchers.',
    website: 'https://www.arena.education',
    focus: ['Technical Training', 'Interpretability', 'Research Skills']
  }
]

const typeIcons = {
  organization: BuildingLibraryIcon,
  researcher: AcademicCapIcon,
  community: UserGroupIcon,
  lab: BeakerIcon,
  forum: ChatBubbleLeftRightIcon
}

const categoryColors = {
  research: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  education: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  policy: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  technical: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  general: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

export default function CommunitiesPage() {
  const [selectedType, setSelectedType] = useState<Community['type'] | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<Community['category'] | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter communities
  const filteredCommunities = communities.filter(community => {
    const matchesType = selectedType === 'all' || community.type === selectedType
    const matchesCategory = selectedCategory === 'all' || community.category === selectedCategory
    const matchesSearch = !searchQuery || 
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.focus.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesType && matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/resources" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Back to Resources
              </Link>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UserGroupIcon className="h-5 w-5" />
                Community Directory
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI Safety Community Directory
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Connect with organizations, researchers, and communities working on AI safety around the world.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <input
            type="search"
            placeholder="Search communities, researchers, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Type Filter */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</span>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedType === 'all'
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                All ({communities.length})
              </button>
              {Object.entries(typeIcons).map(([type, Icon]) => {
                const count = communities.filter(c => c.type === type).length
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type as Community['type'])}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                      selectedType === type
                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
                  </button>
                )
              })}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {Object.keys(categoryColors).map(category => {
                const count = communities.filter(c => c.category === category).length
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category as Community['category'])}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? categoryColors[category as keyof typeof categoryColors]
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-600 dark:text-gray-400">
          Showing {filteredCommunities.length} of {communities.length} communities
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCommunities.map(community => {
            const Icon = typeIcons[community.type]
            return (
              <div
                key={community.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <Icon className="h-6 w-6 text-gray-400 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {community.website ? (
                          <a 
                            href={community.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            {community.name}
                          </a>
                        ) : (
                          community.name
                        )}
                      </h3>
                      {community.location && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                          <GlobeAltIcon className="h-3 w-3" />
                          {community.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[community.category]}`}>
                    {community.category}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {community.description}
                </p>

                {/* Focus Areas */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Focus Areas:</p>
                  <div className="flex flex-wrap gap-2">
                    {community.focus.map(area => (
                      <span 
                        key={area}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                {community.resources && community.resources.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Key Resources:</p>
                    <div className="space-y-1">
                      {community.resources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          📄 {resource.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* View Profile Button */}
                {profiles[community.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href={`/resources/communities/${community.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                      <DocumentTextIcon className="h-4 w-4" />
                      View Detailed Profile
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredCommunities.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No communities found matching your criteria.
            </p>
          </div>
        )}

        {/* Add Community CTA */}
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Missing a community?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Help us expand this directory by suggesting organizations, researchers, or communities working on AI safety.
          </p>
          <a
            href="https://github.com/YourUsername/ai-safety-research-compiler/issues/new?title=Community%20Directory%20Suggestion"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserGroupIcon className="h-5 w-5" />
            Suggest a Community
          </a>
        </div>
      </main>
    </div>
  )
}