import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface Post {
  id: string
  content: string
  user: {
    id: string
    username: string
    avatar?: string
  }
  bets: any[]
  likes: any[]
  createdAt: string
}

export default function Feed() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/signin')
      return
    }

    fetchPosts()
  }, [router])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts/feed')
      const data = await res.json()
      setPosts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    if (!newPost.trim()) return

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newPost }),
      })

      if (res.ok) {
        setNewPost('')
        fetchPosts()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleLike = async (postId: string) => {
    const token = localStorage.getItem('token')

    try {
      await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchPosts()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            Betting Tracker
          </Link>
          <div className="space-x-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/leaderboard" className="text-gray-600 hover:text-gray-900">
              Leaderboard
            </Link>
            <Link href="/profile/edit" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Post Composer */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handlePostSubmit}>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your latest picks or betting insights..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
            <button
              type="submit"
              disabled={!newPost.trim()}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              Post
            </button>
          </form>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No posts yet. Follow other users to see their picks!</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <Link href={`/profile/${post.user.username}`} className="flex items-center space-x-3 hover:opacity-80">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {post.user.avatar || post.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">@{post.user.username}</p>
                      <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  </Link>
                </div>

                <p className="text-gray-900 mb-4">{post.content}</p>

                {post.bets.length > 0 && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">{post.bets.length} bet(s) attached</p>
                    {post.bets.slice(0, 3).map(bet => (
                      <div key={bet.id} className="text-sm text-gray-600">
                        {bet.event} - {bet.selection} @ {bet.odds}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="hover:text-blue-600 flex items-center space-x-1"
                  >
                    <span>❤️</span>
                    <span>{post.likes.length}</span>
                  </button>
                  <button className="hover:text-blue-600">💬 Reply</button>
                  <button className="hover:text-blue-600">🔄 Share</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
