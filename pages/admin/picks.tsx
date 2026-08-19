import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface Pick {
  id: string
  event: string
  selection: string
  odds: number
  wagerAmount: number
  status: string
  createdAt: string
}

export default function AdminPicks() {
  const router = useRouter()
  const [picks, setPicks] = useState<Pick[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/signin')
      return
    }

    checkAdminAndFetchPicks(token)
  }, [router])

  const checkAdminAndFetchPicks = async (token: string) => {
    try {
      const userRes = await fetch('/api/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const user = await userRes.json()

      // Check if user is admin (you can modify this logic)
      if (user.username === 'admin' || user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setIsAdmin(true)
        fetchPicks(token)
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      console.error(err)
      router.push('/signin')
    } finally {
      setLoading(false)
    }
  }

  const fetchPicks = async (token: string) => {
    try {
      const res = await fetch('/api/bets', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setPicks(data)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-900">Loading...</div>
  if (!isAdmin) return <div className="flex items-center justify-center min-h-screen bg-gray-900">Not authorized</div>

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-black text-red-600">
            🎯 PICKIT TRACKER ADMIN
          </Link>
          <div className="space-x-4">
            <Link href="/dashboard" className="text-gray-300 hover:text-white font-bold">
              Dashboard
            </Link>
            <button onClick={() => {
              localStorage.removeItem('token')
              router.push('/')
            }} className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black text-white mb-8 border-b-4 border-red-600 pb-4">📊 Manage Championship Picks</h1>

        <div className="bg-gray-800 border-2 border-green-600 rounded-lg p-6 mb-8">
          <p className="text-gray-300 font-bold">
            ℹ️ Your picks appear on the PickIt Bros page. Mark them as won/lost to build your championship record!
          </p>
        </div>

        {/* Picks Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden border-2 border-red-600">
          <table className="w-full">
            <thead className="bg-red-600">
              <tr>
                <th className="px-6 py-4 text-left text-white font-black">Event</th>
                <th className="px-6 py-4 text-left text-white font-black">Selection</th>
                <th className="px-6 py-4 text-left text-white font-black">Odds</th>
                <th className="px-6 py-4 text-left text-white font-black">Status</th>
                <th className="px-6 py-4 text-left text-white font-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {picks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No picks yet. Create your first championship pick!
                  </td>
                </tr>
              ) : (
                picks.map((pick) => (
                  <tr key={pick.id} className="hover:bg-gray-700 transition">
                    <td className="px-6 py-4 text-white font-bold">{pick.event}</td>
                    <td className="px-6 py-4 text-red-400 font-bold">{pick.selection}</td>
                    <td className="px-6 py-4 text-green-400 font-black text-lg">{pick.odds}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${
                        pick.status === 'won' ? 'bg-green-600 text-white' :
                        pick.status === 'lost' ? 'bg-red-600 text-white' :
                        'bg-yellow-600 text-white'
                      }`}>
                        {pick.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/picks/${pick.id}`} className="text-red-400 hover:text-red-300 font-bold">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex space-x-4">
          <Link href="/place-bet" className="bg-red-600 text-white px-8 py-3 rounded-lg font-black hover:bg-red-700 transition">
            ➕ Add New Championship Pick
          </Link>
          <Link href="/pickitbros" className="bg-green-600 text-white px-8 py-3 rounded-lg font-black hover:bg-green-700 transition">
            👀 View Public Picks Page
          </Link>
        </div>
      </main>
    </div>
  )
}
