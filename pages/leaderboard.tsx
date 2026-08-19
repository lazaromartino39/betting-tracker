import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface LeaderboardEntry {
  id: string
  username: string
  totalBets: number
  wins: number
  losses: number
  winRate: number
  totalWagered: number
  totalWon: number
  rank: number
}

export default function Leaderboard() {
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [filter, setFilter] = useState<'winRate' | 'totalWons' | 'mostBets'>('winRate')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/signin')
      return
    }

    fetchLeaderboard()
  }, [filter, router])

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`/api/leaderboard?sort=${filter}`)
      const data = await res.json()
      setLeaderboard(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            Betting Tracker
          </Link>
          <div className="space-x-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/feed" className="text-gray-600 hover:text-gray-900">
              Feed
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Leaderboard</h1>

        {/* Filter Buttons */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setFilter('winRate')}
            className={`px-6 py-2 rounded-lg font-medium ${
              filter === 'winRate'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Win Rate
          </button>
          <button
            onClick={() => setFilter('totalWons')}
            className={`px-6 py-2 rounded-lg font-medium ${
              filter === 'totalWons'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Total Wins
          </button>
          <button
            onClick={() => setFilter('mostBets')}
            className={`px-6 py-2 rounded-lg font-medium ${
              filter === 'mostBets'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Most Bets
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">User</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Total Bets</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Wins</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Losses</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Win Rate</th>
                  <th className="px-6 py-4 text-right text-sm font-bold">Total Wagered</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leaderboard.map((entry, idx) => (
                  <tr key={entry.id} className={idx < 3 ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : entry.rank}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link href={`/profile/${entry.username}`} className="text-blue-600 hover:underline font-medium">
                        @{entry.username}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-900">{entry.totalBets}</td>
                    <td className="px-6 py-4 text-sm text-center text-green-600 font-bold">{entry.wins}</td>
                    <td className="px-6 py-4 text-sm text-center text-red-600 font-bold">{entry.losses}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold">
                        {entry.winRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">
                      ${entry.totalWagered.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
