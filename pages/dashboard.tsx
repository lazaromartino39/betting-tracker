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
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-3xl font-black text-red-600">
            🎯 PICKIT TRACKER
          </Link>
          <div className="space-x-4 flex items-center">
            <Link href="/odds" className="text-gray-300 hover:text-white font-bold">
              Live Odds
            </Link>
            <Link href="/groups" className="text-gray-300 hover:text-white font-bold">
              Groups
            </Link>
            <Link href="/leaderboard" className="text-gray-300 hover:text-white font-bold">
              Leaderboard
            </Link>
            <Link href="/pickitbros" className="text-red-400 hover:text-red-300 font-bold border-2 border-red-600 px-3 py-1 rounded">
              PickIt Bros
            </Link>
            <Link href="/profile/edit" className="text-gray-300 hover:text-white font-bold">
              Profile
            </Link>
            <button onClick={handleLogout} className="text-gray-300 hover:text-white font-bold">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white">Welcome, {user?.username}! 🏆</h1>
          <p className="text-gray-400 mt-2 font-bold">Make championship picks and dominate</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 border-2 border-red-600 p-6 rounded-lg">
            <p className="text-gray-400 text-sm font-bold">Total Bets</p>
            <p className="text-4xl font-black text-white">{bets.length}</p>
          </div>
          <div className="bg-gray-800 border-2 border-green-600 p-6 rounded-lg">
            <p className="text-gray-400 text-sm font-bold">Won ✅</p>
            <p className="text-4xl font-black text-green-600">{bets.filter(b => b.status === 'won').length}</p>
          </div>
          <div className="bg-gray-800 border-2 border-red-600 p-6 rounded-lg">
            <p className="text-gray-400 text-sm font-bold">Lost ❌</p>
            <p className="text-4xl font-black text-red-600">{bets.filter(b => b.status === 'lost').length}</p>
          </div>
          <div className="bg-gray-800 border-2 border-yellow-600 p-6 rounded-lg">
            <p className="text-gray-400 text-sm font-bold">Total Wagered</p>
            <p className="text-4xl font-black text-yellow-400">${bets.reduce((sum, b) => sum + b.wagerAmount, 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border-2 border-red-600 overflow-hidden">
          <div className="px-6 py-4 border-b-2 border-red-600 flex justify-between items-center bg-gray-900">
            <h2 className="text-2xl font-black text-white">Your Recent Bets</h2>
            <Link href="/place-bet" className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">
              ➕ Place Bet
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 border-b-2 border-red-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-black text-red-600">Event</th>
                  <th className="px-6 py-3 text-left text-sm font-black text-red-600">Selection</th>
                  <th className="px-6 py-3 text-left text-sm font-black text-red-600">Odds</th>
                  <th className="px-6 py-3 text-left text-sm font-black text-red-600">Wager</th>
                  <th className="px-6 py-3 text-left text-sm font-black text-red-600">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-black text-red-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {bets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No bets yet. <Link href="/place-bet" className="text-green-400 font-bold hover:text-green-300">Place your first championship pick!</Link>
                    </td>
                  </tr>
                ) : (
                  bets.map(bet => (
                    <tr key={bet.id} className="hover:bg-gray-700 transition">
                      <td className="px-6 py-4 text-sm text-white font-bold">{bet.event}</td>
                      <td className="px-6 py-4 text-sm text-red-400 font-bold">{bet.selection}</td>
                      <td className="px-6 py-4 text-sm text-green-400 font-black">{bet.odds}</td>
                      <td className="px-6 py-4 text-sm text-yellow-400 font-bold">${bet.wagerAmount}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded text-xs font-black ${
                          bet.status === 'won' ? 'bg-green-600 text-white' :
                          bet.status === 'lost' ? 'bg-red-600 text-white' :
                          'bg-yellow-600 text-white'
                        }`}>
                          {bet.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{new Date(bet.createdAt).toLocaleDateString()}</td>
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
