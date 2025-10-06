"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mic, Square, Play, Pause, RotateCcw, Save, Wand2, Download, Share } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Story, AuthService, AIService } from '@/lib/auth'

interface EnhancedRecordingProps {
  initialPrompt?: string
  category?: string
  onSaved?: (story: Story) => void
}

export default function EnhancedRecording({ initialPrompt, category = 'Generelt', onSaved }: EnhancedRecordingProps) {
  const { user } = useAuth()
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [audioQuality, setAudioQuality] = useState<'low' | 'medium' | 'high'>('medium')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (initialPrompt) {
      setDescription(initialPrompt)
    }
  }, [initialPrompt])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      const chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioBlob(blob)
        await analyzeAudio(blob)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Vennligst tillat mikrofontilgang for å ta opp historien din.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }

  const analyzeAudio = async (blob: Blob) => {
    setIsAnalyzing(true)
    try {
      // Simulate AI analysis
      const analysis = await AIService.analyzeAudio(blob)
      setAudioQuality(analysis.quality)

      // Generate transcript
      const transcript = await AIService.generateTranscript(blob)
      setTranscript(transcript)

      // Generate AI suggestions
      setAiSuggestions([
        'Denne historien handler om familie og tradisjoner',
        'Kanskje legg til mer om følelsene dine i situasjonen',
        'Beskriv stedet mer detaljert for lytterne'
      ])
    } catch (error) {
      console.error('Error analyzing audio:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const playRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.play()
      setIsPlaying(true)

      audio.onended = () => {
        setIsPlaying(false)
      }
    }
  }

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const resetRecording = () => {
    setAudioBlob(null)
    setRecordingTime(0)
    setIsPlaying(false)
    setTranscript('')
    setAiSuggestions([])
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const saveStory = async () => {
    if (!audioBlob || !user || !title) return

    const story: Story = {
      id: crypto.randomUUID(),
      userId: user.id,
      title,
      description,
      category,
      duration: recordingTime,
      audioBlob,
      transcript,
      tags,
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      playCount: 0,
      shareSettings: {
        allowDownload: false,
        allowComments: true
      },
      aiMetadata: {
        suggestions: aiSuggestions,
        mood: 'nostalgisk',
        themes: tags,
        voiceCloneReady: audioQuality === 'high' && recordingTime > 120
      }
    }

    AuthService.saveStory(story)
    onSaved?.(story)

    // Reset form
    setTitle('')
    setDescription('')
    setTags([])
    resetRecording()

    alert('Historien er lagret!')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  if (!user) {
    return (
      <Card className="border-amber-200 shadow-lg">
        <CardContent className="p-8 text-center">
          <Mic className="h-20 w-20 text-amber-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Logg inn for å ta opp</h3>
          <p className="text-xl text-gray-600">
            Du må logge inn for å lagre historiene dine og få tilgang til alle funksjoner.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Recording Interface */}
      <Card className="border-amber-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-gray-800">
            {isRecording ? "Tar opp..." : audioBlob ? "Opptak fullført" : "Klar til opptak"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {/* Recording Time Display */}
          <div className="mb-8">
            <div className="text-6xl font-bold text-amber-600 mb-2">
              {formatTime(recordingTime)}
            </div>
            <p className="text-lg text-gray-600">
              {isRecording ? "Opptak pågår..." : "Opptakstid"}
            </p>
            {audioQuality && audioBlob && (
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  audioQuality === 'high' ? 'bg-green-100 text-green-800' :
                  audioQuality === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Kvalitet: {audioQuality === 'high' ? 'Høy' : audioQuality === 'medium' ? 'Middels' : 'Lav'}
                </span>
              </div>
            )}
          </div>

          {/* Recording Controls */}
          <div className="flex justify-center space-x-4 mb-8">
            {!isRecording && !audioBlob && (
              <Button
                onClick={startRecording}
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-12 py-6 text-xl font-semibold rounded-full"
              >
                <Mic className="mr-3 h-8 w-8" />
                Start Opptak
              </Button>
            )}

            {isRecording && (
              <Button
                onClick={stopRecording}
                size="lg"
                className="bg-gray-600 hover:bg-gray-700 text-white px-12 py-6 text-xl font-semibold rounded-full"
              >
                <Square className="mr-3 h-8 w-8" />
                Stopp Opptak
              </Button>
            )}

            {audioBlob && !isRecording && (
              <>
                {!isPlaying ? (
                  <Button
                    onClick={playRecording}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-xl font-semibold rounded-full"
                  >
                    <Play className="mr-3 h-6 w-6" />
                    Lytt
                  </Button>
                ) : (
                  <Button
                    onClick={pausePlayback}
                    size="lg"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-6 text-xl font-semibold rounded-full"
                  >
                    <Pause className="mr-3 h-6 w-6" />
                    Pause
                  </Button>
                )}

                <Button
                  onClick={resetRecording}
                  variant="outline"
                  size="lg"
                  className="border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-6 text-xl font-semibold rounded-full"
                >
                  <RotateCcw className="mr-3 h-6 w-6" />
                  Ta Opp Igjen
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Story Details Form */}
      {audioBlob && (
        <Card className="border-amber-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Legg til Detaljer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
                Tittel på historien *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Gi historien din en minneverdig tittel"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
                Beskrivelse
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kort beskrivelse av hva historien handler om"
                rows={3}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Emneord (Tags)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <span key={index} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                    <button
                      onClick={() => setTags(tags.filter((_, i) => i !== index))}
                      className="ml-2 text-amber-600 hover:text-amber-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                {['familie', 'barndom', 'reise', 'jobb', 'tradisjon'].map((suggestedTag) => (
                  <Button
                    key={suggestedTag}
                    variant="outline"
                    size="sm"
                    onClick={() => addTag(suggestedTag)}
                    disabled={tags.includes(suggestedTag)}
                  >
                    + {suggestedTag}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={saveStory}
                disabled={!title || !audioBlob}
                className="bg-amber-600 hover:bg-amber-700 text-white flex-1 text-lg py-3"
              >
                <Save className="mr-2 h-5 w-5" />
                Lagre Historie
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Results */}
      {(transcript || aiSuggestions.length > 0) && (
        <Card className="border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-gray-800">
              <Wand2 className="mr-3 h-6 w-6 text-blue-600" />
              AI-Analyse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isAnalyzing && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Analyserer opptak...</p>
              </div>
            )}

            {transcript && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Transkripsjon:</h4>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-gray-700">{transcript}</p>
                </div>
              </div>
            )}

            {aiSuggestions.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">AI-forslag:</h4>
                <ul className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
