import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface Analytics {
  totalBets: number
  wins: number
  losses: number
  winRate: number
  totalWagered: number
  totalWon: number
  avgOdds: number
  bestPerformer: string
  topSport: string
  bySport: Record<string, { wins: number; losses: number; wagered: number }>
  byBetType: Record<string, { wins: number; losses: number; wagered: number }>
  monthlyTrend: Array<{ month: string; bets: number; wins: number }>
}

export default function Analytics() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/signin')
      return
    }

    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setAnalytics(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [router])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!analytics) return <div className="flex items-center justify-center min-h-screen">No data</div>

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

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Betting Analytics</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Total Bets</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.totalBets}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Win Rate</p>
            <p className="text-3xl font-bold text-blue-600">{analytics.winRate}%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Total Wagered</p>
            <p className="text-3xl font-bold text-purple-600">${analytics.totalWagered.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Total Won</p>
            <p className="text-3xl font-bold text-green-600">${analytics.totalWon.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* By Sport */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Performance by Sport</h2>
            <div className="space-y-4">
              {Object.entries(analytics.bySport).map(([sport, stats]) => (
                <div key={sport}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-gray-900">{sport}</p>
                    <p className="text-sm text-gray-600">{stats.wins}W - {stats.losses}L</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${stats.wins + stats.losses > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">${stats.wagered.toFixed(2)} wagered</p>
                </div>
              ))}
            </div>
          </div>

          {/* By Bet Type */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Performance by Bet Type</h2>
            <div className="space-y-4">
              {Object.entries(analytics.byBetType).map(([betType, stats]) => (
                <div key={betType}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-gray-900 capitalize">{betType}</p>
                    <p className="text-sm text-gray-600">{stats.wins}W - {stats.losses}L</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${stats.wins + stats.losses > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Best Performing Sport</p>
              <p className="text-lg font-bold text-blue-600">{analytics.topSport}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Average Odds</p>
              <p className="text-lg font-bold text-green-600">{analytics.avgOdds.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
