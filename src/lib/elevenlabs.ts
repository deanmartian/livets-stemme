import { ElevenLabsClient } from 'elevenlabs'

// ElevenLabs API client - only initialize if API key is available
const elevenlabs = process.env.ELEVENLABS_API_KEY
  ? new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY
    })
  : null

export interface VoiceCloneResult {
  voiceId: string
  name: string
  status: 'ready' | 'processing' | 'failed'
  similarity: number
  stability: number
}

export interface VoiceGenerationResult {
  audioBuffer: ArrayBuffer
  audioUrl: string
  duration: number
}

export class ElevenLabsService {
  // Analyze audio quality for voice cloning
  static async analyzeAudioForCloning(audioBlob: Blob): Promise<{
    isEligible: boolean
    quality: 'excellent' | 'good' | 'poor'
    duration: number
    recommendations: string[]
  }> {
    const duration = await this.getAudioDuration(audioBlob)

    // Requirements for good voice cloning:
    // - At least 60 seconds of clear speech
    // - Good audio quality (no background noise)
    // - Consistent voice tone

    const recommendations: string[] = []
    let quality: 'excellent' | 'good' | 'poor' = 'good'
    let isEligible = true

    if (duration < 60) {
      recommendations.push('Ta opp minst 60 sekunder med kontinuerlig tale')
      quality = 'poor'
      isEligible = false
    }

    if (duration > 300) {
      recommendations.push('Begrens opptaket til 5 minutter for best kvalitet')
    }

    recommendations.push('Snakk tydelig og i normal hastighet')
    recommendations.push('Unngå bakgrunnsstøy og ekko')
    recommendations.push('Bruk samme stemmetone gjennom hele opptaket')

    return { isEligible, quality, duration, recommendations }
  }

  // Create voice clone from audio samples
  static async createVoiceClone(
    audioBlobs: Blob[],
    voiceName: string,
    description: string
  ): Promise<VoiceCloneResult> {
    if (!elevenlabs) {
      throw new Error('ElevenLabs API key not configured')
    }

    try {
      // Convert blobs to files for upload
      const audioFiles = await Promise.all(
        audioBlobs.map(async (blob, index) => {
          return new File([blob], `sample_${index}.wav`, { type: 'audio/wav' })
        })
      )

      // Create voice clone
      const voice = await elevenlabs.voices.add({
        name: voiceName,
        files: audioFiles,
        description: description
      })

      return {
        voiceId: voice.voice_id,
        name: voiceName,
        status: 'processing',
        similarity: 0.75, // Will be updated when processing is complete
        stability: 0.5
      }
    } catch (error) {
      console.error('Voice cloning failed:', error)
      throw new Error('Stemmekloning feilet. Prøv igjen med bedre lydkvalitet.')
    }
  }

  // Generate speech from text using cloned voice
  static async generateSpeech(
    text: string,
    voiceId: string,
    options: {
      stability?: number
      similarityBoost?: number
      style?: number
    } = {}
  ): Promise<VoiceGenerationResult> {
    if (!elevenlabs) {
      throw new Error('ElevenLabs API key not configured')
    }

    try {
      const audio = await elevenlabs.generate({
        voice: voiceId,
        text: text,
        model_id: 'eleven_multilingual_v2', // Supports Norwegian
        voice_settings: {
          stability: options.stability || 0.5,
          similarity_boost: options.similarityBoost || 0.8,
          style: options.style || 0.2,
          use_speaker_boost: true
        }
      })

      // Convert to ArrayBuffer
      const chunks = []
      for await (const chunk of audio) {
        chunks.push(chunk)
      }
      const audioBuffer = Buffer.concat(chunks).buffer

      // Create blob URL for playback
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' })
      const audioUrl = URL.createObjectURL(blob)

      // Get duration (approximate based on text length)
      const duration = Math.max(text.length * 0.1, 1) // Rough estimate

      return { audioBuffer, audioUrl, duration }
    } catch (error) {
      console.error('Speech generation failed:', error)
      throw new Error('Stemmegenerering feilet. Sjekk at stemmen er klar for bruk.')
    }
  }

  // Check voice clone status
  static async getVoiceStatus(voiceId: string): Promise<VoiceCloneResult> {
    if (!elevenlabs) {
      throw new Error('ElevenLabs API key not configured')
    }

    try {
      const voice = await elevenlabs.voices.get(voiceId)

      return {
        voiceId: voice.voice_id,
        name: voice.name || 'Unknown Voice',
        status: 'ready',
        similarity: 0.85,
        stability: 0.5
      }
    } catch (error) {
      console.error('Voice status check failed:', error)
      throw new Error('Kunne ikke sjekke stemmestatus.')
    }
  }

  // Get all user's cloned voices
  static async getUserVoices(): Promise<VoiceCloneResult[]> {
    if (!elevenlabs) {
      return []
    }

    try {
      const voices = await elevenlabs.voices.getAll()

      return voices.voices
        .filter(voice => voice.category === 'cloned')
        .map(voice => ({
          voiceId: voice.voice_id,
          name: voice.name || 'Unknown Voice',
          status: 'ready' as const,
          similarity: 0.85,
          stability: 0.5
        }))
    } catch (error) {
      console.error('Failed to get user voices:', error)
      return []
    }
  }

  // Delete voice clone
  static async deleteVoice(voiceId: string): Promise<void> {
    if (!elevenlabs) {
      throw new Error('ElevenLabs API key not configured')
    }

    try {
      await elevenlabs.voices.delete(voiceId)
    } catch (error) {
      console.error('Voice deletion failed:', error)
      throw new Error('Kunne ikke slette stemme.')
    }
  }

  // Helper: Get audio duration from blob
  private static async getAudioDuration(blob: Blob): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio()
      audio.onloadedmetadata = () => resolve(audio.duration)
      audio.src = URL.createObjectURL(blob)
    })
  }
}

// Norwegian text preprocessing for better speech quality
export function preprocessNorwegianText(text: string): string {
  return text
    // Replace common abbreviations
    .replace(/\bdr\./gi, 'doktor')
    .replace(/\bprof\./gi, 'professor')
    .replace(/\bkr\./gi, 'kroner')
    .replace(/\bog\s+/gi, 'og ')
    // Handle Norwegian numbers
    .replace(/(\d+)\s*kr/gi, '$1 kroner')
    .replace(/(\d+)\s*,-/gi, '$1 kroner')
    // Improve pronunciation of common Norwegian words
    .replace(/\bskjønt\b/gi, 'skjønt')
    .replace(/\bkjørt\b/gi, 'kjørt')
    // Clean up extra spaces
    .replace(/\s+/g, ' ')
    .trim()
}
