import { useEffect } from 'react'
import { useRouter } from 'next/router'

interface GoogleSignInProps {
  onError?: (error: string) => void
  onSuccess?: (token: string, user: any) => void
}

declare global {
  interface Window {
    google?: any
  }
}

export default function GoogleSignIn({ onError, onSuccess }: GoogleSignInProps) {
  const router = useRouter()

  useEffect(() => {
    // Load Google Sign-In library
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    script.onload = () => {
      if (typeof window !== 'undefined' && window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: handleCredentialResponse,
        })
      }
    }

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const handleCredentialResponse = async (response: any) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      })

      if (!res.ok) {
        const error = await res.json()
        onError?.(error.error || 'Google authentication failed')
        return
      }

      const data = await res.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({
        userId: data.userId,
        username: data.username,
        email: data.email,
      }))

      onSuccess?.(data.token, data)
      router.push('/dashboard')
    } catch (error: any) {
      onError?.(error.message || 'Google authentication error')
    }
  }

  return (
    <div
      id="g_id_onload"
      data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
      data-callback="handleCredentialResponse"
      style={{ display: 'none' }}
    />
  )
}
