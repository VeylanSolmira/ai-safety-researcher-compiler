// Check what's actually being fetched for topics

async function checkTopicFetch() {
  console.log('Checking topic fetch...')
  
  // Check if database is being used
  console.log('USE_DATABASE env:', process.env.NEXT_PUBLIC_USE_DATABASE_FOR_JOURNEY)
  
  // Test the API directly
  try {
    const response = await fetch('http://localhost:3002/api/journey/topics/prerequisites-foundations')
    const data = await response.json()
    
    console.log('\nAPI Response:')
    console.log('Keys:', Object.keys(data))
    console.log('Has content?:', 'content' in data)
    console.log('Has contentAcademic?:', 'contentAcademic' in data)
    console.log('Has contentPersonal?:', 'contentPersonal' in data)
    console.log('Content type:', typeof data.content)
    console.log('ContentPersonal type:', typeof data.contentPersonal)
    
    if ('contentAcademic' in data) {
      console.log('\nWARNING: API is returning contentAcademic field!')
      console.log('This should have been mapped to "content"')
    }
  } catch (error) {
    console.error('Error fetching from API:', error)
  }
}

checkTopicFetch()