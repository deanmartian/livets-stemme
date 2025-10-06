"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, ArrowLeft, Play, Pause, Share, Download, Mail, Copy, Users, Volume2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ListenPage() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Mock data for demonstration
  const stories = [
    {
      id: 1,
      title: "Møtet med Din Bestefar",
      duration: "12:34",
      category: "Familie & Forhold",
      description: "Historien om hvordan jeg møtte kjærligheten i mitt liv på et kirkesosialt i 1952...",
      audioUrl: "#"
    },
    {
      id: 2,
      title: "Min Første Jobb på Fabrikken",
      duration: "8:22",
      category: "Jobb & Prestasjoner",
      description: "Å begynne å jobbe som 16-åring og lære verdien av hardt arbeid...",
      audioUrl: "#"
    },
    {
      id: 3,
      title: "Huset Jeg Vokste Opp I",
      duration: "15:45",
      category: "Barndom & Oppvekst",
      description: "Vårt lille hvite hus på Eplegate med det store eiketreet i forhagen...",
      audioUrl: "#"
    }
  ]

  const handlePlayPause = (storyId: number) => {
    if (currentlyPlaying === storyId && isPlaying) {
      setIsPlaying(false)
    } else {
      setCurrentlyPlaying(storyId)
      setIsPlaying(true)
    }
  }

  const handleShare = (story: typeof stories[0]) => {
    // In a real app, this would generate a shareable link
    alert(`Deler "${story.title}" med familien din!`)
  }

  const handleDownload = (story: typeof stories[0]) => {
    // In a real app, this would download the audio file
    alert(`Laster ned "${story.title}"`)
  }

  const handleEmail = (story: typeof stories[0]) => {
    // In a real app, this would open email with the story attached
    const subject = `Lytt til historien min: "${story.title}"`
    const body = `Jeg ville dele denne historien med deg. Den handler om ${story.description.substring(0, 100)}...`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
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
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Lytt til & Del Historiene Dine</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nyt å lytte til dine innspilte minner og del disse dyrebare historiene med de du elsker.
            Din stemme bærer arven din videre.
          </p>
        </div>

        {/* Audio Player Section */}
        {currentlyPlaying && (
          <Card className="border-amber-200 shadow-lg mb-12 bg-gradient-to-r from-amber-100 to-orange-100">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => handlePlayPause(currentlyPlaying)}
                    className={`${
                      isPlaying ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                    } text-white w-16 h-16 rounded-full`}
                  >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {stories.find(s => s.id === currentlyPlaying)?.title}
                    </h3>
                    <p className="text-lg text-gray-600">Spiller nå</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Volume2 className="h-6 w-6 text-gray-600" />
                  <div className="w-32 h-2 bg-gray-300 rounded-full">
                    <div className="w-1/3 h-2 bg-amber-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stories List */}
        <div className="space-y-6 mb-12">
          {stories.map((story) => (
            <Card key={story.id} className="border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-gray-800 mb-2">{story.title}</CardTitle>
                    <div className="bg-amber-100 inline-block px-3 py-1 rounded-full">
                      <span className="text-amber-700 font-medium text-sm">{story.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-800">{story.duration}</div>
                    <div className="text-sm text-gray-600">Varighet</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-600 mb-6">{story.description}</p>

                {/* Playback Controls */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button
                    onClick={() => handlePlayPause(story.id)}
                    className={`${
                      currentlyPlaying === story.id && isPlaying
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                  >
                    {currentlyPlaying === story.id && isPlaying ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Lytt
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleDownload(story)}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Last ned
                  </Button>
                </div>

                {/* Sharing Options */}
                <div className="border-t border-amber-200 pt-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Del Denne Historien</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => handleShare(story)}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <Share className="mr-2 h-4 w-4" />
                      Del Lenke
                    </Button>
                    <Button
                      onClick={() => handleEmail(story)}
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Send til Familie
                    </Button>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`Lytt til historien min: "${story.title}"`)
                        alert("Historielenke kopiert til utklippstavlen!")
                      }}
                      variant="outline"
                      className="border-purple-600 text-purple-600 hover:bg-purple-50"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Kopier Lenke
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Family Sharing Guide */}
        <Card className="border-amber-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-gray-800">
              <Users className="mr-3 h-8 w-8 text-amber-600" />
              Deling med Familien Din
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-amber-600 mb-4">Måter å Dele På</h4>
                <ul className="text-lg text-gray-600 space-y-3">
                  <li className="flex items-start">
                    <Mail className="h-5 w-5 text-amber-500 mr-3 mt-1 flex-shrink-0" />
                    <span>Send historier direkte til familiemedlemmer på e-post</span>
                  </li>
                  <li className="flex items-start">
                    <Share className="h-5 w-5 text-amber-500 mr-3 mt-1 flex-shrink-0" />
                    <span>Lag delbare lenker for enkel tilgang</span>
                  </li>
                  <li className="flex items-start">
                    <Download className="h-5 w-5 text-amber-500 mr-3 mt-1 flex-shrink-0" />
                    <span>Last ned filer for å dele på sosiale medier</span>
                  </li>
                  <li className="flex items-start">
                    <Copy className="h-5 w-5 text-amber-500 mr-3 mt-1 flex-shrink-0" />
                    <span>Kopier lenker for å dele i tekstmeldinger</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-bold text-amber-600 mb-4">Gjøre Det Spesielt</h4>
                <ul className="text-lg text-gray-600 space-y-3">
                  <li>• Legg til en personlig melding når du deler</li>
                  <li>• Grupper relaterte historier i samlinger</li>
                  <li>• Del historier på spesielle anledninger</li>
                  <li>• Oppmuntre familien til å svare med egne minner</li>
                  <li>• Lag historiesamlinger for forskjellige familiemedlemmer</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-lg text-gray-700 italic text-center">
                "Historiene dine er gaver til familien din. Hver enkelt er en skatt som forbinder generasjoner
                og bevarer kjærligheten, visdommen og opplevelsene som gjør familien din unik."
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
