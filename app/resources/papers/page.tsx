'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Paper {
  id: string
  title: string
  authors: string[]
  year: number
  category: 'foundational' | 'alignment' | 'interpretability' | 'governance' | 'technical' | 'philosophy'
  tags: string[]
  abstract: string
  link: string
  importance: 'essential' | 'important' | 'useful'
  readingTime?: string
}

// Sample data - in production this would come from a database or API
const papers: Paper[] = [
  {
    id: 'superintelligence-2014',
    title: 'Superintelligence: Paths, Dangers, Strategies',
    authors: ['Nick Bostrom'],
    year: 2014,
    category: 'foundational',
    tags: ['existential risk', 'AI safety', 'superintelligence'],
    abstract: 'The foundational book examining paths to superintelligence and associated risks...',
    link: 'https://www.amazon.com/Superintelligence-Dangers-Strategies-Nick-Bostrom/dp/0198739834',
    importance: 'essential',
    readingTime: '12-15 hours'
  },
  {
    id: 'concrete-problems-2016',
    title: 'Concrete Problems in AI Safety',
    authors: ['Dario Amodei', 'Chris Olah', 'Jacob Steinhardt', 'Paul Christiano', 'John Schulman', 'Dan Mané'],
    year: 2016,
    category: 'foundational',
    tags: ['AI safety', 'machine learning', 'technical'],
    abstract: 'An accessible introduction to AI safety for ML researchers, outlining five practical research problems...',
    link: 'https://arxiv.org/abs/1606.06565',
    importance: 'essential',
    readingTime: '45 min'
  },
  {
    id: 'ai-alignment-problem-2021',
    title: 'The Alignment Problem',
    authors: ['Brian Christian'],
    year: 2021,
    category: 'foundational',
    tags: ['alignment', 'AI safety', 'popular science'],
    abstract: 'A comprehensive overview of the AI alignment problem for general audiences...',
    link: 'https://brianchristian.org/the-alignment-problem/',
    importance: 'important',
    readingTime: '8-10 hours'
  },
  {
    id: 'agi-ruin-2022',
    title: 'AGI Ruin: A List of Lethalities',
    authors: ['Eliezer Yudkowsky'],
    year: 2022,
    category: 'foundational',
    tags: ['existential risk', 'AGI', 'alignment difficulty'],
    abstract: 'A comprehensive list of reasons why AGI poses an existential risk, outlining core difficulties in alignment...',
    link: 'https://www.lesswrong.com/posts/uMQ3cqWDPHhjtiesc/agi-ruin-a-list-of-lethalities',
    importance: 'essential',
    readingTime: '2 hours'
  },
  {
    id: 'reward-is-enough-2021',
    title: 'Reward is Enough',
    authors: ['David Silver', 'Satinder Singh', 'Doina Precup', 'Richard S. Sutton'],
    year: 2021,
    category: 'technical',
    tags: ['reinforcement learning', 'AGI', 'capabilities'],
    abstract: 'Argues that reward maximization is sufficient for developing artificial general intelligence...',
    link: 'https://www.sciencedirect.com/science/article/pii/S0004370221000862',
    importance: 'important',
    readingTime: '1 hour'
  },
  {
    id: 'constitutional-ai-2022',
    title: 'Constitutional AI: Harmlessness from AI Feedback',
    authors: ['Yuntao Bai', 'Saurav Kadavath', 'Sandipan Kundu', 'et al.'],
    year: 2022,
    category: 'alignment',
    tags: ['RLHF', 'Constitutional AI', 'alignment techniques'],
    abstract: 'Introduces Constitutional AI, a method for training harmless AI systems using AI feedback...',
    link: 'https://arxiv.org/abs/2212.08073',
    importance: 'important',
    readingTime: '90 min'
  },
  {
    id: 'mechanistic-interpretability-2023',
    title: 'Towards Monosemanticity: Decomposing Language Models With Dictionary Learning',
    authors: ['Trenton Bricken', 'Adly Templeton', 'Joshua Batson', 'et al.'],
    year: 2023,
    category: 'interpretability',
    tags: ['mechanistic interpretability', 'sparse autoencoders', 'features'],
    abstract: 'Uses sparse autoencoders to extract interpretable features from language models...',
    link: 'https://transformer-circuits.pub/2023/monosemantic-features/index.html',
    importance: 'important',
    readingTime: '2 hours'
  },
  {
    id: 'ai-safety-governance-2023',
    title: 'Computing Power and the Governance of Artificial Intelligence',
    authors: ['Girish Sastry', 'Lennart Heim', 'Haydn Belfield', 'et al.'],
    year: 2024,
    category: 'governance',
    tags: ['compute governance', 'policy', 'regulation'],
    abstract: 'Analyzes how computing power can be leveraged for AI governance and safety measures...',
    link: 'https://arxiv.org/abs/2402.08797',
    importance: 'important',
    readingTime: '1.5 hours'
  },
  {
    id: 'mesa-optimization-2019',
    title: 'Risks from Learned Optimization in Advanced Machine Learning Systems',
    authors: ['Evan Hubinger', 'Chris van Merwijk', 'Vladimir Mikulik', 'Joar Skalse', 'Scott Garrabrant'],
    year: 2019,
    category: 'foundational',
    tags: ['mesa-optimization', 'inner alignment', 'deceptive alignment'],
    abstract: 'Introduces the concept of mesa-optimizers and the inner alignment problem...',
    link: 'https://arxiv.org/abs/1906.01820',
    importance: 'essential',
    readingTime: '3 hours'
  },
  {
    id: 'power-seeking-2021',
    title: 'Optimal Policies Tend to Seek Power',
    authors: ['Alexander Matt Turner', 'Logan Smith', 'Rohin Shah', 'Andrew Critch', 'Prasad Tadepalli'],
    year: 2021,
    category: 'technical',
    tags: ['instrumental goals', 'power-seeking', 'formal theory'],
    abstract: 'Formally proves that optimal reinforcement learning agents tend to seek power over their environment...',
    link: 'https://arxiv.org/abs/1912.01683',
    importance: 'important',
    readingTime: '2 hours'
  },
  {
    id: 'debate-2018',
    title: 'AI Safety via Debate',
    authors: ['Geoffrey Irving', 'Paul Christiano', 'Dario Amodei'],
    year: 2018,
    category: 'alignment',
    tags: ['debate', 'alignment techniques', 'amplification'],
    abstract: 'Proposes training AI systems through debate as a method for aligning superhuman AI...',
    link: 'https://arxiv.org/abs/1805.00899',
    importance: 'important',
    readingTime: '1 hour'
  },
  {
    id: 'scalable-oversight-2022',
    title: 'Measuring Progress on Scalable Oversight for Large Language Models',
    authors: ['Samuel R. Bowman', 'Jeeyoon Hyun', 'Ethan Perez', 'et al.'],
    year: 2022,
    category: 'alignment',
    tags: ['scalable oversight', 'evaluation', 'benchmarks'],
    abstract: 'Introduces benchmarks for measuring progress on scalable oversight of language models...',
    link: 'https://arxiv.org/abs/2211.03540',
    importance: 'useful',
    readingTime: '1.5 hours'
  },
  {
    id: 'existential-risk-survey-2020',
    title: 'Existential Risk from Artificial Intelligence: A Survey',
    authors: ['Vince Conitzer', 'Walter Sinnott-Armstrong', 'Jana Schaich Borg', 'Yuan Deng', 'Max Kramer'],
    year: 2020,
    category: 'philosophy',
    tags: ['existential risk', 'survey', 'philosophy'],
    abstract: 'A comprehensive survey of arguments for and against AI existential risk...',
    link: 'https://arxiv.org/abs/2001.09768',
    importance: 'useful',
    readingTime: '2 hours'
  }
]

const categories = [
  { id: 'all', label: 'All Papers', color: 'bg-gray-500' },
  { id: 'foundational', label: 'Foundational', color: 'bg-blue-500' },
  { id: 'alignment', label: 'Alignment', color: 'bg-green-500' },
  { id: 'interpretability', label: 'Interpretability', color: 'bg-purple-500' },
  { id: 'governance', label: 'Governance', color: 'bg-yellow-500' },
  { id: 'technical', label: 'Technical', color: 'bg-red-500' },
  { id: 'philosophy', label: 'Philosophy', color: 'bg-indigo-500' }
]

export default function ResearchPapersHub() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredPapers, setFilteredPapers] = useState(papers)

  useEffect(() => {
    let filtered = papers

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(paper => paper.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(paper => 
        paper.title.toLowerCase().includes(query) ||
        paper.authors.some(author => author.toLowerCase().includes(query)) ||
        paper.tags.some(tag => tag.toLowerCase().includes(query)) ||
        paper.abstract.toLowerCase().includes(query)
      )
    }

    setFilteredPapers(filtered)
  }, [searchQuery, selectedCategory])

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'essential': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'important': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'useful': return 'text-green-400 bg-green-400/10 border-green-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat?.color || 'bg-gray-500'
  }

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
                📚 Research Papers Hub
              </h1>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Essential AI Safety Papers</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Curated collection of papers every AI safety researcher should know
          </p>
        </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <input
              type="search"
              placeholder="Search papers by title, author, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
            />

            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category.id
                      ? `${category.color} text-white`
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {category.label}
                  {category.id !== 'all' && (
                    <span className="ml-2 text-sm opacity-75">
                      ({papers.filter(p => p.category === category.id).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Special callout for foundational papers */}
          {selectedCategory === 'foundational' && (
            <div className="mb-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h2 className="text-2xl font-semibold text-blue-400 mb-3">
                Foundational Papers
              </h2>
              <p className="text-gray-300">
                These are the essential papers that every AI safety researcher should read. 
                They establish core concepts, define key problems, and provide the intellectual 
                foundation for the field.
              </p>
              <Link 
                href="/journey/foundation/foundational-papers"
                className="inline-block mt-4 text-blue-400 hover:text-blue-300 underline"
              >
                View structured learning path →
              </Link>
            </div>
          )}

          {/* Results count */}
          <div className="mb-4 text-gray-400">
            Showing {filteredPapers.length} of {papers.length} papers
          </div>

          {/* Papers list */}
          <div className="space-y-4">
            {filteredPapers.map(paper => (
              <div 
                key={paper.id}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      <a 
                        href={paper.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 transition"
                      >
                        {paper.title}
                      </a>
                    </h3>
                    <div className="text-gray-400 text-sm mb-3">
                      {paper.authors.join(', ')} • {paper.year}
                    </div>
                  </div>
                  <span 
                    className={`ml-4 px-3 py-1 rounded-full text-xs font-medium border ${getImportanceColor(paper.importance)}`}
                  >
                    {paper.importance}
                  </span>
                </div>

                <p className="text-gray-300 mb-4 line-clamp-3">
                  {paper.abstract}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(paper.category)} bg-opacity-20 text-white`}
                    >
                      {paper.category}
                    </span>
                    {paper.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium text-gray-400 border border-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {paper.readingTime && (
                    <span className="text-sm text-gray-500">
                      📖 {paper.readingTime}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredPapers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No papers found matching your criteria.
              </p>
            </div>
          )}
      </main>
    </div>
  )
}