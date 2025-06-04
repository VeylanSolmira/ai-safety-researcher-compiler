import { getDb, eq } from '../lib/db'
import * as schema from '../lib/db/schema'

async function debugTopicContent() {
  const db = getDb()
  
  // Get a topic with content
  const topic = await db
    .select()
    .from(schema.topics)
    .where(eq(schema.topics.id, 'prerequisites-foundations'))
    .get()
  
  if (!topic) {
    console.log('Topic not found')
    return
  }
  
  console.log('Topic ID:', topic.id)
  console.log('Title:', topic.title)
  console.log('Content Academic type:', typeof topic.contentAcademic)
  console.log('Content Academic first 100 chars:', topic.contentAcademic?.substring(0, 100))
  console.log('Content Personal type:', typeof topic.contentPersonal)
  console.log('Content Personal first 100 chars:', topic.contentPersonal?.substring(0, 100))
  
  // Test the API endpoint
  console.log('\nTesting API endpoint...')
  const response = await fetch('http://localhost:3000/api/journey/topics/prerequisites-foundations')
  const data = await response.json()
  
  console.log('API Response type:', typeof data)
  console.log('API Response keys:', Object.keys(data))
  console.log('API content type:', typeof data.content)
  console.log('API contentPersonal type:', typeof data.contentPersonal)
}

debugTopicContent().catch(console.error)