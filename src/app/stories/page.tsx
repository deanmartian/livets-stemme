"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, ArrowLeft, Play, Edit, Share, Trash2, Plus, Calendar, Clock, Mic, Search, Filter } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Story, AuthService } from "@/lib/auth"
import { format } from 'date-fns'
import { nb } from 'date-fns/locale'
import LoginForm from "@/components/auth/LoginForm"

type SortOption = 'newest' | 'oldest' | 'longest' | 'most-played'

export default function StoriesPage() {
  const { user, loading } = useAuth()
  const [stories, setStories] = useState<Story[]>([])
  const [filteredStories, setFilteredStories] = useState<Story[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('alle')
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  useEffect(() => {
    if (user) {
      const userStories = AuthService.getStories(user.id)
      setStories(userStories)
    }
  }, [user])

  useEffect(() => {
    let filtered = stories.filter(story => {
      const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           story.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'alle' || story.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort stories
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'longest':
          return b.duration - a.duration
        case 'most-played':
          return b.playCount - a.playCount
        default:
          return 0
      }
    })

    setFilteredStories(filtered)
  }, [stories, searchTerm, selectedCategory, sortBy])

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd. MMM yyyy', { locale: nb })
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const deleteStory = (storyId: string) => {
    if (confirm('Er du sikker på at du vil slette denne historien? Dette kan ikke angres.')) {
      AuthService.deleteStory(storyId)
      setStories(stories.filter(s => s.id !== storyId))
    }
  }

  const playStory = (story: Story) => {
    // Increment play count
    const updatedStory = { ...story, playCount: story.playCount + 1 }
    AuthService.saveStory(updatedStory)
    setStories(stories.map(s => s.id === story.id ? updatedStory : s))

    // Play audio if available
    if (story.audioBlob) {
      const audioUrl = URL.createObjectURL(story.audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()
    }
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption)
  }

  // Get unique categories
  const categories = ['alle', ...Array.from(new Set(stories.map(s => s.category)))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Laster...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <header className="bg-white shadow-sm border-b border-amber-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Heart className="h-8 w-8 text-amber-600" />
                <h1 className="text-2xl font-bold text-gray-800">Livets Stemme</h1>
              </div>
              <Link href="/" className="flex items-center text-amber-600 hover:text-amber-700 font-medium">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Tilbake til Hjem
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto px-6 py-16">
          <LoginForm />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-amber-600" />
              <h1 className="text-2xl font-bold text-gray-800">Livets Stemme</h1>
            </div>
            <Link href="/" className="flex items-center text-amber-600 hover:text-amber-700 font-medium">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Tilbake til Hjem
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Mine Historier</h2>
            <p className="text-xl text-gray-600">
              Dine dyrebare minner, vakkert bevart i din egen stemme
            </p>
          </div>
          <Link href="/record">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-6 py-3">
              <Plus className="mr-2 h-5 w-5" />
              Ta Opp Ny Historie
            </Button>
          </Link>
        </div>

        {/* Stories Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-amber-200 shadow-lg text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-amber-600 mb-2">{stories.length}</div>
              <p className="text-lg text-gray-600">Historier Tatt Opp</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200 shadow-lg text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.floor(stories.reduce((sum, story) => sum + story.duration, 0) / 60)}m
              </div>
              <p className="text-lg text-gray-600">Total Opptakstid</p>
            </CardContent>
          </Card>
          <Card className="border-green-200 shadow-lg text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stories.reduce((sum, story) => sum + story.playCount, 0)}
              </div>
              <p className="text-lg text-gray-600">Totale Avspillinger</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-gray-200 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Søk i historier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'alle' ? 'Alle kategorier' : category}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="newest">Nyeste først</option>
                <option value="oldest">Eldste først</option>
                <option value="longest">Lengst</option>
                <option value="most-played">Mest spilt</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Stories List */}
        {filteredStories.length === 0 ? (
          <Card className="border-amber-200 shadow-lg">
            <CardContent className="text-center py-16">
              <Mic className="h-20 w-20 text-amber-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {stories.length === 0 ? "Ingen Historier Ennå" : "Ingen Historier Funnet"}
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                {stories.length === 0
                  ? "Du har ikke tatt opp noen historier ennå. Hvorfor ikke begynne med din første?"
                  : "Prøv å endre søket eller filteret ditt."
                }
              </p>
              {stories.length === 0 && (
                <Link href="/record">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-8 py-4">
                    <Mic className="mr-3 h-6 w-6" />
                    Ta Opp Din Første Historie
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredStories.map((story) => (
              <Card key={story.id} className="border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-gray-800 mb-2">{story.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="text-base">{formatDate(story.createdAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-base">{formatDuration(story.duration)}</span>
                        </div>
                        <div className="flex items-center">
                          <Play className="h-4 w-4 mr-1" />
                          <span className="text-base">{story.playCount} avspillinger</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-amber-100 px-3 py-1 rounded-full">
                      <span className="text-amber-700 font-medium text-sm">{story.category}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {story.description && (
                    <p className="text-lg text-gray-600 mb-4">{story.description}</p>
                  )}

                  {story.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {story.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => playStory(story)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Lytt
                    </Button>
                    <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                      <Edit className="mr-2 h-4 w-4" />
                      Rediger
                    </Button>
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                      <Share className="mr-2 h-4 w-4" />
                      Del
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                      onClick={() => deleteStory(story.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Slett
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
