import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface Group {
  id: string
  name: string
  description?: string
  members?: any[]
  posts?: any[]
}

export default function GroupDetail() {
  const router = useRouter()
  const { groupId } = router.query
  const [group, setGroup] = useState<Group | null>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!groupId) return

    const token = localStorage.getItem('token')
    const fetchGroup = async () => {
      try {
        const res = await fetch(`/api/groups/${groupId}`)
        const data = await res.json()
        setGroup(data)

        const postsRes = await fetch(`/api/groups/${groupId}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setPosts(await postsRes.json())
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchGroup()
  }, [groupId])

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
        body: JSON.stringify({ content: newPost, groupId }),
      })

      if (res.ok) {
        setNewPost('')
        // Refresh posts
        const postsRes = await fetch(`/api/groups/${groupId}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setPosts(await postsRes.json())
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!group) return <div className="flex items-center justify-center min-h-screen">Group not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/groups" className="text-2xl font-bold text-blue-600">
            Groups
          </Link>
          <Link href="/groups" className="text-gray-600 hover:text-gray-900">
            Back to Groups
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Group Header */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-20 h-20 bg-blue-600 rounded-lg"></div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
              <p className="text-gray-600 mt-2">{group.description}</p>
              <p className="text-sm text-gray-500 mt-4">{group.members?.length || 0} members</p>
            </div>
          </div>
        </div>

        {/* Post Composer */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handlePostSubmit}>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your bets with the group..."
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

        {/* Posts */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No posts yet</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">@{post.user?.username}</p>
                    <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-gray-900">{post.content}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
