import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { OddsWebSocket } from '@/lib/websocket'

interface Event {
  id: string
  home_team: string
  away_team: string
  commence_time: string
  bookmakers: Array<{
    key: string
    title: string
    markets: Array<{
      key: string
      outcomes: Array<{
        name: string
        price: number
      }>
    }>
  }>
}

export default function LiveOdds() {
  const router = useRouter()
  const [sports, setSports] = useState<any[]>([])
  const [selectedSport, setSelectedSport] = useState('nfl')
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [ws, setWs] = useState<OddsWebSocket | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/signin')
      return
    }

    fetchSports()
    setupWebSocket()

    return () => {
      if (ws) ws.close()
    }
  }, [router])

  useEffect(() => {
    if (selectedSport) {
      fetchEvents(selectedSport)
    }
  }, [selectedSport])

  const fetchSports = async () => {
    try {
      const res = await fetch('/api/odds/sports')
      const data = await res.json()
      setSports(data.data || data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchEvents = async (sport: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/odds/latest?sport=${sport}`)
      const data = await res.json()
      setEvents(data.data || data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const setupWebSocket = () => {
    const wsUrl = (process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000').replace('http', 'ws')
    const websocket = new OddsWebSocket(
      `${wsUrl}/api/ws/odds`,
      (data) => {
        if (data.type === 'odds_update') {
          // Update events with new odds
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.id === data.eventId
                ? { ...event, bookmakers: data.bookmakers }
                : event
            )
          )
        }
      },
      (error) => {
        console.error('WebSocket error:', error)
      }
    )

    websocket.connect()
    setWs(websocket)
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading odds...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            Live Odds
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Sport Selector */}
        <div className="mb-8 flex space-x-2 overflow-x-auto pb-2">
          {sports.map((sport) => (
            <button
              key={sport.key}
              onClick={() => setSelectedSport(sport.key)}
              className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap ${
                selectedSport === sport.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {sport.title}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No upcoming events for this sport</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {event.home_team} vs {event.away_team}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(event.commence_time).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Bookmakers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {event.bookmakers.slice(0, 6).map((bookmaker) => (
                      <div key={bookmaker.key} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs font-bold text-gray-700 mb-3">{bookmaker.title}</p>

                        {bookmaker.markets.map((market) => (
                          <div key={market.key} className="mb-2">
                            <p className="text-xs text-gray-600 mb-2 capitalize">{market.key}</p>
                            <div className="space-y-1">
                              {market.outcomes.map((outcome) => (
                                <button
                                  key={outcome.name}
                                  onClick={() => router.push(`/place-bet?event=${event.id}&outcome=${outcome.name}&odds=${outcome.price}`)}
                                  className="w-full text-left px-3 py-2 bg-white rounded border border-gray-300 hover:bg-blue-50 hover:border-blue-400 transition"
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-900">{outcome.name}</span>
                                    <span className="text-xs font-bold text-blue-600">{outcome.price.toFixed(2)}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/place-bet?eventId=${event.id}`}
                    className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View all sportsbooks →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
