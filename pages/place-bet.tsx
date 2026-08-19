import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface Sport {
  key: string
  title: string
  group: string
}

interface Event {
  id: string
  sport_key: string
  sport_title: string
  commence_time: string
  home_team: string
  away_team: string
}

interface Bookmaker {
  key: string
  title: string
  markets?: Array<{
    key: string
    outcomes: Array<{
      name: string
      price: number
    }>
  }>
}

export default function PlaceBet() {
  const router = useRouter()
  const [sports, setSports] = useState<Sport[]>([])
  const [selectedSport, setSelectedSport] = useState('')
  const [events, setEvents] = useState<Event[]>([])
  const [odds, setOdds] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const [betData, setBetData] = useState({
    selection: '',
    odds: 0,
    wagerAmount: 0,
    betType: 'moneyline',
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/signin')
      return
    }

    fetchSports()
  }, [router])

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
    if (!sport) return
    setLoading(true)
    try {
      const res = await fetch(`/api/odds/events?sport=${sport}`)
      const data = await res.json()
      setEvents(data.data || data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchOdds = async (sport: string) => {
    if (!sport) return
    setLoading(true)
    try {
      const res = await fetch(`/api/odds/latest?sport=${sport}`)
      const data = await res.json()
      setOdds(data.data || data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sport = e.target.value
    setSelectedSport(sport)
    setSelectedEvent(null)
    setBetData({ ...betData, selection: '', odds: 0 })
    fetchEvents(sport)
    fetchOdds(sport)
  }

  const handlePlaceBet = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    if (!betData.selection || !betData.odds || !betData.wagerAmount) {
      alert('Please fill in all fields')
      return
    }

    try {
      const res = await fetch('/api/bets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sport: selectedSport,
          league: selectedEvent?.sport_key || '',
          event: selectedEvent ? `${selectedEvent.home_team} vs ${selectedEvent.away_team}` : '',
          eventId: selectedEvent?.id || '',
          betType: betData.betType,
          selection: betData.selection,
          odds: betData.odds,
          wagerAmount: betData.wagerAmount,
        }),
      })

      if (res.ok) {
        alert('Bet placed successfully!')
        router.push('/dashboard')
      } else {
        alert('Failed to place bet')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            Betting Tracker
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Place a Bet</h1>

        <form onSubmit={handlePlaceBet} className="bg-white rounded-lg shadow p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sport</label>
              <select
                value={selectedSport}
                onChange={handleSportChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a sport</option>
                {sports.map(sport => (
                  <option key={sport.key} value={sport.key}>
                    {sport.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedSport && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event</label>
                <select
                  value={selectedEvent?.id || ''}
                  onChange={(e) => {
                    const event = events.find(ev => ev.id === e.target.value)
                    setSelectedEvent(event)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select an event</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.home_team} vs {event.away_team}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bet Type</label>
              <select
                value={betData.betType}
                onChange={(e) => setBetData({ ...betData, betType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="moneyline">Moneyline</option>
                <option value="spread">Spread</option>
                <option value="over_under">Over/Under</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selection</label>
              <input
                type="text"
                value={betData.selection}
                onChange={(e) => setBetData({ ...betData, selection: e.target.value })}
                placeholder="e.g., Team A, Over, -3.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Odds</label>
              <input
                type="number"
                step="0.01"
                value={betData.odds}
                onChange={(e) => setBetData({ ...betData, odds: parseFloat(e.target.value) })}
                placeholder="e.g., 1.50"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Wager Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={betData.wagerAmount}
                onChange={(e) => setBetData({ ...betData, wagerAmount: parseFloat(e.target.value) })}
                placeholder="e.g., 100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {betData.wagerAmount > 0 && betData.odds > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                Potential Win: <span className="font-bold text-lg text-blue-600">${(betData.wagerAmount * betData.odds).toFixed(2)}</span>
              </p>
            </div>
          )}

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            Place Bet
          </button>
        </form>
      </main>
    </div>
  )
}
