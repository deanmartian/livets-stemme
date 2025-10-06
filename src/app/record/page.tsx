"use client"

import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import EnhancedRecording from "@/components/recording/EnhancedRecording"
import LoginForm from "@/components/auth/LoginForm"

export default function RecordPage() {
  const { user, loading } = useAuth()

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

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Ta Opp Din Historie</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {user
              ? "Ta din tid. Snakk fra hjertet. Din historie betyr noe."
              : "Logg inn for å lagre historiene dine og få tilgang til alle funksjoner."
            }
          </p>
        </div>

        {user ? (
          <EnhancedRecording
            category="Generelt"
            onSaved={(story) => {
              console.log('Story saved:', story)
              // Could redirect to stories page or show success message
            }}
          />
        ) : (
          <LoginForm />
        )}
      </main>
    </div>
  )
}
