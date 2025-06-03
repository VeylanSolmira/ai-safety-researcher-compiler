#!/usr/bin/env npx tsx

// Test the content editing API endpoint

async function testContentEditAPI() {
  const topicId = 'why-ai-safety'
  const testContent = '# Test Content Update\n\nThis is a test update from the API.'
  
  try {
    console.log('Testing content edit API...')
    
    // Update academic content
    const response = await fetch(`http://localhost:3002/api/topics/${topicId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contentAcademic: testContent
      }),
    })
    
    const result = await response.json()
    
    if (response.ok) {
      console.log('✓ Successfully updated topic content')
      console.log('Response:', result)
    } else {
      console.error('✗ Failed to update content:', result.error)
    }
    
  } catch (error) {
    console.error('✗ Error testing API:', error)
  }
}

testContentEditAPI()