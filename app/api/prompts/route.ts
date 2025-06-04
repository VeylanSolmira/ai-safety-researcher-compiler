import { NextResponse } from 'next/server'
import { getAllAIPrompts } from '@/lib/db/resource-queries'

export async function GET() {
  try {
    const prompts = getAllAIPrompts()
    return NextResponse.json(prompts)
  } catch (error) {
    console.error('Error fetching AI prompts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch AI prompts' },
      { status: 500 }
    )
  }
}