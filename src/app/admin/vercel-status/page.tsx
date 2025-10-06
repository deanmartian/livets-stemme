"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface HealthStatus {
  status: string
  timestamp: string
  environment: string
  region: string
  version: string
  services: {
    database: string
    ai: string
    payments: string
  }
}

export default function VercelStatusPage() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/health')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      setHealthStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'configured':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'not configured':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'error':
      case 'unhealthy':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'configured':
        return 'text-green-600'
      case 'not configured':
        return 'text-yellow-600'
      case 'error':
      case 'unhealthy':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-amber-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Livets Stemme</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Vercel Deployment Status</h2>
          <p className="text-gray-600">Overvåk status for alle integrasjoner og tjenester</p>
        </div>

        {/* Refresh Button */}
        <div className="text-center mb-8">
          <Button
            onClick={checkHealth}
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Sjekker...' : 'Oppdater Status'}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-red-800">Feil ved status-sjekk</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Health Status */}
        {healthStatus && (
          <div className="space-y-6">
            {/* Overall Status */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {getStatusIcon(healthStatus.status)}
                  <span className="ml-3">Overordnet Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`font-semibold ${getStatusColor(healthStatus.status)}`}>
                      {healthStatus.status === 'healthy' ? 'Frisk' : 'Problemer'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Miljø</p>
                    <p className="font-semibold">{healthStatus.environment}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Region</p>
                    <p className="font-semibold">{healthStatus.region}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Versjon</p>
                    <p className="font-semibold">{healthStatus.version}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Sist oppdatert</p>
                  <p className="text-sm font-mono">{new Date(healthStatus.timestamp).toLocaleString('nb-NO')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Services Status */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Database */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    {getStatusIcon(healthStatus.services.database)}
                    <span className="ml-3">Database</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`font-semibold ${getStatusColor(healthStatus.services.database)}`}>
                    {healthStatus.services.database === 'configured' ? 'Konfigurert' :
                     healthStatus.services.database === 'not configured' ? 'Ikke konfigurert' : 'Feil'}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Supabase PostgreSQL</p>
                  {healthStatus.services.database === 'not configured' && (
                    <p className="text-sm text-yellow-700 mt-2">
                      Sett NEXT_PUBLIC_SUPABASE_URL i environment variables
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* AI Services */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    {getStatusIcon(healthStatus.services.ai)}
                    <span className="ml-3">AI Tjenester</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`font-semibold ${getStatusColor(healthStatus.services.ai)}`}>
                    {healthStatus.services.ai === 'configured' ? 'Konfigurert' :
                     healthStatus.services.ai === 'not configured' ? 'Ikke konfigurert' : 'Feil'}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">OpenAI + ElevenLabs</p>
                  {healthStatus.services.ai === 'not configured' && (
                    <p className="text-sm text-yellow-700 mt-2">
                      Sett OPENAI_API_KEY og ELEVENLABS_API_KEY
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Payments */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    {getStatusIcon(healthStatus.services.payments)}
                    <span className="ml-3">Betalinger</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`font-semibold ${getStatusColor(healthStatus.services.payments)}`}>
                    {healthStatus.services.payments === 'configured' ? 'Konfigurert' :
                     healthStatus.services.payments === 'not configured' ? 'Ikke konfigurert' : 'Feil'}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Stripe</p>
                  {healthStatus.services.payments === 'not configured' && (
                    <p className="text-sm text-yellow-700 mt-2">
                      Sett STRIPE_SECRET_KEY i environment variables
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Environment Variables Check */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Påkrevde Variabler</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center">
                        {process.env.NEXT_PUBLIC_SUPABASE_URL ?
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" /> :
                          <XCircle className="h-4 w-4 text-red-600 mr-2" />
                        }
                        NEXT_PUBLIC_SUPABASE_URL
                      </li>
                      <li className="flex items-center">
                        {process.env.NEXTAUTH_SECRET ?
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" /> :
                          <XCircle className="h-4 w-4 text-red-600 mr-2" />
                        }
                        NEXTAUTH_SECRET
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Valgfrie Variabler</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center">
                        {process.env.OPENAI_API_KEY ?
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" /> :
                          <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                        }
                        OPENAI_API_KEY
                      </li>
                      <li className="flex items-center">
                        {process.env.STRIPE_SECRET_KEY ?
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" /> :
                          <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                        }
                        STRIPE_SECRET_KEY
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tests */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Hurtigtester</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => window.open('/api/ai/story-prompts?category=Familie', '_blank')}
                    className="mr-3"
                  >
                    Test AI API
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open('/api/health', '_blank')}
                    className="mr-3"
                  >
                    Test Health API
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open('/', '_blank')}
                  >
                    Test Frontend
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Klikk på knappene for å teste ulike deler av applikasjonen i en ny fane.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            🚀 Deployed on Vercel • 🎙️ Livets Stemme v{healthStatus?.version || '5.0'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            For support: <a href="mailto:support@livetsstemme.no" className="text-amber-600 hover:underline">
              support@livetsstemme.no
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
