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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-7xl font-black text-white mb-2" style={{ textShadow: '0 0 20px rgba(220, 38, 38, 0.5)' }}>
          🎯 PICKIT TRACKER
        </h1>
        <p className="text-2xl font-bold text-red-400 mb-4">Your Championship Picks Start Here</p>
        <p className="text-lg text-gray-300 mb-8">Track your bets. Follow champions. Win big.</p>

        <div className="space-x-4">
          <Link href="/signup" className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition">
            Get Started
          </Link>
          <Link href="/signin" className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition">
            Sign In
          </Link>
          <Link href="/pickitbros" className="inline-block bg-gray-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
            PickIt Bros Picks
          </Link>
        </div>
      </div>
    </div>
  )
}
