import { NextResponse } from 'next/server'
import { getWritableDatabasePath, testDatabaseAccess } from '@/lib/db/writable-db-path'
import Database from 'better-sqlite3'
import fs from 'fs'

export async function GET() {
  try {
    const dbPath = getWritableDatabasePath()
    const fileExists = fs.existsSync(dbPath)
    const fileStats = fileExists ? fs.statSync(dbPath) : null
    
    let dbTest = { success: false, error: '', topicCount: 0, sampleTopic: null }
    
    if (fileExists) {
      try {
        const db = new Database(dbPath, { readonly: true })
        
        // Count topics
        const countResult = db.prepare('SELECT COUNT(*) as count FROM topics').get() as { count: number }
        dbTest.topicCount = countResult.count
        
        // Get a sample topic with content
        const sampleTopic = db.prepare(`
          SELECT id, title, 
                 LENGTH(content_academic) as academic_length,
                 LENGTH(content_personal) as personal_length,
                 SUBSTR(content_academic, 1, 100) as academic_preview
          FROM topics 
          WHERE content_academic IS NOT NULL 
          LIMIT 1
        `).get()
        
        dbTest.sampleTopic = sampleTopic as any
        dbTest.success = true
        
        db.close()
      } catch (error) {
        dbTest.error = error instanceof Error ? error.message : 'Unknown error'
      }
    }
    
    const diagnostics = {
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        cwd: process.cwd()
      },
      database: {
        path: dbPath,
        exists: fileExists,
        size: fileStats?.size,
        lastModified: fileStats?.mtime,
        ...dbTest
      },
      test: testDatabaseAccess()
    }
    
    return NextResponse.json(diagnostics, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}