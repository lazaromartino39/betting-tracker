import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface UserProfile {
  id: string
  username: string
  email: string
  name?: string
  bio?: string
  avatar?: string
  bets?: any[]
  followers?: any[]
  following?: any[]
}

export default function UserProfile() {
  const router = useRouter()
  const { username } = router.query
  const [user, setUser] = useState<UserProfile | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBets: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    totalWagered: 0,
    followers: 0,
    following: 0,
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || !username) return

    const fetchData = async () => {
      try {
        const userRes = await fetch(`/api/user/profile/${username}`)
        const userData = await userRes.json()
        setUser(userData)

        const curUserRes = await fetch('/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCurrentUser(await curUserRes.json())

        if (userData.bets) {
          const wins = userData.bets.filter((b: any) => b.status === 'won').length
          const losses = userData.bets.filter((b: any) => b.status === 'lost').length
          const total = userData.bets.length
          const wagered = userData.bets.reduce((sum: number, b: any) => sum + b.wagerAmount, 0)

          setStats({
            totalBets: total,
            wins,
            losses,
            winRate: total > 0 ? Math.round((wins / total) * 100) : 0,
            totalWagered: wagered,
            followers: userData.followers?.length || 0,
            following: userData.following?.length || 0,
          })

          const followingIds = currentUser?.following?.map((f: any) => f.followingId) || []
          setIsFollowing(followingIds.includes(userData.id))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [username])

  const handleFollow = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`/api/user/follow/${user?.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        setIsFollowing(true)
        setStats({ ...stats, followers: stats.followers + 1 })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleUnfollow = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`/api/user/follow/${user?.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        setIsFollowing(false)
        setStats({ ...stats, followers: stats.followers - 1 })
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!user) return <div className="flex items-center justify-center min-h-screen">User not found</div>

  const isOwnProfile = currentUser?.id === user.id

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
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.avatar || user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name || user.username}</h1>
                <p className="text-gray-600">@{user.username}</p>
                {user.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}
              </div>
            </div>

            {!isOwnProfile && (
              <button
                onClick={isFollowing ? handleUnfollow : handleFollow}
                className={`px-6 py-2 rounded-lg font-medium ${
                  isFollowing
                    ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}

            {isOwnProfile && (
              <Link href="/profile/edit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                Edit Profile
              </Link>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Total Bets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBets}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Wins</p>
              <p className="text-2xl font-bold text-green-600">{stats.wins}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Losses</p>
              <p className="text-2xl font-bold text-red-600">{stats.losses}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Win Rate</p>
              <p className="text-2xl font-bold text-blue-600">{stats.winRate}%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Total Wagered</p>
              <p className="text-2xl font-bold text-purple-600">${stats.totalWagered.toFixed(2)}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Followers</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.followers}</p>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Following</p>
              <p className="text-2xl font-bold text-pink-600">{stats.following}</p>
            </div>
          </div>
        </div>

        {/* Recent Bets */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Bets</h2>
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
                </tr>
              </thead>
              <tbody className="divide-y">
                {user.bets && user.bets.length > 0 ? (
                  user.bets.slice(0, 10).map((bet: any) => (
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No bets yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
