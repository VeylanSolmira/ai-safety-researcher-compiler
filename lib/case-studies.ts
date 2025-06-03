// AI Safety Case Studies and Incidents

export interface CaseStudy {
  id: string
  title: string
  summary: string
  content: string // Markdown content
  date: string
  category: 'misinformation' | 'security' | 'alignment' | 'policy' | 'accident' | 'adversarial'
  severity: 'critical' | 'high' | 'medium' | 'low'
  tags: string[]
  citations: Citation[]
  lessons: string[]
  image?: {
    url: string
    alt: string
  }
}

export interface Citation {
  title: string
  source: string
  url?: string
  date: string
  finding: string
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'gpt-misinformation-campaigns',
    title: 'GPT-based Misinformation Campaigns (2023-2024)',
    summary: 'Documentation of AI-generated misinformation campaigns using large language models, demonstrating the ease with which GPT models can be used to create and spread false narratives at scale.',
    content: `# GPT-Based Misinformation Campaigns (2023-2024) - Bibliography

## Primary Research Studies

### NewsGuard Research Reports

1. **Brewster, J., Arvanitis, L., & Sadeghi, M. (2023, January).** "The Next Great Misinformation Superspreader: How ChatGPT Could Spread Toxic Misinformation At Unprecedented Scale." NewsGuard Misinformation Monitor. 
   - URL: https://www.newsguardtech.com/misinformation-monitor/jan-2023/
   - Key Finding: ChatGPT generated false narratives for 80 of 100 tested misinformation prompts

2. **Arvanitis, L., Sadeghi, M., & Brewster, J. (2023, March).** "GPT-4 produces more misinformation than predecessor." NewsGuard Misinformation Monitor.
   - URL: https://www.newsguardtech.com/misinformation-monitor/march-2023/
   - Key Finding: GPT-4 generated all 100 false narratives tested, compared to 80 for GPT-3.5

3. **Brewster, J., Arvanitis, L., & Sadeghi, M. (2023, March 23).** "Despite OpenAI's Promises, the Company's New AI Tool Produces Misinformation More Frequently, and More Persuasively, than its Predecessor." Newsweek.
   - URL: https://www.newsweek.com/2023/03/24/openais-new-ai-tool-produces-misinformation-more-frequently-more-persuasively-its-predecessor-1789706.html

## Academic Publications

4. **[Authors not specified in search results] (2025, February 11).** "The origin of public concerns over AI supercharging misinformation in the 2024 U.S. presidential election." HKS Misinformation Review, Harvard Kennedy School.
   - URL: https://misinforeview.hks.harvard.edu/article/the-origin-of-public-concerns-over-ai-supercharging-misinformation-in-the-2024-u-s-presidential-election/
   - Key Finding: 83.4% of Americans surveyed in August 2023 expressed concern about AI spreading election misinformation

5. **Simon, F., et al. (2023, November 22).** "Misinformation reloaded? Fears about the impact of generative AI on misinformation are overblown." HKS Misinformation Review.
   - URL: https://misinforeview.hks.harvard.edu/article/misinformation-reloaded-fears-about-the-impact-of-generative-ai-on-misinformation-are-overblown/
   - Note: Contrarian perspective arguing concerns may be overblown

6. **[Author not specified] (2023, February 3).** "Disinformation In the Age of ChatGPT." Modern War Institute at West Point.
   - URL: https://mwi.westpoint.edu/disinformation-in-the-age-of-chatgpt/
   - Focus: Military and security implications of AI-generated disinformation

## Major Media Coverage

### News Reports and Investigations

7. **Zakrzewski, C. (2023, August 28).** "AI could be used in the 2024 election from disinformation to ads." The Washington Post.
   - URL: https://www.washingtonpost.com/technology/2023/08/28/ai-2024-election-campaigns-disinformation-ads/
   - Key Finding: OpenAI's unenforced ban on political campaign use of ChatGPT

8. **[PBS NewsHour Staff] (2023, May 14).** "AI-generated disinformation poses threat of misleading voters in 2024 election." PBS News.
   - URL: https://www.pbs.org/newshour/politics/ai-generated-disinformation-poses-threat-of-misleading-voters-in-2024-election
   - Notable: Documents RNC's AI-generated dystopian campaign ad and Trump's sharing of AI-manipulated content

9. **[Associated Press] (2024, March 21).** "Election disinformation takes a big leap with AI being used to deceive worldwide." AP News.
   - URL: https://apnews.com/article/artificial-intelligence-elections-disinformation-chatgpt-bc283e7426402f0b4baa7df280a4c3fd
   - Scope: Global perspective on AI election interference

10. **[Axios Staff] (2023, March 21).** "Exclusive: GPT-4 readily spouts misinformation, study finds." Axios.
    - URL: https://www.axios.com/2023/03/21/gpt4-misinformation-newsguard-study
    - Based on NewsGuard's exclusive research findings

## Key Research Findings Summary

### Capability Demonstrations
- GPT-3.5: Generated misinformation for 80/100 tested false narratives (January 2023)
- GPT-4: Generated misinformation for 100/100 tested false narratives (March 2023)
- GPT-4 produced more persuasive misinformation than GPT-3.5

### Real-World Examples Documented
- Doctored video of President Biden making false statements about transgender people
- Manipulated CNN Anderson Cooper video shared by Donald Trump
- AI-generated robocalls impersonating political figures
- RNC's AI-generated dystopian campaign advertisement

### Policy Responses
- OpenAI initially banned all political campaign use of ChatGPT
- Later relaxed to ban only targeted demographic messaging
- Enforcement found to be lacking as of mid-2023
- Proposed legislation requiring labeling of AI-generated campaign content

## Citation Note
All sources accessed and verified through web search on [Current Date]. URLs and publication dates are as provided in the original sources. When citing these sources in academic work, please verify current URLs and follow appropriate citation formatting for your discipline.`,
    date: '2024-12-15',
    category: 'misinformation',
    severity: 'high',
    tags: ['misinformation', 'gpt', 'chatgpt', 'political', 'social-impact', 'content-generation'],
    citations: [
      {
        title: 'The Next Great Misinformation Superspreader: How ChatGPT Could Spread Toxic Misinformation At Unprecedented Scale',
        source: 'NewsGuard Misinformation Monitor',
        url: 'https://www.newsguardtech.com/misinformation-monitor/jan-2023/',
        date: 'January 2023',
        finding: 'ChatGPT generated false narratives for 80 of 100 tested misinformation prompts'
      },
      {
        title: 'GPT-4 produces more misinformation than predecessor',
        source: 'NewsGuard Misinformation Monitor',
        url: 'https://www.newsguardtech.com/misinformation-monitor/march-2023/',
        date: 'March 2023',
        finding: 'GPT-4 generated all 100 false narratives tested, compared to 80 for GPT-3.5'
      },
      {
        title: 'The origin of public concerns over AI supercharging misinformation in the 2024 U.S. presidential election',
        source: 'HKS Misinformation Review',
        url: 'https://misinforeview.hks.harvard.edu/article/the-origin-of-public-concerns-over-ai-supercharging-misinformation-in-the-2024-u-s-presidential-election/',
        date: 'February 2025',
        finding: '83.4% of Americans surveyed in August 2023 expressed concern about AI spreading election misinformation'
      },
      {
        title: 'AI-generated disinformation poses threat of misleading voters in 2024 election',
        source: 'PBS NewsHour',
        url: 'https://www.pbs.org/newshour/politics/ai-generated-disinformation-poses-threat-of-misleading-voters-in-2024-election',
        date: 'May 2023',
        finding: 'Documents RNC AI-generated dystopian campaign ad and Trump sharing of AI-manipulated content'
      },
      {
        title: 'AI could be used in the 2024 election from disinformation to ads',
        source: 'Washington Post',
        url: 'https://www.washingtonpost.com/technology/2023/08/28/ai-2024-election-campaigns-disinformation-ads/',
        date: 'August 2023',
        finding: 'OpenAI\'s unenforced ban on political campaign use of ChatGPT'
      },
      {
        title: 'Election disinformation takes a big leap with AI being used to deceive worldwide',
        source: 'Associated Press',
        url: 'https://apnews.com/article/artificial-intelligence-elections-disinformation-chatgpt-bc283e7426402f0b4baa7df280a4c3fd',
        date: 'March 2024',
        finding: 'Global perspective on AI election interference'
      },
      {
        title: 'Disinformation In the Age of ChatGPT',
        source: 'Modern War Institute at West Point',
        url: 'https://mwi.westpoint.edu/disinformation-in-the-age-of-chatgpt/',
        date: 'February 2023',
        finding: 'Military and security implications of AI-generated disinformation'
      },
      {
        title: 'Exclusive: GPT-4 readily spouts misinformation, study finds',
        source: 'Axios',
        url: 'https://www.axios.com/2023/03/21/gpt4-misinformation-newsguard-study',
        date: 'March 2023',
        finding: 'Based on NewsGuard\'s exclusive research findings'
      },
      {
        title: 'Despite OpenAI\'s Promises, the Company\'s New AI Tool Produces Misinformation More Frequently',
        source: 'Newsweek',
        url: 'https://www.newsweek.com/2023/03/24/openais-new-ai-tool-produces-misinformation-more-frequently-more-persuasively-its-predecessor-1789706.html',
        date: 'March 2023',
        finding: 'GPT-4 produces misinformation more frequently and persuasively than GPT-3.5'
      },
      {
        title: 'Misinformation reloaded? Fears about the impact of generative AI on misinformation are overblown',
        source: 'HKS Misinformation Review',
        url: 'https://misinforeview.hks.harvard.edu/article/misinformation-reloaded-fears-about-the-impact-of-generative-ai-on-misinformation-are-overblown/',
        date: 'November 2023',
        finding: 'Contrarian perspective arguing concerns may be overblown'
      }
    ],
    lessons: [
      'AI systems designed for beneficial purposes can be easily repurposed for harm',
      'Scale and automation fundamentally change the threat landscape',
      'Technical safety measures must be complemented by policy and social solutions',
      'Public education about AI capabilities is crucial for resilience',
      'International coordination is necessary for effective response'
    ]
  },
  // Add more case studies here as needed
]

// Utility functions
export function getAllCaseStudies(): CaseStudy[] {
  return [...caseStudies].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getCaseStudiesByCategory(category: CaseStudy['category']): CaseStudy[] {
  return getAllCaseStudies().filter(study => study.category === category)
}

export function getCaseStudiesBySeverity(severity: CaseStudy['severity']): CaseStudy[] {
  return getAllCaseStudies().filter(study => study.severity === severity)
}

export function getCaseStudyById(id: string): CaseStudy | undefined {
  return caseStudies.find(study => study.id === id)
}

export function getCaseStudiesByTag(tag: string): CaseStudy[] {
  return getAllCaseStudies().filter(study => 
    study.tags.includes(tag.toLowerCase())
  )
}

export function getAllTags(): string[] {
  const tags = new Set<string>()
  caseStudies.forEach(study => {
    study.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
}

export function formatCaseStudyDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}