import { getDb } from '../lib/db';
import { topics } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs/promises';
import path from 'path';

interface ValidationResult {
  citation: {
    text: string;
    year?: string;
    fullMatch: string;
    topicId: string;
    topicTitle: string;
    contentType: 'academic' | 'personal';
    lineNumber: number;
    type: 'standard' | 'author-year' | 'paper-mention' | 'work-reference';
  };
  verified: boolean;
  verifiedUrl?: string;
}

const WARNING_TEMPLATE = (citation: string, year?: string, type?: string) => {
  const yearDisplay = year ? ` (${year})` : '';
  const typeDisplay = type ? ` [${type}]` : '';
  return `<span style="background-color: #ff0000; color: #ffffff; padding: 4px 8px; font-weight: bold;">⚠️ UNVERIFIED CITATION</span> "${citation}"${yearDisplay}${typeDisplay} <span style="color: #ff0000; font-style: italic;">*Could not find a reliable source for this citation*</span>`;
};

async function loadValidationResults(): Promise<ValidationResult[]> {
  const resultsPath = path.join(process.cwd(), 'docs', 'citation-validation-results.json');
  const data = await fs.readFile(resultsPath, 'utf-8');
  return JSON.parse(data);
}

async function flagUnverifiedCitations(dryRun: boolean = true) {
  console.log(`Starting citation flagging (Dry run: ${dryRun})...\n`);
  
  // Load validation results
  const results = await loadValidationResults();
  const unverifiedResults = results.filter(r => !r.verified);
  
  console.log(`Found ${unverifiedResults.length} unverified citations to flag\n`);
  
  // Group by topic
  const byTopic = unverifiedResults.reduce((acc, result) => {
    if (!acc[result.citation.topicId]) {
      acc[result.citation.topicId] = {
        academic: [],
        personal: []
      };
    }
    acc[result.citation.topicId][result.citation.contentType].push(result);
    return acc;
  }, {} as Record<string, { academic: ValidationResult[], personal: ValidationResult[] }>);
  
  // Process each topic
  const db = getDb();
  for (const [topicId, citations] of Object.entries(byTopic)) {
    const topic = await db.select().from(topics).where(eq(topics.id, topicId)).limit(1);
    if (!topic[0]) continue;
    
    let updatedAcademic = topic[0].contentAcademic;
    let updatedPersonal = topic[0].contentPersonal;
    
    // Process academic content
    if (citations.academic.length > 0 && updatedAcademic) {
      console.log(`\nProcessing ${topic[0].title} (academic):`);
      
      // Sort citations by position in reverse order to avoid offset issues
      const sortedCitations = citations.academic.sort((a, b) => 
        b.citation.fullMatch.length - a.citation.fullMatch.length
      );
      
      for (const result of sortedCitations) {
        const yearDisplay = result.citation.year ? ` (${result.citation.year})` : '';
        console.log(`  - Flagging: "${result.citation.text}"${yearDisplay} [${result.citation.type}]`);
        
        const warning = WARNING_TEMPLATE(result.citation.text, result.citation.year, result.citation.type);
        updatedAcademic = updatedAcademic.replace(
          result.citation.fullMatch,
          warning
        );
      }
    }
    
    // Process personal content
    if (citations.personal.length > 0 && updatedPersonal) {
      console.log(`\nProcessing ${topic[0].title} (personal):`);
      
      const sortedCitations = citations.personal.sort((a, b) => 
        b.citation.fullMatch.length - a.citation.fullMatch.length
      );
      
      for (const result of sortedCitations) {
        const yearDisplay = result.citation.year ? ` (${result.citation.year})` : '';
        console.log(`  - Flagging: "${result.citation.text}"${yearDisplay} [${result.citation.type}]`);
        
        const warning = WARNING_TEMPLATE(result.citation.text, result.citation.year, result.citation.type);
        updatedPersonal = updatedPersonal.replace(
          result.citation.fullMatch,
          warning
        );
      }
    }
    
    // Update database if not dry run
    if (!dryRun) {
      await db.update(topics)
        .set({
          contentAcademic: updatedAcademic,
          contentPersonal: updatedPersonal,
          updatedAt: new Date()
        })
        .where(eq(topics.id, topicId));
      
      console.log(`  ✅ Updated topic: ${topic[0].title}`);
    } else {
      console.log(`  🔍 Would update topic: ${topic[0].title}`);
    }
  }
  
  if (dryRun) {
    console.log('\n⚠️  This was a dry run. Run with --no-dry-run to apply changes.');
  } else {
    console.log('\n✅ All unverified citations have been flagged!');
  }
}

// Check command line arguments
const args = process.argv.slice(2);
const dryRun = !args.includes('--no-dry-run');

// Run the flagging
flagUnverifiedCitations(dryRun).catch(console.error);