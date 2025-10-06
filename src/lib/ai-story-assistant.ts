import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  : null

export interface StoryPrompt {
  id: string
  category: string
  question: string
  followUp: string[]
  cultural: boolean
  ageAppropriate: boolean
}

export interface StoryAnalysis {
  themes: string[]
  mood: string
  suggestions: string[]
  culturalRelevance: number
  clarity: number
  emotionalDepth: number
}

export interface ConversationContext {
  userAge?: number
  birthYear?: number
  region?: string
  interests?: string[]
  previousStories?: string[]
}

export class AIStoryAssistant {
  // Generate culturally relevant story prompts for Norwegian elderly
  static async generateStoryPrompts(
    category: string,
    context: ConversationContext = {}
  ): Promise<StoryPrompt[]> {
    const systemPrompt = `Du er en vennlig norsk historieassistent som hjelper eldre mennesker (65+) med å dele sine livshistorier.

Du skal lage milde, respektfulle spørsmål som:
- Er kulturelt relevante for Norge
- Passer for personer født mellom 1930-1960
- Tar hensyn til norsk historie (krig, gjenoppbygging, velferdssamfunn)
- Er varme og personlige, ikke invaderende
- Bruker enkelt, hverdagslig norsk språk
- Fokuserer på positive minner og verdifulle opplevelser

Kategorier: Barndom & Oppvekst, Familie & Forhold, Jobb & Prestasjoner, Eventyr & Reiser, Tradisjoner & Verdier`

    const userPrompt = `Lag 5 historieforslag for kategorien "${category}".

Kontekst om brukeren:
- Alder: ${context.userAge || 'ukjent'}
- Fødselsår: ${context.birthYear || 'ukjent'}
- Region: ${context.region || 'Norge'}
- Interesser: ${context.interests?.join(', ') || 'ukjent'}

Format som JSON array med: question, followUp (array), cultural (boolean)`

    if (!openai) {
      // Fallback to predefined Norwegian prompts if OpenAI not configured
      return this.getFallbackPrompts(category)
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('No response from AI')

      const prompts = JSON.parse(content)

      return prompts.map((prompt: { question: string; followUp?: string[]; cultural?: boolean }, index: number) => ({
        id: `${category}-${index}`,
        category,
        question: prompt.question,
        followUp: prompt.followUp || [],
        cultural: prompt.cultural || false,
        ageAppropriate: true
      }))
    } catch (error) {
      console.error('AI prompt generation failed:', error)

      // Fallback to predefined Norwegian prompts
      return this.getFallbackPrompts(category)
    }
  }

  // Analyze story content and provide suggestions
  static async analyzeStory(
    title: string,
    content: string,
    transcript?: string
  ): Promise<StoryAnalysis> {
    if (!openai) {
      // Fallback analysis if OpenAI not configured
      return {
        themes: ['familie', 'minner'],
        mood: 'nostalgisk',
        suggestions: ['Legg til mer om følelsene dine i situasjonen'],
        culturalRelevance: 0.7,
        clarity: 0.8,
        emotionalDepth: 0.7
      }
    }

    const systemPrompt = `Du er en ekspert på norske livshistorier og kulturell kontekst. Analyser historien og gi konstruktive, varme tilbakemeldinger.

Fokuser på:
- Kulturelle temaer og referanser til norsk historie/samfunn
- Emosjonell dybde og autensitet
- Klarhet i fortellingen
- Forslag til utdyping uten å være påtrengende

Vær alltid oppmuntrende og respektfull overfor eldre menneskers opplevelser.`

    const userPrompt = `Analyser denne historien:

Tittel: ${title}
Innhold: ${content}
${transcript ? `Transkripsjon: ${transcript}` : ''}

Gi analyse som JSON med: themes[], mood, suggestions[], culturalRelevance (0-1), clarity (0-1), emotionalDepth (0-1)`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 1000
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('No analysis response')

      return JSON.parse(content)
    } catch (error) {
      console.error('Story analysis failed:', error)

      // Fallback analysis
      return {
        themes: ['familie', 'minner'],
        mood: 'nostalgisk',
        suggestions: ['Legg til mer om følelsene dine i situasjonen'],
        culturalRelevance: 0.7,
        clarity: 0.8,
        emotionalDepth: 0.7
      }
    }
  }

  // Interactive conversation to help expand stories
  static async conductStoryInterview(
    storyTopic: string,
    userResponses: string[],
    context: ConversationContext = {}
  ): Promise<{
    nextQuestion: string
    encouragement: string
    isComplete: boolean
  }> {
    const systemPrompt = `Du er en varm, tålmodig intervjuer som hjelper eldre nordmenn med å utdype sine historier.

Regler:
- Bruk varmt, støttende språk
- Still oppfølgingsspørsmål basert på det de har sagt
- Vis ekte interesse og empati
- Unngå for personlige eller traumatiske spørsmål
- Oppmuntre til detaljer om følelser, stedet, menneskene involvert
- Respekter hvis de ikke vil snakke om noe
- Bruk norske uttrykk og kulturelle referanser

Mål: Hjelpe dem å skape en full, rik historie de kan være stolte av.`

    const conversationHistory = userResponses
      .map((response, i) => `Svar ${i + 1}: ${response}`)
      .join('\n')

    const userPrompt = `Emne: ${storyTopic}

Samtalehistorikk:
${conversationHistory}

Lag neste spørsmål for å hjelpe dem utdype historien.
Format som JSON: { nextQuestion, encouragement, isComplete }`

    if (!openai) {
      return {
        nextQuestion: 'Kan du fortelle mer om hvordan du følte deg i den situasjonen?',
        encouragement: 'Det høres ut som en viktig opplevelse. Takk for at du deler den med oss.',
        isComplete: false
      }
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 300
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('No interview response')

      return JSON.parse(content)
    } catch (error) {
      console.error('Story interview failed:', error)

      return {
        nextQuestion: 'Kan du fortelle mer om hvordan du følte deg i den situasjonen?',
        encouragement: 'Det høres ut som en viktig opplevelse. Takk for at du deler den med oss.',
        isComplete: false
      }
    }
  }

  // Generate suggestions for improving story titles
  static async suggestBetterTitles(storyContent: string): Promise<string[]> {
    const systemPrompt = `Du lager minnerike, varme titler for eldre nordmenns livshistorier.

Tittlene skal være:
- Korte og lett å huske
- Personlige og følelsesmessige
- Beskrivende uten å avsløre alt
- Passende for familiedeling
- På naturlig norsk`

    const userPrompt = `Foreslå 5 alternative titler for denne historien:

${storyContent.substring(0, 500)}...

Returner som JSON array av strings.`

    if (!openai) {
      return []
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 200
      })

      const content = response.choices[0]?.message?.content
      if (!content) return []

      return JSON.parse(content)
    } catch (error) {
      console.error('Title suggestion failed:', error)
      return []
    }
  }

  // Transcribe audio using Whisper API
  static async transcribeAudio(audioBlob: Blob): Promise<string> {
    if (!openai) {
      throw new Error('OpenAI API key not configured for transcription')
    }

    try {
      // Convert blob to file
      const audioFile = new File([audioBlob], 'recording.wav', {
        type: 'audio/wav'
      })

      const response = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'no', // Norwegian
        prompt: 'Dette er en eldre norsk person som forteller sin livshistorie.' // Context helps accuracy
      })

      return response.text
    } catch (error) {
      console.error('Transcription failed:', error)
      throw new Error('Kunne ikke transkribere lydopptaket.')
    }
  }

  // Fallback prompts if AI fails
  private static getFallbackPrompts(category: string): StoryPrompt[] {
    const prompts: Record<string, StoryPrompt[]> = {
      'Barndom & Oppvekst': [
        {
          id: 'childhood-1',
          category,
          question: 'Fortell om huset eller leiligheten du vokste opp i. Hvordan så det ut, og hvilket rom var ditt favorittsted?',
          followUp: ['Hvilke lukter husker du fra hjemmet?', 'Hadde dere noen spesielle familietradisjoner?'],
          cultural: true,
          ageAppropriate: true
        },
        {
          id: 'childhood-2',
          category,
          question: 'Hvordan var det å gå på skole da du var liten? Hvem var din favorittlærer?',
          followUp: ['Hva lærte du utenfor skolen?', 'Hvordan kom du deg til skolen?'],
          cultural: true,
          ageAppropriate: true
        }
      ],
      'Familie & Forhold': [
        {
          id: 'family-1',
          category,
          question: 'Fortell om hvordan du møtte din kjære. Hvor var dere, og hva var ditt første inntrykk?',
          followUp: ['Når skjønte du at dette var "den rette"?', 'Hvordan fant dere sammen?'],
          cultural: false,
          ageAppropriate: true
        }
      ]
    }

    return prompts[category] || []
  }
}

// Context-aware Norwegian cultural references
export const NorwegianCulturalContext = {
  // Historical periods relevant to elderly users
  historicalPeriods: {
    'wartime': { years: [1940, 1945], keywords: ['krig', 'okkupasjon', 'motstand'] },
    'reconstruction': { years: [1945, 1960], keywords: ['gjenoppbygging', 'Marshall-hjelp'] },
    'welfare': { years: [1960, 1980], keywords: ['velferdssamfunn', 'folketrygd'] },
    'oil': { years: [1970, 1990], keywords: ['oljeeventyret', 'Nordsjøen'] }
  },

  // Common Norwegian childhood experiences by decade
  childhoodByDecade: {
    1930: ['radiolytting', 'hjemmebakte brød', 'utedass'],
    1940: ['rasjonering', 'luftverndrøvelser', 'hjemmefront'],
    1950: ['nye hus', 'kylling på søndager', 'første bil'],
    1960: ['TV kommer', 'feriekroer', 'moped']
  },

  // Regional variations
  regions: {
    'nord': ['midnattsol', 'fiske', 'nordlys'],
    'vest': ['fjorder', 'regn', 'sjø'],
    'øst': ['skog', 'innsjøer', 'Østfold'],
    'sør': ['skjærgård', 'sommer', 'båt']
  }
}
