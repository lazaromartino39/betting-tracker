import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">Betting Tracker</h1>
        <p className="text-xl text-blue-100 mb-8">Track your bets, follow friends, and beat the odds</p>

        <div className="space-x-4">
          <Link href="/signup" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50">
            Sign Up
          </Link>
          <Link href="/signin" className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-400">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
