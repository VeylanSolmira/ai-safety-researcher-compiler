#!/usr/bin/env npx tsx

import Database from 'better-sqlite3';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'journey-dev.db');

async function fixCaseStudyNewlines() {
  console.log('🔧 Fixing escaped newlines in case study content...\n');
  
  const db = new Database(DB_PATH);
  
  try {
    // Get all case studies
    const caseStudies = db.prepare(`
      SELECT id, title, content 
      FROM case_studies 
      WHERE content LIKE '%\\n%'
    `).all() as Array<{id: string, title: string, content: string}>;
    
    console.log(`Found ${caseStudies.length} case studies with escaped newlines\n`);
    
    // Prepare update statement
    const updateStmt = db.prepare(`
      UPDATE case_studies 
      SET content = ? 
      WHERE id = ?
    `);
    
    // Fix each case study
    let fixed = 0;
    for (const caseStudy of caseStudies) {
      console.log(`Fixing: ${caseStudy.title}`);
      
      // Replace escaped newlines with actual newlines
      const fixedContent = caseStudy.content.replace(/\\n/g, '\n');
      
      // Update the database
      updateStmt.run(fixedContent, caseStudy.id);
      fixed++;
    }
    
    console.log(`\n✅ Successfully fixed ${fixed} case studies`);
    
    // Verify the fix by checking one example
    const example = db.prepare(`
      SELECT id, title, SUBSTR(content, 1, 200) as snippet
      FROM case_studies 
      WHERE id = 'alpha-evolve'
    `).get() as {id: string, title: string, snippet: string};
    
    console.log('\n📋 Example (AlphaEvolve) after fix:');
    console.log('---');
    console.log(example.snippet);
    console.log('---');
    
  } catch (error) {
    console.error('❌ Error fixing case study newlines:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

// Run the fix
fixCaseStudyNewlines().catch(console.error);