import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface Bet {
  id: string
  event: string
  selection: string
  odds: number
  wagerAmount: number
  status: string
  createdAt: string
}

export default function Dashboard() {
  const router = useRouter()
  const [bets, setBets] = useState<Bet[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/signin')
      return
    }

    const fetchData = async () => {
      try {
        const userRes = await fetch('/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (userRes.ok) {
          setUser(await userRes.json())
        }

        const betsRes = await fetch('/api/bets', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (betsRes.ok) {
          setBets(await betsRes.json())
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
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
            <Link href="/odds" className="text-gray-600 hover:text-gray-900">
              Live Odds
            </Link>
            <Link href="/groups" className="text-gray-600 hover:text-gray-900">
              Groups
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome, {user?.username}!</h1>
          <p className="text-gray-600 mt-2">Track your bets and compete with friends</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Bets</p>
            <p className="text-3xl font-bold text-gray-900">{bets.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Won</p>
            <p className="text-3xl font-bold text-green-600">{bets.filter(b => b.status === 'won').length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Lost</p>
            <p className="text-3xl font-bold text-red-600">{bets.filter(b => b.status === 'lost').length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Wagered</p>
            <p className="text-3xl font-bold text-gray-900">${bets.reduce((sum, b) => sum + b.wagerAmount, 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Your Recent Bets</h2>
            <Link href="/place-bet" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Place Bet
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Event</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Selection</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Odds</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Wager</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No bets yet. <Link href="/place-bet" className="text-blue-600">Place your first bet</Link>
                    </td>
                  </tr>
                ) : (
                  bets.map(bet => (
                    <tr key={bet.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{bet.event}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{bet.selection}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{bet.odds}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${bet.wagerAmount}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          bet.status === 'won' ? 'bg-green-100 text-green-800' :
                          bet.status === 'lost' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {bet.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(bet.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
