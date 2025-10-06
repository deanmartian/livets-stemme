export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
  subscription: 'free' | 'premium' | 'family'
  preferences: {
    language: 'nb' | 'en'
    notifications: boolean
    autoSave: boolean
    audioQuality: 'standard' | 'high'
  }
  familyMembers: FamilyMember[]
}

export type PermissionType = 'view' | 'listen' | 'download' | 'comment'

export interface FamilyMember {
  id: string
  email: string
  name: string
  relationship: string
  permissions: PermissionType[]
  inviteStatus: 'pending' | 'accepted' | 'declined'
  invitedAt: string
}

export interface Story {
  id: string
  userId: string
  title: string
  description: string
  category: string
  duration: number
  audioUrl?: string
  audioBlob?: Blob
  transcript?: string
  tags: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
  playCount: number
  shareSettings: {
    allowDownload: boolean
    allowComments: boolean
    expiresAt?: string
    password?: string
  }
  aiMetadata?: {
    suggestions: string[]
    mood: string
    themes: string[]
    voiceCloneReady: boolean
  }
}

export interface AIPrompt {
  id: string
  category: string
  question: string
  followUp?: string[]
  cultural: boolean
}

// Simulated authentication service (would be replaced with Supabase/Firebase)
export class AuthService {
  private static readonly STORAGE_KEY = 'livets_stemme_user'
  private static readonly STORIES_KEY = 'livets_stemme_stories'

  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null

    const stored = localStorage.getItem(this.STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  }

  static async signInWithEmail(email: string): Promise<User> {
    // Simulate passwordless login - in real app, this would send magic link
    const existingUser = this.getCurrentUser()

    if (existingUser && existingUser.email === email) {
      return existingUser
    }

    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0], // Default name from email
      createdAt: new Date().toISOString(),
      subscription: 'free',
      preferences: {
        language: 'nb',
        notifications: true,
        autoSave: true,
        audioQuality: 'standard'
      },
      familyMembers: []
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newUser))
    return newUser
  }

  static async signOut(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  static async updateProfile(updates: Partial<User>): Promise<User> {
    const currentUser = this.getCurrentUser()
    if (!currentUser) throw new Error('No user logged in')

    const updatedUser = { ...currentUser, ...updates }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUser))
    return updatedUser
  }

  // Story management
  static getStories(userId: string): Story[] {
    if (typeof window === 'undefined') return []

    const stored = localStorage.getItem(this.STORIES_KEY)
    const allStories = stored ? JSON.parse(stored) : []
    return allStories.filter((story: Story) => story.userId === userId)
  }

  static saveStory(story: Story): void {
    const stored = localStorage.getItem(this.STORIES_KEY)
    const allStories = stored ? JSON.parse(stored) : []

    const existingIndex = allStories.findIndex((s: Story) => s.id === story.id)
    if (existingIndex >= 0) {
      allStories[existingIndex] = story
    } else {
      allStories.push(story)
    }

    localStorage.setItem(this.STORIES_KEY, JSON.stringify(allStories))
  }

  static deleteStory(storyId: string): void {
    const stored = localStorage.getItem(this.STORIES_KEY)
    const allStories = stored ? JSON.parse(stored) : []
    const filtered = allStories.filter((s: Story) => s.id !== storyId)
    localStorage.setItem(this.STORIES_KEY, JSON.stringify(filtered))
  }

  // Family member management
  static async inviteFamilyMember(email: string, relationship: string, permissions: PermissionType[]): Promise<FamilyMember> {
    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0],
      relationship,
      permissions,
      inviteStatus: 'pending',
      invitedAt: new Date().toISOString()
    }

    const user = this.getCurrentUser()
    if (user) {
      user.familyMembers.push(newMember)
      await this.updateProfile(user)
    }

    return newMember
  }
}

// AI Service simulation
export class AIService {
  static async generateStoryPrompts(category: string, userProfile: User): Promise<AIPrompt[]> {
    // Simulate AI-generated prompts based on category and user profile
    const prompts: { [key: string]: AIPrompt[] } = {
      'Barndom & Oppvekst': [
        {
          id: '1',
          category: 'Barndom & Oppvekst',
          question: 'Fortell om det første hjemmet du husker. Hvordan så det ut, og hvilke rom var dine favoritter?',
          followUp: ['Hvilke lukter forbinder du med barndomshjemmet?', 'Hadde dere noen spesielle familietradisjoner?'],
          cultural: true
        },
        {
          id: '2',
          category: 'Barndom & Oppvekst',
          question: 'Beskriv din aller beste venn da du var barn. Hva gjorde dere sammen?',
          followUp: ['Hvor traff dere første gang?', 'Har dere kontakt i dag?'],
          cultural: false
        }
      ],
      'Familie & Forhold': [
        {
          id: '3',
          category: 'Familie & Forhold',
          question: 'Fortell historien om hvordan du møtte din livsledsager.',
          followUp: ['Hva var ditt første inntrykk?', 'Når skjønte du at dette var "den rette"?'],
          cultural: false
        }
      ]
    }

    return prompts[category] || []
  }

  static async analyzeAudio(audioBlob: Blob): Promise<{
    duration: number
    quality: 'low' | 'medium' | 'high'
    voiceCloneReady: boolean
  }> {
    // Simulate audio analysis
    return {
      duration: 120, // seconds
      quality: 'high',
      voiceCloneReady: true
    }
  }

  static async generateTranscript(audioBlob: Blob): Promise<string> {
    // Simulate speech-to-text (would use AssemblyAI/Whisper in production)
    return "Dette er en simulert transkripsjon av lydopptaket. I en ekte implementering ville denne teksten være den faktiske talen fra opptaket, konvertert til tekst ved hjelp av AI-basert tale-til-tekst teknologi."
  }
}
