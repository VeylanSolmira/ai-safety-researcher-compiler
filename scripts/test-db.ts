#!/usr/bin/env node

import { getDb, learningPaths, eq } from '../lib/db'

async function testDatabase() {
  console.log('Testing database connection...')
  
  try {
    const db = getDb()
    
    // Test query - get all learning paths
    const paths = db.select().from(learningPaths).all()
    
    console.log('\n✅ Database connection successful!')
    console.log(`\nFound ${paths.length} learning paths:`)
    
    for (const path of paths) {
      console.log(`  - ${path.id}: ${path.name} - ${path.description}`)
    }
    
    // Test if we can query a specific path
    const technicalPath = db
      .select()
      .from(learningPaths)
      .where(eq(learningPaths.id, 'technical-safety'))
      .get()
    
    if (technicalPath) {
      console.log('\n✅ Specific query successful!')
      console.log(`Technical safety path: ${technicalPath.description}`)
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    process.exit(1)
  }
}

testDatabase()