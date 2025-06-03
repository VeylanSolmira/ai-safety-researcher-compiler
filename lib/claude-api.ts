// Secure Claude API wrapper
// Server-side only - never expose API keys to client

import Anthropic from '@anthropic-ai/sdk'

// Only use on server-side
if (typeof window !== 'undefined') {
  throw new Error('Claude API should only be used on the server side!')
}

// Initialize Claude client
const apiKey = process.env.ANTHROPIC_API_KEY
const anthropic = new Anthropic({
  apiKey: apiKey || '',
})

export interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ClaudeOptions {
  model?: string
  maxTokens?: number
  temperature?: number
  systemPrompt?: string
}

/**
 * Send a message to Claude and get a response
 * @param messages - Array of messages in the conversation
 * @param options - Configuration options
 * @returns Claude's response
 */
export async function askClaude(
  messages: ClaudeMessage[],
  options: ClaudeOptions = {}
): Promise<string> {
  const {
    model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
    maxTokens = 1000,
    temperature = 0.7,
    systemPrompt = 'You are a helpful AI safety research assistant.'
  } = options
  
  try {
    // Check if API key is available
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set')
    }

    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    })

    // Extract text from response
    const textContent = response.content
      .filter(block => block.type === 'text')
      .map(block => 'text' in block ? block.text : '')
      .join('\n')

    return textContent || 'No response content'
  } catch (error) {
    console.error('Claude API Error:', error)
    
    // More detailed error handling
    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes('API key')) {
        throw new Error('Invalid or missing Anthropic API key')
      } else if (error.message.includes('rate limit')) {
        throw new Error('Claude API rate limit exceeded')
      } else if (error.message.includes('model')) {
        throw new Error(`Invalid model: ${model}`)
      }
      
      // Pass through the original error message for debugging
      throw new Error(`Claude API error: ${error.message}`)
    }
    
    throw new Error('Failed to get response from Claude')
  }
}

/**
 * Analyze AI safety content with Claude
 * @param content - The content to analyze
 * @param analysisType - Type of analysis to perform
 * @returns Analysis result
 */
export async function analyzeContent(
  content: string,
  analysisType: 'summary' | 'critique' | 'expand' | 'simplify' = 'summary'
): Promise<string> {
  const prompts = {
    summary: 'Summarize the following AI safety content in 2-3 paragraphs:',
    critique: 'Provide a critical analysis of the following AI safety content, highlighting strengths and potential weaknesses:',
    expand: 'Expand on the following AI safety content with additional relevant details and examples:',
    simplify: 'Explain the following AI safety content in simpler terms for beginners:'
  }

  return askClaude([
    {
      role: 'user',
      content: `${prompts[analysisType]}\n\n${content}`
    }
  ], {
    systemPrompt: 'You are an expert AI safety researcher providing educational assistance.',
    temperature: 0.5 // Lower temperature for more focused responses
  })
}

/**
 * Generate quiz questions based on content
 * @param content - The content to generate questions from
 * @param count - Number of questions to generate
 * @returns Quiz questions
 */
export async function generateQuizQuestions(
  content: string,
  count: number = 5
): Promise<string> {
  return askClaude([
    {
      role: 'user',
      content: `Based on the following AI safety content, generate ${count} multiple-choice quiz questions with 4 options each. Mark the correct answer with an asterisk (*). Format as numbered list.\n\n${content}`
    }
  ], {
    systemPrompt: 'You are an AI safety educator creating assessment questions.',
    maxTokens: 2000,
    temperature: 0.8
  })
}

/**
 * Analyze content with a specific paradigm perspective
 * @param content - The content to analyze
 * @param paradigm - The paradigm to use (e.g., 'the-race', 'birth-parenthood')
 * @param mode - Teacher or adversary mode
 * @param style - Academic or personal style
 * @returns Analysis from the paradigm perspective
 */
export async function analyzeWithParadigm(
  content: string,
  paradigm: string,
  mode: 'teacher' | 'adversary' = 'teacher',
  style: 'academic' | 'personal' = 'academic'
): Promise<string> {
  // Import prompts dynamically to avoid circular dependencies
  const { paradigmPrompts } = await import('./prompts')
  
  const paradigmPrompt = paradigmPrompts[paradigm]
  if (!paradigmPrompt) {
    throw new Error(`Unknown paradigm: ${paradigm}`)
  }
  
  const systemPrompt = paradigmPrompt[mode][style]
  
  return askClaude([
    {
      role: 'user',
      content: `Please analyze and discuss the following AI safety content from your unique perspective:\n\n${content}`
    }
  ], {
    systemPrompt,
    maxTokens: 2000,
    temperature: 0.7
  })
}