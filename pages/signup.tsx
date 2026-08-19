import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function SignUp() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Sign up failed')
      } else {
        localStorage.setItem('token', data.token)
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-gray-800 border-4 border-green-600 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-black text-green-600 mb-2 text-center">🎯 PICKIT</h1>
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>

        {error && <div className="mb-4 p-4 bg-red-600 text-white rounded-lg font-bold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border-2 border-green-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border-2 border-green-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border-2 border-green-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-black hover:bg-green-700 disabled:opacity-50 transition text-lg"
          >
            {loading ? 'Creating...' : '✅ CREATE ACCOUNT'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/signin" className="text-red-400 hover:text-red-300 font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
