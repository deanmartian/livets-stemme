import { NextRequest, NextResponse } from 'next/server'
import { ElevenLabsService } from '@/lib/elevenlabs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFiles = formData.getAll('audioFiles') as File[]
    const voiceName = formData.get('voiceName') as string
    const description = formData.get('description') as string

    if (!audioFiles.length || !voiceName) {
      return NextResponse.json(
        { error: 'Lydfiler og stemmenavn er påkrevd' },
        { status: 400 }
      )
    }

    // Convert files to blobs
    const audioBlobs = await Promise.all(
      audioFiles.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer()
        return new Blob([arrayBuffer], { type: file.type })
      })
    )

    // Analyze audio quality first
    const analysis = await ElevenLabsService.analyzeAudioForCloning(audioBlobs[0])

    if (!analysis.isEligible) {
      return NextResponse.json({
        error: 'Lydkvalitet ikke egnet for stemmekloning',
        recommendations: analysis.recommendations
      }, { status: 400 })
    }

    // Create voice clone
    const result = await ElevenLabsService.createVoiceClone(
      audioBlobs,
      voiceName,
      description || 'Stemme opprettet fra Livets Stemme'
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Voice cloning error:', error)
    return NextResponse.json(
      { error: 'Stemmekloning feilet. Prøv igjen med bedre lydkvalitet.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const voices = await ElevenLabsService.getUserVoices()
    return NextResponse.json({ voices })
  } catch (error) {
    console.error('Get voices error:', error)
    return NextResponse.json(
      { error: 'Kunne ikke hente stemmer' },
      { status: 500 }
    )
  }
}
