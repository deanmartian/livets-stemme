"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  User,
  Calendar,
  Clock,
  Play,
  Heart,
  TrendingUp,
  Users,
  Share,
  Download,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  BarChart3,
  Settings,
  Crown
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Story, AuthService, FamilyMember } from '@/lib/auth'
import { format } from 'date-fns'
import { nb } from 'date-fns/locale'

type SortOption = 'newest' | 'oldest' | 'most-played' | 'longest'

export default function UserDashboard() {
  const { user } = useAuth()
  const [stories, setStories] = useState<Story[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('alle')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showInviteForm, setShowInviteForm] = useState(false)

  useEffect(() => {
    if (user) {
      const userStories = AuthService.getStories(user.id)
      setStories(userStories)
    }
  }, [user])

  if (!user) return null

  // Analytics calculations
  const totalDuration = stories.reduce((sum, story) => sum + story.duration, 0)
  const totalPlays = stories.reduce((sum, story) => sum + story.playCount, 0)
  const averageDuration = stories.length > 0 ? totalDuration / stories.length : 0
  const categoryCounts = stories.reduce((acc, story) => {
    acc[story.category] = (acc[story.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Filter and sort stories
  const filteredStories = stories
    .filter(story => {
      const matchesCategory = selectedCategory === 'alle' || story.category === selectedCategory
      const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           story.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'most-played': return b.playCount - a.playCount
        case 'longest': return b.duration - a.duration
        default: return 0
      }
    })

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}t ${minutes}m`
    }
    return `${minutes}m ${seconds % 60}s`
  }

  const deleteStory = (storyId: string) => {
    if (confirm('Er du sikker på at du vil slette denne historien?')) {
      AuthService.deleteStory(storyId)
      setStories(stories.filter(s => s.id !== storyId))
    }
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption)
  }

  const categories = ['alle', ...Object.keys(categoryCounts)]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Velkommen tilbake, {user.name}!
          </h1>
          <p className="text-xl text-gray-600">
            Her er oversikten over dine historier og familieaktivitet
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {user.subscription === 'premium' && (
            <div className="flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              <Crown className="h-4 w-4 mr-1" />
              Premium
            </div>
          )}
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Innstillinger
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Totale Historier</p>
                <p className="text-3xl font-bold text-gray-900">{stories.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-amber-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              +2 denne måneden
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Opptakstid</p>
                <p className="text-3xl font-bold text-gray-900">{formatDuration(totalDuration)}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Gjennomsnitt: {formatDuration(averageDuration)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Totale Avspillinger</p>
                <p className="text-3xl font-bold text-gray-900">{totalPlays}</p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Familie har lyttet {totalPlays} ganger
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Familiemedlemmer</p>
                <p className="text-3xl font-bold text-gray-900">{user.familyMembers.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {user.familyMembers.filter(m => m.inviteStatus === 'pending').length} ventende invitasjoner
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">Hurtighandlinger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white h-16 text-lg">
              <Plus className="mr-2 h-6 w-6" />
              Ta Opp Ny Historie
            </Button>
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 h-16 text-lg"
              onClick={() => setShowInviteForm(true)}
            >
              <Users className="mr-2 h-6 w-6" />
              Inviter Familie
            </Button>
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 h-16 text-lg">
              <BarChart3 className="mr-2 h-6 w-6" />
              Se Detaljert Statistikk
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Story Management */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-gray-800">Mine Historier</CardTitle>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Søk i historier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Category Filter */}
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

              {/* Sort */}
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="newest">Nyeste først</option>
                <option value="oldest">Eldste først</option>
                <option value="most-played">Mest spilt</option>
                <option value="longest">Lengst</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStories.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Ingen historier funnet</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== 'alle'
                  ? 'Prøv å endre søket eller filteret ditt'
                  : 'Ta opp din første historie for å komme i gang!'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStories.map((story) => (
                <div key={story.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{story.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(story.createdAt), 'dd. MMM yyyy', { locale: nb })}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDuration(story.duration)}
                        </span>
                        <span className="flex items-center">
                          <Play className="h-4 w-4 mr-1" />
                          {story.playCount} avspillinger
                        </span>
                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                          {story.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => deleteStory(story.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {story.description && (
                    <p className="text-gray-600 mb-3">{story.description}</p>
                  )}

                  {story.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {story.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Family Members */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-gray-800">
            <Users className="mr-3 h-6 w-6 text-purple-600" />
            Familiemedlemmer
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user.familyMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Ingen familiemedlemmer ennå</h3>
              <p className="text-gray-500 mb-4">Inviter familie til å lytte til historiene dine</p>
              <Button
                onClick={() => setShowInviteForm(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Inviter Familie
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {user.familyMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-800">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className="text-sm text-gray-500">{member.relationship}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      member.inviteStatus === 'accepted' ? 'bg-green-100 text-green-800' :
                      member.inviteStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {member.inviteStatus === 'accepted' ? 'Godkjent' :
                       member.inviteStatus === 'pending' ? 'Venter' : 'Avslått'}
                    </span>
                    <Button size="sm" variant="outline">
                      Rediger
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
