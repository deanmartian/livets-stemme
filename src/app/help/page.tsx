import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, ArrowLeft, Lightbulb, MessageCircle, Book, Users, Calendar, MapPin } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const storyCategories = [
    {
      icon: <Book className="h-8 w-8 text-amber-600" />,
      title: "Barndom & Oppvekst",
      prompts: [
        "Fortell om huset du vokste opp i",
        "Hvordan var nabolaget ditt da du var ung?",
        "Beskriv din favorittlek eller ditt favorittleke som barn",
        "Hva ville du bli når du ble stor?",
        "Fortell om din første skoledag"
      ]
    },
    {
      icon: <Users className="h-8 w-8 text-amber-600" />,
      title: "Familie & Forhold",
      prompts: [
        "Hvordan møtte du din ektefelle/partner?",
        "Fortell om dine foreldre eller besteforeldre",
        "Hva er en kjær familietradisjon?",
        "Beskriv et spesielt øyeblikk med barna dine",
        "Hvem har hatt størst innflytelse på deg?"
      ]
    },
    {
      icon: <Calendar className="h-8 w-8 text-amber-600" />,
      title: "Jobb & Prestasjoner",
      prompts: [
        "Hvordan var din første jobb?",
        "Fortell om et øyeblikk du følte deg virkelig stolt",
        "Hva er det hardeste du noen gang har jobbet for?",
        "Beskriv en gang du hjalp noen andre",
        "Hva vil du bli husket for?"
      ]
    },
    {
      icon: <MapPin className="h-8 w-8 text-amber-600" />,
      title: "Eventyr & Reiser",
      prompts: [
        "Fortell om det lengste du noen gang har reist",
        "Beskriv et sted som føltes som hjemme",
        "Hva er det vakreste du noen gang har sett?",
        "Fortell om en gang du prøvde noe nytt",
        "Beskriv din favorittferie eller -reise"
      ]
    }
  ]

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
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Trenger Du Hjelp til å Komme i Gang?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Noen ganger er det vanskeligste å vite hvor man skal begynne. Her er milde spørsmål og ideer
            som kan vekke minnene dine og hjelpe deg gjennom å dele historiene dine.
          </p>
        </div>

        {/* AI Assistant Section */}
        <Card className="border-amber-200 shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-gray-800">
              <MessageCircle className="mr-3 h-8 w-8 text-amber-600" />
              Din Vennlige Historieassistent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 rounded-lg p-8 border border-amber-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Hvordan Vi Hjelper Deg</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-amber-600 mb-3">Milde Spørsmål</h4>
                  <p className="text-lg text-gray-600 mb-4">
                    Vi stiller deg gjennomtenkte spørsmål for å hjelpe deg med å bringe frem minner.
                    Som å ha en samtale med en omsorgsfull venn som virkelig er interessert i livet ditt.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-amber-600 mb-3">Historiestruktur</h4>
                  <p className="text-lg text-gray-600 mb-4">
                    Hvis du ikke er sikker på hvordan du skal organisere tankene dine, kan vi hjelpe deg med å strukturere
                    historien din slik at den flyter naturlig fra begynnelse til slutt.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-amber-600 mb-3">Emneforslag</h4>
                  <p className="text-lg text-gray-600 mb-4">
                    Velg mellom forskjellige livstemaer, eller fortell oss hva som er viktig for deg
                    og vi hjelper deg med å utforske disse minnene.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-amber-600 mb-3">Oppmuntring</h4>
                  <p className="text-lg text-gray-600 mb-4">
                    Vi er her for å minne deg på at historiene dine betyr noe og hjelpe deg
                    føle deg trygg på å dele opplevelsene dine.
                  </p>
                </div>
              </div>
              <div className="text-center mt-8">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-8 py-4">
                  <MessageCircle className="mr-3 h-6 w-6" />
                  Start en Samtale
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Story Categories */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-8">Historieforslag etter Tema</h3>
          <div className="grid lg:grid-cols-2 gap-8">
            {storyCategories.map((category, index) => (
              <Card key={index} className="border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-800">
                    {category.icon}
                    <span className="ml-3">{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.prompts.map((prompt, promptIndex) => (
                      <li key={promptIndex} className="flex items-start">
                        <Lightbulb className="h-5 w-5 text-amber-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-lg text-gray-600">{prompt}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="border-amber-600 text-amber-600 hover:bg-amber-50 w-full text-lg py-3"
                    >
                      Bruk Disse Ideene
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Getting Started Guide */}
        <Card className="border-amber-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800 text-center">Enkle Steg for å Komme i Gang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-amber-600">1</span>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">Velg Det Som Føles Riktig</h4>
                <p className="text-lg text-gray-600">
                  Se gjennom historieideene ovenfor og velg noe som bringer et smil til ansiktet ditt
                  eller som rører ved hjertet ditt.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-amber-600">2</span>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">Snakk med Vår Assistent</h4>
                <p className="text-lg text-gray-600">
                  Vår vennlige assistent vil stille deg milde spørsmål for å hjelpe deg huske detaljer
                  og organisere tankene dine.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-amber-600">3</span>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">Start Opptak</h4>
                <p className="text-lg text-gray-600">
                  Når du føler deg klar, trykk bare på opptak og fortell historien din. Ta din tid,
                  pause når du trenger det, og snakk fra hjertet.
                </p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link href="/record">
                <Button
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-4 text-xl font-semibold"
                >
                  Jeg Er Klar til å Ta Opp
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
