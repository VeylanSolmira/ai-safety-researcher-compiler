import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

function addCBAIFellowship() {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    const insert = db.prepare(`
      INSERT OR REPLACE INTO external_resources (id, name, type, url, description, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    insert.run(
      'cbai-fellowship-2025',
      'CBAI Fellowship 2025',
      'fellowship',
      'https://www.cbai.ai/fellowship',
      'Connect with 19+ AI safety mentors from leading organizations including Anthropic, Redwood Research, MIT, Harvard, and more. Get personalized research guidance and work on cutting-edge safety problems. Applications open for 2025.',
      JSON.stringify({
        provider: 'CBAI',
        mentors: '19+',
        organizations: ['Anthropic', 'Redwood Research', 'MIT', 'Harvard', 'MIRI', 'UK AI Safety Institute'],
        applicationStatus: 'Open',
        featured: true
      })
    )
    
    console.log('✅ Added CBAI Fellowship 2025 to external resources')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    db.close()
  }
}

addCBAIFellowship()