import { getDb } from '../lib/db';
import { topics } from '../lib/db/schema';
import fs from 'fs/promises';
import path from 'path';

interface Citation {
  text: string;
  year?: string;
  fullMatch: string;
  topicId: string;
  topicTitle: string;
  contentType: 'academic' | 'personal';
  lineNumber: number;
  type: 'standard' | 'author-year' | 'paper-mention' | 'work-reference';
}

interface ValidationResult {
  citation: Citation;
  verified: boolean;
  verifiedUrl?: string;
  searchResults?: any[];
}

// Multiple patterns to catch different citation formats
const CITATION_PATTERNS = [
  // Standard format: "Paper Title" (2002)
  { pattern: /(?<!\[)"([^"]+)"\s*\((\d{4})\)(?!\])/g, type: 'standard' as const },
  
  // Author et al. format: Smith et al. (2020)
  { pattern: /(?<!\[)([A-Z][a-z]+(?:\s+(?:et\s+al\.|and\s+[A-Z][a-z]+))?)\s*\((\d{4})\)(?!\])/g, type: 'author-year' as const },
  
  // Paper mentions: "the Attention is All You Need paper", "the GPT-3 paper"
  { pattern: /(?:the\s+)"([^"]+)"\s+paper/gi, type: 'paper-mention' as const },
  
  // Works/research mentions: "work by Anthropic", "research from DeepMind (2023)"
  { pattern: /(?:work|research|study|paper)\s+(?:by|from)\s+([A-Za-z\s]+?)(?:\s*\((\d{4})\))?(?=\s*[,.\s])/gi, type: 'work-reference' as const },
  
  // Parenthetical paper titles: (see "Paper Title")
  { pattern: /\(see\s+"([^"]+)"\)/gi, type: 'paper-mention' as const },
  
  // Academic work indicators: "demonstrated in [Title]", "shown by [Author]"
  { pattern: /(?:demonstrated|shown|proposed|introduced|described)\s+(?:in|by)\s+"([^"]+)"/gi, type: 'paper-mention' as const }
];

async function extractCitations(content: string, topicId: string, topicTitle: string, contentType: 'academic' | 'personal'): Promise<Citation[]> {
  const citations: Citation[] = [];
  const lines = content.split('\n');
  const foundCitations = new Set<string>(); // To avoid duplicates
  
  lines.forEach((line, lineIndex) => {
    // Skip lines that are already hyperlinks
    if (line.match(/\[([^\]]+)\]\(http/)) return;
    
    // Skip code blocks
    if (line.trim().startsWith('```')) return;
    
    // Apply each pattern
    CITATION_PATTERNS.forEach(({ pattern, type }) => {
      const linePattern = new RegExp(pattern.source, pattern.flags);
      let match;
      
      while ((match = linePattern.exec(line)) !== null) {
        const text = match[1];
        const year = match[2] || undefined;
        const fullMatch = match[0];
        
        // Create unique key to avoid duplicates
        const key = `${text}-${year || 'no-year'}-${type}`;
        
        if (!foundCitations.has(key)) {
          foundCitations.add(key);
          
          // Filter out common false positives
          const isValidCitation = 
            text.length > 3 && // Minimum length
            !text.match(/^(the|a|an|this|that|these|those)$/i) && // Not just articles
            !text.match(/^(and|or|but|with|from|by)$/i) && // Not conjunctions/prepositions
            !fullMatch.includes('http') && // Not part of a URL
            !fullMatch.includes('.com') && // Not a domain
            !fullMatch.includes('.org'); // Not a domain
          
          if (isValidCitation) {
            citations.push({
              text: text.trim(),
              year,
              fullMatch,
              topicId,
              topicTitle,
              contentType,
              lineNumber: lineIndex + 1,
              type
            });
          }
        }
      }
    });
  });
  
  return citations;
}

async function searchForCitation(citation: Citation): Promise<{ url?: string; results?: any[] }> {
  try {
    let searchQuery = '';
    
    // Build search query based on citation type
    switch (citation.type) {
      case 'standard':
        searchQuery = `"${citation.text}" ${citation.year} paper pdf site:arxiv.org OR site:openreview.net OR site:aclanthology.org OR site:proceedings.neurips.cc OR site:proceedings.mlr.press`;
        break;
        
      case 'author-year':
        // For author citations, search with "paper" added
        searchQuery = `${citation.text} ${citation.year} paper site:arxiv.org OR site:scholar.google.com OR site:semanticscholar.org`;
        break;
        
      case 'paper-mention':
        // For paper mentions without year, broader search
        searchQuery = `"${citation.text}" paper filetype:pdf site:arxiv.org OR site:openreview.net`;
        break;
        
      case 'work-reference':
        // For work references, include organization/author name
        const yearPart = citation.year ? ` ${citation.year}` : '';
        searchQuery = `${citation.text}${yearPart} AI safety research paper`;
        break;
    }
    
    // Note: This is a placeholder for actual web search
    // In production, you'd use a proper search API
    console.log(`Searching for: ${searchQuery}`);
    console.log(`  Type: ${citation.type}`);
    
    // For now, return empty result
    return { url: undefined, results: [] };
  } catch (error) {
    console.error(`Error searching for citation: ${citation.text}`, error);
    return { url: undefined, results: [] };
  }
}

async function validateCitations() {
  console.log('Starting citation validation...\n');
  
  const db = getDb();
  const allTopics = await db.select().from(topics).orderBy(topics.position);
  const allCitations: Citation[] = [];
  const validationResults: ValidationResult[] = [];
  
  // Extract all citations
  for (const topic of allTopics) {
    if (topic.contentAcademic) {
      const academicCitations = await extractCitations(
        topic.contentAcademic,
        topic.id,
        topic.title,
        'academic'
      );
      allCitations.push(...academicCitations);
    }
    
    if (topic.contentPersonal) {
      const personalCitations = await extractCitations(
        topic.contentPersonal,
        topic.id,
        topic.title,
        'personal'
      );
      allCitations.push(...personalCitations);
    }
  }
  
  console.log(`Found ${allCitations.length} citations to validate\n`);
  
  // Validate each citation
  for (const citation of allCitations) {
    const yearDisplay = citation.year ? ` (${citation.year})` : '';
    console.log(`Validating: "${citation.text}"${yearDisplay}`);
    console.log(`  From: ${citation.topicTitle} (${citation.contentType})`);
    console.log(`  Type: ${citation.type}`);
    
    const searchResult = await searchForCitation(citation);
    
    const result: ValidationResult = {
      citation,
      verified: !!searchResult.url,
      verifiedUrl: searchResult.url,
      searchResults: searchResult.results
    };
    
    validationResults.push(result);
    
    if (!result.verified) {
      console.log(`  ❌ Could not verify citation\n`);
    } else {
      console.log(`  ✅ Verified: ${result.verifiedUrl}\n`);
    }
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Generate report
  await generateReport(validationResults, allTopics.length);
}

async function generateReport(results: ValidationResult[], totalTopics: number) {
  const verifiedCount = results.filter(r => r.verified).length;
  const unverifiedCount = results.filter(r => !r.verified).length;
  const successRate = results.length > 0 ? (verifiedCount / results.length * 100).toFixed(1) : 0;
  
  // Group by topic and content type
  const byTopic = results.reduce((acc, result) => {
    const key = `${result.citation.topicId}_${result.citation.contentType}`;
    if (!acc[key]) {
      acc[key] = {
        topicId: result.citation.topicId,
        topicTitle: result.citation.topicTitle,
        contentType: result.citation.contentType,
        citations: []
      };
    }
    acc[key].citations.push(result);
    return acc;
  }, {} as Record<string, any>);
  
  // Generate markdown report
  let report = `# Citation Validation Report

Generated: ${new Date().toISOString()}

## Summary
- **Total topics scanned**: ${totalTopics}
- **Total citations found**: ${results.length}
- **Citations verified**: ${verifiedCount}
- **Citations flagged**: ${unverifiedCount}
- **Success rate**: ${successRate}%

## Unverified Citations by Topic

`;

  // Add unverified citations
  Object.values(byTopic).forEach((group: any) => {
    const unverified = group.citations.filter((r: ValidationResult) => !r.verified);
    if (unverified.length > 0) {
      report += `### ${group.topicTitle} (${group.contentType})\n\n`;
      unverified.forEach((result: ValidationResult) => {
        const yearDisplay = result.citation.year ? ` (${result.citation.year})` : '';
        const typeLabel = `[${result.citation.type}]`;
        report += `- **Line ${result.citation.lineNumber}** ${typeLabel}: "${result.citation.text}"${yearDisplay}\n`;
        report += `  - Full match: \`${result.citation.fullMatch}\`\n`;
      });
      report += '\n';
    }
  });
  
  // Save report
  const reportPath = path.join(process.cwd(), 'docs', 'citation-validation-report.md');
  await fs.writeFile(reportPath, report);
  console.log(`\nReport saved to: ${reportPath}`);
  
  // Also create a JSON file with all results for further processing
  const jsonPath = path.join(process.cwd(), 'docs', 'citation-validation-results.json');
  await fs.writeFile(jsonPath, JSON.stringify(results, null, 2));
  console.log(`JSON results saved to: ${jsonPath}`);
}

// Run the validation
validateCitations().catch(console.error);