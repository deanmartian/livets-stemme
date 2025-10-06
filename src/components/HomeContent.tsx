"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Mic, Heart, Users, HelpCircle, Play, User, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import LoginForm from '@/components/auth/LoginForm'
import UserDashboard from '@/components/dashboard/UserDashboard'

export default function HomeContent() {
  const { user, signOut, loading } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

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

  // Show dashboard if user is logged in
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        {/* Header Navigation for logged-in users */}
        <header className="bg-white shadow-sm border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Heart className="h-8 w-8 text-amber-600" />
                <h1 className="text-2xl font-bold text-gray-800">Livets Stemme</h1>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-lg text-gray-700 hover:text-amber-600 font-medium">Dashboard</Link>
                <Link href="/record" className="text-lg text-gray-700 hover:text-amber-600 font-medium">Ta Opp</Link>
                <Link href="/stories" className="text-lg text-gray-700 hover:text-amber-600 font-medium">Mine Historier</Link>
                <Link href="/help" className="text-lg text-gray-700 hover:text-amber-600 font-medium">Hjelp</Link>
                <Link href="/listen" className="text-lg text-gray-700 hover:text-amber-600 font-medium">Lytt & Del</Link>
              </nav>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">{user.name}</span>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Innstillinger
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logg ut
                </Button>
              </div>
            </div>
          </div>
        </header>

        <UserDashboard />
      </div>
    )
  }

  // Show login modal if requested
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <header className="bg-white shadow-sm border-b border-amber-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Heart className="h-8 w-8 text-amber-600" />
                <h1 className="text-2xl font-bold text-gray-800">Livets Stemme</h1>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowLogin(false)}
              >
                Tilbake
              </Button>
            </div>
          </div>
        </header>

        <div className="py-16">
          <LoginForm onClose={() => setShowLogin(false)} />
        </div>
      </div>
    )
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-amber-600" />
              <h1 className="text-2xl font-bold text-gray-800">Livets Stemme</h1>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                <Link href="/help" className="text-lg text-gray-700 hover:text-amber-600 font-medium">Hjelp</Link>
                <Link href="/about" className="text-lg text-gray-700 hover:text-amber-600 font-medium">Om Oss</Link>
              </nav>
              <Button
                onClick={() => setShowLogin(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <User className="mr-2 h-4 w-4" />
                Logg Inn
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Dine Historier Betyr Noe.<br />
            <span className="text-amber-600">La Oss Bevare Dem Sammen.</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Velkommen til et spesielt sted hvor dine livserfaringer blir til dyrebare minner for familien din.
            Ta opp historiene dine med din egen stemme, få mild hjelp til å organisere tankene dine, og lag
            noe virkelig meningsfullt for de du elsker.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-xl font-semibold"
              onClick={() => setShowLogin(true)}
            >
              <Mic className="mr-3 h-6 w-6" />
              Start Opptak av Din Historie
            </Button>
            <Link href="/help">
              <Button variant="outline" size="lg" className="border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-4 text-xl font-semibold">
                <HelpCircle className="mr-3 h-6 w-6" />
                Trenger Du Inspirasjon?
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <Mic className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Enkelt Opptak</h3>
              <p className="text-lg text-gray-600 mb-6">
                Bare klikk og snakk. Ingen komplisert teknologi - bare din stemme og dine historier.
              </p>
              <Button
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => setShowLogin(true)}
              >
                Start Opptak
              </Button>
            </CardContent>
          </Card>

          <Card className="border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <HelpCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">AI-Assistanse</h3>
              <p className="text-lg text-gray-600 mb-6">
                Vår AI-assistent hjelper deg med å strukturere historier og foreslår interessante spørsmål.
              </p>
              <Link href="/help">
                <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                  Få Historieforslag
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Trygg Deling</h3>
              <p className="text-lg text-gray-600 mb-6">
                Kontroller hvem som kan lytte til historiene dine. Sikker deling med familie og venner.
              </p>
              <Button
                variant="outline"
                className="border-amber-600 text-amber-600 hover:bg-amber-50"
                onClick={() => setShowLogin(true)}
              >
                <Play className="mr-2 h-5 w-5" />
                Lær Mer
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Premium Features */}
        <Card className="border-blue-200 shadow-lg mb-16">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Premium Funksjoner</h3>
              <p className="text-xl text-gray-600">
                Få tilgang til avanserte AI-funksjoner og ubegrenset lagring
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-blue-600 mb-3">🎭 Stemmekloning</h4>
                <p className="text-gray-600 mb-4">
                  ElevenLabs AI kan lære din stemme og hjelpe med å fullføre historier eller lage nye opptak i din stemme.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-blue-600 mb-3">📝 Automatisk Transkripsjon</h4>
                <p className="text-gray-600 mb-4">
                  Få tekstversjoner av alle opptakene dine automatisk, med mulighet for redigering og søk.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-blue-600 mb-3">👥 Utvidet Familie-deling</h4>
                <p className="text-gray-600 mb-4">
                  Inviter ubegrenset antall familiemedlemmer og lag private familiesamlinger av historier.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-blue-600 mb-3">🧠 AI Historieassistent</h4>
                <p className="text-gray-600 mb-4">
                  Få personlige historieforslag basert på din alder, bakgrunn og interesser.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-amber-200">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-8">Slik Fungerer Det</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">1</span>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Opprett Konto</h4>
              <p className="text-lg text-gray-600">
                Registrer deg trygt med e-post. Ingen passord nødvendig - vi sender deg en sikker innloggingslenke.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">2</span>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Ta Opp Historier</h4>
              <p className="text-lg text-gray-600">
                Bruk AI-assistenten til å finne emner, ta så opp historiene dine direkte i nettleseren.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">3</span>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Del med Familie</h4>
              <p className="text-lg text-gray-600">
                Inviter familiemedlemmer til å lytte, kommentere og dele egne minner tilbake.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-6">Klar til å Begynne?</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start din reise med å bevare livshistoriene dine i dag. Det tar bare et minutt å komme i gang.
          </p>
          <Button
            size="lg"
            className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-4 text-xl font-semibold"
            onClick={() => setShowLogin(true)}
          >
            <User className="mr-3 h-6 w-6" />
            Opprett Gratis Konto
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-amber-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p className="text-lg mb-2">Laget med ❤️ for å bevare dyrebare minner</p>
            <p className="text-base">Dine historier. Din stemme. Din arv.</p>
            <div className="mt-4 space-x-6 text-sm">
              <Link href="/privacy" className="hover:text-amber-600">Personvern</Link>
              <Link href="/terms" className="hover:text-amber-600">Vilkår</Link>
              <Link href="/contact" className="hover:text-amber-600">Kontakt</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
