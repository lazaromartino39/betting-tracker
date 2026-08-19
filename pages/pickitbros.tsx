import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface FeaturedPick {
  id: string
  event: string
  selection: string
  odds: number
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  sport: string
  status: 'pending' | 'won' | 'lost'
  analysis: string
  createdAt: string
}

interface Stats {
  totalPicks: number
  winRate: number
  wins: number
  losses: number
  consecutiveWins: number
  monthlyWins: number
}

export default function PickItBros() {
  const router = useRouter()
  const [picks, setPicks] = useState<FeaturedPick[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPickItBrosPicks()
  }, [])

  const fetchPickItBrosPicks = async () => {
    try {
      const res = await fetch('/api/pickitbros/picks')
      const data = await res.json()
      setPicks(data.picks || [])
      setStats(data.stats || null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-900">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b-4 border-red-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-black text-red-600">
            🎯 PICKIT TRACKER
          </Link>
          <div className="space-x-4 flex items-center">
            <Link href="/signin" className="text-gray-300 hover:text-white font-bold">
              Sign In
            </Link>
            <Link href="/signup" className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700">
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-800 via-red-900 to-gray-800 py-16 border-b-2 border-red-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-black text-white mb-4">🏆 PICKIT BROS CHAMPIONSHIP PICKS</h1>
          <p className="text-xl text-red-300 font-bold">The Best Picks in Sports Betting</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            <div className="bg-gray-800 border-2 border-red-600 rounded-lg p-6 text-center">
              <p className="text-gray-400 text-sm font-bold uppercase">Total Picks</p>
              <p className="text-4xl font-black text-red-600">{stats.totalPicks}</p>
            </div>
            <div className="bg-gray-800 border-2 border-green-600 rounded-lg p-6 text-center">
              <p className="text-gray-400 text-sm font-bold uppercase">Win Rate</p>
              <p className="text-4xl font-black text-green-600">{stats.winRate}%</p>
            </div>
            <div className="bg-gray-800 border-2 border-green-600 rounded-lg p-6 text-center">
              <p className="text-gray-400 text-sm font-bold uppercase">Wins</p>
              <p className="text-4xl font-black text-green-600">{stats.wins}</p>
            </div>
            <div className="bg-gray-800 border-2 border-red-600 rounded-lg p-6 text-center">
              <p className="text-gray-400 text-sm font-bold uppercase">Streak</p>
              <p className="text-4xl font-black text-red-600">🔥 {stats.consecutiveWins}</p>
            </div>
            <div className="bg-gray-800 border-2 border-yellow-600 rounded-lg p-6 text-center">
              <p className="text-gray-400 text-sm font-bold uppercase">Month</p>
              <p className="text-4xl font-black text-yellow-600">{stats.monthlyWins}</p>
            </div>
          </div>
        )}

        {/* Featured Picks */}
        <div className="mb-12">
          <h2 className="text-4xl font-black text-white mb-8 border-b-4 border-red-600 pb-4">🎯 TODAY'S CHAMPIONSHIP PICKS</h2>

          <div className="space-y-6">
            {picks.length === 0 ? (
              <div className="bg-gray-800 border-2 border-red-600 rounded-lg p-12 text-center">
                <p className="text-gray-400 text-lg">Check back soon for the latest PickIt Bros picks!</p>
              </div>
            ) : (
              picks.map((pick) => (
                <div
                  key={pick.id}
                  className={`border-4 rounded-lg p-6 transition ${
                    pick.status === 'won'
                      ? 'bg-green-900 border-green-600'
                      : pick.status === 'lost'
                      ? 'bg-red-900 border-red-600'
                      : 'bg-gray-800 border-red-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-white">{pick.event}</h3>
                      <p className="text-gray-300 font-bold mt-1">{pick.sport.toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-black ${
                        pick.status === 'won' ? 'text-green-400' :
                        pick.status === 'lost' ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {pick.status === 'won' ? '✅ WON' : pick.status === 'lost' ? '❌ LOSS' : '⏳ PENDING'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-700 rounded p-4">
                      <p className="text-gray-400 text-xs font-bold uppercase">Pick</p>
                      <p className="text-2xl font-black text-white">{pick.selection}</p>
                    </div>
                    <div className="bg-gray-700 rounded p-4">
                      <p className="text-gray-400 text-xs font-bold uppercase">Odds</p>
                      <p className="text-2xl font-black text-red-400">{pick.odds}</p>
                    </div>
                    <div className="bg-gray-700 rounded p-4">
                      <p className="text-gray-400 text-xs font-bold uppercase">Confidence</p>
                      <p className={`text-2xl font-black ${
                        pick.confidence === 'HIGH' ? 'text-green-400' :
                        pick.confidence === 'MEDIUM' ? 'text-yellow-400' :
                        'text-orange-400'
                      }`}>
                        {pick.confidence}
                      </p>
                    </div>
                  </div>

                  {pick.analysis && (
                    <div className="bg-gray-700 rounded p-4 mb-4">
                      <p className="text-gray-400 text-sm font-bold uppercase mb-2">Analysis</p>
                      <p className="text-gray-100 text-sm leading-relaxed">{pick.analysis}</p>
                    </div>
                  )}

                  <p className="text-gray-500 text-xs">{new Date(pick.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-red-900 via-gray-800 to-red-900 border-4 border-red-600 rounded-lg p-12 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Join the Winning Team</h2>
          <p className="text-xl text-gray-300 mb-8">Start tracking your bets with the championship picks strategy</p>
          <Link href="/signup" className="inline-block bg-green-600 text-white px-12 py-4 rounded-lg font-black text-xl hover:bg-green-700 transition">
            CREATE FREE ACCOUNT
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t-4 border-red-600 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p className="font-bold mb-2">© 2024 PickIt Tracker. All rights reserved.</p>
          <p className="text-sm">Responsible Gambling. Please Bet Responsibly.</p>
        </div>
      </footer>
    </div>
  )
}
