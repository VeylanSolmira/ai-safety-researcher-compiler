# Claude API Integration Guide

## Overview

This project has secure Claude API integration that keeps your API key on the server side and provides rate limiting.

## Setup

1. **Add your API key to `.env.local`:**
   ```bash
   ANTHROPIC_API_KEY=your-api-key-here
   ANTHROPIC_MODEL=claude-3-5-haiku-20241022  # Optional, defaults to Haiku
   ```

2. **Never commit `.env.local`** - it's already in `.gitignore`

## Rate Limiting

The system has two types of limits:

1. **Request Limit**: 10 requests per minute per IP
2. **Token Limit**: 50,000 tokens per hour per IP

These protect against:
- Accidental infinite loops
- Malicious usage
- Excessive costs

## Usage Examples

### 1. Using the React Hook

```typescript
import { useClaude } from '@/hooks/useClaude'

function MyComponent() {
  const { loading, error, analyzeContent, generateQuiz } = useClaude()
  
  const handleSummarize = async () => {
    const summary = await analyzeContent(myContent, 'summary')
    console.log(summary)
  }
  
  return (
    <button onClick={handleSummarize} disabled={loading}>
      Summarize with Claude
    </button>
  )
}
```

### 2. Using the ClaudeAssistant Component

```typescript
import ClaudeAssistant from '@/components/ClaudeAssistant'

function TopicPage({ content }) {
  return (
    <div>
      <h1>My Topic</h1>
      <div>{content}</div>
      
      {/* Add Claude assistant for the content */}
      <ClaudeAssistant content={content} />
    </div>
  )
}
```

### 3. Direct API Calls

```typescript
// Chat with Claude
const response = await fetch('/api/claude', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'chat',
    messages: [
      { role: 'user', content: 'Explain AI alignment' }
    ]
  })
})

// Analyze content
const response = await fetch('/api/claude', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'analyze',
    content: 'Your content here',
    analysisType: 'summary' // or 'critique', 'expand', 'simplify'
  })
})

// Generate quiz
const response = await fetch('/api/claude', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'quiz',
    content: 'Your content here',
    count: 5
  })
})
```

## Security Features

1. **Server-side only**: API key never exposed to client
2. **Rate limiting**: Prevents abuse and excessive costs
3. **Input validation**: All requests validated before processing
4. **Error handling**: Graceful failures with user-friendly messages

## Available Claude Models

- `claude-3-opus-20240229` - Most capable
- `claude-3-sonnet-20240229` - Balanced (default)
- `claude-3-haiku-20240307` - Fastest
- `claude-3-5-sonnet-20241022` - Latest Sonnet
- `claude-3-5-haiku-20241022` - Latest Haiku

## Cost Estimation

With current limits (25k tokens/hour):
- Sonnet 3.5: ~$0.075/hour max
- Haiku 3.5: ~$0.025/hour max
- Opus: ~$0.375/hour max

## Future Enhancements

1. **Persistent rate limiting** with Redis
2. **User-based quotas** after authentication
3. **Streaming responses** for long content
4. **Conversation memory** for context
5. **Fine-tuned prompts** for AI safety domain

## Troubleshooting

**"Claude API key not configured"**
- Ensure `ANTHROPIC_API_KEY` is in `.env.local`
- Restart the development server

**"Rate limit exceeded"**
- Wait 1 minute for request limit reset
- Wait 1 hour for token limit reset

**"Failed to get response from Claude"**
- Check API key is valid
- Check Claude API status
- Check console for detailed error