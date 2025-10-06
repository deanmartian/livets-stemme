"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Shield, Check, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface LoginFormProps {
  onClose?: () => void
}

export default function LoginForm({ onClose }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'sent' | 'success'>('email')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      // In a real app, this would send a magic link
      // For demo purposes, we'll simulate immediate login
      await signIn(email)
      setStep('success')
      setTimeout(() => {
        onClose?.()
      }, 2000)
    } catch (error) {
      console.error('Login error:', error)
      alert('Det oppstod en feil ved innlogging. Prøv igjen.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <Card className="border-green-200 shadow-lg max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Velkommen!</h3>
          <p className="text-lg text-gray-600">
            Du er nå logget inn og kan begynne å ta opp historiene dine.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (step === 'sent') {
    return (
      <Card className="border-amber-200 shadow-lg max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-gray-800">
            Sjekk E-posten Din
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <Mail className="h-16 w-16 text-amber-600 mx-auto mb-4" />
            <p className="text-lg text-gray-600 mb-4">
              Vi har sendt en sikker innloggingslenke til:
            </p>
            <p className="text-xl font-semibold text-gray-800 mb-6">{email}</p>
            <p className="text-base text-gray-600">
              Klikk på lenken i e-posten for å logge inn trygt.
              Lenken er gyldig i 15 minutter.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setStep('email')}
            className="w-full text-lg py-3"
          >
            Bruk en annen e-postadresse
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-amber-200 shadow-lg max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-gray-800">
          Logg Inn eller Registrer Deg
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <Shield className="h-16 w-16 text-amber-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">
            Ingen passord nødvendig! Vi sender deg en sikker innloggingslenke på e-post.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
              E-postadresse
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@epost.no"
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xl py-4"
          >
            {loading ? (
              'Sender lenke...'
            ) : (
              <>
                Send Innloggingslenke
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="font-semibold text-gray-800 mb-2">Trygg innlogging:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Ingen passord å huske</li>
            <li>• Sikker lenke sendt til din e-post</li>
            <li>• Automatisk utlogging etter inaktivitet</li>
            <li>• Dine historier forblir private</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
