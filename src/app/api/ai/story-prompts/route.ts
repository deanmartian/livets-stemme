import { NextRequest, NextResponse } from 'next/server'
import { AIStoryAssistant, ConversationContext } from '@/lib/ai-story-assistant'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, context }: { category: string; context?: ConversationContext } = body

    if (!category) {
      return NextResponse.json(
        { error: 'Kategori er påkrevd' },
        { status: 400 }
      )
    }

    const prompts = await AIStoryAssistant.generateStoryPrompts(category, context)

    return NextResponse.json({ prompts })
  } catch (error) {
    console.error('AI story prompts error:', error)
    return NextResponse.json(
      { error: 'Kunne ikke hente historieforslag' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  if (!category) {
    return NextResponse.json(
      { error: 'Kategori parameter er påkrevd' },
      { status: 400 }
    )
  }

  try {
    const prompts = await AIStoryAssistant.generateStoryPrompts(category)
    return NextResponse.json({ prompts })
  } catch (error) {
    console.error('AI story prompts error:', error)
    return NextResponse.json(
      { error: 'Kunne ikke hente historieforslag' },
      { status: 500 }
    )
  }
}
